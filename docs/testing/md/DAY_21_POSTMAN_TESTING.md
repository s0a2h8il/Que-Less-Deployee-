# **DAY 21: POSTMAN SECURITY TESTING GUIDE**

---

## **🧪 Testing Security Features in Postman**

This guide shows how to test all security features implemented in Day 21.

---

## **📋 Test 1: Input Validation**

### **Test 1.1: Invalid Email Format (Register)**

**Request:**

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "not-an-email",
  "password": "password123"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "email: invalid email format"
}
```

**What it tests:**

- Email validation is working
- Returns 400 Bad Request
- Doesn't expose internal errors

---

### **Test 1.2: Password Too Short (Register)**

**Request:**

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "password: password must be at least 6 characters"
}
```

---

### **Test 1.3: Missing Required Field (Register)**

**Request:**

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "password: password is required"
}
```

---

### **Test 1.4: Invalid MongoDB ObjectId**

**Request:**

```
GET http://localhost:5000/api/queues/invalid-id
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Invalid queue ID format"
}
```

---

### **Test 1.5: Invalid Business Body (Create Queue)**

**Request:**

```
POST http://localhost:5000/api/queues
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "businessId": "invalid-id",
  "title": ""
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "businessId: invalid Business ID format; title: queue title is required"
}
```

---

## **🔐 Test 2: Rate Limiting**

### **Test 2.1: Auth Rate Limiting (Brute Force)**

**Postman Collection Setup:**

```
Create 10 sequential requests to /api/auth/login with different passwords
```

**Requests 1-5:**

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```

**Response:**

```
Status: 401 Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Request 6 (after 5 failures):**

```
POST http://localhost:5000/api/auth/login
```

**Expected Response (429):**

```
Status: 429 Too Many Requests
RateLimit-Limit-Remaining: 0
RateLimit-Reset: <timestamp>

{
  "success": false,
  "message": "Too many login attempts, please try again after 15 minutes"
}
```

**What it tests:**

- Auth rate limiter blocks after 5 attempts
- Returns 429 (Too Many Requests)
- Includes rate limit headers

---

### **Test 2.2: Global Rate Limiting**

**Postman Collection Setup:**
Use "Run Collection" feature to send 101 rapid requests:

```
Send 101 requests to /api/health in rapid succession
```

**Request 101:**

```
GET http://localhost:5000/api/health
```

**Expected Response (429):**

```
Status: 429 Too Many Requests

