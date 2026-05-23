# Agent Verification & Super Admin System — Implementation Plan

## Overview

Currently, agents (guides) who sign up via the `admin/` panel using Google OAuth get immediate, unrestricted access. The `super-admin/` panel is a disconnected template with mock auth. This plan adds a verification workflow and a real super admin backend.

---

## Phase 1: Backend Foundations — Super Admin Auth & Agent Model Changes

### 1.1 Dependencies
- Add `bcryptjs` to `backend/package.json` for password hashing

### 1.2 User Model Changes (`backend/src/models/user.model.ts`)
Add fields to support verification and agent management:

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `password` | String | optional | Used only for super admin (email/password auth); null for Google-auth agents |
| `verificationStatus` | String | `'pending'` | `'pending'` / `'approved'` / `'rejected'` |
| `isActive` | Boolean | `true` | Super admin can set to `false` to deactivate an agent |
| `isProfilePublic` | Boolean | `false` | Agent's public profile visibility |

Update `role` enum to: `['traveller', 'guide', 'admin']` (keep as-is, `admin` = super admin)

### 1.3 Super Admin Auth Endpoints (`backend/src/controllers/superAdmin.controller.ts`)
Create email/password-based auth for super admins:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/super-admin/signup` | Create super admin account (email + password) |
| `POST` | `/api/super-admin/login` | Login with email + password, returns JWT |
| `GET` | `/api/super-admin/me` | Get current super admin profile |

- JWT payload for super admin: `{ id, role: 'admin' }`
- `authMiddleware` already accepts `admin` role alongside `guide`
- Add `isAdmin` middleware guard (similar to `isGuide`)

### 1.4 Super Admin Agent Management Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/super-admin/agents` | List all agents (with pagination, search, filter by status) |
| `GET` | `/api/super-admin/agents/:id` | Get single agent details |
| `PATCH` | `/api/super-admin/agents/:id/verify` | Approve/reject agent (`{ status: 'approved'|'rejected' }`) |
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
| `getAllTourPlans` (public) | Only return plans where `isPublic: true` AND the guide is `verificationStatus: 'approved'` AND `isActive: true` |
| `searchTourPlans` | Same filter as above |
| New endpoint | `PATCH /api/tour-plans/:id/publish` — Agent can toggle `isPublic` (only if they are verified) |
| `getTourPlansByGuide` | Agent's own view — returns ALL their plans regardless of `isPublic` |

### 1.7 Agent Signup Flow Changes (`backend/src/controllers/auth.controller.ts`)
- When `googleGuideLogin` creates/upgrades a user to `'guide'` role:
  - Set `verificationStatus: 'pending'`
  - Set `isProfilePublic: false`
- JWT still issued, but admin panel will check verification status client-side

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
  - Name, Email, Phone, Signup Date, Verification Status (Pending/Approved/Rejected), Account Status (Active/Inactive)
  - Filters: by verification status, by account status
  - Actions: Approve, Reject, View Details
- **AgentDetailPage** — Full agent profile showing:
  - Personal info, contact details
  - Verification status + Approve/Reject buttons
  - Account status toggle (Active/Inactive)
  - Tour Packages section (list all packages by this agent)
  - Metrics: Total packages, public packages, bookings, revenue (if any)
- **AgentMetricsCards** — Reusable metrics component

### 2.4 Sidebar & Route Updates (`super-admin`)

Add sidebar navigation items:
- **Agents** (icon: `UserCog`) → `/agents` (with badge showing pending count)

New routes:
| Path | Component |
|------|-----------|
| `/agents` | AgentsListPage |
| `/agents/$agentId` | AgentDetailPage |

### 2.5 Dashboard Updates
- Replace mock data in Dashboard with real metrics:
  - Total agents
  - Pending verifications
  - Active packages
  - Total bookings (placeholder for now)

---

## Phase 3: Admin Panel — Verification-Aware Agent Experience

### 3.1 Onboarding Status UI (`admin/src/`)
- After login, check user's `verificationStatus` from stored user object
- Show a banner/modal based on status:
  - **Pending**: "Your account is under review. You can browse but packages won't be public."
  - **Approved**: Full access granted
  - **Rejected**: "Your account was not approved. Contact support."

