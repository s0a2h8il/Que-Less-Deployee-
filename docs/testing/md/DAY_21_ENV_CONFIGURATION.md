# **DAY 21: ENVIRONMENT VARIABLES & CONFIGURATION**

---

## **🔐 Complete .env Template**

```env
# ═══════════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════════

PORT=5000
NODE_ENV=development

# ═══════════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════════

MONGODB_URI=mongodb://localhost:27017/queueless

# ═══════════════════════════════════════════════════════════════
# JWT & AUTHENTICATION
# ═══════════════════════════════════════════════════════════════

# Must be cryptographically random, minimum 32 characters
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars_very_random

# Refresh token secret (different from access token secret)
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_min_32_chars_different

# Token expiration times
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# ═══════════════════════════════════════════════════════════════
# SECURITY & CORS
# ═══════════════════════════════════════════════════════════════

# Comma-separated list of allowed origins
# Development: http://localhost:5173,http://localhost:3000
# Production: https://yourdomain.com,https://www.yourdomain.com
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ═══════════════════════════════════════════════════════════════
# RATE LIMITING (optional overrides)
# ═══════════════════════════════════════════════════════════════

# Global rate limiter: requests per time window
GLOBAL_RATE_LIMIT_WINDOW=900000
GLOBAL_RATE_LIMIT_MAX=100

# Auth rate limiter: login/register attempts
AUTH_RATE_LIMIT_WINDOW=900000
AUTH_RATE_LIMIT_MAX=5

# API rate limiter: general endpoints
API_RATE_LIMIT_WINDOW=600000
API_RATE_LIMIT_MAX=60

# Sensitive actions: delete, transfer, exchange
SENSITIVE_RATE_LIMIT_WINDOW=600000
SENSITIVE_RATE_LIMIT_MAX=10

# ═══════════════════════════════════════════════════════════════
# EMAIL (if using email notifications)
# ═══════════════════════════════════════════════════════════════

# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@queueless.com

# ═══════════════════════════════════════════════════════════════
# EXTERNAL SERVICES
# ═══════════════════════════════════════════════════════════════

# Analytics & Error Tracking
# SENTRY_DSN=https://key@sentry.io/projectid

# Cloud Storage (if needed)
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
# AWS_S3_BUCKET=queueless-uploads

# ═══════════════════════════════════════════════════════════════
# FEATURE FLAGS
# ═══════════════════════════════════════════════════════════════

# Enable/disable features
# ENABLE_EMAIL_NOTIFICATIONS=true
# ENABLE_SMS_NOTIFICATIONS=false
# ENABLE_ANALYTICS=true

# ═══════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════

LOG_LEVEL=debug
```

---

## **🔑 How to Generate Secure JWT Secrets**

### **Method 1: Node.js**

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: 64-character random hex string
# Copy this to JWT_SECRET in .env
```

### **Method 2: OpenSSL**

```bash
openssl rand -hex 32
```

### **Method 3: Online Generator**

Use any cryptographically secure random generator, e.g., Random.org

---

## **📝 Environment-Specific Configurations**

### **Development (.env)**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queueless
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
JWT_SECRET=dev_key_abc123def456ghi789jkl012mno345pqr678stu
JWT_REFRESH_SECRET=dev_refresh_xyz987uvw654tsr321qpo012nml345kji876hgf
```

### **Production (.env.production)**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/queueless
CORS_ORIGIN=https://queueless.com,https://www.queueless.com
JWT_SECRET=[VERY LONG RANDOM STRING FROM GENERATION]
JWT_REFRESH_SECRET=[DIFFERENT VERY LONG RANDOM STRING]
```

### **Testing (.env.test)**

```env
NODE_ENV=test
PORT=5001
MONGODB_URI=mongodb://localhost:27017/queueless_test
CORS_ORIGIN=*
JWT_SECRET=test_key_for_testing_only
JWT_REFRESH_SECRET=test_refresh_key_for_testing_only
```

---

## **🔒 Security Best Practices for .env**

✅ **DO:**

- Store .env in project root (NOT in git)
- Add .env to .gitignore
- Use strong, random values (minimum 32 chars for secrets)
- Use different secrets for dev/test/prod
- Rotate secrets regularly in production
- Use .env.example with placeholder values
- Keep .env permissions restricted (chmod 600)
- Use environment-specific files (.env.production, etc)
- Store secrets in CI/CD platform, not in code

❌ **DON'T:**

- Commit .env to git
- Use simple/weak values
- Share .env with team in plaintext
- Use same secret for all environments
- Log environment variables
- Put .env in Docker images
- Expose secrets in error messages
- Use defaults for production secrets
- Hardcode secrets in source code

---

## **🚀 Loading Environment Variables**

The server already loads .env automatically:

```javascript
// In server.js
import dotenv from "dotenv";
dotenv.config();

// Access variables
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;
```

---

## **📊 Rate Limiting Configuration Reference**

Default values in [rateLimitMiddleware.js](../backend/src/middleware/rateLimitMiddleware.js):

```javascript
// Global rate limiter
- Window: 15 minutes (900,000 ms)
- Limit: 100 requests
- Used by: All endpoints
- Bypass: Health check, superadmin

// Auth rate limiter
- Window: 15 minutes (900,000 ms)
- Limit: 5 attempts
- Used by: /api/auth/login, /api/auth/register
- Rate limit key: IP + email
- Bypass: Postman in development

// API rate limiter
- Window: 10 minutes (600,000 ms)
- Limit: 60 requests
- Used by: /api/business, /api/queues, /api/analytics

// Sensitive actions limiter
- Window: 10 minutes (600,000 ms)
- Limit: 10 actions
- Used by: /api/exchanges, /api/admin, delete operations
- Bypass: Superadmin role
```

---

## **🔄 Refreshing Secrets in Production**

### **Step 1: Generate New Secret**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 2: Update .env**

```bash
# Save old secret for backward compatibility
OLD_JWT_SECRET=$JWT_SECRET

# Set new secret
JWT_SECRET=[NEW GENERATED SECRET]
```

### **Step 3: Handle Token Transition**

```javascript
// Accept both old and new secrets temporarily
app.use((req, res, next) => {
  try {
    // Try with new secret
    const token = jwt.verify(req.token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    // Fallback to old secret
    try {
      const token = jwt.verify(req.token, process.env.OLD_JWT_SECRET);
      // Schedule forced logout
      next();
    } catch (err2) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
});
```

### **Step 4: Deploy**

```bash
# Deploy with both secrets active
npm start

# After 24 hours (all old tokens expired), remove OLD_JWT_SECRET
```

---

## **✅ Verification Checklist**

Before deploying:

- [ ] .env exists and is in .gitignore
- [ ] All required variables are set
- [ ] JWT_SECRET is cryptographically random (min 32 chars)
- [ ] JWT_REFRESH_SECRET is different from JWT_SECRET
- [ ] CORS_ORIGIN contains production domain
- [ ] NODE_ENV=production for production
- [ ] No sensitive values in .env.example
- [ ] MONGODB_URI points to correct database
- [ ] Email variables set (if using email)
- [ ] Rate limit values appropriate
- [ ] PORT not conflicting with other services

---

**Status: CONFIGURATION READY** ✅
