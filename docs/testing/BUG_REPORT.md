# BUG REPORT — QueueLess

**Version:** 1.0.0 | **Date:** 2026-05-04 | **Phase:** Day 23 QA

---

## How to Use This File

For every bug found during testing, copy the template below and fill in all fields. Assign a sequential Bug ID (BUG-001, BUG-002, …). Update `Retest Result` after applying a fix.

---

## Bug Template

```
Bug ID:            BUG-XXX
Module:            Auth | Business | Queue | Exchange | Notification | Analytics | SuperAdmin | Socket | Role Access
Title:             One-line description
Steps to Reproduce:
  1.
  2.
  3.
Expected Result:
Actual Result:
Severity:          Critical | High | Medium | Low
Environment:       Browser | Postman | Socket
Console Error:
Possible Cause:
Fix Applied:
Retest Result:     Pass | Fail | Pending
```

---

## Severity Guide

| Level    | Meaning                                             |
| -------- | --------------------------------------------------- |
| Critical | System unusable — auth broken, data loss, security  |
| High     | Core feature broken or incorrect data returned      |
| Medium   | Feature works but with wrong behavior / UI mismatch |
| Low      | Cosmetic, edge-case, or minor copy issue            |

---

## Active Bug Log

> Add each bug below. Keep in chronological order.

### BUG-001 _(Template — replace with real bug)_

```
Bug ID:            BUG-001
Module:            —
Title:             —
Steps to Reproduce:
  1. —
Expected Result:   —
Actual Result:     —
Severity:          —
Environment:       —
Console Error:     —
Possible Cause:    —
Fix Applied:       —
Retest Result:     Pending
```

## Logged Bugs

Bug ID: BUG-2026-002
Module: Analytics - GET /api/analytics/overview
Steps to Reproduce:

1. Login as admin or superadmin.
2. Call GET /api/analytics/overview without businessId.
   Expected Result: Overview analytics should return 200 for superadmin and either 200 or a clear business-scoped response for admin.
   Actual Result: Admin returns 404; superadmin returns 500.
   Severity: High
   Screenshot/Console Error: Response body shows StrictPopulateError for `business`; admin path also fails when looking up business ownership.
   Possible Cause: Controller uses `Business.findOne({ owner: req.user._id })` but the schema field is `ownerId`. Superadmin path also tries to populate `business` on Queue documents, while schema uses `businessId`.
   Fix Applied: Pending
   Retest Result: Pending

---

## Common Bugs & Known Fixes Reference

| #   | Bug Pattern                         | Root Cause                            | Fix                                                |
| --- | ----------------------------------- | ------------------------------------- | -------------------------------------------------- |
| 1   | Token not sent in Postman           | Cookie not forwarded                  | Enable "Send cookies" in Postman settings          |
| 2   | 401 on valid token                  | Cookie missing `httpOnly` / sameSite  | Verify corsConfig allows credentials               |
| 3   | Socket event fires multiple times   | Duplicate `useEffect` listener        | Cleanup listener in `return () => socket.off(...)` |
| 4   | User can join queue twice           | Join guard missing `waiting` check    | Check member status before inserting               |
| 5   | Leave queue 400 on second attempt   | Correct behavior — not a bug          | Confirm status is `waiting` before leave           |
| 6   | Admin cannot call next on own queue | Queue `businessId` ownership mismatch | Verify admin's businessId matches queue            |
| 7   | Exchange request with called user   | Status guard missing in controller    | Check target member status === "waiting"           |
| 8   | Notifications 404 in frontend       | Route mounted inline in server.js     | Use `/api/notifications` (not router file)         |
| 9   | Rate limiter blocks rapid tests     | `globalLimiter` too strict in dev     | Increase limit in `.env` for dev environment       |
| 10  | Analytics 403 for admin             | `authorize("admin")` not applied      | Confirm `analyticsRoutes` middleware order         |

---

## Bug Summary Table _(fill during testing)_

| Bug ID  | Module | Title | Severity | Status  | Fix Applied |
| ------- | ------ | ----- | -------- | ------- | ----------- |
| BUG-001 | —      | —     | —        | Pending | —           |
