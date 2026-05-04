# **DAY 21: ROUTE VALIDATION EXAMPLES**

---

## **📝 How to Apply Validators to Routes**

Validators are middleware that check input before the controller runs.

### **Basic Pattern**

```javascript
import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerValidator } from "../validators/authValidator.js";
import { register } from "../controllers/authController.js";

const router = Router();

// Pattern: validator → validateRequest → controller
router.post("/register", registerValidator, validateRequest, register);

export default router;
```

---

## **🔐 Auth Routes Example**

**File: `backend/src/routes/authRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";

const router = Router();

/**
 * Public Routes
 * No authentication required
 */

// Register new user
// POST /api/auth/register
// Body: { name, email, password }
router.post("/register", registerValidator, validateRequest, register);

// Login user
// POST /api/auth/login
// Body: { email, password }
router.post("/login", loginValidator, validateRequest, login);

/**
 * Protected Routes
 * Authentication required
 */

// Get current user profile
// GET /api/auth/me
router.get("/me", protect, getCurrentUser);

// Logout user
// POST /api/auth/logout
router.post("/logout", protect, logout);

export default router;
```

---

## **🏢 Business Routes Example**

**File: `backend/src/routes/businessRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { businessValidator } from "../validators/businessValidator.js";
import {
  createBusiness,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses,
} from "../controllers/businessController.js";

const router = Router();

/**
 * Public Routes
 */

// Get all businesses (with filters)
// GET /api/business?category=restaurant&city=NYC
router.get("/", getAllBusinesses);

// Get single business by ID
// GET /api/business/:id
router.get("/:id", getBusiness);

/**
 * Protected Routes - User must be authenticated
 */

// Create new business
// POST /api/business
// Body: { name, category, address, city, phone?, email? }
router.post("/", protect, businessValidator, validateRequest, createBusiness);

// Update business (owner only)
// PUT /api/business/:id
// Body: { name?, category?, address?, city?, phone?, email? }
router.put("/:id", protect, businessValidator, validateRequest, updateBusiness);

// Delete business (owner + superadmin)
// DELETE /api/business/:id
router.delete("/:id", protect, deleteBusiness);

export default router;
```

---

## **📋 Queue Routes Example**

**File: `backend/src/routes/queueRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  queueValidator,
  statusUpdateValidator,
} from "../validators/queueValidator.js";
import {
  createQueue,
  getQueue,
  getAllQueues,
  updateQueue,
  deleteQueue,
  joinQueue,
  leaveQueue,
  updateUserStatus,
} from "../controllers/queueController.js";

const router = Router();

/**
 * Public Routes
 */

// Get all queues (with filters)
// GET /api/queues?businessId=xxx&status=active
router.get("/", getAllQueues);

// Get single queue details
// GET /api/queues/:id
router.get("/:id", getQueue);

/**
 * Protected Routes
 */

// Create new queue (business owner)
// POST /api/queues
// Body: { businessId, title, estimatedTimePerUser?, maxUsers? }
router.post("/", protect, queueValidator, validateRequest, createQueue);

// Update queue (business owner)
// PUT /api/queues/:id
// Body: { title?, estimatedTimePerUser?, maxUsers? }
router.put("/:id", protect, queueValidator, validateRequest, updateQueue);

// Delete queue (business owner + superadmin)
// DELETE /api/queues/:id
router.delete("/:id", protect, deleteQueue);

// Join queue (any user)
// POST /api/queues/:id/join
router.post("/:id/join", protect, joinQueue);

// Leave queue (user who joined)
// POST /api/queues/:id/leave
router.post("/:id/leave", protect, leaveQueue);

// Update user status in queue (business owner)
// PATCH /api/queues/:queueId/user/:userId/status
// Body: { status: "called" | "completed" | "skipped" | "left" | "cancelled" }
router.patch(
  "/:queueId/user/:userId/status",
  protect,
  statusUpdateValidator,
  validateRequest,
  updateUserStatus,
);

export default router;
```

---

## **🔄 Exchange Routes Example**

**File: `backend/src/routes/exchangeRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { exchangeValidator } from "../validators/exchangeValidator.js";
import {
  createExchangeRequest,
  getIncomingRequests,
  getOutgoingRequests,
  approveExchange,
  rejectExchange,
  getExchangeHistory,
} from "../controllers/exchangeController.js";

const router = Router();

/**
 * Protected Routes - All require authentication
 */

// Create exchange request (any user in queue)
// POST /api/exchanges
// Body: { queueId, toUser, message? }
router.post(
  "/",
  protect,
  exchangeValidator,
  validateRequest,
  createExchangeRequest,
);

// Get incoming exchange requests (target user)
// GET /api/exchanges/incoming
router.get("/incoming", protect, getIncomingRequests);

// Get outgoing exchange requests (sender)
// GET /api/exchanges/outgoing
router.get("/outgoing", protect, getOutgoingRequests);

// Get exchange history
// GET /api/exchanges/history
router.get("/history", protect, getExchangeHistory);

// Approve exchange request (target user)
// PATCH /api/exchanges/:id/approve
router.patch("/:id/approve", protect, approveExchange);

// Reject exchange request
// PATCH /api/exchanges/:id/reject
router.patch("/:id/reject", protect, rejectExchange);

export default router;
```

