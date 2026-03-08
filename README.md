# Application Architecture — AWS Study Project

[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](./docs/README.pt-br.md)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next-16.x-E0234E?logo=nextjs)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger)](https://real-time-notification-system-nl.up.railway.app/api)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 1. Project Objective

This project aims to build a complete **fullstack application** for learning AWS using modern technologies from the JavaScript ecosystem.

The application will allow learning about:

- Deploying applications on AWS
- Integration with a SQL database (RDS)
- Integration with a NoSQL database (DynamoDB)
- Automated CI/CD
- Structuring scalable applications
- Modern fullstack architecture

The application will be a **Task Manager**.

---

# 2. Technology Stack

## Backend

- Node.js
- NestJS
- Prisma ORM
- PostgreSQL (AWS RDS)
- DynamoDB
- JWT Authentication
- bcrypt
- Swagger

## Frontend

- Next.js (App Router)
- TailwindCSS — rose palette
- shadcn/ui
- Lucide Icons
- TanStack Query

## AWS Infrastructure

- AWS Cognito (Authentication)
- AWS RDS (PostgreSQL)
- AWS DynamoDB
- AWS S3
- AWS CloudFront
- AWS EC2 or ECS
- AWS CloudWatch
- AWS IAM

## CI/CD

- GitHub
- GitHub Actions

---

# 3. Application Description

The application will be a **Task Manager** where users can:

- Create an account
- Log in
- Create tasks
- List tasks
- Update tasks
- Delete tasks
- Mark tasks as completed

Each task belongs to an authenticated user.

---

# 4. High-Level Architecture

Application flow:

```
User
  |
  v
Next.js Frontend
  |
  v
NestJS API
  |
  +----> RDS (PostgreSQL)
  |
  +----> DynamoDB
```

Frontend static files will be hosted on:

```
S3 + CloudFront
```

The backend will run on:

```
EC2 or ECS
```

---

# 5. Repository Organization

Recommended structure:

```
task-manager-aws

backend/
frontend/
infra/
docs/
```

---

# 6. Backend Structure (NestJS)

```
backend/src

├── modules
│
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── users
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── tasks
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.repository.ts
│   │   └── tasks.module.ts
│
├── prisma
│   └── prisma.service.ts
│
├── dynamo
│   └── dynamo.service.ts
│
├── common
│   ├── guards
│   ├── decorators
│   └── dto
│
└── main.ts
```

---

# 7. Frontend Structure (Next.js)

Using **App Router**.

```
frontend/src

app/
│
├── login
│   └── page.tsx
│
├── register
│   └── page.tsx
│
├── dashboard
│   └── page.tsx
│
├── layout.tsx
└── page.tsx

components/

├── ui (shadcn)
├── task
│   ├── task-card.tsx
│   ├── task-form.tsx
│   │
│   └── task-list.tsx
│
└── layout
    └── sidebar.tsx

services/

├── api.ts
└── auth.ts

hooks/

├── useTasks.ts
└── useAuth.ts
```

---

# 8. Design System

The interface will be built using:

- TailwindCSS
- shadcn/ui
- Lucide Icons

---

# 9. State Management

The project will use:

**TanStack Query**

Responsible for:

- request caching
- backend synchronization
- automatic refetch
- loading states

Example usage:

```
useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks
})
```

---

# 10. Data Model

## SQL Database — PostgreSQL (RDS)

Table: `users`

Fields:

```
id UUID
name TEXT
email TEXT UNIQUE
password_hash TEXT
created_at TIMESTAMP
```

Example Prisma schema:

```
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

## NoSQL Database — DynamoDB

Table: `tasks`

Partition Key:

```
user_id
```

Sort Key:

```
task_id
```

Fields:

```
task_id
user_id
title
description
status
created_at
```

Possible status values:

```
pending
completed
```

---

# 11. Authentication Flow

Registration:

1. User submits data
2. Backend validates the data
3. Password is encrypted using bcrypt
4. User is saved in RDS

Login:

1. Backend validates credentials
2. JWT is generated
3. Token is returned to the frontend

Protected requests use:

```
Authorization: Bearer TOKEN
```

NestJS uses:

```
AuthGuard
```

---

# 12. Task Flow

Create task:

```
POST /tasks
```

The backend saves the task in DynamoDB.

List tasks:

```
GET /tasks
```

Query by `user_id`.

Update task:

```
PATCH /tasks/:id
```

Delete task:

```
DELETE /tasks/:id
```

---

# 13. Deployment

Frontend:

```
Next build
→ upload to S3
→ distribution via CloudFront
```

Backend:

```
Docker container
→ deploy to EC2 or ECS
```

---

# 14. CI/CD

Pipeline using **GitHub Actions**.

Flow:

```
git push
   |
GitHub Actions
   |
build
   |
test
   |
deploy AWS
```

Backend:

```
build docker
push ECR
deploy ECS
```

Frontend:

```
build next
deploy S3
invalidate CloudFront
```

---

# 15. Monitoring

Logs are sent to:

```
AWS CloudWatch
```

This allows:

- monitoring errors
- tracking execution
- viewing container logs

---

# 16. Security

Best practices applied:

- bcrypt for passwords
- JWT authentication
- variables stored in secrets
- HTTPS via CloudFront
- IAM with least-privilege permissions

---

# 18. Development Setup

## Environment Variables

### Backend (`apps/api/.env`)

Key variables for development:

```env
# Auto-confirm users (bypass email confirmation)
AUTO_CONFIRM_USER=true

# Database type: sql | nosql | both
DB_TYPE=both
```

**AUTO_CONFIRM_USER**:

- `true` (development): Users are auto-confirmed after registration, no email verification needed
- `false` (production): Users must confirm email with code sent by Cognito

## Cognito Management Scripts

```bash
cd apps/api

# List all users and their status
pnpm cognito:list

# Manually confirm a user
pnpm cognito:confirm email@example.com

# Delete a specific user
pnpm cognito:delete email@example.com

# Delete all users
pnpm cognito:delete-all
```

## Database Visualization

**PostgreSQL (SQL):**

```bash
cd apps/api
pnpm prisma:studio
```

Opens at: `http://localhost:5555`

**DynamoDB (NoSQL):**

```bash
cd apps/api
pnpm dynamo:admin
```

Opens at: `http://localhost:8001`

---

# 19. Learning Objectives

With this project it will be possible to learn:

### Frontend

- Next.js
- TanStack Query
- shadcn
- Tailwind

### Backend

- NestJS
- Prisma
- JWT
- Modular architecture

### AWS

- S3
- CloudFront
- EC2 or ECS
- RDS
- DynamoDB
- CloudWatch
- IAM
- CI/CD

---
