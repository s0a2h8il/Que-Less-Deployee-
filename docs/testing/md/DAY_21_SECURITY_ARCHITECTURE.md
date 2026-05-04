# **DAY 21: BACKEND SECURITY - ARCHITECTURE GUIDE**

---

## **🔒 Security Architecture Overview**

QueueLess backend implements **enterprise-grade security** with multiple layers of protection:

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT REQUEST                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  1. Helmet Security Headers                                  │
│     - XSS Protection, CSP, HSTS, X-Frame-Options            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  2. CORS Protection                                           │
│     - Origin whitelist, Credentials, Methods control         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Global Rate Limiter                                       │
│     - 100 req/15 min per IP (protects all endpoints)         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Request Parsing                                           │
│     - express.json(), cookie-parser, URL encoding            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Route-Specific Rate Limiters                             │
│     - Auth: 5 req/15 min  (brute force protection)           │
│     - API: 60 req/10 min  (standard endpoints)               │
│     - Sensitive: 10 req/10 min (delete, transfer, etc)       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  6. Input Validation                                          │
│     - express-validator rules for all inputs                 │
│     - Sanitization, type checking, length limits             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  7. Authentication & Authorization                           │
│     - JWT verification, Role checking, Protected routes      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  8. Business Logic Execution                                 │
│     - Database queries, Operations, Validations              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  9. Central Error Handler                                     │
│     - Catch all errors, Format responses, Hide stack traces  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  10. Response to Client                                       │
│      - Consistent format, No sensitive data exposed           │
└─────────────────────────────────────────────────────────────┘
```

---

## **🛡️ Security Features Implemented**

### **1. Helmet Security Headers**

```javascript
// Protects against:
✓ XSS (Cross-Site Scripting)
✓ Clickjacking (Frame-based attacks)
✓ MIME Sniffing
✓ Info disclosure (Powered-by header)

// Headers added:
- Content-Security-Policy (CSP)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Referrer-Policy: strict-origin-when-cross-origin
```

### **2. CORS Protection**

```javascript
// Only allows:
✓ Whitelisted origins (from CORS_ORIGIN env)
✓ Specific HTTP methods (GET, POST, PUT, PATCH, DELETE)
✓ Specific headers (Content-Type, Authorization)
✓ Credentials (cookies, JWT)

// Blocks:
✗ Unknown origins
✗ Unauthorized methods
✗ Invalid headers
```

### **3. Rate Limiting Tiers**

| Tier          | Limit      | Window | Use Case                     |
| ------------- | ---------- | ------ | ---------------------------- |
| **Global**    | 100 req    | 15 min | All endpoints                |
| **Auth**      | 5 attempts | 15 min | Login/register (brute force) |
| **API**       | 60 req     | 10 min | Standard endpoints           |
| **Sensitive** | 10 actions | 10 min | Delete, transfer, exchange   |

```javascript
// Rate limit by:
- IP address (global)
- IP + email (auth)
- User ID or IP (sensitive actions)
- Allows superadmin bypass
```

### **4. Input Validation**

```javascript
// Validates:
✓ Field presence (required fields)
✓ Data types (string, number, boolean)
✓ Length constraints (min/max)
✓ Format validation (email, phone, MongoDB ID)
✓ Enum validation (allowed values only)
✓ Custom validations (unique email, valid ID)

// Returns:
- 400 Bad Request with field-level errors
- Doesn't expose internal details
```

### **5. JWT Security**

```javascript
// Protected:
✓ Secret key in .env (never exposed)
✓ Expiration: 7 days (configurable)
✓ Refresh tokens: 30 days
✓ HttpOnly cookies (no JavaScript access)
✓ Secure flag (HTTPS only in production)
✓ SameSite=strict (CSRF protection)
```

### **6. Error Handling**

```javascript
// Handles:
✓ Validation errors → 400
✓ Unauthorized → 401
✓ Forbidden/insufficient permissions → 403
✓ Not found → 404
✓ Duplicate key (email) → 409
✓ JWT expired → 401
✓ Invalid JWT → 401
✓ Server errors → 500

// Does NOT expose:
✗ Stack traces (production)
✗ Database queries
✗ Internal error details
✗ Sensitive file paths
```

### **7. Production Safety**

```javascript
// Production mode (/NODE_ENV=production):
✓ No stack traces in responses
✓ No verbose logging
✓ HTTPS enforced (secure cookies)
✓ All rate limiters active
✓ CSP headers enforced
✓ No development routes/endpoints

// Development mode:
✓ Full error messages (debugging)
✓ Stack traces included
✓ CORS allows localhost
✓ Can bypass some limiters for testing
```

---

## **📋 Installation Steps**

### **Step 1: Install Required Packages**

```bash
npm install express-rate-limit
```

### **Step 2: Update .env**

```env
# Security
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development

# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queueless
```

### **Step 3: Middleware is Already Applied**

The server.js now has security middleware in correct order:

1. Helmet
2. Security headers
3. Logging
4. CORS
5. Global rate limiter
6. Body parsers
7. Cookie parser
8. Routes
9. 404 handler
10. Error handler

---

## **🔐 Validators Available**

### **Auth Validators**

```javascript
import { registerValidator, loginValidator } from "./validators/authValidator.js";

// registerValidator checks:
- name: 2-50 characters, required
- email: valid format, required
- password: min 6 characters, required

// loginValidator checks:
- email: valid format, required
- password: required
```

### **Business Validators**

```javascript
import { businessValidator } from "./validators/businessValidator.js";

// businessValidator checks:
- name: 2-100 characters, required
- category: required
- address: required
- city: required
- phone: optional, 10-15 digits
- email: optional, valid format
```

### **Queue Validators**

```javascript
import { queueValidator, statusUpdateValidator } from "./validators/queueValidator.js";

// queueValidator checks:
- businessId: valid MongoDB ID, required
- title: max 100 chars, required
- estimatedTimePerUser: positive integer, optional
- maxUsers: 1-1000, optional

// statusUpdateValidator checks:
- status: one of [waiting, called, completed, left, skipped, cancelled]
```

### **Exchange Validators**

```javascript
import { exchangeValidator } from "./validators/exchangeValidator.js";

// exchangeValidator checks:
- queueId: valid MongoDB ID, required
- toUser: valid MongoDB ID, required
- message: max 200 chars, optional
```

### **Notification Validators**

```javascript
import { notificationIdValidator, notificationQueryValidator } from "./validators/notificationValidator.js";

// notificationIdValidator checks:
- notificationId: valid MongoDB ID

// notificationQueryValidator checks:
- type: one of [queue_update, business_notification, exchange_request, system_notification]
- read: boolean
- page: positive integer
- limit: 1-100
```

### **Analytics Validators**

```javascript
import { analyticsQueryValidator, businessIdParamValidator } from "./validators/analyticsValidator.js";

// analyticsQueryValidator checks:
- startDate: ISO8601 format, optional
- endDate: ISO8601 format, optional
- businessId: valid MongoDB ID, optional

// businessIdParamValidator checks:
- businessId parameter: valid MongoDB ID
```

---

## **✅ Security Checklist**

Before deploying to production:

- [ ] All environment variables set (.env file)
- [ ] JWT_SECRET is random and min 32 characters
- [ ] CORS_ORIGIN contains only production domain
- [ ] NODE_ENV=production set
- [ ] All rate limiters active
- [ ] No console.log() with sensitive data
- [ ] No hardcoded secrets in code
- [ ] All input validated with express-validator
- [ ] All error responses hide stack traces
- [ ] HTTPS enabled on server
- [ ] Helmet CSP configured for frontend domain
- [ ] Rate limit errors return proper HTTP status
- [ ] Database credentials in .env only
- [ ] API keys in .env only
- [ ] Error monitoring enabled (Sentry, etc)

---

## **📊 Performance Impact**

Security adds minimal overhead:

```
Helmet: < 1ms per request
CORS check: < 1ms per request
Rate limit check: < 1ms per request
Input validation: 1-5ms (depends on complexity)
JWT verification: 1-2ms per request
Total security overhead: ~5-10ms per request
```

On modern servers (handling 1000+ req/sec):

- Negligible impact on performance
- Security benefits far outweigh minimal latency

---

## **🚀 Deployment Considerations**

### **For Production**

```bash
# Set environment to production
NODE_ENV=production

# Enable HTTPS
- Use nginx/Apache reverse proxy
- Configure SSL certificates
- Forward HTTPS traffic to Node app

# Rate limiting
- Use Redis for distributed rate limiting
- npm install rate-limit-redis
- Configure for multiple server instances

# Monitoring
- Set up error tracking (Sentry)
- Monitor rate limit hits
- Log security events
```

### **Docker Deployment**

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY src ./src
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"]
```

---

## **⚠️ Common Security Mistakes (Avoid)**

1. **Exposing JWT secret in code** → Use .env only
2. **Allowing all CORS origins** → Whitelist specific domains
3. **No rate limiting** → Always implement rate limits
4. **Logging sensitive data** → Filter emails, passwords, tokens
5. **Returning full error objects** → Return only user-friendly messages
6. **No input validation** → Validate every input
7. **Storing passwords in plain text** → Use bcrypt with salt
8. **No HTTPS** → Always use HTTPS in production
9. **Weak JWT tokens** → Use strong, random secrets
10. **No refresh token rotation** → Implement token refresh

---

**Status: SECURITY ARCHITECTURE READY** ✅
