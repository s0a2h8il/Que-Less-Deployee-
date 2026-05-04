# QueueLess Super Admin Panel - Testing Guide

## Prerequisites

- Backend running on http://localhost:5001
- Frontend running on http://localhost:5173
- MongoDB connected to localhost:27017/queueless
- Create a test superadmin user with role: "superadmin"

## Test Scenarios

### **Test Group 1: Authentication & Access Control**

#### Test 1.1: Superadmin Access

**Steps:**

1. Login with superadmin credentials
2. Click "Super Admin" button (red) in navbar
3. Should redirect to /admin/superadmin with all tabs visible

**Expected Result:** ✓ Dashboard loads, no access denied error

**Test Data:**

```
Email: superadmin@test.com
Password: Test@123
Role: superadmin
```

---

#### Test 1.2: Regular Admin Cannot Access

**Steps:**

1. Login with admin credentials (role: "admin")
2. Try accessing /admin/superadmin directly
3. Should redirect or show 403 error

**Expected Result:** ✓ Access denied or redirected to /admin/dashboard

---

#### Test 1.3: Regular User Cannot Access

**Steps:**

1. Login with user credentials (role: "user")
2. Try accessing /admin/superadmin
3. Should redirect or show 403 error

**Expected Result:** ✓ Access denied or redirected to home

---

### **Test Group 2: Overview Tab**

#### Test 2.1: Stats Load Correctly

**Steps:**

1. Navigate to Super Admin Dashboard
2. Overview tab should be active by default
3. Verify 5 stat cards display:
   - Total Users (with admin count)
   - Total Businesses (with unverified count)
   - Verified Businesses (with percentage)
   - Active Queues (with total count)
   - Pending Reports (placeholder)

**Expected Result:** ✓ All stat cards load with correct data

---

### **Test Group 3: Users Tab**

#### Test 3.1: Users List Loads with Pagination

**Steps:**

1. Click "Users" tab
2. Table should display list of users with columns:
   - Name
   - Email
   - Role
   - Joined Date
3. Pagination buttons should appear if more than default limit (10 per page)
4. First page should have "Joined Date" formatted properly

**Expected Result:** ✓ Users table displays with correct pagination

---

#### Test 3.2: Search Users by Name

**Steps:**

1. In Users tab, enter a user's first name in search box
2. Table should filter in real-time
3. Only users matching the search appear

**Test Data:**

```
Search: "john" (if user named John exists)
Expected: Only users with "john" in name/email shown
```

**Expected Result:** ✓ Search filters users correctly

---

#### Test 3.3: Search Users by Email

**Steps:**

1. In Users tab, enter an email in search box
2. Table should filter to show matching users

**Test Data:**

```
Search: "test@example.com"
Expected: User with that email shown
```

**Expected Result:** ✓ Email search works correctly

---

#### Test 3.4: Filter Users by Role

**Steps:**

1. In Users tab, click role filter buttons (user/admin/superadmin)
2. Table should show only users with that role
3. Clicking same button again should deselect filter

**Expected Result:** ✓ Role filtering works, can toggle on/off

---

#### Test 3.5: User Pagination

**Steps:**

1. Go to Users tab
2. If more than 10 users exist, "Next" button should be enabled
3. Click "Next" → page 2 loads
4. Click "Previous" → back to page 1

**Expected Result:** ✓ Pagination navigates correctly

---

### **Test Group 4: Businesses Tab**

#### Test 4.1: Businesses List Loads

**Steps:**

1. Click "Businesses" tab
2. Table displays all businesses with columns:
   - Business Name (with city below)
   - Owner (name + email)
   - Category
   - Verified Status (badge: green for verified, gray for unverified)

**Expected Result:** ✓ Businesses table displays correctly

---

#### Test 4.2: Search Businesses

**Steps:**

1. In Businesses tab, enter business name in search
2. Table filters to matching businesses
3. Clear search → all businesses appear again

**Test Data:**

```
Search: "pizza" (if pizza business exists)
Expected: Only pizza businesses shown
```

**Expected Result:** ✓ Search filters businesses correctly

---

#### Test 4.3: Filter by Verification Status

**Steps:**

1. Click "Verified" status filter
2. Table shows only verified businesses
3. Click "Unverified" filter
4. Table shows only unverified businesses
5. Click same filter again to deselect

**Expected Result:** ✓ Status filters work, can toggle

---

#### Test 4.4: Verify Unverified Business

**Steps:**

1. In Businesses tab, find an unverified business
2. Click "Verify" button (green checkmark icon)
3. Modal should ask for confirmation
4. Click "Verify" in modal
5. Business should move to verified

**Expected Result:** ✓ Verification status changes, table updates

