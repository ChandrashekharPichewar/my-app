# MyApp Backend

REST API backend built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

Includes Swagger UI documentation, JWT access/refresh token rotation, device registration, and rate limiting.

---

## Features

- **Authentication**:
  - `POST /api/auth/signup`: User registration with `firstname`, `lastname`, `email`, `password`, and `deviceId`. Checks for duplicate emails, hashes passwords with bcrypt, and establishes device linkage.
  - `POST /api/auth/login`: User login with `username` (email or firstname), `password`, and `deviceId`.
  - `POST /api/auth/refresh`: Refresh token rotation.
- **Device Management**:
  - `POST /api/deviceId`: Registers or updates `deviceID`.
- **Documentation**:
  - OpenAPI 3.0 specification with Swagger UI served at `/api-docs` (and `/api-docs.json`).
- **Security & Reliability**:
  - Helmet security headers
  - CORS configuration
  - Rate limiting (Auth & General API limiters)
  - Zod request body validation & centralized error handling
  - Graceful shutdown handling (SIGINT / SIGTERM)

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Validation**: Zod
- **Documentation**: Swagger UI (`swagger-ui-express`)

---

## Project Structure

```text
my-app-backend/
├── prisma/
│   ├── schema.prisma            # Prisma schema (User, RefreshToken, Device)
│   └── migrations/              # SQL migrations
├── src/
│   ├── config/
│   │   ├── env.ts               # Validated environment config
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── swagger.ts           # OpenAPI specification
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT verification (requireAuth & optionalAuth)
│   │   ├── error.middleware.ts   # Centralized error handler & 404
│   │   ├── rate-limit.middleware.ts
│   │   └── validate.middleware.ts# Zod request body validator
│   ├── modules/
│   │   ├── auth/                # Auth schemas, service, controller, and routes
│   │   └── device/              # Device schemas, service, controller, and routes
│   ├── utils/                   # Helpers (JWT, password hash, error class, async handler)
│   ├── app.ts                   # Express app setup
│   └── server.ts                # App entrypoint
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database

### 2. Setup Environment
Copy `.env.example` to `.env` and fill in your database credentials and secrets:
```bash
cp .env.example .env
```

Example `.env`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:password@localhost:5432/my-app?schema=public"
JWT_ACCESS_SECRET="your-32-char-min-access-secret"
JWT_REFRESH_SECRET="your-32-char-min-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="*"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migration & Prisma Client
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```

Server starts at: `http://localhost:4000`  
Swagger UI is available at: `http://localhost:4000/api-docs`

---

## Scripts

- `npm run dev`: Start dev server with file watching via `tsx`
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Run compiled production server
- `npm run typecheck`: Run TypeScript compiler check without emitting files
- `npm run prisma:studio`: Open Prisma Studio database GUI
