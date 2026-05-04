# QueueLess Super Admin Panel - Common Issues & Solutions

## Quick Reference Guide

This guide documents common issues encountered during Super Admin Panel development and their solutions.

---

## Issue Categories

### 1. Import Path Issues

#### Issue: "Could not resolve '../../utils/cn'"

**File:** SuperAdminSidebar.jsx  
**Error Message:**

```
[UNRESOLVED_IMPORT] Error: Could not resolve '../../utils/cn' in src/components/dashboard/superadmin/SuperAdminSidebar.jsx
```

**Root Cause:**

- SuperAdminSidebar is in: `src/components/dashboard/superadmin/`
- Import path `../../utils/cn` resolves to: `src/components/utils/cn`
- Actual location of `cn` utility: `src/utils/cn.js`

**Solution:**

```diff
- import { cn } from "../../utils/cn";
+ import { cn } from "../../../utils/cn";
```

**Prevention:**

- Count directory levels carefully
- From `src/components/dashboard/superadmin/`:
  - `../` → `src/components/dashboard/`
  - `../../` → `src/components/`
  - `../../../` → `src/`
  - `../../../utils/` → `src/utils/`

---

### 2. Port Conflict Issues

#### Issue: "EADDRINUSE: address already in use :::5000"

**File:** backend/.env  
**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Root Cause:**

- Port 5000 already in use by another process
- Windows commonly has port 5000 reserved for Windows Process Activation Service

**Solution:**

```javascript
// In backend/.env
- PORT=5000
+ PORT=5001

// In frontend/src/constants/config.js
- VITE_API_BASE_URL=http://localhost:5000/api
+ VITE_API_BASE_URL=http://localhost:5001/api
```

**Verify Fix:**

```bash
# Check if port is free (Windows PowerShell)
netstat -ano | findstr :5001

# If port shows in use, kill process
taskkill /PID <process_id> /F
```

**Prevention:**

- Use non-standard ports (5001, 5002, etc.)
- Check port availability before starting dev server
- Document port configuration in README

---

### 3. Authorization Issues

#### Issue: "not authorized to create a queue" (403 Forbidden)

**File:** businessController.js (getUserBusinesses)  
**Error Context:**

- Admin trying to create queue gets 403 even with valid token
- Form shows all businesses but authorization fails

**Root Cause:**