---

#### Test 4.5: Unverify Verified Business

**Steps:**

1. Find a verified business
2. Click "Unverify" button (red X icon)
3. Modal asks for confirmation with warning
4. Click "Unverify" in modal
5. Business should move to unverified

**Expected Result:** ✓ Unverification works, status changes

---

#### Test 4.6: Delete Business (Soft Delete)

**Steps:**

1. Find any business
2. Click "Delete" button (trash icon)
3. Modal asks: "Are you sure?" with explanation of soft delete
4. Click "Delete" button (red)
5. Business should disappear from table but isActive remains false in DB

**Expected Result:** ✓ Business disappears from table (soft deleted)

**Verify in MongoDB:**

```
db.businesses.findOne({_id: ObjectId("...")})
// Should show: isActive: false
```

---

#### Test 4.7: Business Pagination

**Steps:**

1. If more than 10 businesses exist
2. Navigate between pages using Previous/Next buttons

**Expected Result:** ✓ Pagination works correctly

---

### **Test Group 5: Queues Tab**

#### Test 5.1: Queues List Loads with Stats

**Steps:**

1. Click "Queues" tab
2. Table displays all queues with columns:
   - Queue Title
   - Business Name
   - Status (active/paused/closed badge)
   - Waiting Users Count
   - Current Token #
   - Actions

**Expected Result:** ✓ Queues table displays with calculated stats

---

#### Test 5.2: Queue Stats Calculation

**Steps:**

1. In Queues tab, check "Waiting Users Count" column
2. Verify it matches the number of users in queue.members array

**Expected Result:** ✓ Stats calculated correctly

---

#### Test 5.3: Search Queues

**Steps:**

1. In Queues tab, enter queue title in search
2. Table filters to matching queues

**Test Data:**

```
Search: "billing" (if queue titled "Billing Queue" exists)
Expected: Only matching queues shown
```

**Expected Result:** ✓ Search filters queues correctly

---

#### Test 5.4: Filter Queues by Status

**Steps:**

1. Click status filter buttons (active/paused/closed)
2. Table shows only queues with that status
3. Toggle filters on/off

**Expected Result:** ✓ Status filtering works

---

#### Test 5.5: Delete Queue (Soft Delete)

**Steps:**

1. Find any active queue
2. Click "Delete" button
3. Modal shows confirmation
4. Click "Delete" (red button)
5. Queue should disappear from table

**Expected Result:** ✓ Queue disappears (status: "closed")

**Verify in MongoDB:**

```
db.queues.findOne({_id: ObjectId("...")})
// Should show: status: "closed"
```

---

#### Test 5.6: Queue Pagination

**Steps:**

1. If more than 10 queues exist
2. Navigate between pages

**Expected Result:** ✓ Pagination works

---

### **Test Group 6: Activity Logs Tab**

#### Test 6.1: Logs Tab Loads

**Steps:**

1. Click "Activity Logs" tab
2. Currently shows placeholder (empty array)

**Expected Result:** ✓ Tab loads without error

**Note:** Activity logs feature to be implemented in future

---

### **Test Group 7: Navigation & UI**

#### Test 7.1: Tab Switching

**Steps:**

1. Start on Overview tab
2. Click each sidebar tab: Users → Businesses → Queues → Logs
3. Content should update for each tab
4. Tab should remain highlighted in sidebar

**Expected Result:** ✓ All tabs switch correctly

---

#### Test 7.2: Loading States

**Steps:**

1. Navigate to different tabs
2. If data is loading, should see skeleton loaders

**Expected Result:** ✓ Loading indicators visible during data fetch

---

#### Test 7.3: Error Handling

**Steps:**

1. Simulate network error (dev tools network throttle)
2. Navigate to tab
3. Error banner should appear with "Retry" button
4. Click "Retry" → should refetch data

**Expected Result:** ✓ Error handling works, retry works

---

#### Test 7.4: Empty States

**Steps:**

1. If no users/businesses/queues exist
2. Each tab should show "No [items] found" message

**Expected Result:** ✓ Empty state displays correctly

---

### **Test Group 8: Modal Dialogs**

#### Test 8.1: Delete Confirmation Modal

**Steps:**

1. Click delete on any item (business/queue)
2. Modal should show:
   - Title
   - Message
   - Warning icon
   - "Delete" button (red)
   - "Cancel" button (gray)

**Expected Result:** ✓ Modal displays correctly

---

#### Test 8.2: Modal Close on Cancel

**Steps:**

1. Open delete modal
2. Click "Cancel" button
3. Modal should close, item remains unchanged

**Expected Result:** ✓ Modal closes, no deletion occurs

---

