# 🚀 Backend Developer Starter Project (Rise Interns)

Welcome to the **Backend Developer Starter Project**! This project serves as a foundational boilerplate and learning template for backend engineering interns. It is built using modern **Node.js**, **Express 5**, **TypeScript**, **PostgreSQL**, **Prisma 7**, **Zod**, and **pnpm**, structured using a clean, scalable **Modular (Layered) Architecture**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Prerequisites](#-prerequisites)
- [Project Initialization & Setup](#-project-initialization--setup)
- [Prisma 7 & PostgreSQL Setup (Step-by-Step)](#-prisma-7--postgresql-setup-step-by-step)
- [Zod Request Validation Setup](#-zod-request-validation-setup)
- [User Registration API Implementation](#-user-registration-api-implementation)
- [API Endpoints Reference & Postman Guide](#-api-endpoints-reference--postman-guide)
- [Available Scripts](#-available-scripts)
- [Interns' Quick Guide & Concepts](#-interns-quick-guide--concepts)
  - [The Request Lifecycle](#the-request-lifecycle)
  - [How to Add a New Module (Step-by-Step)](#how-to-add-a-new-module-step-by-step)
  - [Key Rules & Best Practices](#key-rules--best-practices)
- [Upcoming Exercises & Milestones](#-upcoming-exercises--milestones)

---

## 🎯 Overview

The purpose of this template is to give interns a production-ready mental model of how backend applications are organized:

- **Separation of Concerns**: Business logic is decoupled from HTTP transport.
- **Modular Design**: Features are encapsulated in self-contained module directories.
- **Strict Data Validation**: Request payloads are validated at the route boundary with **Zod**.
- **Modern ORM**: PostgreSQL integration using **Prisma 7** with driver adapters and multi-file schemas.
- **Security**: Passwords hashed with **bcrypt** before database persistence.
- **Process Resilience**: Includes graceful shutdown hooks (`SIGINT`, `SIGTERM`) and global process error monitors (`unhandledRejection`, `uncaughtException`).

---

## 🛠 Tech Stack

| Technology              | Purpose                                                                 |
| :---------------------- | :---------------------------------------------------------------------- |
| **Node.js**             | Modern JavaScript runtime environment                                   |
| **Express 5**           | Minimal and fast web application framework                              |
| **TypeScript**          | Type-safe JavaScript superset with strict type checking (`nodenext`)    |
| **pnpm**                | Fast, disk space efficient package manager                              |
| **Prisma 7**            | Next-generation TypeScript ORM with multi-file schema support           |
| **PostgreSQL** & **pg** | Relational database & node-postgres client pool                         |
| **@prisma/adapter-pg**  | Prisma driver adapter for PostgreSQL connection pooling                 |
| **Zod**                 | Schema definition and data validation library                           |
| **bcrypt**              | Password hashing for secure credential storage                          |
| **tsx**                 | High-performance TypeScript execution engine & hot-reloading dev runner |
| **dotenv**              | Environment variable management                                         |
| **cors**                | Cross-Origin Resource Sharing middleware                                |
| **cookie-parser**       | HTTP cookie parsing middleware                                          |

---

## 📂 Project Architecture & Directory Structure

```text
project-setup/
├── .env.example                  # Template for environment variables
├── .env                          # Local environment variables (DO NOT COMMIT!)
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies, engines, and scripts
├── pnpm-lock.yaml                # pnpm lockfile
├── pnpm-workspace.yaml           # Workspace configuration
├── prisma7.config.ts             # Prisma 7 configuration (multi-file schema & migrations)
├── tsconfig.json                 # TypeScript compiler settings (ESM NodeNext)
├── prisma/                       # Prisma Schema & Database Migrations
│   ├── schema.prisma             # Datasource and generator configuration
│   ├── user.prisma               # User model definition
│   ├── enum.prisma               # Shared Prisma enums (Role, OrderStatus, etc.)
│   └── migrations/               # SQL migration history
└── src/
    ├── server.ts                 # Server entrypoint: bootstrap & graceful shutdown
    ├── app.ts                    # Express app setup: global middlewares & root routes
    ├── config/
    │   ├── env.config.ts         # Centralized & typed environment variables
    │   └── prisma.config.ts      # Prisma Client instance with PostgreSQL adapter
    ├── middleware/
    │   ├── validateRequest.ts    # Generic Zod validation middleware
    │   ├── notFound.ts           # 404 route handler
    │   └── globalErrorHandler.ts # Centralized error handling middleware
    ├── routes/
    │   └── routes.ts             # Main application router aggregator
    ├── utils/
    │   ├── AppError.ts           # Custom operational error class
    │   ├── apiResonse.ts         # Standardized API response helper
    │   └── catchAsync.ts         # Async error wrapper for Express handlers
    └── modules/
        └── auth/                 # Feature Module: Authentication
            ├── auth.types.ts     # TypeScript interfaces and DTOs
            ├── auth.validate.ts  # Zod validation schemas for auth endpoints
            ├── auth.route.ts     # Routes and validation middleware mapping
            ├── auth.controller.ts# Request extraction and response formatting
            └── auth.service.ts   # Business logic, password hashing & DB queries
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v20.x or higher recommended)
- **pnpm** (v12.x or latest)
- **PostgreSQL** database running locally or remotely

```bash
node -v
pnpm -v
```

---

## 🚀 Project Initialization & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShahriarRefat0/rise_inter_class.git
cd rise_inter_class
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create your local `.env` configuration file:

```bash
cp .env.example .env
```

Ensure `.env` contains:

```env
PORT=5000
NODE_ENVIRONMENT=development
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public
```

---

## 🐘 Prisma 7 & PostgreSQL Setup (Step-by-Step)

Prisma 7 introduces high-performance driver adapters and native multi-file schema management.

### Step 1: Install Prisma & PostgreSQL Dependencies

Run the required installation commands:

```bash
# 1. Install Prisma CLI preview and pg type definitions as devDependencies
pnpm add prisma@prev @types/pg --save-dev

# 2. Install Prisma Client, PG adapter, pg driver, and dotenv
pnpm add @prisma/client@7 @prisma/adapter-pg pg dotenv

# 3. Verify Prisma CLI is working
pnpm prisma

# 4. Initialize Prisma with PostgreSQL provider and custom output path
pnpm prisma init --datasource-provider postgresql --output ../generated/prisma
```

---

### Step 2: Configure Prisma 7 Config (`prisma7.config.ts`)

Create `prisma7.config.ts` in your root directory to enable directory-based multi-file schemas and custom migration paths:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

### Step 3: Define Multi-file Schemas in `prisma/`

1. **`prisma/schema.prisma`** (Generator & Datasource):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

2. **`prisma/enum.prisma`** (Enums):

```prisma
enum Role {
  ADMIN
  USER
  CUSTOMER
}

enum orderStatus {
  PENDDING
  CANCEL
  CONFRIM
}
```

3. **`prisma/user.prisma`** (User Model):

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  avatar    String?
  role      Role     @default(USER)
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
}
```

---

### Step 4: Run Migrations & Generate Client

Create the database tables and generate the typed client:

```bash
# Run migration to create PostgreSQL tables
pnpm prisma migrate dev --name init

# Generate the Prisma Client
pnpm prisma generate
```

---

### Step 5: Configure Prisma Client Singleton (`src/config/prisma.config.ts`)

Connect Prisma to PostgreSQL using connection pooling via `pg.Pool` and `@prisma/adapter-pg`:

```typescript
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const pool = new Pool({
  connectionString: env.database_url,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (env.node_environment !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

## 🛡 Zod Request Validation Setup

Zod ensures incoming requests match exact types and constraints before hitting controller and service logic.

### 1. Install Zod

```bash
pnpm add zod
```

### 2. Create Reusable Validation Middleware (`src/middleware/validateRequest.ts`)

This middleware automatically handles both direct schemas and schemas wrapped with `body: z.object(...)`, formats field error messages clearly, and passes sanitized data to `req.body`:

```typescript
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validateRequest = (schema: z.ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isWrapped = schema instanceof z.ZodObject && "body" in schema.shape;

      const dataToValidate = isWrapped
        ? {
            body: req.body,
            cookies: req.cookies,
            query: req.query,
            params: req.params,
          }
        : req.body;

      const result = await schema.safeParseAsync(dataToValidate);

      if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[issue.path.length - 1] ?? "unknown";
          const fieldKey = String(field);
          if (!fieldErrors[fieldKey]) {
            fieldErrors[fieldKey] = [issue.message];
          } else {
            fieldErrors[fieldKey].push(issue.message);
          }
        }

        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: fieldErrors,
        });
      }

      req.body =
        isWrapped && (result.data as any).body !== undefined
          ? (result.data as any).body
          : result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
```

### 3. Define Validation Schema (`src/modules/auth/auth.validate.ts`)

```typescript
import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
```

---

## 🔐 User Registration API Implementation

The registration pipeline demonstrates full end-to-end flow: **Zod Validation -> Controller -> Service -> Hashing -> Database Insert**.

### 1. Route Layer (`src/modules/auth/auth.route.ts`)

```typescript
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { UserValidation } from "./auth.validate.js";
import validateRequest from "../../middleware/validateRequest.js";

const route: Router = Router();

route.post("/login", authController.login);
route.post(
  "/register",
  validateRequest(UserValidation.createUserValidationSchema),
  authController.registerUser,
);

export const authRouther = route;
```

### 2. Controller Layer (`src/modules/auth/auth.controller.ts`)

```typescript
import { Request, Response } from "express";
import { authSevice } from "./auth.service.js";
import { ApiResponse } from "../../utils/apiResonse.js";
import { catchAsync } from "../../utils/catchAsync.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authSevice.registerUser(req.body);
  ApiResponse.success(res, result, "Register successful");
});

export const authController = {
  login,
  registerUser,
};
```

### 3. Service Layer (`src/modules/auth/auth.service.ts`)

```typescript
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config.js";
import { AppError } from "../../utils/AppError.js";
import { RegisterUser } from "./auth.types.js";

const registerUser = async (payload: RegisterUser) => {
  // 1. Check if user already exists
  const isExistUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExistUser) {
    throw new AppError(StatusCodes.CONFLICT, "User already exist");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // 3. Create user in database (omitting password from result)
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return newUser;
};

export const authSevice = {
  login,
  registerUser,
};
```

---

## 📡 API Endpoints Reference & Postman Guide

### Base URL

```
http://localhost:5000/api/v1
```

---

### 1. User Registration

- **Method:** `POST`
- **URL:** `/api/v1/auth/register`
- **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
  "name": "Refat",
  "email": "refat@gmail.com",
  "password": "password123"
}
```

#### ✅ Success Response (`200 OK`):

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "id": "b4ce6005-23c3-4e42-844f-cbbba171bc54",
    "name": "Refat",
    "email": "refat@gmail.com",
    "avatar": null,
    "role": "USER",
    "createAt": "2026-11-20T07:48:02.452Z",
    "updateAt": "2026-11-20T07:48:02.452Z"
  }
}
```

#### ❌ Validation Error Response (`400 Bad Request`):

_(Triggered when field values fail Zod constraints)_

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": ["Name must be at least 2 characters"],
    "email": ["Invalid email format"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

#### ❌ Duplicate User Error Response (`409 Conflict`):

```json
{
  "succes": false,
  "message": "User already exist"
}
```

---

### 2. User Login

- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "email": "refat@gmail.com",
  "password": "password123"
}
```

- **Response:** `200 OK`

---

### 3. Server Health Check

- **Method:** `GET`
- **URL:** `/`
- **Response:** `200 OK`

```json
{
  "success": true,
  "message": "Server is running on port 5000"
}
```

---

## 📜 Available Scripts

| Script                        | Command                     | Description                                          |
| :---------------------------- | :-------------------------- | :--------------------------------------------------- |
| **`pnpm run dev`**            | `tsx --watch src/server.ts` | Runs the server in development mode with live reload |
| **`pnpm prisma migrate dev`** | `prisma migrate dev`        | Applies database migrations in development           |
| **`pnpm prisma generate`**    | `prisma generate`           | Generates TypeScript Prisma Client code              |
| **`pnpm prisma studio`**      | `prisma studio`             | Opens the visual database management GUI             |

---

## 🎓 Interns' Quick Guide & Concepts

### The Request Lifecycle

```mermaid
flowchart LR
    Client([HTTP Request]) --> Middleware[Global Middleware: CORS, JSON, Cookies]
    Middleware --> AppRouter[Express Router: /api/v1/auth]
    AppRouter --> Validate[Zod Middleware: validateRequest]
    Validate -- If Invalid (400) --> Client
    Validate -- If Valid --> Controller[Controller: authController.registerUser]
    Controller --> Service[Service: authService.registerUser]
    Service --> Prisma[(Prisma 7 -> PostgreSQL)]
    Prisma --> Service
    Service --> Controller
    Controller --> Response([HTTP Response])
```

1. **Client** sends request with JSON payload.
2. **`validateRequest`** verifies request body against Zod schemas. If validation fails, it immediately returns a structured `400 Bad Request` with exact field error messages.
3. **`auth.controller.ts`** orchestrates the request and passes sanitized payload to the service.
4. **`auth.service.ts`** executes business checks (e.g. duplicate user check), hashes passwords with `bcrypt`, and persists records using `prisma.user.create()`.
5. **`ApiResponse.success`** formats standard JSON response and sends it to the client.

---

### Key Rules & Best Practices

1. **ESM Import Syntax**:
   Because `tsconfig.json` uses `"module": "nodenext"`, all relative TypeScript imports must specify the `.js` extension:

   ```typescript
   // Correct:
   import { authRouther } from "./modules/auth/auth.route.js";

   // Incorrect (will fail compiler in NodeNext):
   import { authRouther } from "./modules/auth/auth.route";
   ```

2. **Always Use `omit` for Sensitive Fields**:
   When creating or querying users with Prisma, omit sensitive credentials like passwords before returning data:

   ```typescript
   prisma.user.create({
     data: { ... },
     omit: { password: true }
   });
   ```

3. **Never Put Business Logic in Controllers**:
   Controllers only manage HTTP request extraction and response formatting. All verification, hashing, and DB access belong in the Service layer.

---

## 🎯 Upcoming Exercises & Milestones

- [x] **Global Error Handler**: Captures errors and returns standardized JSON error responses.
- [x] **Validation Layer**: Integrated `zod` schema validation to validate request bodies before reaching the controller.
- [x] **Database Integration**: Connected PostgreSQL using **Prisma 7** driver adapter.
- [x] **Auth Expansion**: Implemented Registration with password hashing using `bcrypt`.
- [ ] **JWT Access Tokens**: Implement access & refresh token generation (`jsonwebtoken`) in `auth.service.ts` upon login.
- [ ] **Authentication Middleware**: Create `authCheck` middleware to verify Bearer JWT tokens on protected routes.
- [ ] **Role-Based Access Control (RBAC)**: Restrict endpoints to specific user roles (`ADMIN`, `USER`, `CUSTOMER`).