- Admin user tries to create queue with business they don't own
- Authorization check: `if (queue.business._id.toString() !== req.user._id.toString())`
- Admin sees all businesses (shouldn't) but can only use owned ones

**Solution - Backend:**

```javascript
// Add new endpoint in businessRoutes.js
router.get(
  "/my",
  protect,
  asyncHandler(async (req, res) => {
    const businesses = await Business.find({ owner: req.user._id });
    res.json(new ApiResponse(200, businesses, "User businesses fetched"));
  }),
);
```

**Solution - Frontend:**

```javascript
// In CreateQueueForm.jsx, use new endpoint
const { data } = await axios.get("/api/business/my", {
  headers: { Authorization: `Bearer ${token}` },
});
setBusinesses(data.data);
```

**Prevention:**

- Implement separate endpoints for:
  - `/api/business` → All businesses (for browsing)
  - `/api/business/my` → User's businesses (for creating queue)
- Use clear authorization messages in errors
- Test form submission as different user roles

---

### 4. Route Shadowing Issues

#### Issue: Business with ID "my" gets 500 error

**File:** businessRoutes.js  
**Error Context:**

- Route: `/:id` matches before `/my`
- Request: `/api/business/my` matches `/:id` with id="my"
- MongoDB fails to find business with \_id="my"

**Root Cause:**

- Express routes matched in order
- Generic `/:id` route catches `/my` before specific route loads
- No ObjectId validation on `:id` parameter

**Solution:**

```javascript
// Reorder routes: specific BEFORE generic
router.get("/my", protect, getUserBusinesses); // Specific route first

// Add ObjectId validation to generic route
router.get(
  "/:id([0-9a-fA-F]{24})", // Only match 24-char hex (ObjectId format)
  asyncHandler(getBusinessById),
);
```

**Prevention:**

- Always place specific routes before generic routes
- Use regex pattern matching for route parameters: `/:id([0-9a-fA-F]{24})`
- Document route order in comments
- Test edge cases like `/my`, `/admin`, `/all`

---

### 5. Promise.all Cascading Failures

#### Issue: Dashboard crashes if one API call fails

**File:** useSuperAdminDashboard.js  
**Error Context:**

- useEffect tries to fetch 4 data sources
- If any one fails, entire Promise.all rejects
- User sees blank dashboard with error

**Root Cause:**

```javascript
// WRONG: One rejection breaks everything
const [stats, users, businesses, queues] = await Promise.all([
  fetchStats(),
  fetchUsers(),
  fetchBusinesses(),
  fetchQueues(),
]);
```

**Solution:**

```javascript
// CORRECT: Each promise independent
const results = await Promise.allSettled([
  fetchStats(),
  fetchUsers(),
  fetchBusinesses(),
  fetchQueues(),
]);

const [statsResult, usersResult, businessesResult, queuesResult] = results;

// Handle each result individually
if (statsResult.status === "fulfilled") {
  setStats(statsResult.value.data);
}
if (statsResult.status === "rejected") {
  console.error("Stats fetch failed", statsResult.reason);
}

// Continue for each...
```

**Prevention:**

- Use `Promise.allSettled` for independent operations
- Handle each result with `.status` check
- Provide fallback values for failed requests
- Show partial data instead of complete failure
- Log failures for debugging

---

### 6. Layout Spacing Issues

#### Issue: Page content overly centered with excessive whitespace

**Files:** index.css, App.jsx  
**Visual Issue:**

- Content squeezed to center with huge left/right margins
- On 1920px screen, only 400px of content visible
- Unusable for data-heavy dashboard

**Root Cause:**

```css
/* Vite starter template defaults (WRONG) */
body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

#root {
  display: flex;
  justify-content: center;
}
```

**Solution:**

```css
/* Remove centering CSS */
body {
  /* Remove max-width */
}

#root {
  /* Remove centering */
}

/* Container should be full-width for dashboard */
```

**Prevention:**

- Review starter template defaults
- Remove unnecessary constraints for admin dashboards
- Use full viewport width for data tables
- Test on multiple screen sizes
- Consider viewport as design baseline

---

### 7. Scroll Position Issues

#### Issue: Page doesn't scroll to top on route navigation

**File:** App.jsx  
**User Experience Issue:**

- Navigate from Users tab (at bottom of page) to Overview
- Overview tab scrolls to previous position (bottom)
- User must manually scroll to top to see content

**Root Cause:**

- React Router doesn't auto-scroll on route change
- Browser history doesn't reset scroll position
- No scroll handler on navigation

**Solution - Create ScrollToTop Component:**

```javascript
// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

**Solution - Use in App:**

```javascript
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Routes */}
    </BrowserRouter>
  );
}
```

**Prevention:**

- Always add ScrollToTop component in main App
- Test navigation between different scroll depths
- Consider scroll behavior in navigation design

---

### 8. Missing Component Exports

#### Issue: "Component not found in index.js"

**File:** components/index.js  
**Error When:**

- Importing from `components/index.js`
- Component exists but isn't exported

**Root Cause:**

```javascript
// WRONG: Component exists but not exported
// components/ui/Button.jsx exists
export { Card } from "./Card";
// Button missing!
```

**Solution:**

```javascript
// CORRECT: Export all components
export { Card } from "./Card";
export { Button } from "./Button";
export { Input } from "./Input";
export { Modal } from "./Modal";
export { Loader } from "./Loader";
// ... all others
```

**Prevention:**

- Maintain central index.js for all exports
- Update index.js when creating new components
- Use barrel exports pattern consistently
- Document all exported components

---

### 9. Modal State Management

#### Issue: Modal doesn't close or closes unexpectedly

**File:** DeleteConfirmModal.jsx  
**User Experience:**

- Click delete → modal shows
- Click confirm → modal doesn't close
- Click cancel → modal sometimes stays open

**Root Cause:**

```javascript
// WRONG: Props don't update modal visibility
const DeleteConfirmModal = ({ isOpen, ... }) => {
  return isOpen ? <Modal>{...}</Modal> : null;
}

