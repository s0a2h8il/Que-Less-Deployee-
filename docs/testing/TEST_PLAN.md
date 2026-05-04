# TEST PLAN — QueueLess
**Version:** 1.0.0 | **Date:** 2026-05-04 | **Phase:** Day 23 Full QA

---

## 1. Objectives
- Validate all functional requirements end-to-end
- Verify real-time socket event delivery (no duplication)
- Confirm role-based access at both API and UI layers
- Identify, document, and triage all defects
- Confirm system is production-ready

---

## 2. Scope

| Module              | Test Types                                  |
|---------------------|---------------------------------------------|
| Auth                | API, Browser, Role Access                   |
| Business            | API, Browser, Role Access                   |
| Queue               | API, Browser, Socket, Role Access           |
| Admin Queue Control | API, Browser, Socket, Role Access           |
| Exchange            | API, Browser, Socket, Role Access           |
| Notifications       | API, Browser, Socket                        |
| Analytics           | API, Role Access                            |
| Super Admin         | API, Browser, Role Access                   |

---

## 3. Test Environment

**Backend:** `http://localhost:5000/api` | Node.js + Express + MongoDB + Socket.IO  
**Frontend:** `http://localhost:5173` | React + Vite  
**Auth:** JWT via HttpOnly cookies

---

## 4. Test Accounts

| Role        | Email                | Password   | Creation                        |
|-------------|----------------------|------------|---------------------------------|
| User A      | usera@test.com       | Test123456 | POST /api/auth/register         |
| User B      | userb@test.com       | Test123456 | POST /api/auth/register         |
| Admin       | admin@test.com       | Test123456 | Register → set role via MongoDB |
| Super Admin | superadmin@test.com  | Test123456 | Register → set role via MongoDB |

### Creating SuperAdmin (MongoDB Shell)
```js
// Register via API first, then run:
db.users.updateOne({ email: "superadmin@test.com" }, { $set: { role: "superadmin" } })
db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } })
```

---

## 5. All API Endpoints (from server.js)

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

# Business
GET    /api/business
GET    /api/business/my
GET    /api/business/:id
POST   /api/business          [admin, superadmin]
PUT    /api/business/:id      [admin, superadmin]

# Queue
GET    /api/queues
GET    /api/queues/my-active
POST   /api/queues            [admin]
GET    /api/queues/:id
POST   /api/queues/:id/join
POST   /api/queues/:id/leave
POST   /api/queues/:id/next   [admin]
PUT    /api/queues/:id/pause  [admin]
PUT    /api/queues/:id/resume [admin]
PUT    /api/queues/:id/close  [admin]
PUT    /api/queues/:id/members/:memberId/status [admin]

# Exchange
POST   /api/exchanges/request
GET    /api/exchanges/my-requests
GET    /api/exchanges/history
PUT    /api/exchanges/:id/accept
PUT    /api/exchanges/:id/reject

# Notifications
GET    /api/notifications
GET    /api/notifications/unread-count
PUT    /api/notifications/read-all
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id

# Analytics [admin, superadmin]
GET    /api/analytics/overview
GET    /api/analytics/business/:businessId
GET    /api/analytics/queues
GET    /api/analytics/peak-hours
GET    /api/analytics/completion-rate

# Super Admin [superadmin only]
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/businesses
PUT    /api/admin/businesses/:id/verify
PUT    /api/admin/businesses/:id/unverify
DELETE /api/admin/businesses/:id
GET    /api/admin/queues
DELETE /api/admin/queues/:id
GET    /api/admin/logs

# Health
GET    /api/health
```

---

## 6. Socket Events

| Direction       | Event             | Trigger                        |
|-----------------|-------------------|--------------------------------|
| Client → Server | join_queue        | User opens queue detail page   |
| Client → Server | leave_queue       | User leaves queue room         |
| Server → Client | queue_updated     | Any queue state change         |
| Server → Client | turn_near         | User is within 2-3 positions   |
| Server → Client | called_next       | User's token called            |
| Server → Client | exchange_accepted  | Exchange swap completed        |

---

## 7. Test Execution Order

```
1. Health Check
2. Auth Flow
3. Business Flow
4. Queue Flow
5. Admin Queue Control
6. Exchange Flow
7. Notification Flow
8. Analytics Flow
9. Super Admin Flow
10. Socket Events
11. Role Access Matrix
```

---

## 8. Bug Severity SLA

| Severity | Fix SLA   | Examples                              |
|----------|-----------|---------------------------------------|
| Critical | Immediate | Login broken, data loss, auth bypass  |
| High     | Same day  | Core feature broken, wrong data       |
| Medium   | 24 hours  | UI mismatch, minor logic error        |
| Low      | 72 hours  | Cosmetic, edge case                   |

---

## 9. Entry / Exit Criteria

**Entry:** Backend on :5000, Frontend on :5173, MongoDB connected, test accounts created, Postman ready.  
**Exit:** All test cases run, zero Critical/High bugs open, BUG_REPORT completed, QA_CHECKLIST signed.

---

## 10. Risks

| Risk                           | Mitigation                              |
|--------------------------------|-----------------------------------------|
| Rate limiter blocks test calls | Add delays in Postman / use env resets  |
| Token expires mid-test         | Re-login and update `{{token}}` var     |
| Socket events duplicated       | Check for duplicate listeners in DevTools |
| Cookie not sent in Postman     | Enable "Send cookies" in Postman settings |
