# AI Finance Tracker - Testing Guide

## ✅ Fixed Issues

### 1. JWT Authentication Error
- **Problem**: Invalid JWT signature errors when accessing protected routes
- **Cause**: Old tokens in localStorage signed with different JWT_SECRET
- **Solution**: 
  - Enhanced auth middleware with specific error messages
  - Added automatic token clearing on Login/Register pages
  - API interceptor redirects to login on 401 errors

### 2. Server Startup
- **Problem**: Port 5000 already in use
- **Solution**: Kill existing Node processes before starting server
- **Status**: ✅ Server running on http://localhost:5000
- **Database**: ✅ MongoDB connected to localhost

## 🚀 How to Test

### Step 1: Verify Both Servers Are Running

#### Backend Server (Port 5000)
```powershell
cd C:\Users\sudha\OneDrive\Desktop\MAIN\ai-finance-tracker\server
npm run dev
```
You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

#### Frontend Client (Port 5173)
```powershell
cd C:\Users\sudha\OneDrive\Desktop\MAIN\ai-finance-tracker\client
npm run dev
```
You should see:
```
VITE ready in xxx ms
Local: http://localhost:5173/
```

### Step 2: Clear Browser Data (First Time Only)

Open browser console (F12) and run:
```javascript
localStorage.clear()
```

Or simply navigate to http://localhost:5173/login (which auto-clears tokens)

### Step 3: Register a New Account

1. Go to http://localhost:5173/register
2. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click **Register**
4. Should redirect to Dashboard

### Step 4: Test Expense Management

#### Create Expense
1. Click **Expenses** in navbar
2. Fill expense form:
   - Description: "Lunch at Restaurant"
   - Amount: 45.50
   - Category: Food & Dining
   - Payment Method: Credit Card
   - Date: Select today's date
3. Click **Add Expense**
4. Expense should appear in the table below

#### Edit Expense
1. Click **Edit** button on an expense
2. Change amount to 50
3. Click **Update Expense**
4. Table should update immediately

#### Delete Expense
1. Click **Delete** button
2. Confirm deletion
3. Expense removed from table

### Step 5: Test Dashboard

1. Click **Dashboard** in navbar
2. Verify all stat cards display:
   - Total Expenses (sum of all expenses)
   - Monthly Expenses (current month)
   - Budget Used (percentage)
   - Remaining Budget
3. Check that colors update based on data:
   - Green: Budget remaining positive
   - Red: Over budget

### Step 6: Test Authentication Flow

#### Logout
1. Click **Logout** button
2. Should redirect to login page
3. Token removed from localStorage

#### Login Again
1. Go to http://localhost:5173/login
2. Enter credentials from Step 3
3. Click **Login**
4. Should redirect to Dashboard with your data

## 🔍 API Endpoints Testing

You can also test endpoints directly using curl or Postman:

### Health Check (No Auth)
```powershell
curl http://localhost:5000/api/health
```

### Register (No Auth)
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login (No Auth)
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Expenses (Requires Auth)
```powershell
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/expenses `
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Expense (Requires Auth)
```powershell
curl -X POST http://localhost:5000/api/expenses `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"description":"Coffee","amount":5.50,"category":"Food & Dining","paymentMethod":"Cash"}'
```

## ⚠️ Common Issues & Solutions

### Issue: "Failed to load resource: 404"
- **Check**: Is the backend server running?
- **Solution**: Start server with `npm run dev` in server directory

### Issue: "Network Error" or CORS
- **Check**: Is backend on port 5000?
- **Solution**: Verify `MONGO_URI` in server/.env and restart

### Issue: "Invalid token" errors
- **Solution**: Navigate to /login page (auto-clears tokens) or run `localStorage.clear()` in console

### Issue: "EADDRINUSE" port already in use
```powershell
# Kill all Node processes
Get-Process -Name node | Stop-Process -Force
```

### Issue: MongoDB connection failed
- **Check**: Is MongoDB service running?
```powershell
Get-Service -Name MongoDB* | Select-Object Name, Status
```
- **Solution**: Start MongoDB service or update `MONGO_URI` in .env

## 📊 Expected Behavior

### Authentication
- ✅ Register creates new user and logs in
- ✅ Login with correct credentials succeeds
- ✅ Invalid credentials show error message
- ✅ Protected routes redirect to login when no token
- ✅ Expired/invalid tokens auto-logout

### Expenses
- ✅ Create adds expense to database
- ✅ List shows all user's expenses (sorted by date)
- ✅ Edit updates expense in place
- ✅ Delete removes expense after confirmation
- ✅ Validation prevents negative amounts
- ✅ Category badges show color-coded categories

### Dashboard
- ✅ Displays real-time statistics
- ✅ Calculates totals correctly
- ✅ Shows monthly expenses for current month
- ✅ Budget tracking with percentage
- ✅ Color coding (green/red) based on budget status

## 🎯 Day 5 Completed Features

- [x] ExpenseForm component (create + edit modes)
- [x] ExpenseTable component (list with actions)
- [x] Expenses page integration
- [x] Dashboard stat cards
- [x] Edit expense functionality
- [x] Delete expense with confirmation
- [x] Category color coding
- [x] Smooth scroll to form on edit
- [x] JWT error handling improvements
- [x] Automatic token clearing

## 📝 Next Steps (Day 6+)

1. **Budget Management**
   - Create budget form
   - Set category limits
   - Budget alert notifications

2. **AI Integration**
   - Auto-categorize expenses with AI
   - Generate insights
   - Spending predictions

3. **Data Visualization**
   - Pie charts for categories
   - Line charts for trends
   - Monthly comparison charts

4. **Advanced Features**
   - Export to CSV/PDF
   - Recurring expenses
   - Bill reminders
   - Multi-currency support