// Parent doesn't update isOpen state properly
```

**Solution:**

```javascript
// CORRECT: Parent manages state, Modal only displays
const [deleteModal, setDeleteModal] = useState({
  isOpen: false,
  itemId: null,
});

// When delete button clicked
const handleDelete = (id) => {
  setDeleteModal({ isOpen: true, itemId: id });
};

// When confirmed
const handleConfirm = async () => {
  await deleteItem(deleteModal.itemId);
  setDeleteModal({ isOpen: false, itemId: null });
};

// Modal receives isOpen prop
<DeleteConfirmModal
  isOpen={deleteModal.isOpen}
  onConfirm={handleConfirm}
  onCancel={() => setDeleteModal({ isOpen: false, itemId: null })}
/>;
```

**Prevention:**

- Keep modal state in parent component
- Pass isOpen as prop from parent
- Don't manage open/close inside Modal
- Test open → confirm → close sequence
- Test open → cancel → close sequence

---

### 10. API Error Response Format

#### Issue: Error message displays as "[object Object]"

**File:** Any component calling API  
**Display Issue:**

- Toast shows: "Error: [object Object]"
- Should show: "Business not found"

**Root Cause:**

```javascript
// WRONG: Error object not stringified
catch (error) {
  setError(error);  // error is object
  showToast(error, 'error');  // [object Object]
}
```

**Solution:**

```javascript
// CORRECT: Extract message from error
catch (error) {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  setError(message);
  showToast(message, 'error');
}
```

**Backend Response Format:**

```javascript
// API should return consistent error format
throw new ApiError(404, "Business not found");

// ApiError middleware formats as:
{
  statusCode: 404,
  message: "Business not found",
  success: false,
  data: null
}
```

**Prevention:**

- Standardize error response format
- Use utility functions for error extraction
- Log full error for debugging
- Test error message display in UI

---

### 11. Token Expiration Issues

#### Issue: API calls fail with 401 after some time

**File:** axios.js, authMiddleware.js  
**Context:**

- User logged in successfully
- After 30 minutes (or token expiry), API calls return 401
- User not redirected to login

**Root Cause:**

```javascript
// WRONG: No token refresh mechanism
// Token expires, axios still sends old token
```

**Solution:**

```javascript
// In axios.js - Add token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

**Prevention:**

- Implement token refresh before expiry
- Add 401 response handler
- Test with expired tokens
- Set reasonable token expiry (24 hours for dev)

---

### 12. Database Query Performance

#### Issue: Tables load slowly with large datasets

**File:** superAdminController.js  
**Performance Issue:**

- Loading 10,000 users takes 5+ seconds
- Table pagination appears frozen

**Root Cause:**

```javascript
// WRONG: No database indexes, large queries
const users = await User.find().limit(10); // Scans entire collection
```

**Solution:**

```javascript
// CORRECT: Use indexes and efficient queries
const users = await User.find()
  .select("name email role createdAt") // Only needed fields
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

// Create MongoDB indexes
// In database setup:
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });
db.businesses.createIndex({ owner: 1 });
db.businesses.createIndex({ category: 1 });
db.queues.createIndex({ business: 1 });
```

**Prevention:**

- Create indexes on frequently queried fields
- Use `.select()` to fetch only needed fields
- Use pagination for large datasets
- Monitor query performance in MongoDB
- Test with realistic data volumes

---

### 13. CORS Issues

#### Issue: "Access to XMLHttpRequest blocked by CORS policy"

**Error:**

```
Access to XMLHttpRequest at 'http://localhost:5001/api/...'
from origin 'http://localhost:5173' blocked by CORS policy
```

**Root Cause:**

```javascript
// WRONG: Missing CORS configuration
// Backend doesn't allow requests from frontend origin
```

**Solution:**

```javascript
// In backend/src/server.js
import cors from "cors";

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
```

**Prevention:**

- Configure CORS in Express
- Test requests from different origins
- Allow credentials if using cookies
- Document CORS configuration in README

---

### 14. State Update After Unmount

#### Issue: "Can't perform a React state update on an unmounted component"

**Console Warning:**

```
Warning: Can't perform a React state update on an unmounted component.
This is a no-op, but it indicates a memory leak in your application.
```

