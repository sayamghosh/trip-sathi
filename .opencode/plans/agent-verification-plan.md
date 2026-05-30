# Agent Verification & Super Admin System — Implementation Plan

## Overview

Currently, agents (guides) who sign up via the `admin/` panel using Google OAuth get immediate, unrestricted access. The `super-admin/` panel is a disconnected template with mock auth. This plan adds an authorization toggle system and a real super admin backend. The super admin can flip a switch to authorize or deauthorize any agent at any time.

---

## Phase 1: Backend Foundations — Super Admin Auth & Agent Model Changes

### 1.1 Dependencies
- Add `bcryptjs` to `backend/package.json` for password hashing
- Add `@types/bcryptjs` as dev dependency

### 1.2 User Model Changes (`backend/src/models/user.model.ts`)
Add fields to support authorization toggle and agent management:

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `password` | String | optional | Used only for super admin (email/password auth); `null` for Google-auth agents |
| `isAuthorized` | Boolean | `false` | Super admin can toggle this on/off at any time to authorize or deauthorize an agent |
| `isActive` | Boolean | `true` | Super admin can set to `false` to deactivate an agent |
| `isProfilePublic` | Boolean | `false` | Agent's public profile visibility |

- **`isAuthorized` replaces `verificationStatus`** — no more pending/approved/rejected workflow. It's a simple on/off switch the super admin controls freely.
- Update `role` enum to: `['traveller', 'guide', 'admin']` (keep as-is, `admin` = super admin)

### 1.3 Super Admin Auth (`backend/src/controllers/superAdmin.controller.ts`)
Create email/password-based auth for super admins.

**Credentials (seeded):**
| Field | Value |
|-------|-------|
| Email | `admin` |
| Password | `admin@ts.com` (hashed with bcryptjs) |

**Auth endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/super-admin/login` | Login with email + password, returns JWT |
| `GET` | `/api/super-admin/me` | Get current super admin profile |

- JWT payload: `{ id, role: 'admin' }`
- `authMiddleware` already accepts `admin` role alongside `guide`
- Add `isAdmin` middleware guard (similar to `isGuide`)
- **No signup endpoint** — the account is created via a seed script (see 1.9)

### 1.9 Seed Script (`backend/src/seed.ts`)
Create a one-time seed script to bootstrap the super admin:

```typescript
// src/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import { connectDB } from './config/db.js';

async function seed() {
  await connectDB();
  
  const existing = await User.findOne({ email: 'admin' });
  if (existing) {
    console.log('Super admin already exists. Skipping seed.');
    await mongoose.disconnect();
    return;
  }
  
  const hashedPassword = await bcrypt.hash('admin@ts.com', 10);
  await User.create({
    googleId: 'super-admin',  // placeholder, not used for Google auth
    email: 'admin',
    name: 'Super Admin',
    password: hashedPassword,
    role: 'admin',
    isAuthorized: true,
    isActive: true,
  });
  
  console.log('Super admin created: email=admin, password=admin@ts.com');
  await mongoose.disconnect();
}

seed();
```

Add to `backend/package.json`:
```json
"scripts": {
  "seed": "tsx src/seed.ts"
}
```

Run once: `npm run seed`

### 1.4 Super Admin Agent Management Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/super-admin/agents` | List all agents (with pagination, search, filter by authorization status) |
| `GET` | `/api/super-admin/agents/:id` | Get single agent details |
| `PATCH` | `/api/super-admin/agents/:id/authorize` | Toggle agent authorization (`{ isAuthorized: boolean }`) — super admin can flip this on/off at any time |
| `PATCH` | `/api/super-admin/agents/:id/status` | Activate/deactivate agent (`{ isActive: boolean }`) |
| `GET` | `/api/super-admin/agents/:id/metrics` | Get agent metrics (total packages, bookings, revenue etc.) |
| `GET` | `/api/super-admin/agents/:id/packages` | List all packages by an agent (public + private) |

### 1.5 TourPlan Model Changes (`backend/src/models/tourPlan.model.ts`)
Add field:

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `isPublic` | Boolean | `false` | Agent sets to `true` only when verified |

### 1.6 Updated TourPlan Controller Logic

| Change | Detail |
|--------|--------|
| `createTourPlan` | Sets `isPublic: false` always |
| `getAllTourPlans` (public) | Only return plans where `isPublic: true` AND the guide is `isAuthorized: true` AND `isActive: true` |
| `searchTourPlans` | Same filter as above |
| New endpoint | `PATCH /api/tour-plans/:id/publish` — Agent can toggle `isPublic` (only if `isAuthorized: true`) |
| `getTourPlansByGuide` | Agent's own view — returns ALL their plans regardless of `isPublic` |

