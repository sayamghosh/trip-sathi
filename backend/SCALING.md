# Scaling Trip Sathi — A Roadmap for Multi-User Growth

This document lays out how the current backend should evolve as usage grows
from "a handful of users" to "many concurrent users across regions." It's
meant as a living reference for architecture decisions, not a rigid spec —
revisit and revise it as real usage data comes in.

## 1. Where we are today

- **Stack**: Node.js + Express (single monolithic API), Mongoose/MongoDB,
  JWT auth, Cloudinary for media, Nodemailer for email.
- **Hosting**: Vercel serverless functions (`vercel.json` routes everything
  through `src/index.ts`).
- **Domains handled by one process**: auth, profiles, hotels, tour plans,
  bookings, callbacks, contact messages, newsletter, super-admin.
- **No caching layer, no queue, no rate limiting, no horizontal DB
  scaling configured.**

This is the right shape for an early-stage product — it's simple to reason
about and cheap to run. The sections below describe what breaks first as
traffic grows, and what to replace it with.

## 2. What breaks first, roughly in order

1. **Serverless cold starts + DB connection storms.** Every serverless
   invocation potentially opens a new MongoDB connection. Under bursty
   traffic (e.g. a marketing push) this exhausts MongoDB's connection
   limit fast.
2. **Unindexed / inefficient queries** on `hotels`, `tourPlans`, and
   `bookings` collections as row counts grow — full collection scans that
   were invisible at 100 documents become visible at 100k.
3. **Synchronous side effects in request handlers** — e.g. sending a
   confirmation email or notifying admins inline during a booking POST.
   These add latency and become failure points under load.
4. **Single points of write contention** — booking creation likely needs
   to check hotel/tour-plan availability and write atomically; without
   care this becomes a race condition under concurrent bookings.
5. **No caching** — hotel/tour-plan listings are read far more often than
   they're written, and are currently hitting MongoDB on every request.
6. **Media uploads blocking the request thread** (multer → Cloudinary)
   under concurrent upload load.

## 3. Target architecture (medium-term)

```
                         ┌──────────────┐
                         │   CDN/Edge   │  (static assets, images via Cloudinary,
                         │  (Cloudflare │   cached GET responses)
                         │   / Vercel)  │
                         └──────┬───────┘
                                │
                      ┌─────────────────┐
                      │  API Gateway /  │  (rate limiting, auth check,
                      │  Load Balancer  │   request routing)
                      └────────┬────────┘
                                │
        ┌───────────────────────────────────────────┐
        │           Stateless API instances          │
        │   (Node/Express, containerized, N replicas)│
        └───────────────────────┬────────────────────┘
                                 │
          ┌──────────────┬──────┴───────┬────────────────┐
          │              │              │                │
     ┌────────┐    ┌───────────┐  ┌───────────┐   ┌─────────────┐
     │ MongoDB│    │   Redis   │  │  Message   │   │  Object      │
     │ Atlas  │    │ (cache +  │  │  Queue     │   │  Storage      │
     │(replica│    │ sessions/ │  │ (BullMQ /  │   │  (Cloudinary/ │
     │  set)  │    │ rate-limit)│  │  SQS)      │   │  S3)          │
     └────────┘    └───────────┘  └─────┬──────┘   └─────────────┘
                                          │
                                   ┌─────────────┐
                                   │  Worker(s)  │  (emails, notifications,
                                   │             │   report generation)
                                   └─────────────┘
```

### Key changes from today

**a. Keep it a modular monolith — don't jump to microservices yet.**
The current controller/route/model split by domain (hotel, booking,
tourPlan, auth, ...) is already a reasonable modular structure. At this
project's scale, splitting into separate deployable services adds
operational overhead (service discovery, distributed tracing, network
latency between services) without a clear payoff. Revisit only if a
specific domain (e.g. bookings) needs independent scaling/deploy cadence
or a different team owns it.

**b. Move off pure serverless once traffic is steady, or fix connection
pooling if staying serverless.**
- If sticking with Vercel/serverless: use a MongoDB driver connection
  pattern that reuses connections across invocations (cache the connection
  on the global scope, which `connectDB()` should already be moving
  toward) and consider MongoDB Atlas's Data API or a connection pooler
  like Mongoose's built-in pooling tuned for serverless (`maxPoolSize`
  small per instance).
- Once traffic is predictable/steady, a small fleet of long-running
  containers (Railway, Render, Fly.io, AWS ECS/Fargate, or a VM behind a
  load balancer) is often cheaper and avoids cold starts + connection
  churn entirely. This is a "when it hurts" migration, not urgent now.

**c. Add Redis for caching and rate limiting.**
- Cache read-heavy, low-churn data: hotel listings, tour plan listings,
  public content — with short TTLs (30s–5min) and explicit invalidation
  on write.
- Use Redis (or an in-memory store behind the gateway) for rate limiting
  auth endpoints, contact/newsletter forms, and callback requests to
  prevent abuse — these are currently unprotected.