#### Test 8.3: Modal Close on X Button

**Steps:**

1. Open delete modal
2. Click X button (top-right)
3. Modal should close

**Expected Result:** ✓ Modal closes

---

### **Test Group 9: API Error Scenarios**

#### Test 9.1: Verify Already Verified Business

**Steps:**

1. Try to verify a business that's already verified
2. Should show error message

**Expected Result:** ✓ Error handled with user-friendly message

---

#### Test 9.2: Unverify Already Unverified Business

**Steps:**

1. Try to unverify a business that's already unverified
2. Should show error message

**Expected Result:** ✓ Error handled gracefully

---

#### Test 9.3: Invalid Business ID

**Steps:**

1. Try to access /api/admin/businesses/invalid-id
2. Should return 400 Bad Request

**Expected Result:** ✓ Error validation works

---

#### Test 9.4: Non-Existent Resource

**Steps:**

1. Try to delete a business with fake ObjectId
2. Should show 404 or resource not found error

**Expected Result:** ✓ 404 handled correctly

---

### **Test Group 10: Performance & Data Handling**

#### Test 10.1: Pagination with Large Dataset

**Steps:**

1. If database has 100+ users/businesses/queues
2. Load first page → should be fast
3. Navigate to page 5 → should load quickly

**Expected Result:** ✓ Pagination handles large datasets

---

#### Test 10.2: Search Performance

**Steps:**

1. Have 1000+ users in database
2. Search for a common name
3. Should return results in <1 second

**Expected Result:** ✓ Search is performant

---

#### Test 10.3: Multiple Modal Operations

**Steps:**

1. Delete business A (shows modal)
2. Close modal
3. Delete business B (shows modal again)
4. Should work without issues

**Expected Result:** ✓ Multiple modals work correctly

---

### **Test Group 11: Role-Based Authorization Checks**

#### Test 11.1: Superadmin Routes Protected

**Steps:**

1. Make unauthorized request to /api/admin/stats (without auth token)
2. Should return 401 Unauthorized

**Expected Result:** ✓ Routes properly protected

---

#### Test 11.2: Regular Admin Cannot Access Super Admin Routes

**Steps:**

1. Get auth token for regular admin
2. Try GET /api/admin/stats
3. Should return 403 Forbidden

**Expected Result:** ✓ Role authorization works

---

### **Test Group 12: Data Consistency**

#### Test 12.1: Soft Delete Maintains Data

**Steps:**

1. Delete a business
2. Check MongoDB: business document should still exist with isActive: false
3. Table should not show deleted business

**Expected Result:** ✓ Soft delete works, data maintained

---

#### Test 12.2: Search Excludes Deleted Items

**Steps:**

1. Delete a business named "Pizza Place"
2. Search for "pizza"
3. Should not find the deleted business

**Expected Result:** ✓ Deleted items not searchable

---

### **Test Group 13: Form Validation**

#### Test 13.1: Modal Confirm Button States

**Steps:**

1. Open delete modal
2. While loading, "Delete" button should be disabled
3. After completion, modal should close

**Expected Result:** ✓ Button disabled during loading

---

### **Test Group 14: Browser Compatibility**

#### Test 14.1: Chrome/Edge

**Steps:**

1. Open dashboard in Chrome
2. All features should work

**Expected Result:** ✓ Works in Chrome

---

#### Test 14.2: Firefox

**Steps:**

1. Open dashboard in Firefox
2. All features should work

**Expected Result:** ✓ Works in Firefox

---

#### Test 14.3: Safari (if on Mac)

**Steps:**

1. Open dashboard in Safari
2. All features should work

**Expected Result:** ✓ Works in Safari

---

### **Test Group 15: Responsive Design**

#### Test 15.1: Desktop View (1920x1080)

**Steps:**

1. Open dashboard on desktop
2. All tables should display correctly
3. Sidebar should be visible

**Expected Result:** ✓ Desktop view correct

---

#### Test 15.2: Tablet View (768x1024)

**Steps:**

1. Resize to tablet size
2. Layout should adapt
3. Tables may scroll horizontally

**Expected Result:** ✓ Tablet view functional

---

#### Test 15.3: Mobile View (375x667)

**Steps:**

1. Resize to mobile size
2. Sidebar may collapse
3. Tables should scroll

**Expected Result:** ✓ Mobile view functional

---

### **Test Group 16: Notifications & Feedback**

#### Test 16.1: Success Toast on Action

**Steps:**

1. Verify a business
2. Toast should show "Business verified successfully"
3. Toast auto-dismisses after 3 seconds

**Expected Result:** ✓ Success notifications work

---

#### Test 16.2: Error Toast on Failure

**Steps:**