---

## **📬 Notification Routes Example**

**File: `backend/src/routes/notificationRoutes.js`** (if separate file)

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  notificationIdValidator,
  notificationQueryValidator,
} from "../validators/notificationValidator.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = Router();

/**
 * Protected Routes - All require authentication
 */

// Get all notifications (with filters)
// GET /api/notifications?type=queue_update&read=false&page=1&limit=10
router.get(
  "/",
  protect,
  notificationQueryValidator,
  validateRequest,
  getNotifications,
);

// Get unread notification count
// GET /api/notifications/unread-count
router.get("/unread-count", protect, getUnreadCount);

// Mark specific notification as read
// PUT /api/notifications/:notificationId/read
router.put(
  "/:notificationId/read",
  protect,
  notificationIdValidator,
  validateRequest,
  markAsRead,
);

// Mark all notifications as read
// PUT /api/notifications/read-all
router.put("/read-all", protect, markAllAsRead);

// Delete notification
// DELETE /api/notifications/:notificationId
router.delete(
  "/:notificationId",
  protect,
  notificationIdValidator,
  validateRequest,
  deleteNotification,
);

export default router;
```

---

## **📊 Analytics Routes Example**

**File: `backend/src/routes/analyticsRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  analyticsQueryValidator,
  businessIdParamValidator,
} from "../validators/analyticsValidator.js";
import {
  getDashboardStats,
  getQueueAnalytics,
  getBusinessAnalytics,
  getSystemAnalytics,
} from "../controllers/analyticsController.js";

const router = Router();

/**
 * Protected Routes - Authentication required
 */

// Get dashboard statistics for current user
// GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
router.get(
  "/dashboard",
  protect,
  analyticsQueryValidator,
  validateRequest,
  getDashboardStats,
);

// Get queue analytics
// GET /api/analytics/queues/:businessId?startDate=2024-01-01&endDate=2024-12-31
router.get(
  "/queues/:businessId",
  protect,
  businessIdParamValidator,
  getQueueAnalytics,
);

// Get business analytics (owner only)
// GET /api/analytics/business/:businessId?startDate=2024-01-01
router.get(
  "/business/:businessId",
  protect,
  businessIdParamValidator,
  getBusinessAnalytics,
);

// Get system-wide analytics (superadmin only)
// GET /api/analytics/system?startDate=2024-01-01&endDate=2024-12-31
router.get(
  "/system",
  protect,
  analyticsQueryValidator,
  validateRequest,
  getSystemAnalytics,
);

export default router;
```

---

## **👮 Admin Routes Example**

**File: `backend/src/routes/superAdminRoutes.js`**

```javascript
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { businessValidator } from "../validators/businessValidator.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  suspendBusiness,
  approveBusiness,
  getSystemStats,
} from "../controllers/superAdminController.js";

const router = Router();

/**
 * Protected Routes - Superadmin only
 */

// Get all users in system
// GET /api/admin/users
router.get("/users", protect, checkRole(["superadmin"]), getAllUsers);

// Delete user account
// DELETE /api/admin/users/:userId
router.delete("/users/:userId", protect, checkRole(["superadmin"]), deleteUser);

// Update user role
// PATCH /api/admin/users/:userId/role
// Body: { role: "admin" | "user" }
router.patch(
  "/users/:userId/role",
  protect,
  checkRole(["superadmin"]),
  validateRequest,
  updateUserRole,
);

// Suspend business
// PATCH /api/admin/business/:businessId/suspend
router.patch(
  "/business/:businessId/suspend",
  protect,
  checkRole(["superadmin"]),
  suspendBusiness,
);

// Approve business
// PATCH /api/admin/business/:businessId/approve
router.patch(
  "/business/:businessId/approve",
  protect,
  checkRole(["superadmin"]),
  approveBusiness,
);

// Get system statistics
// GET /api/admin/stats
router.get("/stats", protect, checkRole(["superadmin"]), getSystemStats);

export default router;
```

---

## **📝 Validator Chain Pattern**

For routes requiring multiple validators:

```javascript
// Single validator
router.post("/", validator1, validateRequest, controller);

// Multiple validators (combined)
router.post("/", [...validator1, ...validator2], validateRequest, controller);

// Custom combined validator
export const combinedValidator = [...queueValidator, ...statusUpdateValidator];

router.patch(
  "/:id/status",
  protect,
  combinedValidator,
  validateRequest,
  updateStatus,
);
```

---

## **🔍 Testing Validators Locally**

```bash
# Test register endpoint with invalid email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "password": "123456"
  }'

# Expected response (400):
{
  "success": false,
  "message": "email: invalid email format; password: password must be at least 6 characters"
}

# Test with valid data
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'

# Expected response (200 or 201):
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}
```

---

**Status: ROUTE VALIDATION READY** ✅
