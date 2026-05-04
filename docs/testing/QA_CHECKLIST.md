# QA CHECKLIST — QueueLess
**Version:** 1.0.0 | **Date:** 2026-05-04 | **Phase:** Day 23

Mark each item `[x]` when verified. Sign off at the bottom when complete.

---

## SECTION 1 — Setup

- [ ] Backend server running on port 5000 without errors
- [ ] Frontend Vite server running on port 5173
- [ ] MongoDB connected (check server console for "✅ MongoDB Connected")
- [ ] All four test accounts created (usera, userb, admin, superadmin)
- [ ] Admin and SuperAdmin roles set via MongoDB
- [ ] Postman collection imported from `backend/QueueLess.postman_collection.json`
- [ ] Postman environment imported from `backend/QueueLess.local.postman_environment.json`
- [ ] "Send cookies" enabled in Postman settings
- [ ] Browser DevTools open (Console + Network tabs)
- [ ] Two browser windows ready for socket testing

---

## SECTION 2 — Auth Flow

- [ ] TC-A01 Register User A — 201 returned
- [ ] TC-A01 Register User B — 201 returned
- [ ] TC-A02 Duplicate email — 400 returned
- [ ] TC-A03 Missing fields — 422 validation error
- [ ] TC-A04 Login User A — token cookie set
- [ ] TC-A05 Wrong password — 401 returned
- [ ] TC-A06 Non-existent email — 401 returned
- [ ] TC-A07 GET /api/auth/me returns user object
- [ ] TC-A08 GET /api/auth/me without auth — 401 returned
- [ ] TC-A09 Page refresh keeps user logged in
- [ ] TC-A10 Logout clears cookie and redirects

---

## SECTION 3 — Business Flow

- [ ] TC-B01 Public GET /api/business returns businesses
- [ ] TC-B02 GET /api/business/:id returns single business
- [ ] TC-B04 Admin creates business — 201 returned
- [ ] TC-B05 User tries to create business — 403 returned
- [ ] TC-B06 Guest tries to create business — 401 returned
- [ ] TC-B07 Admin updates own business — 200 returned
- [ ] TC-B08 Admin updates other admin's business — 403 returned
- [ ] TC-B10 Business appears on Explore page in browser

---

## SECTION 4 — Queue Flow

- [ ] TC-Q01 Admin creates queue — 201, status = open
- [ ] TC-Q02 User tries to create queue — 403 returned
- [ ] TC-Q03 GET /api/queues/:id returns queue with members
- [ ] TC-Q04 User A joins queue — token number 1 assigned
- [ ] TC-Q05 User B joins queue — token number 2 assigned
- [ ] TC-Q06 User A joins again — 400 "Already in queue"
- [ ] TC-Q07 User A leaves queue — member status = left
- [ ] TC-Q08 User A leaves again — 400 "Not in waiting state"
- [ ] TC-Q09 GET /api/queues/my-active returns User B's queue
- [ ] TC-Q10 User joins closed queue — 400 "Queue is not open"

---

## SECTION 5 — Admin Queue Control

- [ ] TC-AC01 Admin calls next — currentToken increments
- [ ] TC-AC02 User calls next — 403 returned
- [ ] TC-AC03 Admin pauses queue — status = paused
- [ ] TC-AC05 Admin resumes queue — status = open
- [ ] TC-AC06 Admin closes queue — status = closed
- [ ] TC-AC07 Admin updates member status manually
- [ ] TC-AC08 Call next on closed queue — 400 returned
- [ ] Admin dashboard lists all own queues and members

---

## SECTION 6 — Socket Events

- [ ] TC-SK01 User joins queue page → `join_queue` emitted (check DevTools)
- [ ] TC-SK02 User A joins → Admin dashboard updates live (no refresh)
- [ ] TC-SK03 Admin calls next → User A receives `called_next` event
- [ ] TC-SK04 User at position 2–3 receives `turn_near` event
- [ ] TC-SK05 User leaves → Admin list updates live (no refresh)
- [ ] TC-SK06 Exchange accepted → both users receive `exchange_accepted`
- [ ] TC-SK07 No duplicate events on page rejoin (verify in console)

---

## SECTION 7 — Exchange Flow