### 1.7 Agent Signup Flow Changes (`backend/src/controllers/auth.controller.ts`)
- When `googleGuideLogin` creates/upgrades a user to `'guide'` role:
  - Set `isAuthorized: false` (agent starts unauthorized — super admin must flip the switch)
  - Set `isProfilePublic: false`
- JWT still issued, but admin panel will check authorization status client-side

### 1.8 Backend Routes Registration
- Create `backend/src/routes/superAdmin.routes.ts`
- Register at `app.use('/api/super-admin', superAdminRoutes)`
- Add publish endpoint to `tourPlan.routes.ts`

---

## Phase 2: Super Admin Panel — Real Auth & Agent Management

### 2.1 Auth Integration (`super-admin/src/stores/auth-store.ts`)
- Replace mock auth with real API calls:
  - `login(email, password)` → `POST /api/super-admin/login`
  - Store JWT in cookie (existing pattern)
  - Validate token on app load via `GET /api/super-admin/me`
- Create `lib/api.ts` with Axios instance (baseURL + JWT interceptor)

### 2.2 Auth UI Updates (`super-admin/src/features/auth/`)
- **Sign In form** (`user-auth-form.tsx`): Remove mock, call real API
- **Sign Up form** (`sign-up-form.tsx`): Remove mock, call real API
- Add route guard in `_authenticated/route.tsx` to redirect to `/sign-in` if no valid token

### 2.3 Agents Management Feature
Create a new feature module at `super-admin/src/features/agents/`:

- **AgentsListPage** — Table of all agents with columns:
  - Name, Email, Phone, Signup Date, Authorization Status (Authorized/Unauthorized), Account Status (Active/Inactive)
  - Filters: by authorization status, by account status
  - Actions: Toggle authorization switch, View Details
- **AgentDetailPage** — Full agent profile showing:
  - Personal info, contact details
  - **Authorization toggle switch** — super admin can flip at any time to authorize/deauthorize
  - Account status toggle (Active/Inactive)
  - Tour Packages section (list all packages by this agent)
  - Metrics: Total packages, public packages, bookings, revenue (if any)
- **AgentMetricsCards** — Reusable metrics component

### 2.4 Sidebar & Route Updates (`super-admin`)

Add sidebar navigation items:
- **Agents** (icon: `UserCog`) → `/agents` (with badge showing unauthorized count)

New routes:
| Path | Component |
|------|-----------|
| `/agents` | AgentsListPage |
| `/agents/$agentId` | AgentDetailPage |

### 2.5 Dashboard Updates
- Replace mock data in Dashboard with real metrics:
  - Total agents
  - Unauthorized agents (count of agents where `isAuthorized: false`)
  - Active packages
  - Total bookings (placeholder for now)

---

## Phase 3: Admin Panel — Authorization-Aware Agent Experience

### 3.1 Onboarding Status UI (`admin/src/`)
- After login, check user's `isAuthorized` from stored user object
- Show a banner based on status:
  - **`isAuthorized === false`**: "Your account is awaiting authorization. You can browse but packages won't be public until the super admin authorizes your account."
  - **`isAuthorized === true`**: Full access granted

### 3.2 Dashboard Changes (`admin/src/pages/Dashboard.tsx`)
- If `isAuthorized === false`:
  - Show "awaiting authorization" card instead of (or alongside) normal dashboard
  - Restrict navigation — allow dashboard, profile, package creation (draft only)
  - Show message: "You can create draft packages. They will be published once your account is authorized."
- If `isAuthorized === true`:
  - Full dashboard as before
  - Publish toggle on packages

### 3.3 Package Creation Changes (`admin/src/components/package/CreatePlanPage.tsx`)
- All created packages have `isPublic: false` by default (backend enforced)
- After creation, show status: "Saved as draft"
- Only when `isAuthorized === true`:
  - Show "Publish" button on package detail page
  - Show visibility toggle

### 3.4 Package List Changes (`admin/src/components/package/PackagePage.tsx`)
- Add a badge/indicator showing "Draft" vs "Published" status
- Add publish/unpublish toggle action (only if authorized)

### 3.5 Profile Page Changes
- Show authorization status ("Authorized" / "Unauthorized")
- Show profile public/private toggle (only if authorized)

---

## Phase 4: Backend — Tour Plan Visibility Enforcement

