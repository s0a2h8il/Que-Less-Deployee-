# QueueLess Postman/Newman Run Guide

This guide explains how to run the full QueueLess API collection with Postman or Newman and verify the backend end to end.

## Files

- Collection: [backend/QueueLess.postman_collection.json](../../backend/QueueLess.postman_collection.json)
- Environment: [backend/QueueLess.local.postman_environment.json](../../backend/QueueLess.local.postman_environment.json)

## What This Collection Covers

- Auth
- Business
- Queue
- Admin queue control
- Exchange
- Notification
- Analytics
- Super admin

## Prerequisites

1. Node.js installed.
2. Backend running locally.
3. MongoDB reachable from the backend.
4. Postman installed, or Newman available through `npx`.

## Important Local Settings

The checked-in environment file uses:

- `base_url = http://localhost:5000`

If your backend runs on a different port, update `base_url` before running the collection.

In this workspace, the backend has been running on `http://localhost:5001`, so set `base_url` to:

```text
http://localhost:5001
```

## Environment Variables

The collection expects these variables:

- `base_url`
- `user_token`
- `admin_token`
- `superadmin_token`
- `user_id`
- `business_id`
- `queue_id`
- `member_id`

The collection automatically stores `user_token` and `user_id` after a successful login request.

## Recommended Test Order

Run the requests in this order so the later steps have the required IDs and tokens:

1. Auth
   - Register User
   - Login User
   - Get Me
2. Business
   - Create Business
   - Get All Businesses
   - Get Single Business
3. Queue
   - Create Queue
   - Get Queue Details
   - Join Queue
   - Leave Queue
4. Admin Queue Control
   - Call Next
   - Pause Queue
   - Resume Queue
   - Close Queue
   - Update Member Status
5. Exchange
   - Create Request
   - Get Incoming Requests
   - Accept Request
   - Reject Request
   - Get History
6. Notification
   - Get Notifications
   - Get Unread Count
   - Mark As Read
   - Mark All As Read
   - Delete Notification
7. Analytics
   - Overview
   - Business Analytics
   - Queue Analytics
   - Peak Hours
   - Completion Rate
8. Super Admin
   - Stats
   - Users
   - Businesses
   - Queues
   - Logs

## Running in Postman

1. Open Postman.
2. Import [backend/QueueLess.postman_collection.json](../../backend/QueueLess.postman_collection.json).
3. Import [backend/QueueLess.local.postman_environment.json](../../backend/QueueLess.local.postman_environment.json).
4. Select the `QueueLess Local` environment.
5. Update `base_url` to the correct backend URL, if needed.
6. Run the requests in the recommended order.
7. Watch the Tests tab and the response body for failures.

### What to Verify in Postman

- 200 / 201 for valid requests.
- 401 for missing or invalid auth.
- 403 for role violations.
- 404 for missing resources.
- Validation messages for bad input.
- Saved variables after login and resource creation.

## Running with Newman

### Option 1: Run with `npx`

```bash
npx newman run "backend/QueueLess.postman_collection.json" \
  -e "backend/QueueLess.local.postman_environment.json"
```

### Option 2: Install Newman globally

```bash
npm install -g newman
newman run "backend/QueueLess.postman_collection.json" \
  -e "backend/QueueLess.local.postman_environment.json"
```

### Recommended Newman flags

Use these when you want better CI-style output:

```bash
npx newman run "backend/QueueLess.postman_collection.json" \
  -e "backend/QueueLess.local.postman_environment.json" \
  --reporters cli,json,junit \
  --reporter-json-export "docs/testing/newman-results.json" \
  --reporter-junit-export "docs/testing/newman-results.xml"
```

## Expected Data Flow

The collection relies on earlier requests to save data into the environment:

- Login saves `user_token` and `user_id`.
- Create Business should be used to capture `business_id`.
- Create Queue should be used to capture `queue_id`.
- Exchange and admin queue actions may require `member_id`.

If a request fails because an ID is missing, rerun the previous step that creates it.

## Common Failures and Fixes

### 1. `401 Unauthorized`

- Token missing.
- Environment not selected.
- Wrong token variable name.

### 2. `403 Forbidden`

- Logged in with the wrong role.
- Admin-only route used with a normal user token.

### 3. `404 Not Found`

- Backend running on a different port.
- `base_url` is wrong.
- Missing resource ID.

### 4. `429 Too Many Requests`

- Rate limiter triggered.
- Wait for the reset window or restart the backend for a clean local test.

### 5. Validation errors

- Request body missing a required field.
- Wrong body shape in the request.

## Suggested QA Flow

1. Run Auth first and confirm the token variables are saved.
2. Create one business as admin.
3. Create one queue under that business.
4. Join and leave the queue with a normal user token.
5. Test admin queue control.
6. Test analytics and super admin routes.
7. Record any failures in [BUG_REPORT.md](BUG_REPORT.md).

## Notes for Super Admin Testing

If `superadmin_token` is not already available, create the account manually in MongoDB or seed it with a known password before running the collection.

The collection uses bearer tokens in request headers, so a valid token must exist before running protected routes.
