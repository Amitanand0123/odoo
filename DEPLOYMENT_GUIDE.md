# QuickDesk Deployment Guide

This guide will help you deploy your QuickDesk application to Vercel (frontend) and Render (backend), and set up a GitHub workflow to keep the backend awake.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **MongoDB Atlas**: Set up a MongoDB database at [mongodb.com](https://mongodb.com)
5. **Cloudinary Account**: Set up cloud storage at [cloudinary.com](https://cloudinary.com)

## Step 1: Deploy Backend to Render

### 1.1 Prepare Your Repository
Make sure your repository has the following structure:
```
odoo/
├── server/
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── client/
    ├── src/
    ├── package.json
    └── vercel.json
```

### 1.2 Deploy to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the Service**
   - **Name**: `quickdesk-backend` (or your preferred name)
   - **Root Directory**: `server` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (this will run `node index.js`)
   - **Plan**: Free (or paid if needed)

4. **Environment Variables**
   Add these environment variables in Render:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdesk
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=10000
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   DISABLE_EMAIL_NOTIFICATIONS=false
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://quickdesk-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend Environment

1. **Create Environment File**
   Create `.env.production` in the `client` directory:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update API Configuration**
   The `client/src/services/api.js` is already configured to use environment variables.

### 2.2 Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add this environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://quickdesk-frontend.vercel.app`)

## Step 3: Update CORS Configuration

After getting your frontend URL, update the `CORS_ORIGIN` environment variable in your Render backend:
```
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Step 4: Set Up GitHub Workflow

### 4.1 Add Repository Secret

1. **Go to GitHub Repository**
   - Navigate to your repository on GitHub
   - Go to Settings → Secrets and variables → Actions

2. **Add Secret**
   - Click "New repository secret"
   - **Name**: `RENDER_BACKEND_URL`
   - **Value**: `https://your-backend-url.onrender.com`
   - Click "Add secret"

### 4.2 Enable GitHub Actions

1. **Go to Actions Tab**
   - Navigate to the "Actions" tab in your repository
   - The workflow should automatically run

2. **Manual Trigger (Optional)**
   - Go to Actions → "Ping Render Backend"
   - Click "Run workflow" to test manually

## Step 5: Test Your Deployment

1. **Test Backend Health**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"success":true,"message":"QuickDesk API is running"}`

2. **Test Frontend**
   - Visit your Vercel frontend URL
   - Try logging in and creating tickets

3. **Test GitHub Workflow**
   - Go to Actions tab in GitHub
   - Check if the "Ping Render Backend" workflow is running every 14 minutes

## Troubleshooting

### Common Issues

1. **Backend Not Responding**
   - Check Render logs for errors
   - Verify environment variables are set correctly
   - Ensure MongoDB connection string is valid

2. **Module Not Found Error**
   - Ensure `server/index.js` exists and points to `src/app.js`
   - Verify `package.json` has `"main": "index.js"` and `"start": "node index.js"`
   - Check that the Root Directory is set to `server` in Render

2. **Frontend Can't Connect to Backend**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS configuration
   - Ensure backend is deployed and running

3. **GitHub Workflow Failing**
   - Verify `RENDER_BACKEND_URL` secret is set correctly
   - Check if the backend URL is accessible
   - Review workflow logs for specific errors

### Environment Variables Reference

**Backend (Render) Environment Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdesk
JWT_SECRET=your_super_secret_jwt_key_here
PORT=10000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
DISABLE_EMAIL_NOTIFICATIONS=false
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

**Frontend (Vercel) Environment Variables:**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Security Notes

1. **JWT Secret**: Use a strong, random string for JWT_SECRET
2. **MongoDB**: Use MongoDB Atlas with proper authentication
3. **Email**: Use Gmail App Passwords, not regular passwords
4. **Environment Variables**: Never commit sensitive data to your repository

## Cost Optimization

1. **Render Free Tier**: 
   - Services sleep after 15 minutes of inactivity
   - GitHub workflow keeps them awake
   - Limited to 750 hours/month

2. **Vercel Free Tier**:
   - Unlimited deployments
   - 100GB bandwidth/month
   - Perfect for most applications

## Monitoring

1. **Render Dashboard**: Monitor backend performance and logs
2. **Vercel Dashboard**: Monitor frontend performance and analytics
3. **GitHub Actions**: Monitor workflow execution and backend health

Your QuickDesk application should now be fully deployed and operational! 