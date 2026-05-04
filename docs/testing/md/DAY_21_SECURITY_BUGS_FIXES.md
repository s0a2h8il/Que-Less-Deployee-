# **DAY 21: COMMON SECURITY BUGS & FIXES**

---

## **🐛 Bug #1: Exposing Stack Traces in Production**

### **Problem:**

```javascript
// ❌ WRONG
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack, // Exposes file paths, line numbers
  });
});
```

Response exposes internal structure and file paths to attackers.

### **Fix:**

```javascript
// ✅ CORRECT
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});
```

---

## **🐛 Bug #2: Not Validating Input**

### **Problem:**

```javascript
// ❌ WRONG
router.post("/queue", protect, (req, res) => {
  const { title, maxUsers } = req.body;
  // No validation - could be anything!
  Queue.create({ title, maxUsers });
});
```

Allows invalid data, injection attacks, buffer overflows.

### **Fix:**

```javascript
// ✅ CORRECT
import { queueValidator } from "../validators/queueValidator.js";

router.post("/queue", protect, queueValidator, validateRequest, createQueue);

// validator checks:
// - title: required, max 100 chars
// - maxUsers: positive integer, 1-1000
```

---

## **🐛 Bug #3: Allowing All CORS Origins**

### **Problem:**

```javascript
// ❌ WRONG
app.use(cors());
// or
app.use(cors({ origin: "*" }));
```

Any website can make requests to your API = cross-site attacks.

### **Fix:**

```javascript
// ✅ CORRECT
import { corsConfig } from "./middleware/securityMiddleware.js";
app.use(cors(corsConfig));

// corsConfig only allows:
// - http://localhost:5173
// - https://yourdomain.com
```

---

## **🐛 Bug #4: No Rate Limiting**

### **Problem:**

```javascript
// ❌ WRONG
router.post("/login", login); // No rate limit
```

Allows unlimited login attempts = brute force attacks.

### **Fix:**

```javascript
// ✅ CORRECT
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

router.post("/login", authLimiter, login);
// Limited to 5 attempts per 15 minutes
```

---

## **🐛 Bug #5: Storing Secrets in Code**

### **Problem:**

```javascript
// ❌ WRONG
const JWT_SECRET = "super_secret_key_12345";
app.use(express.json());
```

Secrets visible in code repository.

### **Fix:**

```javascript
// ✅ CORRECT - Use .env
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
// Add .env to .gitignore
```

---

## **🐛 Bug #6: No Input Sanitization**

### **Problem:**

```javascript
// ❌ WRONG
const email = req.body.email;
User.findOne({ email }); // Could have extra spaces, case issues
```

Email comparison might fail or cause issues.

### **Fix:**

```javascript
// ✅ CORRECT
body("email")
  .trim() // Remove spaces
  .toLowerCase() // Normalize case
  .isEmail() // Validate format
  .normalizeEmail(); // Normalize according to RFC
```

---

## **🐛 Bug #7: Sending Sensitive Data in Error Response**

### **Problem:**

```javascript
// ❌ WRONG
try {
  user = User.findById(userId);
} catch (err) {
  res.status(500).json({
    message: "Database error: Connection refused to mongodb://user:pass@host",
    query: err.query,
    code: err.code,
  });
}
```

Exposes database credentials and internals.

### **Fix:**

```javascript
// ✅ CORRECT
try {
  user = User.findById(userId);
} catch (err) {
  console.error("DB Error:", err); // Log internally
  res.status(500).json({
    success: false,
    message: "Failed to fetch user",
  });
}
```

---

## **🐛 Bug #8: Not Checking User Permissions**

### **Problem:**

```javascript
// ❌ WRONG
router.delete("/business/:id", protect, (req, res) => {
  Business.findByIdAndDelete(req.params.id); // Any logged-in user can delete!
});
```

Any authenticated user can delete any business.

### **Fix:**

```javascript
// ✅ CORRECT
router.delete("/business/:id", protect, async (req, res) => {
  const business = await Business.findById(req.params.id);

  // Check: Is requester the owner?
  if (business.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this business");
  }

  await Business.findByIdAndDelete(req.params.id);
});
```

---

## **🐛 Bug #9: Weak Password Requirements**

### **Problem:**

```javascript
// ❌ WRONG
body("password").isLength({ min: 3 }); // Too weak!
```

Passwords like "abc" or "123" are easily guessed.

### **Fix:**

```javascript
// ✅ CORRECT
body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/) // At least one uppercase
  .withMessage("Password must contain an uppercase letter")
  .matches(/[a-z]/) // At least one lowercase
  .withMessage("Password must contain a lowercase letter")
  .matches(/[0-9]/) // At least one digit
  .withMessage("Password must contain a digit")
  .matches(/[@$!%*?&]/) // At least one special char
  .withMessage("Password must contain a special character");
```

---

## **🐛 Bug #10: Not Using HTTPS in Production**

### **Problem:**

```javascript
// ❌ WRONG - Production without HTTPS
node src/server.js
// Sends JWT tokens, passwords over plain HTTP = can be intercepted
```

Man-in-the-middle attacks can steal tokens and passwords.

### **Fix:**

```javascript
// ✅ CORRECT - Use HTTPS with reverse proxy
// nginx.conf
upstream backend {
  server localhost:5000;
}

server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://backend;
  }
}

// Also set secure cookies
const cookieConfig = {
  secure: process.env.NODE_ENV === "production", // HTTPS only
  httpOnly: true,
  sameSite: "strict"
};
```

---

## **🐛 Bug #11: No Request Size Limits**

### **Problem:**

