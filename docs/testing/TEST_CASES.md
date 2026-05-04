# TEST CASES — QueueLess
**Version:** 1.0.0 | **Date:** 2026-05-04

---

## MODULE 1: AUTH

| TC ID  | Title                      | Method | Endpoint              | Body / Params                              | Expected Result                              | Status |
|--------|----------------------------|--------|-----------------------|--------------------------------------------|----------------------------------------------|--------|
| TC-A01 | Register new user          | POST   | /api/auth/register    | `{name, email: usera@test.com, password}`  | 201 · user created · token set in cookie     | ☐      |
| TC-A02 | Register duplicate email   | POST   | /api/auth/register    | Same email as TC-A01                       | 400 · "Email already in use"                 | ☐      |
| TC-A03 | Register missing fields    | POST   | /api/auth/register    | `{email only}`                             | 422 · validation errors returned             | ☐      |
| TC-A04 | Login valid credentials    | POST   | /api/auth/login       | `{email, password: Test123456}`            | 200 · JWT cookie set · user object returned  | ☐      |
| TC-A05 | Login wrong password       | POST   | /api/auth/login       | `{email, password: wrongpass}`             | 401 · "Invalid credentials"                  | ☐      |
| TC-A06 | Login non-existent email   | POST   | /api/auth/login       | `{email: ghost@x.com, password}`           | 401 · "Invalid credentials"                  | ☐      |
| TC-A07 | Get current user (auth)    | GET    | /api/auth/me          | Cookie: valid JWT                          | 200 · user object with role                  | ☐      |
| TC-A08 | Get current user (no auth) | GET    | /api/auth/me          | No cookie                                  | 401 · "Not authorized"                       | ☐      |
| TC-A09 | Token persists on refresh  | —      | Browser refresh       | After login, refresh page                  | User stays logged in, token still in cookie  | ☐      |
| TC-A10 | Logout clears token        | —      | Browser logout button | Click logout                               | Cookie cleared, redirect to login            | ☐      |

---

## MODULE 2: BUSINESS

| TC ID  | Title                          | Method | Endpoint             | Auth Role | Expected Result                          | Status |
|--------|--------------------------------|--------|----------------------|-----------|------------------------------------------|--------|
| TC-B01 | Get all businesses (public)    | GET    | /api/business        | None      | 200 · array of businesses                | ☐      |
| TC-B02 | Get business by ID             | GET    | /api/business/:id    | None      | 200 · single business object             | ☐      |
| TC-B03 | Get invalid ID format          | GET    | /api/business/abc    | None      | 404 · route not matched (regex guard)    | ☐      |
| TC-B04 | Create business as admin       | POST   | /api/business        | Admin     | 201 · business created                   | ☐      |
| TC-B05 | Create business as user        | POST   | /api/business        | User      | 403 · "Forbidden"                        | ☐      |
| TC-B06 | Create business as guest       | POST   | /api/business        | None      | 401 · "Not authorized"                   | ☐      |
| TC-B07 | Update own business            | PUT    | /api/business/:id    | Admin     | 200 · updated business returned          | ☐      |
| TC-B08 | Update another admin's business| PUT    | /api/business/:id    | Admin     | 403 · "Not your business"                | ☐      |
| TC-B09 | Get my businesses              | GET    | /api/business/my     | Admin     | 200 · array of own businesses            | ☐      |
| TC-B10 | Business appears on Explore    | —      | Browser /explore     | Any       | Business card visible after creation     | ☐      |

---

## MODULE 3: QUEUE

| TC ID  | Title                       | Method | Endpoint               | Auth Role | Expected Result                            | Status |
|--------|-----------------------------|--------|------------------------|-----------|--------------------------------------------|--------|
| TC-Q01 | Create queue as admin       | POST   | /api/queues            | Admin     | 201 · queue object with status: open       | ☐      |
| TC-Q02 | Create queue as user        | POST   | /api/queues            | User      | 403 · Forbidden                            | ☐      |
| TC-Q03 | Get queue details           | GET    | /api/queues/:id        | User      | 200 · queue with members array             | ☐      |
| TC-Q04 | Join queue (User A)         | POST   | /api/queues/:id/join   | User A    | 200 · token number assigned (e.g. 1)       | ☐      |
| TC-Q05 | Join queue (User B)         | POST   | /api/queues/:id/join   | User B    | 200 · token number 2                       | ☐      |
| TC-Q06 | Duplicate join blocked      | POST   | /api/queues/:id/join   | User A    | 400 · "Already in queue"                   | ☐      |
| TC-Q07 | Leave queue (User A)        | POST   | /api/queues/:id/leave  | User A    | 200 · member status = left                 | ☐      |
| TC-Q08 | Leave again after leaving   | POST   | /api/queues/:id/leave  | User A    | 400 · "Not in waiting state"               | ☐      |
| TC-Q09 | Get my active queues        | GET    | /api/queues/my-active  | User B    | 200 · array with User B's active queue     | ☐      |
| TC-Q10 | Join closed queue           | POST   | /api/queues/:id/join   | User      | 400 · "Queue is not open"                  | ☐      |

