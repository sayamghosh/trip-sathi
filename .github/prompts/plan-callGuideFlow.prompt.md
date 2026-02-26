## Objective
Enforce authentication before a traveller can open the “Call the guide” modal, persist their contact info in data base for future requests, and resume the modal automatically after login. The traveller should see their last provided name/phone prefilled but still be able to edit them freely before requesting a callback.

## Constraints & Assumptions
- Frontend uses React 19 with TanStack Router, AuthContext, and a locally managed `LoginModal` from the navbar.
- Callback API (`POST /api/callbacks`) currently accepts anonymous requests; we’ll require auth tokens going forward.
- Traveller profile info (name/phone) may come from AuthContext or need persistence via backend/local storage.

## Step-by-Step Plan
1. **Secure the Callback Endpoint**
   - Wrap `POST /api/callbacks` with `authMiddleware` in `backend/src/routes/callback.routes.ts` so only authenticated travellers can submit.
   - In `callback.controller.ts`, default `requesterName`/`requesterPhone` from `req.user` if the client omits them and persist the latest phone on the `User` document for future autofill.

2. **Ensure Traveller Data is Available**
   - Confirm the login response includes `name` and `phone`; if not, extend the backend auth/profile response and update `AuthContext` parsing in `frontend/src/context/AuthContext.tsx`.
   - Optionally store a `lastCallbackContact` entry in localStorage keyed by `user._id` to fall back when the profile lacks phone data.

3. **Update Callback Service**
   - Modify `requestCallback` in `frontend/src/services/callback.service.ts` to include the `Authorization` header and handle `401` errors, surfacing a friendly “Please sign in” toast.

4. **Introduce an Auth Flow Coordinator**
   - Create `AuthFlowContext` managing `pendingAction` (e.g., `{ type: 'CALL_GUIDE', planId }`), with helpers `requestAuth(action)` and `resumePendingAction()`.
   - Expose hooks so any component can trigger login and later be notified when authentication completes.

5. **Wire Navbar/Login Modal into the Flow**
   - Refactor `Navbar` so its `LoginModal` open state also listens to `AuthFlowContext`. When `requestAuth` is called, open the modal automatically.
   - After successful login in `LoginModal`, call `resumePendingAction()` so the requesting component can continue its workflow.

6. **Enhance PopularPackages Modal Logic**
   - Import `useAuth` + `useAuthFlow` inside `frontend/src/components/PopularPackages.tsx`.
   - On “Call the guide,” if `isAuthenticated` is false, call `requestAuth({ type: 'CALL_GUIDE', planId })` and exit.
   - Use an effect that watches `isAuthenticated` and `pendingAction`; when the traveller logs in for `CALL_GUIDE`, reopen the `ContactModal` with the stored plan.

7. **Prefill and Persist Contact Fields**
   - Initialize `userName`/`userPhone` from `AuthContext.user` or the `lastCallbackContact` cache.
   - After a successful submission, update `AuthContext.user` (if a new phone was entered) and refresh the local cache so future modal openings prefill the edited values. Keep inputs editable.

8. **Finalize UX & Error Handling**
   - Show a brief message/toast when redirecting to login (“Sign in to call this guide”).
   - Ensure unauthenticated API attempts return a consistent error that prompts `requestAuth` again.
   - Test the full flow: logged-out click → login modal → auto-open callback modal with prefilled data, plus editing and resubmitting.
