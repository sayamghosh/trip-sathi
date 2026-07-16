# Trip Sathi — Project Pitch & Market Positioning

*A booking operating system for independent tour guides and small travel operators.*

This document is written so you can use it directly in an interview or a
pitch conversation: what the product is, who it's for, what's genuinely
different about it, and an honest look at where it stands against real
competitors — including where they're still ahead.

---

## 1. The one-line pitch

> Trip Sathi is a multi-tenant booking platform that gives independent tour
> guides and small travel operators — who today run their business over
> WhatsApp, Excel, and phone calls — their own branded storefront, itinerary
> builder, and lead/booking pipeline, without the enterprise pricing or
> Western-market assumptions baked into platforms like FareHarbor, Rezdy, or
> Bókun.

## 2. What the product actually is

Trip Sathi is four coordinated pieces:

1. **Public site (Next.js)** — where travelers browse tour packages and
   hotels, view day-by-day itineraries, and submit a callback request or
   booking enquiry.
2. **Guide/operator dashboard (React + Vite + shadcn)** — where a tour
   guide manages their own tour plans, hotel inventory, incoming callback
   requests, and bookings.
3. **Super-admin console (React + shadcn admin)** — where the platform
   operator onboards and authorizes new guides, monitors their packages,
   and manages the marketplace.
4. **API (Node/Express + MongoDB)** — the backend this repo contains,
   modeling guides, tour plans, hotels, bookings, callback requests, and
   contact/newsletter capture, all scoped per-guide (`guideId` on every
   core document) so the platform is multi-tenant by design, not bolted
   on later.

### Core features already built

- **Day-by-day itinerary builder** — tour plans aren't a single price/description
  blob; they're structured into days, and each day into typed activities
  (transfer, sightseeing, hotel, meal, other), each with its own images
  and an optional link to a real hotel record. This is closer to what a
  professional itinerary document looks like than a generic "tour listing."
- **Guide-owned hotel inventory** — guides maintain their own hotel list
  (location, amenities, price/night, images) and reference it directly
  inside itineraries, instead of re-typing hotel details per package.
- **Lead capture before booking** — a `CallbackRequest` model captures
  interest from a specific tour plan/guide before a formal booking exists,
  with a pending/positive/negative pipeline — matching how travel sales
  actually works (a human follow-up call closes most bookings, especially
  in India).
- **Booking + payment-state tracking** — bookings track traveler details,
  trip date, party size, final price, and a payment lifecycle (unpaid →
  advance paid → fully paid), plus cancellation with a reason — the
  operational data a guide actually needs, not just a checkout record.
- **Platform governance** — guides must be explicitly authorized by a
  super-admin before going live, and can be deactivated — this is what
  makes a public marketplace trustworthy instead of an open free-for-all.
- **Public/private draft state** on tour plans (`isPublic`), so guides can
  build and preview a package before publishing it.
- Media handled via Cloudinary, auth via JWT with Google OAuth support,
  contact/newsletter capture for top-of-funnel marketing.

## 3. The problem, with actual market grounding

I looked at both ends of the market this product sits between:

**End A — enterprise/global tour-booking SaaS.** The category is real and
well-funded: Bókun, FareHarbor (owned by Booking Holdings, 20,000+
clients), and Rezdy — which recently merged with Checkfront and Regiondo
into Expedition Software Holding, now serving ~17,000 operators and $5B+
in gross booking value. These are mature, feature-rich platforms with OTA
channel management, payment processing, and website builders.

But their pricing model doesn't fit a solo Indian tour guide:
- **FareHarbor** charges no monthly fee but takes up to **6% commission
  on direct bookings** — at meaningful volume this is enormous (illustrative
  math from industry comparisons: 500 bookings/month at $100 average books
  out to roughly **$36,000/year** in commission alone).
- **Rezdy** avoids per-booking commission on direct sales but charges a
  **$49–$249/month** flat fee — real money for an operator running a
  handful of packages a month, and priced/designed around USD/EUR
  ticketing businesses, not INR, WhatsApp-first, advance-payment-in-cash
  Indian tourism.