---

## MODULE 4: ADMIN QUEUE CONTROL

| TC ID  | Title                       | Method | Endpoint                  | Auth Role | Expected Result                            | Status |
|--------|-----------------------------|--------|---------------------------|-----------|--------------------------------------------|--------|
| TC-AC01| Call next user              | POST   | /api/queues/:id/next      | Admin     | 200 · currentToken increments, member status = called | ☐ |
| TC-AC02| Call next — non-admin       | POST   | /api/queues/:id/next      | User      | 403 · Forbidden                            | ☐      |
| TC-AC03| Pause queue                 | PUT    | /api/queues/:id/pause     | Admin     | 200 · status = paused                      | ☐      |
| TC-AC04| Pause already paused        | PUT    | /api/queues/:id/pause     | Admin     | 400 · appropriate error                    | ☐      |
| TC-AC05| Resume queue                | PUT    | /api/queues/:id/resume    | Admin     | 200 · status = open                        | ☐      |
| TC-AC06| Close queue                 | PUT    | /api/queues/:id/close     | Admin     | 200 · status = closed                      | ☐      |
| TC-AC07| Update member status        | PUT    | /api/queues/:id/members/:memberId/status | Admin | 200 · member status updated  | ☐ |
| TC-AC08| Call next on closed queue   | POST   | /api/queues/:id/next      | Admin     | 400 · "Queue is not open"                  | ☐      |
| TC-AC09| View admin queues list      | GET    | /api/queues               | Admin     | 200 · own queues listed                    | ☐      |

---

## MODULE 5: EXCHANGE

| TC ID  | Title                         | Method | Endpoint                    | Auth Role | Expected Result                            | Status |
|--------|-------------------------------|--------|-----------------------------|-----------|--------------------------------------------|--------|
| TC-EX01| User A sends exchange request | POST   | /api/exchanges/request      | User A    | 201 · exchange request created (pending)   | ☐      |
| TC-EX02| Self exchange blocked         | POST   | /api/exchanges/request      | User A    | 400 · "Cannot exchange with yourself"      | ☐      |
| TC-EX03| Duplicate pending blocked     | POST   | /api/exchanges/request      | User A    | 400 · "Pending request already exists"     | ☐      |
| TC-EX04| Exchange with called user     | POST   | /api/exchanges/request      | User A    | 400 · "Target not in waiting state"        | ☐      |
| TC-EX05| User B views incoming request | GET    | /api/exchanges/my-requests  | User B    | 200 · pending request visible              | ☐      |
| TC-EX06| User B accepts request        | PUT    | /api/exchanges/:id/accept   | User B    | 200 · tokens swapped · status = accepted   | ☐      |
| TC-EX07| Non-receiver cannot accept    | PUT    | /api/exchanges/:id/accept   | User A    | 403 · "Only receiver can accept"           | ☐      |
| TC-EX08| User B rejects request        | PUT    | /api/exchanges/:id/reject   | User B    | 200 · status = rejected                    | ☐      |
| TC-EX09| View exchange history         | GET    | /api/exchanges/history      | User A    | 200 · completed exchanges listed           | ☐      |

---

## MODULE 6: NOTIFICATIONS

| TC ID  | Title                       | Method | Endpoint                          | Auth | Expected Result                     | Status |
|--------|-----------------------------|--------|-----------------------------------|------|-------------------------------------|--------|
| TC-N01 | Get notifications           | GET    | /api/notifications                | User | 200 · array of notification objects | ☐      |
| TC-N02 | Get unread count            | GET    | /api/notifications/unread-count   | User | 200 · `{count: N}`                  | ☐      |
| TC-N03 | Mark one as read            | PUT    | /api/notifications/:id/read       | User | 200 · notification.read = true      | ☐      |
| TC-N04 | Mark all as read            | PUT    | /api/notifications/read-all       | User | 200 · all notifications.read = true | ☐      |
| TC-N05 | Delete notification         | DELETE | /api/notifications/:id            | User | 200 · notification removed          | ☐      |
| TC-N06 | Notification on join        | —      | Socket / browser                  | User | Bell shows notification after join  | ☐      |
| TC-N07 | Notification on turn called | —      | Socket / browser                  | User | Notification received when called   | ☐      |
| TC-N08 | Unauth access blocked       | GET    | /api/notifications                | None | 401 · "Not authorized"              | ☐      |

---

## MODULE 7: ANALYTICS