- [ ] TC-EX01 User A sends exchange request to User B — 201 returned
- [ ] TC-EX02 User A tries self-exchange — 400 blocked
- [ ] TC-EX03 User A sends duplicate request — 400 blocked
- [ ] TC-EX05 User B views incoming request — visible in GET my-requests
- [ ] TC-EX06 User B accepts — tokens swapped — 200 returned
- [ ] TC-EX07 User A tries to accept own sent request — 403 blocked
- [ ] TC-EX08 User B rejects a request — status = rejected
- [ ] TC-EX09 Exchange history shows completed exchanges

---

## SECTION 8 — Notifications

- [ ] TC-N01 GET /api/notifications returns list
- [ ] TC-N02 GET /api/notifications/unread-count returns count
- [ ] TC-N03 PUT /:id/read marks one as read
- [ ] TC-N04 PUT /read-all marks all as read
- [ ] TC-N05 DELETE /:id removes notification
- [ ] TC-N06 Notification appears after joining queue (browser bell)
- [ ] TC-N07 Notification appears when turn is called (browser bell)
- [ ] TC-N08 Unauthenticated request returns 401

---

## SECTION 9 — Analytics

- [ ] TC-AN01 GET /api/analytics/overview — admin gets 200
- [ ] TC-AN02 GET /api/analytics/business/:id — 200 returned
- [ ] TC-AN03 GET /api/analytics/queues — 200 returned
- [ ] TC-AN04 GET /api/analytics/peak-hours — 200 returned
- [ ] TC-AN05 GET /api/analytics/completion-rate — 200 returned
- [ ] TC-AN06 User accesses analytics — 403 returned

---

## SECTION 10 — Super Admin

- [ ] TC-SA01 GET /api/admin/stats — 200 with platform stats
- [ ] TC-SA02 GET /api/admin/users — all users returned
- [ ] TC-SA04 Verify business — verified = true in DB
- [ ] TC-SA05 Unverify business — verified = false in DB
- [ ] TC-SA06 Delete business — removed from DB
- [ ] TC-SA08 Delete queue — removed from DB
- [ ] TC-SA09 GET /api/admin/logs — activity log returned
- [ ] TC-SA10 Admin accessing /api/admin/stats — 403 returned

---

## SECTION 11 — Role Access Matrix

- [ ] Guest cannot access /dashboard → 401 / redirect
- [ ] User cannot access /admin-dashboard → 403 / redirect
- [ ] Admin cannot access /superadmin → 403 / redirect
- [ ] SuperAdmin can access all admin and superadmin areas
- [ ] All API 401/403 responses have correct error message format

---

## SECTION 12 — Error States

- [ ] Invalid MongoDB ID returns proper error (not 500)
- [ ] Malformed JSON body returns 400
- [ ] Missing required fields return 422 with field-level errors
- [ ] Expired token returns 401 with clear message
- [ ] Accessing nonexistent route returns 404

---

## SECTION 13 — UI / Browser Checks

- [ ] Login page renders correctly
- [ ] Register page renders correctly
- [ ] User Dashboard shows active queues
- [ ] Queue Detail page shows token and position
- [ ] Notification bell shows unread count badge
- [ ] Admin Dashboard shows queue list and controls
- [ ] Exchange request sent/received visually confirmed
- [ ] Call Next button updates queue UI live
- [ ] Mobile breakpoint (≤768px) — layout not broken
- [ ] No console errors on any page load

---

## SECTION 14 — Final Sign-Off

| Area               | Tester | Date | Result  |
|--------------------|--------|------|---------|
| Auth Flow          |        |      | Pass/Fail |
| Business Flow      |        |      | Pass/Fail |
| Queue Flow         |        |      | Pass/Fail |
| Admin Controls     |        |      | Pass/Fail |
| Socket Events      |        |      | Pass/Fail |
| Exchange Flow      |        |      | Pass/Fail |
| Notifications      |        |      | Pass/Fail |
| Analytics          |        |      | Pass/Fail |
| Super Admin        |        |      | Pass/Fail |
| Role Access        |        |      | Pass/Fail |
| Error States       |        |      | Pass/Fail |
| Mobile UI          |        |      | Pass/Fail |

**Critical Bugs Open:** ___  
**High Bugs Open:** ___  
**Total Test Cases:** 60  
**Passed:** ___  
**Failed:** ___  

> **Day 23 Status:**  ☐ PASS — Ready for Documentation & Deployment  
> **Signed By:** _________________________ | **Date:** ___________