- None of these platforms are built around the **guide as the unit of the
  business** — they assume a single operator with staff and inventory, not
  a marketplace of many small independent guides each running their own
  storefront under one platform's governance.

**End B — the actual status quo for small Indian operators.** Industry
coverage of Indian tour operators is consistent on this: most run
operations "across a mix of WhatsApp groups, Excel sheets, and paper
registers," and that "spreadsheets work well when you have 5 vehicles and
2 staff members [but] as you grow past 10–15 vehicles, the cracks appear
fast." WhatsApp itself is widely used as the de facto booking and
communication channel across Indian and global travel agencies — not
because it's a good system of record, but because it's the only zero-cost,
zero-setup tool available.

**The gap Trip Sathi is aimed at:** the segment between "WhatsApp and
Excel" and "enterprise SaaS priced for Western OTAs" is underserved.
Indian tour-software vendors that do exist (Trawex, eTravos, TraveloPro,
Technoheaven, etc.) mostly build heavy B2B/DMC/wholesaler back-office
systems (GDS integration, agent portals, white-label OTA infrastructure)
aimed at established travel agencies — not a lightweight, guide-first,
storefront-plus-itinerary-plus-leads product for an independent operator
or a small regional agency (e.g. a Port Blair/Andaman-based operator
running a handful of packages).

## 4. Unique selling points

1. **Guide-first multi-tenancy, not bolted-on B2B.** Every core model
   (`Hotel`, `TourPlan`, `Booking`, `CallbackRequest`) is scoped to a
   `guideId` from the ground up, with a super-admin authorization layer.
   This is a marketplace/platform data model, not a single-tenant
   agency website that was later duct-taped into multi-tenant.
2. **Itinerary as structured data, not a PDF.** Day-by-day, typed
   activities with images and hotel references make itineraries
   queryable, reusable, and consistently rendered — competitors in the
   Indian market often still lean on PDF/Word itinerary docs emailed to
   customers.
3. **Built around the real Indian sales motion.** Callback-request-first,
   human-closes-the-sale flow (rather than instant self-serve checkout)
   matches how tours are actually sold in this market today, while still
   producing structured lead data instead of a lost WhatsApp thread.
4. **Priced for the segment it targets.** No commission-per-booking model
   is baked into the architecture — the cost structure isn't fighting the
   guide's margin the way FareHarbor's take-rate does.
5. **Lean, modern stack.** TypeScript across the board, modular
   controller/route/model structure, ready to deploy serverless (Vercel)
   for near-zero infra cost pre-scale, with a clear path to containers as
   usage grows (see `SCALING.md` in this repo).

## 5. Honest gap analysis — where we are NOT better yet

Being direct about this matters more than the pitch itself:

| Gap | Competitors have it | We don't (yet) | Why it matters |
|---|---|---|---|
| **Payment gateway integration** | FareHarbor/Rezdy/Bókun process payment natively | `paymentStatus` is a manually-set field — no Razorpay/Stripe integration in the codebase | Guides still have to collect payment outside the platform and update status by hand; this is the single biggest credibility gap vs. real booking software |
| **OTA/channel distribution** | Rezdy/Bókun sync availability to Viator, GetYourGuide, TripAdvisor, etc. | No channel manager — each guide's packages only live on our own storefront | Limits guide reach to whatever traffic our own platform generates |
| **Real-time availability/inventory locking** | Mature platforms handle concurrent booking races, capacity limits, blackout dates | `Booking` has no capacity/availability check against `TourPlan` at the model level yet | Risk of double-booking a slot as traffic grows; needs to be solved before real transaction volume |
| **Analytics/revenue reporting** | Dashboards with real revenue, conversion, occupancy metrics | `getAgentMetrics` in the super-admin controller currently returns `totalBookings: 0, revenue: 0` — hardcoded, not computed | An interviewer who reads the code will find this fast — worth acknowledging as "next sprint," not hiding |
| **WhatsApp-native workflow** | Emerging competitors (per industry coverage) now offer native WhatsApp quote/confirmation sending | We capture callback requests in-app but don't push confirmations/quotes over WhatsApp | Given WhatsApp is the dominant channel in this market, this is a near-term differentiator to build, not skip |
| **Track record / trust** | FareHarbor: 20,000+ clients. Rezdy/Checkfront/Regiondo: ~17,000 operators, $5B+ GBV | Pre-revenue / early-stage project | Trust and distribution take years; this is the honest stage-of-life gap, not a product gap |