### 4.1 Public API Filters
- `GET /api/tour-plans/public`:
  ```
  TourPlan.find({ 
    isPublic: true,
    guideId: { $in: authorizedActiveGuides } 
  })
  ```
  Where `authorizedActiveGuides` = list of user IDs where `role: 'guide'`, `isAuthorized: true`, `isActive: true`

- `GET /api/tour-plans/search` — Same filter

- `GET /api/tour-plans/:id` — If not the owner, check `isPublic`

### 4.2 Agent Publish Endpoint
```
PATCH /api/tour-plans/:id/publish
Body: { isPublic: boolean }
Auth: guide
Guard: Only allowed if guide's isAuthorized === true
```

---

## Summary of All New/Modified Files

### Backend (`backend/src/`)
| File | Action |
|------|--------|
| `models/user.model.ts` | Modify: add `password`, `isAuthorized`, `isActive`, `isProfilePublic` |
| `models/tourPlan.model.ts` | Modify: add `isPublic` |
| `controllers/auth.controller.ts` | Modify: set `isAuthorized: false` on guide signup |
| `controllers/tourPlan.controller.ts` | Modify: enforce `isPublic` + authorization checks |
| `controllers/superAdmin.controller.ts` | **New** — super admin login + agent management |
| `middleware/auth.middleware.ts` | Modify: add `isAdmin` guard |
| `routes/auth.routes.ts` | No changes needed |
| `routes/tourPlan.routes.ts` | Modify: add publish endpoint |
| `routes/superAdmin.routes.ts` | **New** |
| `seed.ts` | **New** — one-time script to create super admin `admin` / `admin@ts.com` |
| `index.ts` | Modify: register super admin routes |

### Super Admin (`super-admin/src/`)
| File | Action |
|------|--------|
| `lib/api.ts` | **New** — Axios instance with JWT interceptor |
| `stores/auth-store.ts` | Modify: replace mock with real API calls |
| `features/auth/sign-in/components/user-auth-form.tsx` | Modify: call real login API |
| `features/auth/sign-up/components/sign-up-form.tsx` | Modify: call real signup API |
| `routes/_authenticated/route.tsx` | Modify: add auth guard |
| `features/agents/` | **New** — agents list, detail, metrics components |
| `routes/_authenticated/agents/` | **New** — routes for agents pages |
| `components/layout/data/sidebar-data.ts` | Modify: add Agents nav item |
| `features/dashboard/index.tsx` | Modify: show real agent metrics |

### Admin (`admin/src/`)
| File | Action |
|------|--------|
| `lib/axios.ts` | No changes needed |
| `router.tsx` | Modify: pass user data for route guards |
| `App.tsx` | Modify: show authorization status banner |
| `pages/Dashboard.tsx` | Modify: show unauthorized/authorized state |
| `components/package/PackagePage.tsx` | Modify: show draft/published indicators, publish action |
| `components/package/PackageDetailPage.tsx` | Modify: show publish toggle if authorized |
| `pages/Login.tsx` | Modify: pass `isAuthorized` on login response |

---

## Execution Order

```
Phase 1 (Backend foundation)
  └─ 1.1 Add bcryptjs + @types/bcryptjs dependency
  └─ 1.2 Update User model (new fields)
  └─ 1.3 Create super admin auth controller + routes
  └─ 1.4 Create agent management endpoints
  └─ 1.5 Update TourPlan model (isPublic)
  └─ 1.6 Update TourPlan controller (visibility logic)
  └─ 1.7 Update agent signup flow
  └─ 1.8 Register routes in index.ts
  └─ 1.9 Create seed script & run `npm run seed`
  └─ 1.9.1 Super admin created: email=`admin`, password=`admin@ts.com`

Phase 2 (Super Admin Panel)
  └─ 2.1 Create API client + update auth store
  └─ 2.2 Update sign-in/sign-up forms
  └─ 2.3 Build agents management feature
  └─ 2.4 Add routes + sidebar nav
  └─ 2.5 Wire dashboard to real data

Phase 3 (Admin Panel)
  └─ 3.1 Show onboarding/authorization status
  └─ 3.2 Update dashboard for unauthorized state
  └─ 3.3 Update package creation (draft flow)
  └─ 3.4 Add publish/draft indicators to package list
  └─ 3.5 Profile page status display

Phase 4 (Backend enforcement)
  └─ 4.1 Filter public APIs by authorization + isPublic
  └─ 4.2 Publish endpoint with authorization guard
```
