# MyApp Backend — Complete Production Deployment Guide

A step-by-step guide for deploying the **Node.js + Express + Prisma + PostgreSQL** backend to **[Render](https://render.com)** with continuous deployment from GitHub.

---

## 1. Architecture Overview

```mermaid
flowchart LR
    A["GitHub Repo (main branch)"] -->|Auto Deploy Trigger| B["Render Build Container"]
    B -->|1. npm install| C["Install Dependencies"]
    C -->|2. npx prisma generate| D["Generate Prisma Client"]
    D -->|3. npm run build| E["Compile TypeScript (dist/)"]
    E --> F["Render Production Runner"]
    F -->|4. npx prisma migrate deploy| G[("Render PostgreSQL")]
    F -->|5. npm start (node dist/server.js)| H["Live Express Server"]
    H -->|Exposes| I["Swagger UI (/api-docs)"]
    H -->|Exposes| J["Health Endpoint (/health)"]
    H -->|Exposes| K["REST APIs (/api/auth, /api/deviceId)"]
```

---

## 2. Prerequisites

1. **GitHub Account**: Your repository must be pushed to GitHub:
   `https://github.com/ChandrashekharPichewar/my-app`
2. **Render Account**: Sign up at [https://render.com](https://render.com) (free tier available).

---

## 3. Step 1: Create PostgreSQL Database on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. In the top-right corner, click **New +** → **PostgreSQL**.
3. Configure the database:
   - **Name:** `my-app-db`
   - **Database:** `my_app`
   - **User:** `postgres`
   - **Region:** Choose a region close to your target users (e.g., *Singapore*, *Frankfurt*, or *Oregon*).
   - **Instance Type:** Select **Free** (or Starter for production).
4. Click **Create Database**.
5. Once provisioned (approx. 1-2 minutes), scroll down to the **Connections** panel and copy the **Internal Database URL**:
   ```text
   postgresql://postgres:PASSWORD@dpg-xxxxxxxxxx-a:5432/my_app
   ```
   > **Important:** Always use the **Internal Database URL** for services running inside Render. It offers zero network latency fees and private internal routing.

---

## 4. Step 2: Create Web Service on Render

1. From the Render Dashboard, click **New +** → **Web Service**.
2. Under **Connect a repository**, find and select:
   `ChandrashekharPichewar/my-app`
3. Configure service details:
   - **Name:** `my-app-backend`
   - **Language / Runtime:** `Node`
   - **Branch:** `main`
   - **Region:** *Same region as your database* (e.g., Singapore).
   - **Root Directory:** Leave empty (if repository root contains `package.json`).
   - **Instance Type:** Select **Free** (or Starter).

4. Configure Build and Start commands:

   | Setting | Exact Command | Why It's Needed |
   | :--- | :--- | :--- |
   | **Build Command** | `npm install && npx prisma generate && npm run build` | Installs dependencies, generates Prisma types, and compiles TypeScript into `dist/`. |
   | **Start Command** | `npx prisma migrate deploy && npm start` | Runs all pending SQL migrations on the PostgreSQL database, then boots Express (`node dist/server.js`). |

---

## 5. Step 3: Configure Environment Variables

In the **Environment Variables** section on Render, add the following key-value pairs:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode optimizations. |
| `DATABASE_URL` | `postgresql://postgres:...@dpg-...:5432/my_app` | Internal Database URL from Step 1. |
| `JWT_ACCESS_SECRET` | `4b9e1c7f0a8d2e5b6c3a1f9e8d7b5c4a` | 32+ character random secret for access tokens. |
| `JWT_REFRESH_SECRET` | `8f1b6a3d7b1e9a5c0f8246b7d2a1c94e` | 32+ character random secret for refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Lifetime of access tokens. |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Lifetime of refresh tokens. |
| `CORS_ORIGIN` | `*` | Allowed origins (or specify your mobile/web client domain). |

> **Note:** Render automatically sets the `PORT` variable (typically `10000`). The backend server dynamically reads `process.env.PORT` and binds to it automatically.

---

## 6. Step 4: Deploy & Monitor Logs

1. Click **Create Web Service**.
2. Watch the live deployment logs in your Render dashboard:
   ```text
   ==> Running build command 'npm install && npx prisma generate && npm run build'...
   ✔ Generated Prisma Client
   ==> Build successful 🎉
   ==> Running 'npx prisma migrate deploy && npm start'
   Applying migration `20261112172220_init`
   Applying migration `20261113120513_make_expo_token_nullable`
   All migrations have been successfully applied.
   Server listening on http://localhost:10000
   Swagger docs available at http://localhost:10000/api-docs
   ==> Your service is live 🎉
   ```
3. Once live, Render gives you a secure HTTPS URL:
   `https://my-app-backend-4lw0.onrender.com`

---

## 7. Step 5: Verification & Testing

Verify that your deployed service is healthy using the following endpoints:

### 1. Root & Swagger UI
- Open: `https://my-app-backend-4lw0.onrender.com/` (auto-redirects to `/api-docs`)
- Or directly: `https://my-app-backend-4lw0.onrender.com/api-docs`

### 2. Health Check
```bash
curl https://my-app-backend-4lw0.onrender.com/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-11-13T17:26:49.996Z"
}
```

### 3. Test Signup API
```bash
curl -X POST https://my-app-backend-4lw0.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.test@example.com",
    "password": "Password@123",
    "deviceId": "device-mobile-01"
  }'
```
**Expected Response (201 Created):**
```json
{
  "userId": "a74a2e43-6c91-4206-ab4f-dfa2834450e7",
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni...",
  "firstname": "John",
  "lastname": "Doe"
}
```

### 4. Test Login API
```bash
curl -X POST https://my-app-backend-4lw0.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.test@example.com",
    "password": "Password@123",
    "deviceId": "device-mobile-01"
  }'
```

### 5. Test Device API
```bash
curl -X POST https://my-app-backend-4lw0.onrender.com/api/deviceId \
  -H "Content-Type: application/json" \
  -d '{
    "deviceID": "device-mobile-01"
  }'
```

---

## 8. Continuous Deployment Workflow

Render is connected to your GitHub repository:
- Whenever you make changes locally:
  ```bash
  git add .
  git commit -m "feat: new feature"
  git push origin main
  ```
- Render will automatically trigger a new deployment, run your database migrations, re-compile TypeScript, and reload with zero downtime.

---

## 9. Troubleshooting Common Issues

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Could not find a declaration file for module ...`** | `NODE_ENV=production` skipped `@types/*` during `npm install`. | All `@types/*` packages must be in `dependencies` in `package.json` (already configured). |
| **`Null constraint violation on expo_token`** | Database table has `NOT NULL` on a field optional in schema. | Run `npx prisma migrate deploy` in the Start Command (already configured). |
| **Render Free Tier Sleep (50s delay on first request)** | Free instances sleep after 15 minutes of inactivity. | Normal for free tier. Once awake, response times are instant. Upgrade to Starter ($7/mo) for 24/7 uptime. |
| **CORS Errors from Mobile/Web** | Client origin not permitted. | Set `CORS_ORIGIN=*` in Render Environment Variables. |
