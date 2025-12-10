# API Testing Guide - Day 2 Authentication

## Base URL
```
http://localhost:5000/api
```

## 1. Register New User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "currency": "INR",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "currency": "INR"
  }
}
```

**Validation Rules:**
- All fields required (name, email, password)
- Password must be at least 6 characters
- Email must be unique

---

## 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "currency": "INR",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "currency": "INR"
  }
}
```

---

## 3. Get User Profile (Protected Route)

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Expected Response (200):**
```json
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "currency": "INR"
}
```

---

## 4. Health Check

**Endpoint:** `GET /health`

**Expected Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Testing Steps

### Using cURL

1. **Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

3. **Get Profile (replace TOKEN):**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman/Thunder Client

1. Create a new request collection
2. Test Register → Save the token
3. Test Login → Verify token is returned
4. Test Profile → Add Bearer token in Authorization header

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token provided"
}
```

### 500 Server Error
```json
{
  "message": "Error message here"
}
```

---

## Day 2 Checklist

- [ ] Register a new user
- [ ] Login with credentials
- [ ] Receive JWT token
- [ ] Test protected route with token
- [ ] Verify token expiration (30 days)
- [ ] Test invalid credentials
- [ ] Test duplicate email registration
- [ ] Test missing fields validation