| TC ID  | Title                       | Method | Endpoint                          | Auth Role | Expected Result          | Status |
|--------|-----------------------------|--------|-----------------------------------|-----------|--------------------------|--------|
| TC-AN01| Get overview analytics      | GET    | /api/analytics/overview           | Admin     | 200 · stats object       | ☐      |
| TC-AN02| Get business analytics      | GET    | /api/analytics/business/:id       | Admin     | 200 · business stats     | ☐      |
| TC-AN03| Get queue analytics         | GET    | /api/analytics/queues             | Admin     | 200 · queue stats        | ☐      |
| TC-AN04| Get peak hours              | GET    | /api/analytics/peak-hours         | Admin     | 200 · peak hours array   | ☐      |
| TC-AN05| Get completion rate         | GET    | /api/analytics/completion-rate    | Admin     | 200 · completion %       | ☐      |
| TC-AN06| User accesses analytics     | GET    | /api/analytics/overview           | User      | 403 · Forbidden          | ☐      |

---

## MODULE 8: SUPER ADMIN

| TC ID  | Title                        | Method | Endpoint                         | Auth Role  | Expected Result                     | Status |
|--------|------------------------------|--------|----------------------------------|------------|-------------------------------------|--------|
| TC-SA01| Get platform stats           | GET    | /api/admin/stats                 | Superadmin | 200 · platform-wide stats           | ☐      |
| TC-SA02| Get all users                | GET    | /api/admin/users                 | Superadmin | 200 · all user records              | ☐      |
| TC-SA03| Get all businesses           | GET    | /api/admin/businesses            | Superadmin | 200 · all businesses                | ☐      |
| TC-SA04| Verify a business            | PUT    | /api/admin/businesses/:id/verify | Superadmin | 200 · business.verified = true      | ☐      |
| TC-SA05| Unverify a business          | PUT    | /api/admin/businesses/:id/unverify | Superadmin | 200 · business.verified = false  | ☐      |
| TC-SA06| Delete a business            | DELETE | /api/admin/businesses/:id        | Superadmin | 200 · business deleted              | ☐      |
| TC-SA07| Get all queues               | GET    | /api/admin/queues                | Superadmin | 200 · all queues                    | ☐      |
| TC-SA08| Delete a queue               | DELETE | /api/admin/queues/:id            | Superadmin | 200 · queue deleted                 | ☐      |
| TC-SA09| Get activity logs            | GET    | /api/admin/logs                  | Superadmin | 200 · activity log entries          | ☐      |
| TC-SA10| Admin accesses superadmin    | GET    | /api/admin/stats                 | Admin      | 403 · Forbidden                     | ☐      |

---

## MODULE 9: SOCKET EVENTS

| TC ID  | Title                          | Setup                        | Action                    | Expected Socket Event             | Status |
|--------|--------------------------------|------------------------------|---------------------------|-----------------------------------|--------|
| TC-SK01| User joins queue room          | User on queue detail page    | Page loads                | Client emits join_queue           | ☐      |
| TC-SK02| Admin sees join live           | Admin on dashboard           | User A joins queue        | Admin receives queue_updated      | ☐      |
| TC-SK03| Admin calls next               | User A waiting               | Admin clicks Call Next    | User A receives called_next       | ☐      |
| TC-SK04| Turn near event                | User B at position 2-3       | Admin calls next          | User B receives turn_near         | ☐      |
| TC-SK05| User leaves — admin sees live  | Admin dashboard open         | User leaves queue         | Admin receives queue_updated      | ☐      |
| TC-SK06| Exchange accepted event        | Both users in same queue     | User B accepts exchange   | Both receive exchange_accepted    | ☐      |
| TC-SK07| No duplicate events            | Refresh queue detail page    | Rejoin then leave         | Event fires exactly once per action | ☐    |

---

## MODULE 10: ROLE ACCESS MATRIX

| TC ID  | Resource             | Guest | User | Admin | Superadmin | Status |
|--------|----------------------|-------|------|-------|------------|--------|
| TC-RA01| Register / Login     | ✅    | ✅   | ✅    | ✅         | ☐      |
| TC-RA02| User Dashboard       | ❌401 | ✅   | ✅    | ✅         | ☐      |
| TC-RA03| Admin Dashboard      | ❌401 | ❌403| ✅    | ✅         | ☐      |
| TC-RA04| Superadmin Panel     | ❌401 | ❌403| ❌403 | ✅         | ☐      |
| TC-RA05| Create Business      | ❌401 | ❌403| ✅    | ✅         | ☐      |
| TC-RA06| Create Queue         | ❌401 | ❌403| ✅    | ✅         | ☐      |
| TC-RA07| Join Queue           | ❌401 | ✅   | ✅    | ✅         | ☐      |
| TC-RA08| Call Next / Pause    | ❌401 | ❌403| ✅    | ✅         | ☐      |
| TC-RA09| Analytics Endpoints  | ❌401 | ❌403| ✅    | ✅         | ☐      |
| TC-RA10| /api/admin/* routes  | ❌401 | ❌403| ❌403 | ✅         | ☐      |
