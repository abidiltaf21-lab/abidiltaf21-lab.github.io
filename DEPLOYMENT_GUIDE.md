# Deployment Guide - Smooothpixel

This guide will help you deploy the Smooothpixel project to Railway (backend) and Vercel (frontend) so that the database runs from the cloud instead of your local machine.

## Overview

- **Backend**: ASP.NET Core API deployed to Railway with PostgreSQL database
- **Frontend**: React application deployed to Vercel
- **Database**: PostgreSQL hosted on Railway

## Prerequisites

1. GitHub account with the repository pushed
2. Railway account (https://railway.app)
3. Vercel account (https://vercel.com)
4. Cloudinary account (for media uploads)

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to https://railway.app and log in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `smooothpixel` repository
4. Railway will detect the Dockerfile in the `Project` folder

### 1.2 Configure Environment Variables

After the project is created, go to the "Variables" tab and add:

```
DATABASE_URL = (Railway will auto-set this when you add PostgreSQL)
JWT_KEY = A_Very_Complex_Secret_Key_That_Is_At_Least_32_Bytes_Long_123
JWT_ISSUER = JwtIssuer
JWT_AUDIENCE = JwtAudience
JWT_SUBJECT = JwtSubject
ASPNETCORE_ENVIRONMENT = Production
```

### 1.3 Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable

### 1.4 Configure Build Settings

Railway will automatically use the Dockerfile in the `Project` folder. The build settings are already configured in `railway.json`.

### 1.5 Deploy

1. Click "Deploy" to build and deploy
2. Wait for the deployment to complete
3. Railway will provide a URL like `https://your-app-name.railway.app`
4. Test the health endpoint: `https://your-app-name.railway.app/api/health`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to https://vercel.com and log in
2. Click "Add New" → "Project"
3. Import your `smooothpixel` repository from GitHub

### 2.2 Configure Build Settings

Vercel will automatically detect the root `vercel.json` file with these settings:

```json
{
  "buildCommand": "cd smooothpixel/souce && npm install && npm run build",
  "outputDirectory": "smooothpixel/souce/dist",
  "installCommand": "echo 'install handled in buildCommand'"
}
```

### 2.3 Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```
VITE_PRODUCTION_API_URL = https://your-railway-app.railway.app/api
VITE_CLOUDINARY_CLOUD_NAME = your_cloud_name
VITE_CLOUDINARY_API_KEY = your_api_key
VITE_CLOUDINARY_API_SECRET = your_api_secret
```

**Important**: Replace `https://your-railway-app.railway.app/api` with your actual Railway backend URL from Step 1.

### 2.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Vercel will provide a URL like `https://your-project.vercel.app`

## Step 3: Configure Domain (Optional)

If you want to use `smooothpixel.com`:

### For Vercel (Frontend)

1. Go to Vercel project → Settings → Domains
2. Add `smooothpixel.com`
3. Follow the DNS instructions provided by Vercel

### For Railway (Backend)

1. Go to Railway project → Settings → Domains
2. Add `api.smooothpixel.com` (or similar)
3. Update Vercel environment variable `VITE_PRODUCTION_API_URL` to use the custom domain

## Step 4: Test Deployment

1. Visit your Vercel frontend URL
2. Check if videos are loading from the API
3. Test the admin panel at `/login`
4. Verify that the database is working by creating/updating content

## Troubleshooting

### Backend not responding

- Check Railway logs for errors
- Verify PostgreSQL is running and connected
- Ensure all environment variables are set correctly

### Frontend connection errors

- Verify `VITE_PRODUCTION_API_URL` is set correctly in Vercel
- Check Railway backend is running and accessible
- Test the backend health endpoint directly

### Database connection issues

- Verify `DATABASE_URL` is set in Railway
- Check PostgreSQL service is running
- Ensure the connection string format is correct for PostgreSQL

## Local Development

To continue local development:

1. Install PostgreSQL locally (or use Docker)
2. Update `Project/ReactApi/appsettings.json` with your local PostgreSQL connection string
3. Run backend: `dotnet run --project Project/ReactApi`
4. Run frontend: `cd smooothpixel/souce && npm run dev`

## Summary

After completing these steps:
- Your backend will run on Railway with a cloud PostgreSQL database
- Your frontend will run on Vercel
- The database will no longer depend on your local machine
- Videos and content will load properly on smooothpixel.com