**Bottom line on "are we actually better":** not universally, and not yet
at feature parity with mature platforms on payments or distribution. Where
the product is genuinely better today is **fit for an underserved
segment** — the solo/small Indian tour guide who is currently priced out
or workflow-mismatched by the big platforms and outgrowing WhatsApp/Excel.
That's a real, evidenced gap, not a hypothetical one — the honest pitch is
"right architecture and right target segment, with a clear and known list
of what to build next to close the gap on payments and distribution,"
not "already better across the board."

## 6. How this closes, in priority order

1. **Payment gateway integration** (Razorpay for India — UPI, cards,
   netbanking) tied to `Booking.paymentStatus`, so payment state reflects
   reality instead of manual entry.
2. **Real availability/capacity checks** on `TourPlan`/`Booking` writes
   (atomic `findOneAndUpdate` or a transaction) to prevent overbooking
   once there's real concurrent traffic.
3. **Compute real metrics** in `getAgentMetrics` (bookings, revenue) from
   the `Booking` collection instead of hardcoded zeros.
4. **WhatsApp Business API integration** for booking confirmations and
   quote sharing — matches the channel guides and travelers already use.
5. **Channel distribution** (or at minimum, a well-optimized public
   storefront + SEO) as a longer-term answer to OTA reach, without taking
   on the commission structure that makes big OTAs expensive for guides.

## 7. The interview-ready narrative

> "Small Indian tour operators run their business over WhatsApp and Excel
> because the alternative — platforms like FareHarbor or Rezdy — are
> priced and designed for Western OTA-scale businesses, either taking up
> to 6% commission per booking or charging a flat monthly fee that doesn't
> make sense for someone running a handful of packages a month. I built
> Trip Sathi as a multi-tenant booking platform where independent guides
> get their own storefront, a real day-by-day itinerary builder instead of
> a PDF, a structured lead pipeline that matches how tours are actually
> sold here — a human call closes the sale — and a super-admin layer that
> makes the whole thing a trustworthy marketplace instead of an open
> free-for-all. It's not yet at feature parity with the big platforms on
> payments or OTA distribution, and I can tell you exactly what's next to
> close that gap — but the core data model and multi-tenant architecture
> are built right from day one, which is the part that's hardest to
> retrofit later."

---

## Sources

- [20 Top-Rated Tour Operator Software (2026 Comparison Guide) — Bókun](https://www.bokun.io/tour-operator-software)
- [Bókun vs. FareHarbor vs. Rezdy: 2026 Comparison Guide](https://www.bokun.io/fareharbor-vs-rezdy-vs-bokun)
- [FareHarbor Pricing Guide: What to Know Before You Buy (2026)](https://www.bokun.io/fareharbor-pricing)
- [Bokun vs FareHarbor vs Rezdy 2026 (Fee Calculator)](https://hamzaliaqat.com/blog/best-booking-systems-tour-operators)
- [FareHarbor vs Rezdy 2026: True Cost Compared](https://hamzaliaqat.com/blog/fareharbor-vs-rezdy)
- [Top Tour Operator Software in India 2026 — Track My Tour](https://www.trackmytour.in/blog/tour-operator-software-india/)
- [Tour Operator Software India: 10 Best Tools Compared (2026) — CampaignHQ](https://blog.campaignhq.co/tour-operator-software-india-10-best-tools-compared-2026)
- [WhatsApp Gains as a Powerful Tool for Global Travel Agencies, OTAs, DMCs, and Tour Operators](https://www.travelandtourworld.com/news/article/whatsapp-gains-as-a-powerful-tool-for-global-travel-agencies-otas-dmcs-and-tour-operators/)
- [Top Tour Operator Software in India — Slashdot](https://slashdot.org/software/tour-operator/in-india/)