1. Simulate network error
2. Try to verify business
3. Toast should show error message

**Expected Result:** ✓ Error notifications work

---

### **Test Group 17: Data Refresh**

#### Test 17.1: Manual Refresh Button

**Steps:**

1. Click refresh/reload button (if implemented)
2. Data should reload from backend
3. Timestamps should update

**Expected Result:** ✓ Manual refresh works

---

#### Test 17.2: Tab Switch Triggers Refresh

**Steps:**

1. On Users tab
2. Switch to Businesses tab
3. Should fetch fresh business data

**Expected Result:** ✓ Tab switch loads fresh data

---

## Test Data Setup Script

```javascript
// Run in MongoDB shell to setup test data

// Create superadmin user
db.users.insertOne({
  name: "Super Admin",
  email: "superadmin@test.com",
  password: "hashed_password_here",
  role: "superadmin",
  createdAt: new Date(),
  isActive: true,
});

// Create regular admin
db.users.insertOne({
  name: "Regular Admin",
  email: "admin@test.com",
  password: "hashed_password_here",
  role: "admin",
  createdAt: new Date(),
  isActive: true,
});

// Create regular users
db.users.insertMany([
  {
    name: "John Doe",
    email: "john@test.com",
    role: "user",
    createdAt: new Date(),
    isActive: true,
  },
  {
    name: "Jane Smith",
    email: "jane@test.com",
    role: "user",
    createdAt: new Date(),
    isActive: true,
  },
]);

// Create businesses
db.businesses.insertMany([
  {
    name: "Pizza Place",
    owner: ObjectId("...owner_id..."),
    category: "Food",
    city: "New York",
    isVerified: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Coffee Shop",
    owner: ObjectId("...owner_id..."),
    category: "Food",
    city: "Boston",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
  },
]);

// Create queues
db.queues.insertMany([
  {
    title: "Billing Queue",
    business: ObjectId("...business_id..."),
    status: "active",
    members: [ObjectId("...user_id..."), ObjectId("...user_id...")],
    currentToken: 5,
    createdAt: new Date(),
  },
]);
```

## Common Issues & Solutions

### Issue: "Not authorized to access"

**Solution:**

- Verify user has superadmin role in MongoDB
- Check auth token is valid in browser DevTools → Application → localStorage
- Clear cache and login again

### Issue: Table showing no data

**Solution:**

- Check browser console for API errors
- Verify backend is running on port 5001
- Check MongoDB connection
- Run test data setup script

### Issue: Search not working

**Solution:**

- Check search term matches data in DB
- Verify backend search logic working (test API directly)
- Check component search box is focused

### Issue: Modal not closing

**Solution:**

- Check browser console for JavaScript errors
- Verify onClick handlers properly attached
- Clear browser cache

### Issue: Pagination buttons disabled

**Solution:**

- Verify you have more than 10 items in the list
- Check backend returns correct totalPages value
- Inspect network requests in DevTools

## Manual API Testing

### Get Platform Stats

```bash
curl -X GET http://localhost:5001/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Users

```bash
curl -X GET "http://localhost:5001/api/admin/users?search=john&role=user&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify Business

```bash
curl -X PUT http://localhost:5001/api/admin/businesses/BUSINESS_ID/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Business

```bash
curl -X DELETE "http://localhost:5001/api/admin/businesses/BUSINESS_ID?permanent=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Postman Collection

Import `QueueLess.postman_collection.json` and add these endpoints:

```
GET /api/admin/stats
GET /api/admin/users?search={{search}}&role={{role}}&page={{page}}&limit={{limit}}
GET /api/admin/businesses?search={{search}}&isVerified={{isVerified}}&page={{page}}&limit={{limit}}
PUT /api/admin/businesses/:id/verify
PUT /api/admin/businesses/:id/unverify
DELETE /api/admin/businesses/:id?permanent={{permanent}}
GET /api/admin/queues?search={{search}}&status={{status}}&page={{page}}&limit={{limit}}
DELETE /api/admin/queues/:id?permanent={{permanent}}
GET /api/admin/logs
```

## Completion Checklist

- [ ] All 17 test scenarios passed
- [ ] No console errors
- [ ] No API errors (check Network tab)
- [ ] All sorting works
- [ ] All filtering works
- [ ] Pagination works correctly
- [ ] Modal dialogs work
- [ ] Success/error toasts display
- [ ] Responsive design works
- [ ] Role-based access enforced
- [ ] Soft delete maintains data
- [ ] Performance acceptable

## Sign-Off

**Tested By:** ****\_\_\_****  
**Date:** ****\_\_\_****  
**Version:** 1.0  
**Status:** ☐ PASSED ☐ FAILED
