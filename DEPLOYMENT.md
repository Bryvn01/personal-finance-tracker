# 🚀 Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Environment Setup**
1. Copy `.env.example` to `.env` in root directory
2. Update environment variables with production values
3. Set `NODE_ENV=production` for production deployment

### ✅ **Security Configuration**
- Update CORS origins in `backend/server.js` with your domain
- Set secure session secrets (min 32 characters)
- Configure JWT secret (min 32 characters)

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended for Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
npm run build
vercel --prod
```

### **Option 2: Netlify**
```bash
# Build frontend
cd frontend
npm run build

# Deploy build folder to Netlify
```

### **Option 3: Railway (Full-Stack)**
```bash
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Deploy automatically on push
```

### **Option 4: Heroku**
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

## 🔧 **Production Environment Variables**

### Backend (.env)
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
SESSION_SECRET=your-super-secure-session-secret-min-32-chars
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_DEFAULT_LANGUAGE=en
```

## 📦 **Build Commands**

```bash
# Install all dependencies
npm run install-all

# Build frontend for production
npm run build

# Start production server
cd backend && npm start
```

## 🔒 **Security Notes**

- Never commit `.env` files to GitHub
- Use strong, unique secrets for production
- Enable HTTPS in production
- Update CORS origins to your actual domain
- Consider using a managed database service

## 🌍 **Domain Configuration**

Update `backend/server.js` CORS configuration:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-domain.com'] 
  : ['http://localhost:3000', 'http://localhost:3001']
```