- Store JWT blocklist / refresh-token state in Redis if you move to
  refresh tokens (see §4).

**d. Introduce a job queue for anything that isn't "must happen before
responding."**
- Booking confirmation emails, admin notifications, newsletter sends,
  callback-request notifications → push to a queue (BullMQ + Redis is the
  simplest fit given Node/Express, or SQS if moving to AWS) and process
  in a worker. This keeps API response times flat as email/notification
  volume grows and makes retries safe.

**e. MongoDB: replica set + indexing discipline + read scaling.**
- Move to (or confirm) a MongoDB Atlas replica set for durability and
  read scaling (read from secondaries for non-critical reads like
  listings).
- Add indexes deliberately as query patterns solidify — e.g. compound
  indexes on `hotels` for location/date-range search, on `bookings` for
  `userId + status`, on `tourPlan` for search/filter fields. Use
  `explain()` on hot queries rather than guessing.
- For booking writes that touch availability, use MongoDB transactions
  or an atomic `findOneAndUpdate` with a conditional filter to avoid
  overbooking races — don't rely on read-then-write in application code.
- Sharding is a last resort — only relevant at a scale (single collection
  >1TB or sustained write throughput beyond a single primary) this
  project is very unlikely to hit before other bottlenecks matter more.

**f. Stateless API layer + horizontal scaling.**
- Ensure nothing is kept in local process memory (no in-memory session
  store, no in-memory rate limiter) so any instance can serve any
  request. This is mostly already true (JWT is stateless) — just needs
  to hold as features are added.
- Put a load balancer (or rely on the platform's) in front of N
  identical API instances; scale N based on CPU/latency metrics.

## 4. Auth & multi-tenancy considerations

- **Move from long-lived JWTs to access + refresh token pairs** if not
  already doing so, so compromised tokens have a short blast radius and
  revocation is possible (via a Redis blocklist).
- **Rate-limit and CAPTCHA-protect** auth, contact, newsletter, and
  callback endpoints — these are the ones abuse/bots hit first once the
  product is public.
- If Trip Sathi ever needs to serve **multiple travel agencies/brands**
  from one deployment (true multi-tenancy), decide early whether that's
  modeled as a `tenantId` field on every document (cheaper, simpler,
  fine for tens/hundreds of tenants) vs. separate databases per tenant
  (better isolation, needed if tenants require strict data separation or
  very different scale profiles). Don't build this until there's a
  concrete second tenant — it's easy to over-engineer speculatively.

## 5. Media & static assets

- Already using Cloudinary — good, this scales independently of the API.
  Keep uploads flowing directly from client → Cloudinary (signed upload
  URLs) rather than proxying large files through the API server, if not
  already doing so — this removes upload bandwidth/CPU from the API
  entirely.
- Serve any static frontend assets via a CDN (Vercel Edge/Cloudflare) —
  not from the API server.

## 6. Observability (needed before you can safely scale anything)

You can't scale what you can't measure. Before or alongside
infrastructure changes:
- Structured request logging (method, path, status, latency, user id) —
  ship to a log aggregator (e.g. Better Stack, Axiom, CloudWatch).
- Basic APM/error tracking (Sentry) to catch regressions from scaling
  changes themselves.
- Dashboard on: request rate, p95/p99 latency, DB connection count,
  queue depth, error rate. These numbers tell you *which* section of
  this document to act on next, rather than guessing.

## 7. Suggested hosting path

| Stage | Users (rough) | Hosting | Notes |
|---|---|---|---|
| Now | 10s–100s | Vercel serverless + MongoDB Atlas free/shared tier | Current setup is fine |
| Growth | 100s–10,000s | Vercel serverless (fixed connection pooling) or small container fleet (Render/Railway/Fly.io) + Atlas dedicated cluster + Redis (Upstash) | Add caching, queue, rate limiting per §3 |
| Scale | 10,000s+ | Containers on AWS ECS/Fargate or GCP Cloud Run behind a load balancer, Atlas multi-region cluster with read replicas, dedicated Redis, SQS/BullMQ workers, CDN in front of everything | Add observability stack fully, consider splitting the notification/worker layer into its own deployable if it outgrows the API |

Skip straight to a given stage's setup only when the metrics in §6 say
you need it — provisioning ahead of actual load mostly just adds cost
and complexity without benefit.

## 8. Non-goals (for now)

- **Microservices** — not until a specific domain needs independent
  scaling or ownership.
- **Kubernetes** — adds ops overhead disproportionate to this project's
  size; managed container platforms (Fargate, Cloud Run, Railway) cover
  the same need with far less maintenance burden.
- **Database sharding** — MongoDB Atlas vertical scaling + read replicas
  will comfortably cover this project's realistic growth curve.
- **Multi-region active-active** — only worth it once there's a real
  international user base with latency-sensitive traffic; a single
  well-chosen region with a CDN in front covers most needs first.