**Root Cause:**

```javascript
// WRONG: API call updates state after component unmounts
useEffect(() => {
  fetchData().then((data) => {
    setState(data); // Might run after unmount
  });
}, []);
```

**Solution:**

```javascript
// CORRECT: Cleanup AbortController or flag
useEffect(() => {
  let isMounted = true;

  fetchData().then((data) => {
    if (isMounted) {
      setState(data);
    }
  });

  return () => {
    isMounted = false; // Cleanup
  };
}, []);
```

**Prevention:**

- Add cleanup functions to useEffect
- Use AbortController for fetch requests
- Check component mounted status before state updates
- Test component unmount scenarios

---

### 15. Authentication Header Missing

#### Issue: API returns 401 even with valid token

**Context:**

- Token stored in localStorage
- API calls don't include Authorization header
- Backend can't verify user

**Root Cause:**

```javascript
// WRONG: No header in request
const response = await axios.get("/api/admin/stats");
```

**Solution:**

```javascript
// CORRECT: Include Authorization header
const response = await axios.get("/api/admin/stats", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// OR use axios interceptor globally
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Prevention:**

- Use axios interceptors for global auth headers
- Test API calls with Postman first
- Verify token is stored correctly
- Check bearer token format: "Bearer TOKEN"

---

## Debugging Checklist

When encountering issues, check:

- [ ] Console errors (F12 → Console)
- [ ] Network tab (F12 → Network)
- [ ] API response format (check JSON)
- [ ] Component state (React DevTools)
- [ ] MongoDB documents (check data)
- [ ] Environment variables (.env files)
- [ ] Port availability (netstat)
- [ ] Token validity (check localStorage)
- [ ] CORS headers (Network → Response Headers)
- [ ] TypeScript/compilation errors (npm run build)

---

## Tools for Debugging

### Browser DevTools

```
F12 → Console: Check for JavaScript errors
F12 → Network: Inspect API calls and responses
F12 → Storage: Check localStorage (tokens)
F12 → Sources: Debug JavaScript with breakpoints
```

### MongoDB Shell

```bash
# Check user count
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: "test@example.com" })

# Check indexes
db.users.getIndexes()

# Monitor slow queries
db.setProfilingLevel(1)
```

### VS Code Debugging

```javascript
// Add to .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Postman Testing

```
1. Create "Super Admin" environment with {{ token }}
2. Add Pre-request Script to auto-fetch token
3. Test each endpoint with different parameters
4. Document expected responses
```

---

## Performance Optimization Tips

### Frontend

```javascript
// Use React.memo for expensive components
const UsersTable = React.memo(({ users }) => {
  return <table>{...}</table>;
});

// Use useCallback for event handlers
const handleDelete = useCallback((id) => {
  deleteItem(id);
}, []);

// Lazy load components
const SuperAdminDashboard = lazy(() =>
  import('./pages/dashboard/SuperAdminDashboard')
);
```

### Backend

```javascript
// Use lean() for read-only queries
const users = await User.find().lean();

// Paginate large datasets
const limit = 10;
const page = req.query.page || 1;
const skip = (page - 1) * limit;

// Create appropriate indexes
db.users.createIndex({ role: 1 });
db.businesses.createIndex({ owner: 1 });
```

---

## Common Regex Patterns

### ObjectId Validation (24 hex characters)

```regex
^[0-9a-fA-F]{24}$
```

### Email Validation

```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

### URL Validation

```regex
^https?:\/\/.+
```

---

## Useful Commands

```bash
# Backend
npm start                    # Start dev server
npm run build               # Build for production
npm install                 # Install dependencies

# Frontend
npm run dev                 # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build

# MongoDB
mongosh                    # Start MongoDB shell
use queueless             # Switch to database
db.users.find()           # Find all users
db.users.updateOne({query}, {$set: {updates}})
```

---

## Conclusion

This guide covers the most common issues encountered during Super Admin Panel development. Reference this when:

- Debugging new features
- Investigating user reports
- Onboarding new developers
- Troubleshooting production issues

Keep this document updated with new issues as they're discovered.

---

**Version:** 1.0  
**Last Updated:** Day 18  
**Status:** Ready for reference
