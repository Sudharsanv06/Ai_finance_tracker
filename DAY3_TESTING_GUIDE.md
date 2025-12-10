# Day 3 - Frontend Auth Integration Testing Guide

## ✅ Testing Checklist

### 1. Registration Flow
- [ ] Navigate to http://localhost:5174/register
- [ ] Try registering with a new email
- [ ] Check validation:
  - [ ] Password must be at least 6 characters
  - [ ] Confirm password must match
  - [ ] All fields required
- [ ] After successful registration:
  - [ ] User should be redirected to Dashboard (/)
  - [ ] User name should appear in Navbar
  - [ ] Token should be stored in localStorage
  - [ ] User should stay logged in after refresh

### 2. Login Flow
- [ ] Navigate to http://localhost:5174/login
- [ ] Try logging in with existing credentials (test@example.com / password123)
- [ ] Check validation:
  - [ ] Wrong password shows error message
  - [ ] Invalid email shows error message
- [ ] After successful login:
  - [ ] User should be redirected to Dashboard (/)
  - [ ] User name should appear in Navbar
  - [ ] Token should be stored in localStorage

### 3. Protected Routes
- [ ] Open browser in incognito mode
- [ ] Try accessing http://localhost:5174/expenses directly
- [ ] Should be redirected to /login
- [ ] After login, should access protected route

### 4. Logout Flow
- [ ] Click Logout button in Navbar
- [ ] Should be redirected to /login
- [ ] Token should be removed from localStorage
- [ ] Protected routes should no longer be accessible

### 5. Token Persistence
- [ ] Login to the application
- [ ] Refresh the page (F5)
- [ ] User should remain logged in
- [ ] User info should still appear in Navbar
- [ ] Check browser console for profile fetch

### 6. Error Handling
- [ ] Test with server stopped (invalid token)
- [ ] Test duplicate email registration
- [ ] Test wrong password login
- [ ] All errors should display user-friendly messages

## 🔧 Manual Testing Commands

### Check localStorage
```javascript
// Open browser console (F12) and run:
localStorage.getItem('token')
// Should return JWT token when logged in
```

### Test API Calls
```javascript
// In browser console:
fetch('http://localhost:5000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

## ✅ Day 3 Features Implemented

1. **Axios Configuration**
   - Base URL set to `http://localhost:5000`
   - Environment variable support via `VITE_API_URL`

2. **Auth Service**
   - `registerUser()` - Register new user
   - `loginUser()` - Login existing user
   - `getProfile()` - Fetch user profile with token

3. **Auth Context**
   - Token state management
   - Auto-fetch profile on mount
   - `login()` function for setting token and user
   - `logout()` function for cleanup
   - Loading state for async operations

4. **Login Page**
   - Email/password controlled inputs
   - Form validation
   - Error display
   - Redirect after login
   - Loading state with disabled submit

5. **Register Page**
   - Name/email/password/confirmPassword inputs
   - Password length validation (min 6 chars)
   - Password match validation
   - Error display
   - Redirect after registration
   - Loading state with disabled submit

6. **Protected Routes**
   - ProtectedRoute component blocks unauth users
   - Redirects to /login when not authenticated
   - Shows loading state while checking auth

7. **Navbar**
   - Shows user name when logged in
   - Logout button functionality
   - Conditional rendering (auth/unauth states)
   - Navigation links to all protected routes

## 🎯 Expected Results

After Day 3 completion:
- Users can register from UI ✅
- Users can login from UI ✅
- JWT token stored securely in localStorage ✅
- Users stay logged in after refresh ✅
- Protected routes block unauthorized access ✅
- Logout clears session completely ✅

## 🚀 Next Steps (Day 4)

- Implement Expense CRUD operations
- Create expense forms and tables
- Add expense categorization
- Connect expense API to frontend
