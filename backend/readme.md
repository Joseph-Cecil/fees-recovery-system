TypeScript: Restart TS Server"# School Fee Recovery System - Backend

> RESTful API for Ghanaian school fee collection, billing, payments, and arrears recovery.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Design](#database-design)
8. [API Design](#api-design)
9. [Authentication & Authorization](#authentication--authorization)
10. [Services Layer](#services-layer)
11. [Repository Pattern](#repository-pattern)
12. [DTOs and Validation](#dtos-and-validation)
13. [Error Handling](#error-handling)
14. [Payment Integration](#payment-integration)
15. [Messaging Integration](#messaging-integration)
16. [Background Jobs](#background-jobs)
17. [File Storage](#file-storage)
18. [Caching Strategy](#caching-strategy)
19. [Logging & Monitoring](#logging--monitoring)
20. [Testing Strategy](#testing-strategy)
21. [Database Migrations](#database-migrations)
22. [Security Best Practices](#security-best-practices)
23. [API Documentation](#api-documentation)
24. [Deployment](#deployment)
25. [Troubleshooting](#troubleshooting)

---

## Overview

This is the backend API for the School Fee Recovery System, providing:

- **RESTful API** for the admin dashboard and payment portal
- **Payment Processing** via Paystack/Hubtel (MoMo, Cards, GhQR)
- **Messaging** via SMS (Hubtel/mNotify) and WhatsApp
- **Background Jobs** for reminders, reports, and scheduled tasks
- **Real-time Updates** via webhooks for payment status
- **Audit Logging** for compliance and tracking

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Node.js 20+ LTS | JavaScript runtime |
| Framework | Express.js 4.x | Web framework |
| Language | TypeScript 5+ | Type safety |
| Database | PostgreSQL 15+ | Primary data store |
| ORM | Prisma 5+ | Database ORM with migrations |
| Validation | Zod | Request/response validation |
| Auth | JWT + Refresh Tokens | Authentication |
| Password | bcrypt | Password hashing |
| Queue | BullMQ | Background job processing |
| Cache | Redis | Caching and sessions |
| Storage | S3-compatible | File storage (receipts, imports) |
| Email | Nodemailer | Email sending |
| SMS | Hubtel/mNotify | SMS messaging |
| Payments | Paystack/Hubtel | Payment processing |
| Logging | Pino | Structured logging |
| Docs | Swagger/OpenAPI | API documentation |
| Testing | Vitest | Unit and integration tests |

---

## Project Structure
backend/
├── prisma/
│ ├── schema.prisma # Database schema
│ ├── migrations/ # Database migrations
│ │ └── ...
│ └── seed.ts # Database seeding
│
├── src/
│ ├── index.ts # Application entry point
│ ├── app.ts # Express app setup
│ ├── server.ts # Server initialization
│ │
│ ├── config/ # Configuration
│ │ ├── index.ts # Config exports
│ │ ├── app.config.ts # App configuration
│ │ ├── database.config.ts # Database configuration
│ │ ├── auth.config.ts # Auth configuration
│ │ ├── redis.config.ts # Redis configuration
│ │ ├── storage.config.ts # Storage configuration
│ │ ├── payment.config.ts # Payment provider config
│ │ ├── messaging.config.ts # SMS/WhatsApp config
│ │ └── queue.config.ts # Queue configuration
│ │
│ ├── modules/ # Feature modules
│ │ ├── auth/
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.routes.ts
│ │ │ ├── auth.dto.ts
│ │ │ ├── auth.validation.ts
│ │ │ ├── strategies/
│ │ │ │ ├── jwt.strategy.ts
│ │ │ │ └── refresh.strategy.ts
│ │ │ └── guards/
│ │ │ ├── auth.guard.ts
│ │ │ └── roles.guard.ts
│ │ │
│ │ ├── users/
│ │ │ ├── users.controller.ts
│ │ │ ├── users.service.ts
│ │ │ ├── users.repository.ts
│ │ │ ├── users.routes.ts
│ │ │ ├── users.dto.ts
│ │ │ └── users.validation.ts
│ │ │
│ │ ├── schools/
│ │ │ ├── schools.controller.ts
│ │ │ ├── schools.service.ts
│ │ │ ├── schools.repository.ts
│ │ │ ├── schools.routes.ts
│ │ │ ├── schools.dto.ts
│ │ │ └── schools.validation.ts
│ │ │
│ │ ├── students/
│ │ │ ├── students.controller.ts
│ │ │ ├── students.service.ts
│ │ │ ├── students.repository.ts
│ │ │ ├── students.routes.ts
│ │ │ ├── students.dto.ts
│ │ │ └── students.validation.ts
│ │ │
│ │ ├── guardians/
│ │ │ ├── guardians.controller.ts
│ │ │ ├── guardians.service.ts
│ │ │ ├── guardians.repository.ts
│ │ │ ├── guardians.routes.ts
│ │ │ ├── guardians.dto.ts
│ │ │ └── guardians.validation.ts
│ │ │
│ │ ├── classes/
│ │ │ ├── classes.controller.ts
│ │ │ ├── classes.service.ts
│ │ │ ├── classes.repository.ts
│ │ │ ├── classes.routes.ts
│ │ │ ├── classes.dto.ts
│ │ │ └── classes.validation.ts
│ │ │
│ │ ├── fees/
│ │ │ ├── fees.controller.ts
│ │ │ ├── fees.service.ts
│ │ │ ├── fees.repository.ts
│ │ │ ├── fees.routes.ts
│ │ │ ├── fees.dto.ts
│ │ │ └── fees.validation.ts
│ │ │
│ │ ├── invoices/
│ │ │ ├── invoices.controller.ts
│ │ │ ├── invoices.service.ts
│ │ │ ├── invoices.repository.ts
│ │ │ ├── invoices.routes.ts
│ │ │ ├── invoices.dto.ts
│ │ │ ├── invoices.validation.ts
│ │ │ └── helpers/
│ │ │ ├── invoice-calculator.ts
│ │ │ └── invoice-number-generator.ts
│ │ │
│ │ ├── payments/
│ │ │ ├── payments.controller.ts
│ │ │ ├── payments.service.ts
│ │ │ ├── payments.repository.ts
│ │ │ ├── payments.routes.ts
│ │ │ ├── payments.dto.ts
│ │ │ ├── payments.validation.ts
│ │ │ └── webhooks/
│ │ │ ├── paystack.webhook.ts
│ │ │ └── hubtel.webhook.ts
│ │ │
│ │ ├── receipts/
│ │ │ ├── receipts.controller.ts
│ │ │ ├── receipts.service.ts
│ │ │ ├── receipts.repository.ts
│ │ │ ├── receipts.routes.ts
│ │ │ ├── receipts.dto.ts
│ │ │ └── templates/
│ │ │ └── receipt.template.ts
│ │ │
│ │ ├── messages/
│ │ │ ├── messages.controller.ts
│ │ │ ├── messages.service.ts
│ │ │ ├── messages.repository.ts
│ │ │ ├── messages.routes.ts
│ │ │ ├── messages.dto.ts
│ │ │ ├── messages.validation.ts
│ │ │ └── templates/
│ │ │ ├── sms.templates.ts
│ │ │ └── whatsapp.templates.ts
│ │ │
│ │ ├── reports/
│ │ │ ├── reports.controller.ts
│ │ │ ├── reports.service.ts
│ │ │ ├── reports.routes.ts
│ │ │ ├── reports.dto.ts
│ │ │ └── generators/
│ │ │ ├── collections-report.ts
│ │ │ ├── arrears-report.ts
│ │ │ └── export-generator.ts
│ │ │
│ │ ├── dashboard/
│ │ │ ├── dashboard.controller.ts
│ │ │ ├── dashboard.service.ts
│ │ │ ├── dashboard.routes.ts
│ │ │ └── dashboard.dto.ts
│ │ │
│ │ ├── settings/
│ │ │ ├── settings.controller.ts
│ │ │ ├── settings.service.ts
│ │ │ ├── settings.repository.ts
│ │ │ ├── settings.routes.ts
│ │ │ ├── settings.dto.ts
│ │ │ └── settings.validation.ts
│ │ │
│ │ ├── terms/
│ │ │ ├── terms.controller.ts
│ │ │ ├── terms.service.ts
│ │ │ ├── terms.repository.ts
│ │ │ ├── terms.routes.ts
│ │ │ ├── terms.dto.ts
│ │ │ └── terms.validation.ts
│ │ │
│ │ ├── audit/
│ │ │ ├── audit.controller.ts
│ │ │ ├── audit.service.ts
│ │ │ ├── audit.repository.ts
│ │ │ ├── audit.routes.ts
│ │ │ ├── audit.dto.ts
│ │ │ └── audit.middleware.ts
│ │ │
│ │ └── health/
│ │ ├── health.controller.ts
│ │ └── health.routes.ts
│ │
│ ├── shared/ # Shared utilities
│ │ ├── decorators/
│ │ │ ├── roles.decorator.ts
│ │ │ ├── public.decorator.ts
│ │ │ └── current-user.decorator.ts
│ │ │
│ │ ├── middleware/
│ │ │ ├── error.middleware.ts
│ │ │ ├── auth.middleware.ts
│ │ │ ├── validation.middleware.ts
│ │ │ ├── rate-limit.middleware.ts
│ │ │ ├── cors.middleware.ts
│ │ │ ├── helmet.middleware.ts
│ │ │ ├── request-id.middleware.ts
│ │ │ ├── logger.middleware.ts
│ │ │ └── school-context.middleware.ts
│ │ │
│ │ ├── guards/
│ │ │ ├── auth.guard.ts
│ │ │ ├── roles.guard.ts
│ │ │ └── school.guard.ts
│ │ │
│ │ ├── filters/
│ │ │ └── http-exception.filter.ts
│ │ │
│ │ ├── pipes/
│ │ │ ├── validation.pipe.ts
│ │ │ └── parse-int.pipe.ts
│ │ │
│ │ ├── interceptors/
│ │ │ ├── transform.interceptor.ts
│ │ │ ├── timeout.interceptor.ts
│ │ │ └── cache.interceptor.ts
│ │ │
│ │ └── types/
│ │ ├── express.d.ts
│ │ ├── pagination.types.ts
│ │ └── common.types.ts
│ │
│ ├── core/ # Core infrastructure
│ │ ├── database/
│ │ │ ├── prisma.service.ts
│ │ │ ├── prisma.client.ts
│ │ │ └── transactions.ts
│ │ │
│ │ ├── cache/
│ │ │ ├── redis.service.ts
│ │ │ ├── cache.service.ts
│ │ │ └── cache.keys.ts
│ │ │
│ │ ├── queue/
│ │ │ ├── queue.service.ts
│ │ │ ├── queue.processor.ts
│ │ │ └── jobs/
│ │ │ ├── send-reminder.job.ts
│ │ │ ├── generate-receipt.job.ts
│ │ │ ├── send-sms.job.ts
│ │ │ ├── send-email.job.ts
│ │ │ ├── process-payment.job.ts
│ │ │ └── generate-report.job.ts
│ │ │
│ │ ├── storage/
│ │ │ ├── storage.service.ts
│ │ │ └── storage.types.ts
│ │ │
│ │ ├── logger/
│ │ │ ├── logger.service.ts
│ │ │ └── logger.config.ts
│ │ │
│ │ └── events/
│ │ ├── event-emitter.service.ts
│ │ └── events.ts
│ │
│ ├── integrations/ # Third-party integrations
│ │ ├── payments/
│ │ │ ├── payment.interface.ts
│ │ │ ├── payment.factory.ts
│ │ │ ├── paystack/
│ │ │ │ ├── paystack.service.ts
│ │ │ │ ├── paystack.types.ts
│ │ │ │ └── paystack.webhook.ts
│ │ │ └── hubtel/
│ │ │ ├── hubtel.service.ts
│ │ │ ├── hubtel.types.ts
│ │ │ └── hubtel.webhook.ts
│ │ │
│ │ ├── sms/
│ │ │ ├── sms.interface.ts
│ │ │ ├── sms.factory.ts
│ │ │ ├── hubtel-sms/
│ │ │ │ ├── hubtel-sms.service.ts
│ │ │ │ └── hubtel-sms.types.ts
│ │ │ └── mnotify/
│ │ │ ├── mnotify.service.ts
│ │ │ └── mnotify.types.ts
│ │ │
│ │ ├── email/
│ │ │ ├── email.service.ts
│ │ │ ├── email.types.ts
│ │ │ └── templates/
│ │ │ ├── welcome.template.ts
│ │ │ ├── otp.template.ts
│ │ │ └── invoice.template.ts
│ │ │
│ │ └── whatsapp/
│ │ ├── whatsapp.service.ts
│ │ └── whatsapp.types.ts
│ │
│ ├── utils/ # Utility functions
│ │ ├── helpers/
│ │ │ ├── string.helpers.ts
│ │ │ ├── date.helpers.ts
│ │ │ ├── number.helpers.ts
│ │ │ ├── phone.helpers.ts
│ │ │ └── crypto.helpers.ts
│ │ │
│ │ ├── formatters/
│ │ │ ├── currency.formatter.ts
│ │ │ ├── date.formatter.ts
│ │ │ └── phone.formatter.ts
│ │ │
│ │ ├── validators/
│ │ │ ├── phone.validator.ts
│ │ │ ├── tin.validator.ts
│ │ │ └── ghana.validators.ts
│ │ │
│ │ ├── generators/
│ │ │ ├── id.generator.ts
│ │ │ ├── otp.generator.ts
│ │ │ ├── invoice-number.generator.ts
│ │ │ ├── receipt-number.generator.ts
│ │ │ └── paylink.generator.ts
│ │ │
│ │ └── constants/
│ │ ├── app.constants.ts
│ │ ├── error-codes.constants.ts
│ │ ├── ghana.constants.ts
│ │ └── regex.constants.ts
│ │
│ ├── common/ # Common DTOs and types
│ │ ├── dto/
│ │ │ ├── pagination.dto.ts
│ │ │ ├── response.dto.ts
│ │ │ └── error.dto.ts
│ │ │
│ │ ├── enums/
│ │ │ ├── user-role.enum.ts
│ │ │ ├── student-status.enum.ts
│ │ │ ├── invoice-status.enum.ts
│ │ │ ├── payment-status.enum.ts
│ │ │ ├── payment-method.enum.ts
│ │ │ └── message-status.enum.ts
│ │ │
│ │ └── interfaces/
│ │ ├── pagination.interface.ts
│ │ ├── service.interface.ts
│ │ └── repository.interface.ts
│ │
│ └── routes/
│ └── index.ts # Route aggregator
│
├── tests/
│ ├── setup.ts # Test setup
│ ├── factories/ # Test data factories
│ │ ├── user.factory.ts
│ │ ├── student.factory.ts
│ │ ├── invoice.factory.ts
│ │ └── payment.factory.ts
│ │
│ ├── fixtures/ # Test fixtures
│ │ └── ...
│ │
│ ├── unit/ # Unit tests
│ │ ├── services/
│ │ └── utils/
│ │
│ ├── integration/ # Integration tests
│ │ ├── auth.test.ts
│ │ ├── students.test.ts
│ │ ├── invoices.test.ts
│ │ └── payments.test.ts
│ │
│ └── e2e/ # End-to-end tests
│ └── ...
│
├── scripts/
│ ├── seed.ts # Database seeding
│ ├── migrate.ts # Migration runner
│ └── generate-types.ts # Type generation
│
├── docs/
│ ├── api/ # API documentation
│ │ └── openapi.yaml
│ └── database/ # Database documentation
│ └── erd.md
│
├── .env.example # Environment template
├── .env # Local environment (git ignored)
├── .env.test # Test environment
├── .eslintrc.json # ESLint configuration
├── .prettierrc # Prettier configuration
├── .gitignore # Git ignore rules
├── tsconfig.json # TypeScript configuration
├── vitest.config.ts # Vitest configuration
├── docker-compose.yml # Docker compose for local dev
├── Dockerfile # Production Dockerfile
├── package.json # Dependencies
└── README.md # This file

text


---

## Architecture Patterns

### Overview

This backend follows a **layered architecture** with clear separation of concerns:
┌─────────────────────────────────────────────────────────────┐
│ HTTP Request │
└─────────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Middleware Layer │
│ (Auth, Validation, Rate Limiting, Logging, Error Handling) │
└─────────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Controller Layer │
│ (Request handling, response formatting) │
└─────────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Service Layer │
│ (Business logic, orchestration) │
└─────────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Repository Layer │
│ (Data access, queries, Prisma) │
└─────────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Database Layer │
│ (PostgreSQL) │
└─────────────────────────────────────────────────────────────┘

text


### Key Principles

1. **Single Responsibility**: Each layer has a specific purpose
2. **Dependency Injection**: Services are injected, not instantiated
3. **Repository Pattern**: Data access is abstracted through repositories
4. **DTO Pattern**: Data shapes are defined for requests/responses
5. **Error Boundaries**: Errors are caught and transformed at each layer
6. **Audit Trail**: All significant actions are logged

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- PostgreSQL 15+
- Redis 7+
- npm 10+ or pnpm 8+
- Git

### Local Development with Docker

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Copy environment variables
cp .env.example .env

# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run dev
Local Development without Docker
Bash

# Ensure PostgreSQL and Redis are running locally
# Update .env with your local connection strings

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
Available Scripts
Bash

# Development
npm run dev              # Start with hot reload (nodemon)
npm run dev:debug        # Start with debugger

# Building
npm run build            # Compile TypeScript
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:deploy    # Run migrations (prod)
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm run prisma:reset     # Reset database (dev only)

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run typecheck        # TypeScript type check

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run test:int         # Run integration tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Run with coverage
npm run test:watch       # Run in watch mode

# Utilities
npm run docs             # Generate API docs
npm run clean            # Clean build artifacts
Environment Variables
Bash

# .env.example

# ===========================================
# Application
# ===========================================
NODE_ENV=development
PORT=8000
API_PREFIX=/api/v1
APP_NAME="School Fee Recovery System"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# ===========================================
# Database (PostgreSQL)
# ===========================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_fees_db?schema=public"

# Connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ===========================================
# Redis
# ===========================================
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=
REDIS_DB=0

# ===========================================
# Authentication
# ===========================================
# JWT secrets (generate with: openssl rand -base64 64)
JWT_ACCESS_SECRET="your-access-secret-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-characters-long"

# Token expiration
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# OTP settings
OTP_EXPIRATION_MINUTES=10
OTP_LENGTH=6

# Password settings
BCRYPT_ROUNDS=12

# ===========================================
# Rate Limiting
# ===========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=10

# ===========================================
# File Storage (S3-compatible)
# ===========================================
STORAGE_PROVIDER=s3
S3_BUCKET=school-fees-storage
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=                         # Leave empty for AWS, set for MinIO/R2

# Local storage fallback
LOCAL_STORAGE_PATH=./uploads

# ===========================================
# Payment Providers
# ===========================================
# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx

# Hubtel (alternative)
HUBTEL_CLIENT_ID=
HUBTEL_CLIENT_SECRET=
HUBTEL_MERCHANT_ACCOUNT=
HUBTEL_WEBHOOK_SECRET=

# Active payment provider
PAYMENT_PROVIDER=paystack

# ===========================================
# SMS Providers
# ===========================================
# Hubtel SMS
HUBTEL_SMS_CLIENT_ID=
HUBTEL_SMS_CLIENT_SECRET=
HUBTEL_SMS_SENDER_ID=SchoolFees

# mNotify (alternative)
MNOTIFY_API_KEY=
MNOTIFY_SENDER_ID=SchoolFees

# Active SMS provider
SMS_PROVIDER=hubtel

# ===========================================
# Email
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="School Fees <noreply@schoolfees.com>"

# ===========================================
# Queue (BullMQ)
# ===========================================
QUEUE_REDIS_URL=${REDIS_URL}
QUEUE_DEFAULT_ATTEMPTS=3
QUEUE_DEFAULT_BACKOFF=1000

# ===========================================
# Logging
# ===========================================
LOG_LEVEL=debug
LOG_FORMAT=pretty                     # pretty or json
LOG_FILE_ENABLED=false
LOG_FILE_PATH=./logs/app.log

# ===========================================
# Security
# ===========================================
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Helmet settings
HELMET_ENABLED=true

# Request size limits
REQUEST_BODY_LIMIT=10mb
REQUEST_FILE_LIMIT=50mb

# ===========================================
# Monitoring (Optional)
# ===========================================
SENTRY_DSN=
SENTRY_ENVIRONMENT=development

# ===========================================
# Feature Flags
# ===========================================
ENABLE_SWAGGER=true
ENABLE_RATE_LIMITING=true
ENABLE_REQUEST_LOGGING=true
ENABLE_QUERY_LOGGING=false
Database Design
PostgreSQL Setup for Beginners
PostgreSQL is a powerful, open-source relational database. Here's what you need to know:

Key Concepts
Concept	Description
Database	A container for all your data (like a folder)
Table	A collection of related data (like a spreadsheet)
Row	A single record in a table
Column	A field/attribute of a record
Primary Key	Unique identifier for each row (usually id)
Foreign Key	A reference to a row in another table
Index	Speeds up queries on specific columns
Schema	A namespace for organizing tables (default: public)
Data Types We Use
Type	Description	Example
TEXT	Variable-length string	Names, descriptions
VARCHAR(n)	String with max length	Phone numbers
INTEGER	Whole numbers	Amounts in pesewas
BIGINT	Large whole numbers	IDs
DECIMAL(p,s)	Exact decimal numbers	Money calculations
BOOLEAN	True/false	Flags
TIMESTAMP	Date and time	Created at
DATE	Date only	Date of birth
JSONB	JSON data (searchable)	Settings, metadata
UUID	Unique identifier	Primary keys
ENUM	Predefined values	Status, roles
Prisma Schema
prisma

// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===========================================
// ENUMS
// ===========================================

enum UserRole {
  OWNER
  ADMIN
  FINANCE
  STAFF
}

enum UserStatus {
  ACTIVE
  INACTIVE
  PENDING
  SUSPENDED
}

enum StudentStatus {
  ACTIVE
  GRADUATED
  WITHDRAWN
  SUSPENDED
}

enum Gender {
  MALE
  FEMALE
}

enum InvoiceStatus {
  DRAFT
  SENT
  PARTIALLY_PAID
  PAID
  OVERDUE
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCESSFUL
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentMethod {
  MTN_MOMO
  VODAFONE_CASH
  AIRTELTIGO_MONEY
  CARD
  GHQR
  BANK_TRANSFER
  CASH
}

enum MessageChannel {
  SMS
  WHATSAPP
  EMAIL
}

enum MessageStatus {
  QUEUED
  SENDING
  SENT
  DELIVERED
  FAILED
}

enum MessageType {
  BILL_SENT
  REMINDER_PRE_DUE
  REMINDER_DUE
  REMINDER_OVERDUE_7
  REMINDER_OVERDUE_14
  PAYMENT_RECEIVED
  RECEIPT
  CUSTOM
}

enum FeeType {
  TUITION
  PTA
  BOOKS
  UNIFORM
  TRANSPORT
  HOSTEL
  EXAM
  ICT
  SPORTS
  FEEDING
  OTHER
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  EXPORT
  IMPORT
  SEND_MESSAGE
  PAYMENT_RECEIVED
  PAYMENT_REFUND
  SETTINGS_CHANGE
}

// ===========================================
// CORE MODELS
// ===========================================

/// School/Organization - Multi-tenant root
model School {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  address     String?
  city        String?
  region      String?
  phone       String?
  email       String?
  website     String?
  tin         String?  /// Tax Identification Number
  logoUrl     String?
  
  /// Settings stored as JSON for flexibility
  settings    Json     @default("{}")
  
  /// Subscription/billing info
  plan        String   @default("basic")
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  users       User[]
  students    Student[]
  guardians   Guardian[]
  classes     Class[]
  terms       Term[]
  feeItems    FeeItem[]
  invoices    Invoice[]
  payments    Payment[]
  messages    Message[]
  messageTemplates MessageTemplate[]
  auditLogs   AuditLog[]
  
  @@index([slug])
  @@index([isActive])
  @@map("schools")
}

/// User account - Staff members who access the system
model User {
  id          String      @id @default(cuid())
  email       String      @unique
  phone       String?
  name        String
  password    String?     /// Null if using OTP-only auth
  role        UserRole    @default(STAFF)
  status      UserStatus  @default(PENDING)
  
  /// Email verification
  emailVerified   Boolean  @default(false)
  emailVerifiedAt DateTime?
  
  /// Last login tracking
  lastLoginAt DateTime?
  lastLoginIp String?
  
  /// Password reset
  passwordResetToken   String?
  passwordResetExpires DateTime?
  
  /// Refresh tokens (can have multiple sessions)
  refreshTokens RefreshToken[]
  
  /// School association
  schoolId    String
  school      School     @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  auditLogs   AuditLog[]
  
  @@index([email])
  @@index([schoolId])
  @@index([status])
  @@map("users")
}

/// Refresh tokens for JWT authentication
model RefreshToken {
  id          String   @id @default(cuid())
  token       String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  expiresAt   DateTime
  isRevoked   Boolean  @default(false)
  revokedAt   DateTime?
  
  /// Device/session info
  userAgent   String?
  ipAddress   String?
  
  createdAt   DateTime @default(now())
  
  @@index([token])
  @@index([userId])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

/// OTP for passwordless authentication
model Otp {
  id          String   @id @default(cuid())
  identifier  String   /// Email or phone
  code        String
  type        String   /// login, verify_email, reset_password
  
  expiresAt   DateTime
  usedAt      DateTime?
  attempts    Int      @default(0)
  
  createdAt   DateTime @default(now())
  
  @@index([identifier, type])
  @@index([code])
  @@index([expiresAt])
  @@map("otps")
}

// ===========================================
// STUDENT & GUARDIAN MODELS
// ===========================================

/// Student - The person enrolled in school
model Student {
  id            String        @id @default(cuid())
  
  /// Personal info
  firstName     String
  lastName      String
  otherNames    String?
  gender        Gender?
  dateOfBirth   DateTime?     @db.Date
  
  /// School info
  admissionNo   String?
  admissionDate DateTime?     @db.Date
  
  /// Class assignment
  classId       String
  class         Class         @relation(fields: [classId], references: [id])
  
  /// Family grouping (for siblings)
  familyId      String?
  family        Family?       @relation(fields: [familyId], references: [id])
  
  /// Status
  status        StudentStatus @default(ACTIVE)
  
  /// Custom fee adjustment (positive = surcharge, negative = discount)
  customFeeAdjustment Int     @default(0)
  
  /// School association
  schoolId      String
  school        School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relations
  guardians     StudentGuardian[]
  invoices      Invoice[]
  
  @@unique([schoolId, admissionNo])
  @@index([schoolId])
  @@index([classId])
  @@index([familyId])
  @@index([status])
  @@index([lastName, firstName])
  @@map("students")
}

/// Guardian - Parent or sponsor of student(s)
model Guardian {
  id          String    @id @default(cuid())
  
  /// Personal info
  name        String
  phone       String
  phoneAlt    String?   /// Alternative phone
  email       String?
  address     String?
  occupation  String?
  
  /// Preferred contact method
  preferredContact MessageChannel @default(SMS)
  
  /// School association
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  students    StudentGuardian[]
  messages    Message[]
  
  @@index([schoolId])
  @@index([phone])
  @@index([email])
  @@map("guardians")
}

/// Many-to-many relationship between students and guardians
model StudentGuardian {
  id          String   @id @default(cuid())
  
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  guardianId  String
  guardian    Guardian @relation(fields: [guardianId], references: [id], onDelete: Cascade)
  
  /// Relationship type
  relation    String   /// Father, Mother, Uncle, Sponsor, etc.
  
  /// Is this the primary contact for the student?
  isPrimary   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  
  @@unique([studentId, guardianId])
  @@index([studentId])
  @@index([guardianId])
  @@map("student_guardians")
}

/// Family group for siblings
model Family {
  id          String    @id @default(cuid())
  
  /// Family identifier (human readable)
  familyCode  String    @unique
  
  /// Optional family name
  name        String?
  
  /// School association
  schoolId    String
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  students    Student[]
  
  @@index([schoolId])
  @@map("families")
}

// ===========================================
// CLASS & TERM MODELS
// ===========================================

/// Class/Grade level
model Class {
  id          String    @id @default(cuid())
  
  name        String    /// e.g., "KG 1", "Primary 3", "JHS 2"
  shortName   String?   /// e.g., "KG1", "P3", "JHS2"
  level       Int       /// Numeric level for ordering (1-15)
  section     String?   /// e.g., "A", "B", "Gold", "Silver"
  
  /// Capacity
  capacity    Int?
  
  /// School association
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  /// Is this class active?
  isActive    Boolean   @default(true)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  students    Student[]
  feeItems    FeeItem[]
  
  @@unique([schoolId, name, section])
  @@index([schoolId])
  @@index([level])
  @@map("classes")
}

/// Academic term
model Term {
  id          String    @id @default(cuid())
  
  name        String    /// e.g., "Term 1 2024/2025"
  shortName   String    /// e.g., "T1 24/25"
  
  /// Academic year
  academicYear String   /// e.g., "2024/2025"
  termNumber  Int       /// 1, 2, or 3
  
  /// Term dates
  startDate   DateTime  @db.Date
  endDate     DateTime  @db.Date
  
  /// Fee due date for this term
  feesDueDate DateTime? @db.Date
  
  /// Is this the current active term?
  isCurrent   Boolean   @default(false)
  
  /// School association
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  feeItems    FeeItem[]
  invoices    Invoice[]
  
  @@unique([schoolId, academicYear, termNumber])
  @@index([schoolId])
  @@index([isCurrent])
  @@map("terms")
}

// ===========================================
// FEE & BILLING MODELS
// ===========================================

/// Fee item - A type of fee charged to students
model FeeItem {
  id          String    @id @default(cuid())
  
  name        String    /// e.g., "Tuition Fee", "PTA Dues"
  description String?
  type        FeeType   @default(OTHER)
  
  /// Amount in pesewas (100 pesewas = 1 GHS)
  amount      Int
  
  /// Is this fee mandatory?
  isMandatory Boolean   @default(true)
  
  /// Is this a one-time fee or per-term?
  isRecurring Boolean   @default(true)
  
  /// Term association (null = applies to all terms)
  termId      String?
  term        Term?     @relation(fields: [termId], references: [id])
  
  /// Class restriction (null = applies to all classes)
  classId     String?
  class       Class?    @relation(fields: [classId], references: [id])
  
  /// School association
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  /// Is this fee item active?
  isActive    Boolean   @default(true)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  invoiceItems InvoiceItem[]
  
  @@index([schoolId])
  @@index([termId])
  @@index([classId])
  @@index([type])
  @@map("fee_items")
}

/// Discount rule
model Discount {
  id          String       @id @default(cuid())
  
  name        String       /// e.g., "Sibling Discount", "Early Payment"
  description String?
  
  /// Discount type and value
  type        DiscountType
  value       Int          /// Percentage (0-100) or fixed amount in pesewas
  
  /// Conditions
  siblingPosition Int?     /// e.g., 2 = second child gets this discount
  earlyPaymentDays Int?    /// Days before due date for early payment discount
  
  /// School association
  schoolId    String
  
  /// Is this discount active?
  isActive    Boolean      @default(true)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  @@index([schoolId])
  @@map("discounts")
}

/// Invoice - Bill sent to a student/guardian
model Invoice {
  id          String        @id @default(cuid())
  
  /// Invoice number (human readable, unique per school)
  invoiceNo   String
  
  /// Student being billed
  studentId   String
  student     Student       @relation(fields: [studentId], references: [id])
  
  /// Term for this invoice
  termId      String
  term        Term          @relation(fields: [termId], references: [id])
  
  /// Amounts in pesewas
  subtotal    Int           /// Sum of all items before discounts
  discount    Int           @default(0) /// Total discount
  totalAmount Int           /// Final amount (subtotal - discount)
  paidAmount  Int           @default(0) /// Amount paid so far
  balance     Int           /// Remaining balance (totalAmount - paidAmount)
  
  /// Status
  status      InvoiceStatus @default(DRAFT)
  
  /// Due date
  dueDate     DateTime      @db.Date
  
  /// Payment link
  paylinkId   String        @unique
  paylinkUrl  String
  paylinkExpiresAt DateTime?
  
  /// Notification tracking
  sentAt      DateTime?
  lastReminderAt DateTime?
  reminderCount Int         @default(0)
  
  /// Cancellation
  cancelledAt    DateTime?
  cancelledBy    String?
  cancelReason   String?
  
  /// School association
  schoolId    String
  school      School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  items       InvoiceItem[]
  payments    Payment[]
  messages    Message[]
  
  @@unique([schoolId, invoiceNo])
  @@index([schoolId])
  @@index([studentId])
  @@index([termId])
  @@index([status])
  @@index([dueDate])
  @@index([paylinkId])
  @@map("invoices")
}

/// Invoice line item
model InvoiceItem {
  id          String    @id @default(cuid())
  
  invoiceId   String
  invoice     Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  feeItemId   String
  feeItem     FeeItem   @relation(fields: [feeItemId], references: [id])
  
  /// Amounts in pesewas (captured at time of invoice creation)
  amount      Int
  discount    Int       @default(0)
  discountReason String?
  finalAmount Int       /// amount - discount
  
  createdAt   DateTime  @default(now())
  
  @@index([invoiceId])
  @@index([feeItemId])
  @@map("invoice_items")
}

// ===========================================
// PAYMENT MODELS
// ===========================================

/// Payment - A payment made against an invoice
model Payment {
  id          String        @id @default(cuid())
  
  /// Payment reference (internal)
  reference   String        @unique
  
  /// Invoice being paid
  invoiceId   String
  invoice     Invoice       @relation(fields: [invoiceId], references: [id])
  
  /// Amount in pesewas
  amount      Int
  
  /// Payment method
  method      PaymentMethod
  
  /// Status
  status      PaymentStatus @default(PENDING)
  
  /// PSP details
  pspProvider String        /// paystack, hubtel
  pspReference String?      /// Transaction reference from PSP
  pspStatus   String?       /// Raw status from PSP
  pspMetadata Json?         /// Full response from PSP
  
  /// Processing timestamps
  initiatedAt DateTime      @default(now())
  processedAt DateTime?
  completedAt DateTime?
  failedAt    DateTime?
  
  /// Failure info
  failureReason String?
  
  /// Refund info
  refundedAt    DateTime?
  refundedBy    String?
  refundReason  String?
  refundAmount  Int?
  
  /// For manual payments
  isManual        Boolean   @default(false)
  manualRecordedBy String?
  manualProofUrl  String?   /// Receipt photo/document
  manualNotes     String?
  
  /// School association
  schoolId    String
  school      School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  receipt     Receipt?
  
  @@index([schoolId])
  @@index([invoiceId])
  @@index([reference])
  @@index([pspReference])
  @@index([status])
  @@index([method])
  @@map("payments")
}

/// Receipt - Generated after successful payment
model Receipt {
  id          String    @id @default(cuid())
  
  /// Receipt number (human readable)
  receiptNo   String
  
  /// Payment association
  paymentId   String    @unique
  payment     Payment   @relation(fields: [paymentId], references: [id])
  
  /// PDF storage
  pdfUrl      String?
  pdfGeneratedAt DateTime?
  
  /// Delivery tracking
  sentVia     MessageChannel[]
  sentAt      DateTime?
  
  /// School association
  schoolId    String
  
  createdAt   DateTime  @default(now())
  
  @@unique([schoolId, receiptNo])
  @@index([schoolId])
  @@index([paymentId])
  @@map("receipts")
}

// ===========================================
// MESSAGING MODELS
// ===========================================

/// Message - SMS, WhatsApp, or Email sent to guardians
model Message {
  id          String        @id @default(cuid())
  
  /// Message type
  type        MessageType
  channel     MessageChannel
  
  /// Recipient
  guardianId  String?
  guardian    Guardian?     @relation(fields: [guardianId], references: [id])
  
  /// Or direct phone/email if guardian not in system
  recipientPhone String?
  recipientEmail String?
  
  /// Related invoice (optional)
  invoiceId   String?
  invoice     Invoice?      @relation(fields: [invoiceId], references: [id])
  
  /// Content
  subject     String?       /// For email
  content     String        @db.Text
  
  /// Template used
  templateId  String?
  
  /// Status
  status      MessageStatus @default(QUEUED)
  
  /// Provider tracking
  providerRef String?       /// Message ID from SMS/Email provider
  providerStatus String?
  providerResponse Json?
  
  /// Timestamps
  scheduledFor DateTime?
  sentAt       DateTime?
  deliveredAt  DateTime?
  failedAt     DateTime?
  
  /// Failure info
  failureReason String?
  retryCount   Int          @default(0)
  
  /// Cost tracking (for SMS)
  cost        Int?          /// In pesewas
  
  /// School association
  schoolId    String
  school      School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@index([schoolId])
  @@index([guardianId])
  @@index([invoiceId])
  @@index([status])
  @@index([type])
  @@index([channel])
  @@map("messages")
}

/// Message template
model MessageTemplate {
  id          String         @id @default(cuid())
  
  name        String
  type        MessageType
  channel     MessageChannel
  
  /// Content with placeholders: {{studentName}}, {{amount}}, etc.
  subject     String?        /// For email
  content     String         @db.Text
  
  /// Language
  language    String         @default("en") /// en, tw (Twi)
  
  /// Is this the default template for this type/channel?
  isDefault   Boolean        @default(false)
  
  /// Is this a system template (cannot be deleted)?
  isSystem    Boolean        @default(false)
  
  /// School association (null = system template)
  schoolId    String?
  school      School?        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  @@unique([schoolId, type, channel, language, isDefault])
  @@index([schoolId])
  @@index([type])
  @@index([channel])
  @@map("message_templates")
}

// ===========================================
// AUDIT & LOGGING
// ===========================================

/// Audit log - Track all significant actions
model AuditLog {
  id          String      @id @default(cuid())
  
  /// Who performed the action
  userId      String?
  user        User?       @relation(fields: [userId], references: [id])
  
  /// What action was performed
  action      AuditAction
  
  /// What entity was affected
  entityType  String      /// user, student, invoice, payment, etc.
  entityId    String?     /// ID of the affected entity
  
  /// Details of the change
  description String
  oldValues   Json?       /// Previous values (for updates)
  newValues   Json?       /// New values (for updates)
  metadata    Json?       /// Additional context
  
  /// Request info
  ipAddress   String?
  userAgent   String?
  requestId   String?
  
  /// School association
  schoolId    String
  school      School      @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime    @default(now())
  
  @@index([schoolId])
  @@index([userId])
  @@index([action])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
Database Indexes Explained
Indexes speed up queries but use extra storage. We add indexes for:

Foreign Keys: Always indexed for JOIN operations
Frequently Queried Fields: status, dueDate, etc.
Search Fields: names, phone numbers
Unique Constraints: Automatically indexed
Common PostgreSQL Commands
SQL

-- Connect to database
psql -U postgres -d school_fees_db

-- List all tables
\dt

-- Describe a table
\d students

-- Basic queries
SELECT * FROM students WHERE status = 'ACTIVE' LIMIT 10;

-- Count records
SELECT COUNT(*) FROM invoices WHERE status = 'OVERDUE';

-- Join example
SELECT s.first_name, s.last_name, i.total_amount, i.balance
FROM students s
JOIN invoices i ON s.id = i.student_id
WHERE i.status = 'OVERDUE';

-- Aggregate example
SELECT class_id, COUNT(*) as student_count
FROM students
WHERE status = 'ACTIVE'
GROUP BY class_id;
API Design
RESTful Conventions
HTTP Method	Usage	Example
GET	Read data	GET /students - List students
POST	Create new	POST /students - Create student
PATCH	Partial update	PATCH /students/:id - Update fields
PUT	Full replace	PUT /students/:id - Replace student
DELETE	Remove	DELETE /students/:id - Delete student
URL Structure
text

Base URL: /api/v1

Resources:
  /auth                    - Authentication
  /users                   - User management
  /schools                 - School settings
  /students                - Students
  /guardians               - Guardians
  /classes                 - Classes
  /terms                   - Academic terms
  /fees                    - Fee items
  /invoices                - Invoices/Bills
  /payments                - Payments
  /receipts                - Receipts
  /messages                - Messages
  /reports                 - Reports
  /dashboard               - Dashboard data
  /audit-logs              - Audit logs
  /health                  - Health check
Response Format
All responses follow a consistent format:

TypeScript

// Success response
{
  "success": true,
  "data": { ... },           // Single object or array
  "message": "Optional message"
}

// Paginated response
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 100,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required", "Invalid email format"],
      "phone": ["Invalid phone number"]
    }
  }
}
API Routes Definition
TypeScript

// src/routes/index.ts

import { Router } from 'express';
import { authRoutes } from '@/modules/auth/auth.routes';
import { usersRoutes } from '@/modules/users/users.routes';
import { schoolsRoutes } from '@/modules/schools/schools.routes';
import { studentsRoutes } from '@/modules/students/students.routes';
import { guardiansRoutes } from '@/modules/guardians/guardians.routes';
import { classesRoutes } from '@/modules/classes/classes.routes';
import { termsRoutes } from '@/modules/terms/terms.routes';
import { feesRoutes } from '@/modules/fees/fees.routes';
import { invoicesRoutes } from '@/modules/invoices/invoices.routes';
import { paymentsRoutes } from '@/modules/payments/payments.routes';
import { receiptsRoutes } from '@/modules/receipts/receipts.routes';
import { messagesRoutes } from '@/modules/messages/messages.routes';
import { reportsRoutes } from '@/modules/reports/reports.routes';
import { dashboardRoutes } from '@/modules/dashboard/dashboard.routes';
import { auditRoutes } from '@/modules/audit/audit.routes';
import { healthRoutes } from '@/modules/health/health.routes';

const router = Router();

// Public routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/users', usersRoutes);
router.use('/schools', schoolsRoutes);
router.use('/students', studentsRoutes);
router.use('/guardians', guardiansRoutes);
router.use('/classes', classesRoutes);
router.use('/terms', termsRoutes);
router.use('/fees', feesRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/payments', paymentsRoutes);
router.use('/receipts', receiptsRoutes);
router.use('/messages', messagesRoutes);
router.use('/reports', reportsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit-logs', auditRoutes);

export { router as apiRoutes };
Authentication & Authorization
Authentication Flow
text

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Login   │────▶│ Validate │────▶│  Generate│
│          │     │ Request  │     │ Creds/OTP│     │  Tokens  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Access  │◀────│  Return  │◀────│  Store   │◀────│ Access + │
│  API     │     │  Tokens  │     │ Refresh  │     │ Refresh  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
JWT Strategy
TypeScript

// src/modules/auth/strategies/jwt.strategy.ts

import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { UnauthorizedError } from '@/shared/errors';
import { prisma } from '@/core/database/prisma.client';

export interface JwtPayload {
  sub: string;        // User ID
  email: string;
  role: string;
  schoolId: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  schoolId: string;
  school: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Extract JWT from Authorization header
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return null;
  
  const [type, token] = authHeader.split(' ');
  
  if (type !== 'Bearer' || !token) return null;
  
  return token;
}

/**
 * Verify and decode JWT access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, config.auth.accessSecret) as JwtPayload;
    
    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw error;
  }
}

/**
 * Verify and decode JWT refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, config.auth.refreshSecret) as JwtPayload;
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Generate access token
 */
export function generateAccessToken(user: AuthenticatedUser): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
    schoolId: user.schoolId,
    type: 'access',
  };
  
  return jwt.sign(payload, config.auth.accessSecret, {
    expiresIn: config.auth.accessExpiration,
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(user: AuthenticatedUser): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
    schoolId: user.schoolId,
    type: 'refresh',
  };
  
  return jwt.sign(payload, config.auth.refreshSecret, {
    expiresIn: config.auth.refreshExpiration,
  });
}

/**
 * Get user from JWT payload
 */
export async function getUserFromPayload(payload: JwtPayload): Promise<AuthenticatedUser> {
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
  
  if (!user || user.status !== 'ACTIVE') {
    throw new UnauthorizedError('User not found or inactive');
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    schoolId: user.schoolId,
    school: user.school,
  };
}
Auth Middleware
TypeScript

// src/shared/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import {
  extractToken,
  verifyAccessToken,
  getUserFromPayload,
  AuthenticatedUser,
} from '@/modules/auth/strategies/jwt.strategy';
import { UnauthorizedError } from '@/shared/errors';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      schoolId?: string;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }
    
    const payload = verifyAccessToken(token);
    const user = await getUserFromPayload(payload);
    
    // Attach user and schoolId to request
    req.user = user;
    req.schoolId = user.schoolId;
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth - doesn't fail if no token, but attaches user if valid
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    
    if (token) {
      const payload = verifyAccessToken(token);
      const user = await getUserFromPayload(payload);
      req.user = user;
      req.schoolId = user.schoolId;
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}
Roles Guard
TypeScript

// src/shared/guards/roles.guard.ts

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/shared/errors';
import { UserRole } from '@prisma/client';

/**
 * Create a guard that checks if user has required role(s)
 */
export function requireRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const userRole = req.user.role as UserRole;
      
      if (!roles.includes(userRole)) {
        throw new ForbiddenError(
          `This action requires one of the following roles: ${roles.join(', ')}`
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require OWNER role
 */
export const requireOwner = requireRoles('OWNER');

/**
 * Require OWNER or ADMIN role
 */
export const requireAdmin = requireRoles('OWNER', 'ADMIN');

/**
 * Require OWNER, ADMIN, or FINANCE role
 */
export const requireFinance = requireRoles('OWNER', 'ADMIN', 'FINANCE');

/**
 * Allow all authenticated users
 */
export const requireAuth = requireRoles('OWNER', 'ADMIN', 'FINANCE', 'STAFF');
Auth Service
TypeScript

// src/modules/auth/auth.service.ts

import bcrypt from 'bcrypt';
import { prisma } from '@/core/database/prisma.client';
import { config } from '@/config';
import { cacheService } from '@/core/cache/cache.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getUserFromPayload,
  AuthenticatedUser,
} from './strategies/jwt.strategy';
import {
  LoginDto,
  RequestOtpDto,
  VerifyOtpDto,
  RefreshTokenDto,
  AuthResponse,
} from './auth.dto';
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '@/shared/errors';
import { generateOtp } from '@/utils/generators/otp.generator';
import { smsService } from '@/integrations/sms/sms.factory';
import { emailService } from '@/integrations/email/email.service';
import { auditService } from '@/modules/audit/audit.service';

class AuthService {
  /**
   * Login with email and password
   */
  async login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponse> {
    const { email, password } = dto;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        school: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
    
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Your account is not active. Please contact support.');
    }
    
    if (!user.password) {
      throw new BadRequestError('Please use OTP login for this account');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // Generate tokens
    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
    };
    
    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);
    
    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken, ipAddress, userAgent);
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });
    
    // Audit log
    await auditService.log({
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      description: `User logged in via password`,
      userId: user.id,
      schoolId: user.schoolId,
      ipAddress,
      userAgent,
    });
    
    return {
      user: authUser,
      accessToken,
      refreshToken,
      expiresIn: config.auth.accessExpirationSeconds,
    };
  }

  /**
   * Request OTP for passwordless login
   */
  async requestOtp(dto: RequestOtpDto): Promise<{ message: string }> {
    const { email, phone } = dto;
    const identifier = email || phone;
    
    if (!identifier) {
      throw new BadRequestError('Email or phone is required');
    }
    
    // Find user
    const whereClause = email
      ? { email: email.toLowerCase() }
      : { phone };
    
    const user = await prisma.user.findFirst({
      where: whereClause,
    });
    
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If an account exists, you will receive an OTP' };
    }
    
    if (user.status !== 'ACTIVE') {
      return { message: 'If an account exists, you will receive an OTP' };
    }
    
    // Check rate limit (max 3 OTPs per 10 minutes)
    const rateLimitKey = `otp_rate:${identifier}`;
    const attempts = await cacheService.get<number>(rateLimitKey) || 0;
    
    if (attempts >= 3) {
      throw new BadRequestError('Too many OTP requests. Please try again later.');
    }
    
    // Generate OTP
    const otp = generateOtp(config.auth.otpLength);
    const expiresAt = new Date(Date.now() + config.auth.otpExpirationMs);
    
    // Store OTP
    await prisma.otp.create({
      data: {
        identifier: identifier.toLowerCase(),
        code: otp,
        type: 'login',
        expiresAt,
      },
    });
    
    // Update rate limit
    await cacheService.set(rateLimitKey, attempts + 1, 600); // 10 minutes
    
    // Send OTP
    if (email) {
      await emailService.sendOtp(email, otp);
    } else if (phone) {
      await smsService.sendOtp(phone, otp);
    }
    
    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress: string,
    userAgent: string
  ): Promise<AuthResponse> {
    const { email, phone, otp } = dto;
    const identifier = (email || phone)?.toLowerCase();
    
    if (!identifier) {
      throw new BadRequestError('Email or phone is required');
    }
    
    // Find OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        identifier,
        code: otp,
        type: 'login',
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!otpRecord) {
      // Increment attempts for the most recent OTP
      await prisma.otp.updateMany({
        where: {
          identifier,
          type: 'login',
          usedAt: null,
        },
        data: {
          attempts: { increment: 1 },
        },
      });
      
      throw new UnauthorizedError('Invalid or expired OTP');
    }
    
    // Check max attempts
    if (otpRecord.attempts >= 3) {
      throw new UnauthorizedError('Too many failed attempts. Please request a new OTP.');
    }
    
    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    });
    
    // Find user
    const whereClause = email
      ? { email: email.toLowerCase() }
      : { phone };
    
    const user = await prisma.user.findFirst({
      where: whereClause,
      include: {
        school: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
    
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User not found or inactive');
    }
    
    // Generate tokens
    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,





