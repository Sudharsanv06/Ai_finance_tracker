# Day 4 - Expense CRUD API Testing Guide

## ✅ API Endpoints

### Base URL
```
http://localhost:5000/api/expenses
```

### Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Endpoint Documentation

### 1. Create Expense
**POST** `/api/expenses`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "description": "Grocery shopping at Walmart",
  "amount": 75.50,
  "category": "Food",
  "paymentMethod": "Card",
  "date": "2025-12-10"
}
```

**Response (201 Created):**
```json
{
  "_id": "6939a6dd87a2d2c951061960",
  "user": "6939a2db87a2d2c951061955",
  "description": "Grocery shopping at Walmart",
  "amount": 75.5,
  "category": "Food",
  "paymentMethod": "Card",
  "date": "2025-12-10T00:00:00.000Z",
  "aiCategorized": false,
  "aiNotes": "",
  "createdAt": "2025-12-10T16:59:09.568Z",
  "updatedAt": "2025-12-10T16:59:09.568Z"
}
```

**Validation Rules:**
- ✅ `description` - Required, string
- ✅ `amount` - Required, positive number
- ⚠️ `category` - Optional, enum: [Food, Transport, Shopping, Bills, Entertainment, Health, Education, Others]
- ⚠️ `paymentMethod` - Optional, enum: [Cash, UPI, Card, NetBanking, Other]
- ⚠️ `date` - Optional, defaults to current date

---

### 2. Get All Expenses
**GET** `/api/expenses`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200 OK):**
```json
[
  {
    "_id": "6939a6e687a2d2c951061963",
    "user": "6939a2db87a2d2c951061955",
    "description": "Uber ride to office",
    "amount": 15.25,
    "category": "Transport",
    "paymentMethod": "UPI",
    "date": "2025-12-10T16:59:18.578Z",
    "aiCategorized": false,
    "aiNotes": "",
    "createdAt": "2025-12-10T16:59:18.580Z",
    "updatedAt": "2025-12-10T16:59:18.580Z"
  }
]
```

**Features:**
- Returns only expenses for authenticated user
- Sorted by date (newest first)

---

### 3. Get Single Expense
**GET** `/api/expenses/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200 OK):**
```json
{
  "_id": "6939a6dd87a2d2c951061960",
  "user": "6939a2db87a2d2c951061955",
  "description": "Grocery shopping",
  "amount": 75.5
}
```

**Error Responses:**
- `404` - Expense not found
- `403` - Not authorized (not your expense)

---

### 4. Update Expense
**PUT** `/api/expenses/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "description": "Updated grocery shopping",
  "amount": 85.75,
  "category": "Food",
  "paymentMethod": "Card"
}
```

**Response (200 OK):**
```json
{
  "_id": "6939a6dd87a2d2c951061960",
  "user": "6939a2db87a2d2c951061955",
  "description": "Updated grocery shopping",
  "amount": 85.75,
  "updatedAt": "2025-12-10T17:05:38.934Z"
}
```

**Authorization:**
- ✅ Only expense owner can update
- ❌ Returns 403 if not owner

---

### 5. Delete Expense
**DELETE** `/api/expenses/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200 OK):**
```json
{
  "message": "Expense removed"
}
```

**Authorization:**
- ✅ Only expense owner can delete
- ❌ Returns 403 if not owner

---

## 🧪 PowerShell Testing Commands

### Setup: Get Token
```powershell
$body = @{
  email = "test@example.com"
  password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST -Body $body -ContentType "application/json"

$token = $response.token
```

### Test 1: Create Expense
```powershell
$headers = @{ 
  Authorization = "Bearer $token"
  "Content-Type" = "application/json" 
}

$body = @{
  description = "Grocery shopping"
  amount = 75.50
  category = "Food"
  paymentMethod = "Card"
} | ConvertTo-Json

$expense = Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" `
  -Method POST -Body $body -Headers $headers

$expenseId = $expense._id
```

### Test 2: Get All Expenses
```powershell
$headers = @{ Authorization = "Bearer $token" }

$expenses = Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" `
  -Method GET -Headers $headers
```

### Test 3: Update Expense
```powershell
$headers = @{ 
  Authorization = "Bearer $token"
  "Content-Type" = "application/json" 
}

$body = @{
  description = "Updated grocery shopping"
  amount = 85.75
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/expenses/$expenseId" `
  -Method PUT -Body $body -Headers $headers
```

### Test 4: Delete Expense
```powershell
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Uri "http://localhost:5000/api/expenses/$expenseId" `
  -Method DELETE -Headers $headers
```

### Test 5: Unauthorized Access (should fail)
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" -Method GET
} catch {
  Write-Host "Status: 401 - Unauthorized (Expected)"
}
```

### Test 6: Validation - Missing Description
```powershell
$headers = @{ 
  Authorization = "Bearer $token"
  "Content-Type" = "application/json" 
}

$body = @{ amount = 50 } | ConvertTo-Json

try {
  Invoke-RestMethod -Uri "http://localhost:5000/api/expenses" `
    -Method POST -Body $body -Headers $headers
} catch {
  Write-Host "Validation Error (Expected)"
}
```

---

## ✅ Test Results Summary

### Tests Performed:
1. ✅ **Create Expense** - Status 201, expense created successfully
2. ✅ **Create Multiple** - Multiple expenses created with different categories
3. ✅ **Get All Expenses** - Retrieved all user expenses, sorted by date
4. ✅ **Update Expense** - Updated description and amount, updatedAt changed
5. ✅ **Delete Expense** - Expense removed successfully
6. ✅ **Authorization** - 401 when no token provided
7. ✅ **Validation** - Mongoose validates required fields
8. ✅ **Ownership** - Only expense owner can access/modify

---

## 🔒 Authorization Rules Implemented

### Every expense operation enforces:
```javascript
if (expense.user.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Not authorized' });
}
```

**Security Features:**
- ✅ All routes protected with JWT middleware
- ✅ Expenses filtered by user ID
- ✅ Ownership verification before update/delete
- ✅ No user can see or modify another user's expenses

---

## 📊 Database Schema

### Expense Model Fields:
```javascript
{
  user: ObjectId (ref: User) - Required
  description: String - Required
  amount: Number - Required, > 0
  category: Enum - Default: "Others"
  paymentMethod: Enum - Default: "Other"
  date: Date - Default: Date.now
  aiCategorized: Boolean - Default: false
  aiNotes: String - Optional
  timestamps: true (createdAt, updatedAt)
}
```

### Categories:
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Others (default)

### Payment Methods:
- Cash
- UPI
- Card
- NetBanking
- Other (default)

---

## 🎯 Day 4 Completion Status

### All Goals Achieved:
✅ Create Expense API  
✅ Read User Expenses API  
✅ Update Expense API  
✅ Delete Expense API  
✅ Only owner can access their expenses  
✅ Proper validation & error handling  
✅ All routes protected with JWT  
✅ Ownership enforced on all operations  

---

## 🚀 What's Next - Day 5

Day 5 will focus on **Frontend Expense Management**:

1. Create expense form component
2. Build expense list/table
3. Implement edit/delete functionality
4. Add filtering and sorting
5. Display expense statistics
6. Connect to backend APIs

---

**Day 4 Status: ✅ COMPLETE**  
**All CRUD APIs Working: ✅ YES**  
**Authorization Enforced: ✅ YES**
