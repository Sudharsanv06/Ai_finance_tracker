# 🚀 Deployment Guide - AI Finance Tracker

Complete step-by-step guide to deploy your AI Finance Tracker to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account (free tier works)
- [ ] GitHub repository with latest code
- [ ] Render account (free)
- [ ] Vercel account (free)
- [ ] OpenAI API key (optional - app works without it)

---

## 🗄️ Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Replace `<password>` with your actual password
6. Save this for later!

---

## 🖥️ Step 2: Backend Deployment (Render)

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub account
4. Select your `ai-finance-tracker` repository
5. Click **Connect**

### 2.2 Configure Service

**Basic Settings:**
- **Name**: `ai-finance-tracker-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables** (click **Advanced** → **Add Environment Variable**):

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | Generate random 64+ char string | Use password generator |
| `OPENAI_API_KEY` | `sk-...` | Optional - app works without it |
| `CLIENT_URL` | Leave blank for now | We'll update after frontend deploy |
| `PORT` | `5000` | Render auto-assigns, but good to set |

**Generate JWT_SECRET:**
```bash
# Run this in terminal to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.3 Deploy!

1. Click **Create Web Service**
2. Wait 3-5 minutes for build
3. Once deployed, copy your backend URL (e.g., `https://ai-finance-tracker-backend.onrender.com`)
4. **Save this URL!** You'll need it for frontend

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your `ai-finance-tracker` repository
4. Click **Import**

### 3.2 Configure Project

**Framework Preset:** Vite (should auto-detect)

**Root Directory:** 
- Click **Edit** next to Root Directory
- Enter: `client`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

**Environment Variables:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-render-backend-url.onrender.com/api` |

⚠️ **IMPORTANT**: Add `/api` at the end of your Render URL!

Example: `https://ai-finance-tracker-backend.onrender.com/api`

### 3.3 Deploy!

1. Click **Deploy**
2. Wait 1-2 minutes for build
3. Once deployed, copy your frontend URL (e.g., `https://ai-finance-tracker-abc123.vercel.app`)

---

## 🔗 Step 4: Update Backend CORS

Now that you have your Vercel URL, update Render environment variable:

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **Environment** tab
4. Find `CLIENT_URL` variable (or add it if missing)
5. Set value to your Vercel URL: `https://ai-finance-tracker-abc123.vercel.app`
6. Click **Save Changes**
7. Service will auto-redeploy (30-60 seconds)

---

## ✅ Step 5: Production Testing

Visit your Vercel URL and test everything:

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Check token persistence (refresh page, should stay logged in)

### Expenses
- [ ] Add expense manually
- [ ] Use "Auto Categorize" button
- [ ] Edit an expense
- [ ] Delete an expense

### Budgets
- [ ] Create a monthly budget
- [ ] View budget progress bars
- [ ] Check budget color coding (green/yellow/red)

### Dashboard
- [ ] View total expenses
- [ ] Check pie chart renders
- [ ] Check bar chart with 6 months data
- [ ] Verify budget prediction alert shows

### AI Features
- [ ] Generate AI insight (click button)
- [ ] Ask a question: "How much did I spend on food?"
- [ ] Try budget question: "What's my remaining budget?"

### Profile
- [ ] View profile page
- [ ] Update name
- [ ] Change currency
- [ ] Verify changes persist

### Security
- [ ] Logout from navbar
- [ ] Try accessing dashboard (should redirect to login)
- [ ] Login again
- [ ] All data should be there

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails on Render
- Check Node version in `package.json` (should be 18+)
- Verify all dependencies are in `dependencies` not `devDependencies`
- Check Render build logs for specific error

**Problem**: Server crashes after deploy
- Check Render logs: Dashboard → Logs tab
- Verify `MONGO_URI` is correct (no spaces, quotes)
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Problem**: CORS errors
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- No trailing slash in URL
- Clear browser cache

### Frontend Issues

**Problem**: API calls fail (network error)
- Check `VITE_API_URL` has `/api` at end
- Verify Render backend is running (visit backend URL/api/health)
- Check browser console for exact error

**Problem**: Build fails on Vercel
- Verify `Root Directory` is set to `client`
- Check build logs for missing dependencies
- Ensure Vite config is correct

**Problem**: Blank page after deploy
- Check Vercel deployment logs
- Verify `vercel.json` is in client folder
- Check browser console for errors

### MongoDB Issues

**Problem**: Cannot connect to MongoDB
- MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere
- MongoDB Atlas → Database Access → Ensure user has read/write permissions
- Check connection string format

---

## 🔧 Optional: Custom Domain

### Backend (Render)

1. Render Dashboard → Your Service → Settings
2. Scroll to **Custom Domain**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Follow DNS instructions
5. Update `CLIENT_URL` in environment variables

### Frontend (Vercel)

1. Vercel Dashboard → Your Project → Settings
2. Go to **Domains**
3. Add your domain (e.g., `yourdomain.com`)
4. Follow DNS instructions
5. Update Render's `CLIENT_URL` to your new domain

---

## 🚨 Environment Variables Quick Reference

### Backend (Render)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-finance-tracker
JWT_SECRET=your-64-character-random-secret-string
OPENAI_API_KEY=sk-your-openai-api-key (optional)
CLIENT_URL=https://your-vercel-app.vercel.app
PORT=5000
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

## 📊 Monitoring

### Render
- Dashboard shows: CPU, Memory, Request logs
- Free tier: Limited hours/month (enough for demo)
- Logs: Real-time server logs

### Vercel
- Analytics: Page views, performance
- Free tier: Unlimited bandwidth
- Logs: Build and function logs

---

## 🎉 You're Live!

Your AI Finance Tracker is now live on the internet! 🚀

**Share your links:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

**Next Steps:**
1. Add screenshots to README
2. Test with real users
3. Monitor logs for issues
4. Enjoy your deployed app!

---

## 📞 Support

Issues during deployment? Check:
- Render status: https://status.render.com/
- Vercel status: https://www.vercel-status.com/
- MongoDB status: https://status.cloud.mongodb.com/

For code issues, open an issue on GitHub!