```javascript
// ❌ WRONG
app.use(express.json()); // No limit
```

Attacker can upload massive payloads = memory exhaustion.

### **Fix:**

```javascript
// ✅ CORRECT
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));
```

---

## **🐛 Bug #12: Logging Sensitive Data**

### **Problem:**

```javascript
// ❌ WRONG
console.log("User logged in:", req.body);
// Logs: { email: "user@example.com", password: "secret123" }
```

Sensitive data in logs visible to anyone with access.

### **Fix:**

```javascript
// ✅ CORRECT
console.log("User logged in:", {
  email: req.body.email,
  timestamp: new Date().toISOString(),
});

// Or use logger that sanitizes
const sanitizeObject = (obj) => {
  return {
    ...obj,
    password: "***",
    token: "***",
    secret: "***",
  };
};
```

---

## **🐛 Bug #13: Race Conditions in Unique Checks**

### **Problem:**

```javascript
// ❌ WRONG
const existingUser = await User.findOne({ email });
if (!existingUser) {
  await User.create({ email, password }); // Another request might create same email!
}
```

Two requests check simultaneously, both create account = duplicate.

### **Fix:**

```javascript
// ✅ CORRECT - Use database unique constraint
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
});

// Catch duplicate in error handler
if (err.code === 11000) {
  throw new ApiError(409, "Email already registered");
}
```

---

## **🐛 Bug #14: Not Setting Secure Cookie Flags**

### **Problem:**

```javascript
// ❌ WRONG
res.cookie("token", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

JavaScript can access cookie (XSS risk), sent over HTTP (MITM risk).

### **Fix:**

```javascript
// ✅ CORRECT
res.cookie("token", token, {
  httpOnly: true, // No JS access
  secure: true, // HTTPS only
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

---

## **🐛 Bug #15: Missing CSRF Protection**

### **Problem:**

```html
<!-- ❌ WRONG - No CSRF token -->
<form method="POST" action="https://api.queueless.com/api/business/delete">
  <input type="hidden" name="businessId" value="123" />
  <button>Delete</button>
</form>
```

Attacker can trick user into performing actions.

### **Fix:**

```javascript
// ✅ CORRECT - SameSite cookies prevent CSRF
const cookieConfig = {
  sameSite: "strict", // Only same-site requests
  secure: true,
  httpOnly: true,
};

// Also validate origin/referer for extra safety
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.CORS_ORIGIN.split(",");

    if (!origin || !allowedOrigins.includes(origin)) {
      throw new ApiError(403, "CSRF validation failed");
    }
  }
  next();
});
```

---

## **🐛 Bug #16: No Rate Limiting on Sensitive Operations**

### **Problem:**

```javascript
// ❌ WRONG
router.post("/exchange", protect, createExchange); // No rate limit
```

Attacker can spam exchange requests = DoS.

### **Fix:**

```javascript
// ✅ CORRECT
import { sensitiveActionLimiter } from "../middleware/rateLimitMiddleware.js";

router.post(
  "/exchange",
  protect,
  sensitiveActionLimiter, // 10 per 10 min
  createExchange,
);
```

---

## **🐛 Bug #17: Trusting Client-Provided User ID**

### **Problem:**

```javascript
// ❌ WRONG
router.get("/user/:userId", protect, (req, res) => {
  const user = User.findById(req.params.userId); // Client provided!
  res.json(user.profile);
});
```

User can access any other user's profile by changing URL.

### **Fix:**

```javascript
// ✅ CORRECT - Use authenticated user
router.get("/profile", protect, (req, res) => {
  res.json(req.user.profile); // From JWT token
});
```

---

## **🐛 Bug #18: No Input Length Validation**

### **Problem:**

```javascript
// ❌ WRONG
body("message").isString(); // No max length!
```

User can send 10MB of text = memory exhaustion.

### **Fix:**

```javascript
// ✅ CORRECT
body("message")
  .isString()
  .trim()
  .isLength({ max: 500 })
  .withMessage("Message max 500 characters");
```

---

## **🐛 Bug #19: NoSQL Injection**

### **Problem:**

```javascript
// ❌ WRONG
const email = req.body.email;
User.findOne({ email: { $regex: email } }); // Regex injection possible
```

Attacker sends `{"$regex": ".*"}` = matches all users.

### **Fix:**

```javascript
// ✅ CORRECT
body("email").isEmail().normalizeEmail();
// Only valid emails allowed

// Or escape special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const email = escapeRegex(req.body.email);
```

---

## **🐛 Bug #20: Not Validating MongoDB ObjectIds**

### **Problem:**

```javascript
// ❌ WRONG
router.delete("/queue/:id", protect, async (req, res) => {
  await Queue.findByIdAndDelete(req.params.id); // No validation
});
```

Invalid format could cause errors or injection.

### **Fix:**

```javascript
// ✅ CORRECT
import mongoose from "mongoose";

param("id").custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid queue ID format");
  }
  return true;
});
```

---

## **✅ Security Checklist**

Before deploying each feature:

- [ ] All inputs validated
- [ ] No console.log of sensitive data
- [ ] No stack traces in production
- [ ] Rate limiters applied
- [ ] User permissions checked
- [ ] Secrets in .env only
- [ ] CORS properly configured
- [ ] Helmet enabled
- [ ] Error messages don't leak info
- [ ] Cookies secure + httpOnly
- [ ] No NoSQL injection possible
- [ ] Input length validated
- [ ] User ID from JWT, not request
- [ ] Request size limited
- [ ] HTTPS in production

---

**Status: SECURITY BUGS DOCUMENTED** ✅