{
  "success": false,
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

---

### **Test 2.3: Sensitive Action Rate Limiting**

**Setup:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request (Delete business 11 times):**

```
DELETE http://localhost:5000/api/business/BUSINESS_ID
```

**Request 11:**

```
Status: 429 Too Many Requests

{
  "success": false,
  "message": "Too many sensitive operations, please try again after 10 minutes"
}
```

---

## **🔐 Test 3: Protected Routes**

### **Test 3.1: Access Protected Route Without Token**

**Request:**

```
GET http://localhost:5000/api/notifications
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

---

### **Test 3.2: Access Protected Route With Invalid Token**

**Request:**

```
GET http://localhost:5000/api/notifications
Authorization: Bearer invalid.token.here
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Invalid token, authorization denied"
}
```

---

### **Test 3.3: Access Protected Route With Expired Token**

**Setup:**

1. Create a token with `JWT_EXPIRE=1s` in .env temporarily
2. Generate a token
3. Wait 2 seconds
4. Use the expired token

**Request:**

```
GET http://localhost:5000/api/notifications
Authorization: Bearer <expired_token>
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Token expired, please login again"
}
```

---

### **Test 3.4: Access Protected Route With Valid Token**

**Request:**

```
GET http://localhost:5000/api/notifications
Authorization: Bearer <valid_jwt_token>
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [...]
}
```

---

## **🌐 Test 4: CORS Protection**

### **Test 4.1: CORS Allowed Origin**

**Setup:**
In your frontend (http://localhost:5173), make a request:

```javascript
// In browser console
fetch("http://localhost:5000/api/queues", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
```

**Expected:**

- Request succeeds
- Response headers include: `Access-Control-Allow-Origin: http://localhost:5173`

---

### **Test 4.2: CORS Blocked Origin**

**Setup:**
From a different origin (e.g., http://evil.com):

```javascript
fetch("http://localhost:5000/api/queues", {
  method: "GET",
});
```

**Browser Console Shows:**

```
CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Server Response:**

```
Status: 403 Forbidden
Error: Not allowed by CORS
```

---

### **Test 4.3: Check CORS Headers**

**Postman:**

```
GET http://localhost:5000/api/health
Origin: http://localhost:5173
```

**Response Headers:**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## **🛡️ Test 5: Security Headers**

### **Test 5.1: Check Helmet Security Headers**

**Request:**

```
GET http://localhost:5000/api/health
```

**Response Headers Should Include:**

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
Referrer-Policy: strict-origin-when-cross-origin
```

**What it tests:**

- Helmet is protecting against XSS, clickjacking, MIME sniffing

---

## **❌ Test 6: Error Handling**

### **Test 6.1: Validation Error (No Stack Trace)**

**Request:**

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "",
  "email": "invalid",
  "password": ""
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "name: name is required; email: invalid email; password: password is required"
}
```

**NOT:**

```
{
  "success": false,
  "message": "Validation error",
  "stack": "Error: ... at Object.register (...)...",
  "errors": {...}
}
```

---

### **Test 6.2: Duplicate Email Error**

**Setup:**

1. Register user: john@example.com
2. Try registering again with same email

**Request:**

```
POST http://localhost:5000/api/auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (409):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### **Test 6.3: 404 Not Found**

**Request:**

```
GET http://localhost:5000/api/nonexistent-route
```

**Expected Response (404):**

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

### **Test 6.4: Server Error (500)**

**Postman Script:**

```
// Trigger an error by passing invalid MongoDB connection
DELETE http://localhost:5000/api/business/507f1f77bcf86cd799439011
```

**Expected Response (500):**

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

**NOT exposing:**

- Stack trace
- Database connection string
- Internal file paths

---

## **📊 Test 7: Postman Collection Setup**

Create a collection with these environment variables:

```json
{
  "name": "QueueLess Security Tests",
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:5000"
    },
    {
      "key": "TOKEN",
      "value": ""
    },
    {
      "key": "USER_ID",
      "value": ""
    },
    {
      "key": "BUSINESS_ID",
      "value": ""
    },
    {
      "key": "QUEUE_ID",
      "value": ""
    }
  ]
}
```

### **Setup Requests:**

```javascript
// After login request, add script:
pm.environment.set("TOKEN", pm.response.json().data.token);
pm.environment.set("USER_ID", pm.response.json().data.user._id);
```

---

## **🚀 Run Security Tests**

### **Method 1: Manual Testing**

1. Open Postman
2. Import provided collection
3. Set environment to "Development"
4. Run each test individually
5. Verify expected responses

### **Method 2: Automated Testing**

```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run collection
newman run "QueueLess Security Tests.postman_collection.json" \
  --environment "development.postman_environment.json" \
  --reporters cli,json

# Output:
# ✓ Test 1: Auth validation
# ✓ Test 2: Rate limiting
# ✗ Test 3: CORS (might fail if origin mismatch)
```

---

## **📝 Security Test Checklist**

- [ ] Invalid input rejected (400)
- [ ] Rate limit enforced (429)
- [ ] Protected routes require token (401)
- [ ] Invalid token rejected (401)
- [ ] Expired token rejected (401)
- [ ] CORS allows permitted origins
- [ ] CORS blocks forbidden origins
- [ ] Security headers present
- [ ] Error messages don't leak info
- [ ] Stack traces hidden in production
- [ ] 404 returns proper error
- [ ] Duplicate email returns 409
- [ ] Invalid ObjectId returns 400
- [ ] Sensitive actions rate limited
- [ ] Superadmin bypasses rate limit

---

**Status: SECURITY TESTING READY** ✅