### 3.2 Dashboard Changes (`admin/src/pages/Dashboard.tsx`)
- If `verificationStatus === 'pending'`:
  - Show verification pending card instead of (or alongside) normal dashboard
  - Restrict navigation — allow dashboard, profile, package creation (draft only)
  - Show message: "You can create draft packages. They will be published once your account is verified."
- If `verificationStatus === 'approved'`:
  - Full dashboard as before
  - Publish toggle on packages

### 3.3 Package Creation Changes (`admin/src/components/package/CreatePlanPage.tsx`)
- All created packages have `isPublic: false` by default (backend enforced)
- After creation, show status: "Saved as draft"
- Only when `verificationStatus === 'approved'`:
  - Show "Publish" button on package detail page
  - Show visibility toggle

### 3.4 Package List Changes (`admin/src/components/package/PackagePage.tsx`)
- Add a badge/indicator showing "Draft" vs "Published" status
- Add publish/unpublish toggle action (only if verified)

### 3.5 Profile Page Changes
- Show verification status
- Show profile public/private toggle (only if verified)

---

## Phase 4: Backend — Tour Plan Visibility Enforcement

### 4.1 Public API Filters
- `GET /api/tour-plans/public`:
  ```
  TourPlan.find({ 
    isPublic: true,
    guideId: { $in: verifiedActiveGuides } 
  })
  ```
  Where `verifiedActiveGuides` = list of user IDs where `role: 'guide'`, `verificationStatus: 'approved'`, `isActive: true`

- `GET /api/tour-plans/search` — Same filter

- `GET /api/tour-plans/:id` — If not the owner, check `isPublic`

### 4.2 Agent Publish Endpoint
```
PATCH /api/tour-plans/:id/publish
Body: { isPublic: boolean }
Auth: guide
Guard: Only allowed if guide's verificationStatus === 'approved'
```

---

## Summary of All New/Modified Files

### Backend (`backend/src/`)
| File | Action |
|------|--------|
| `models/user.model.ts` | Modify: add `password`, `verificationStatus`, `isActive`, `isProfilePublic` |
| `models/tourPlan.model.ts` | Modify: add `isPublic` |
| `controllers/auth.controller.ts` | Modify: set `verificationStatus: 'pending'` on guide signup |
| `controllers/tourPlan.controller.ts` | Modify: enforce `isPublic` + verification checks |
| `controllers/superAdmin.controller.ts` | **New** — super admin auth + agent management |
| `middleware/auth.middleware.ts` | Modify: add `isAdmin` guard |
| `routes/auth.routes.ts` | No changes needed |
| `routes/tourPlan.routes.ts` | Modify: add publish endpoint |
| `routes/superAdmin.routes.ts` | **New** |
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
| `App.tsx` | Modify: show verification status banner |
| `pages/Dashboard.tsx` | Modify: show pending/rejected state |
| `components/package/PackagePage.tsx` | Modify: show draft/published indicators, publish action |
| `components/package/PackageDetailPage.tsx` | Modify: show publish toggle if verified |
| `pages/Login.tsx` | Modify: pass verificationStatus on login response |

---

## Execution Order

```
Phase 1 (Backend foundation)
  └─ 1.1 Add bcryptjs dependency
  └─ 1.2 Update User model (new fields)
  └─ 1.3 Create super admin auth controller + routes
  └─ 1.4 Create agent management endpoints
  └─ 1.5 Update TourPlan model (isPublic)
  └─ 1.6 Update TourPlan controller (visibility logic)
  └─ 1.7 Update agent signup flow

Phase 2 (Super Admin Panel)
  └─ 2.1 Create API client + update auth store
  └─ 2.2 Update sign-in/sign-up forms
  └─ 2.3 Build agents management feature
  └─ 2.4 Add routes + sidebar nav
  └─ 2.5 Wire dashboard to real data

Phase 3 (Admin Panel)
  └─ 3.1 Show onboarding/verification status
  └─ 3.2 Update dashboard for pending state
  └─ 3.3 Update package creation (draft flow)
  └─ 3.4 Add publish/draft indicators to package list
  └─ 3.5 Profile page status display

Phase 4 (Backend enforcement)
  └─ 4.1 Filter public APIs by verification + isPublic
  └─ 4.2 Publish endpoint with verification guard
```
