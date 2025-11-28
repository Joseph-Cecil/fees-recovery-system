# School Fee Recovery System - Frontend

> Admin dashboard and payment portal for Ghanaian school fee collection and arrears recovery.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Fetch Service](#fetch-service)
8. [Data Access Layer (DAL)](#data-access-layer-dal)
9. [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
10. [Mutations](#mutations)
11. [Queries](#queries)
12. [Permissions System](#permissions-system)
13. [Authentication](#authentication)
14. [State Management](#state-management)
15. [UI Components](#ui-components)
16. [Pages and Routes](#pages-and-routes)
17. [Forms and Validation](#forms-and-validation)
18. [Error Handling](#error-handling)
19. [Testing](#testing)
20. [Code Style and Conventions](#code-style-and-conventions)
21. [Deployment](#deployment)

---

## Overview

This is the frontend application for the School Fee Recovery System, consisting of:

1. **Admin Dashboard** - For school staff to manage students, billing, payments, and communications
2. **Payment Portal** - Public-facing pages for parents to view invoices and make payments
3. **Receipt Viewer** - Public pages for viewing and downloading payment receipts

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Next.js 14+ (App Router) | React framework with SSR/SSG |
| Language | TypeScript 5+ | Type safety |
| Styling | Tailwind CSS 3+ | Utility-first CSS |
| Components | shadcn/ui | Accessible component library |
| Forms | React Hook Form + Zod | Form handling and validation |
| State | Zustand | Client state management |
| Server State | TanStack Query v5 | API state, caching, mutations |
| Tables | TanStack Table v8 | Data tables with sorting, filtering |
| Charts | Recharts | Dashboard visualizations |
| Icons | Lucide React | Icon library |
| Dates | date-fns | Date manipulation |
| HTTP Client | Custom Fetch Service | API requests (no external deps) |
| Auth | NextAuth.js v5 | Authentication |
| Testing | Vitest + Testing Library | Unit and integration tests |
| E2E Testing | Playwright | End-to-end tests |

---

## Project Structure
frontend/
├── public/
│ ├── images/
│ │ └── logo-placeholder.svg
│ └── fonts/
│
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Auth route group (no layout)
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── verify-otp/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (dashboard)/ # Protected dashboard routes
│ │ │ ├── layout.tsx # Dashboard layout with sidebar
│ │ │ ├── page.tsx # Dashboard home
│ │ │ ├── students/
│ │ │ │ ├── page.tsx # Students list
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx # Student detail
│ │ │ │ ├── import/
│ │ │ │ │ └── page.tsx # CSV import
│ │ │ │ └── new/
│ │ │ │ └── page.tsx # Add student
│ │ │ ├── guardians/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx
│ │ │ ├── classes/
│ │ │ │ └── page.tsx
│ │ │ ├── fees/
│ │ │ │ ├── page.tsx # Fee items list
│ │ │ │ ├── configure/
│ │ │ │ │ └── page.tsx # Fee configuration
│ │ │ │ └── discounts/
│ │ │ │ └── page.tsx
│ │ │ ├── billing/
│ │ │ │ ├── page.tsx # Invoices list
│ │ │ │ ├── generate/
│ │ │ │ │ └── page.tsx # Generate bills
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx # Invoice detail
│ │ │ ├── payments/
│ │ │ │ ├── page.tsx # Payments list
│ │ │ │ ├── manual/
│ │ │ │ │ └── page.tsx # Record manual payment
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx # Payment detail
│ │ │ ├── arrears/
│ │ │ │ └── page.tsx # Defaulters list
│ │ │ ├── messaging/
│ │ │ │ ├── page.tsx # Message center
│ │ │ │ ├── templates/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── history/
│ │ │ │ └── page.tsx
│ │ │ ├── reports/
│ │ │ │ ├── page.tsx # Reports overview
│ │ │ │ ├── collections/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── arrears/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── export/
│ │ │ │ └── page.tsx
│ │ │ ├── settings/
│ │ │ │ ├── page.tsx # General settings
│ │ │ │ ├── school/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── users/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── terms/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── notifications/
│ │ │ │ └── page.tsx
│ │ │ └── audit-log/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (public)/ # Public routes (no auth)
│ │ │ ├── pay/
│ │ │ │ └── [paylink]/
│ │ │ │ └── page.tsx # Payment page
│ │ │ └── receipt/
│ │ │ └── [id]/
│ │ │ └── page.tsx # Receipt viewer
│ │ │
│ │ ├── api/ # API routes (if needed)
│ │ │ └── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts
│ │ │
│ │ ├── layout.tsx # Root layout
│ │ ├── loading.tsx # Global loading
│ │ ├── error.tsx # Global error
│ │ ├── not-found.tsx # 404 page
│ │ └── globals.css # Global styles
│ │
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ │ ├── button.tsx
│ │ │ ├── input.tsx
│ │ │ ├── select.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── table.tsx
│ │ │ ├── card.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── toast.tsx
│ │ │ ├── skeleton.tsx
│ │ │ ├── alert.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── form.tsx
│ │ │ ├── label.tsx
│ │ │ ├── checkbox.tsx
│ │ │ ├── radio-group.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── textarea.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── calendar.tsx
│ │ │ ├── date-picker.tsx
│ │ │ ├── command.tsx
│ │ │ ├── combobox.tsx
│ │ │ ├── sheet.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── progress.tsx
│ │ │ └── spinner.tsx
│ │ │
│ │ ├── layout/ # Layout components
│ │ │ ├── sidebar.tsx
│ │ │ ├── header.tsx
│ │ │ ├── footer.tsx
│ │ │ ├── nav-item.tsx
│ │ │ ├── user-menu.tsx
│ │ │ ├── breadcrumbs.tsx
│ │ │ ├── page-header.tsx
│ │ │ └── mobile-nav.tsx
│ │ │
│ │ ├── forms/ # Form components
│ │ │ ├── student-form.tsx
│ │ │ ├── guardian-form.tsx
│ │ │ ├── fee-item-form.tsx
│ │ │ ├── invoice-form.tsx
│ │ │ ├── manual-payment-form.tsx
│ │ │ ├── message-form.tsx
│ │ │ ├── school-settings-form.tsx
│ │ │ ├── user-form.tsx
│ │ │ └── csv-import-form.tsx
│ │ │
│ │ ├── tables/ # Table components
│ │ │ ├── students-table.tsx
│ │ │ ├── guardians-table.tsx
│ │ │ ├── invoices-table.tsx
│ │ │ ├── payments-table.tsx
│ │ │ ├── arrears-table.tsx
│ │ │ ├── messages-table.tsx
│ │ │ ├── audit-log-table.tsx
│ │ │ ├── data-table.tsx # Generic data table
│ │ │ ├── data-table-pagination.tsx
│ │ │ ├── data-table-toolbar.tsx
│ │ │ └── data-table-column-header.tsx
│ │ │
│ │ ├── cards/ # Card components
│ │ │ ├── stat-card.tsx
│ │ │ ├── student-card.tsx
│ │ │ ├── invoice-card.tsx
│ │ │ ├── payment-card.tsx
│ │ │ └── quick-action-card.tsx
│ │ │
│ │ ├── charts/ # Chart components
│ │ │ ├── collection-chart.tsx
│ │ │ ├── arrears-chart.tsx
│ │ │ ├── payment-methods-chart.tsx
│ │ │ └── trend-chart.tsx
│ │ │
│ │ ├── modals/ # Modal/Dialog components
│ │ │ ├── confirm-dialog.tsx
│ │ │ ├── send-message-modal.tsx
│ │ │ ├── payment-details-modal.tsx
│ │ │ ├── invoice-preview-modal.tsx
│ │ │ └── receipt-modal.tsx
│ │ │
│ │ ├── payment/ # Payment portal components
│ │ │ ├── invoice-summary.tsx
│ │ │ ├── payment-methods.tsx
│ │ │ ├── momo-payment.tsx
│ │ │ ├── card-payment.tsx
│ │ │ ├── payment-status.tsx
│ │ │ └── payment-success.tsx
│ │ │
│ │ └── shared/ # Shared components
│ │ ├── logo.tsx
│ │ ├── empty-state.tsx
│ │ ├── loading-state.tsx
│ │ ├── error-state.tsx
│ │ ├── search-input.tsx
│ │ ├── filter-dropdown.tsx
│ │ ├── date-range-picker.tsx
│ │ ├── file-upload.tsx
│ │ ├── phone-input.tsx
│ │ ├── currency-input.tsx
│ │ ├── currency-display.tsx
│ │ ├── status-badge.tsx
│ │ ├── copy-button.tsx
│ │ └── qr-code.tsx
│ │
│ ├── services/ # Core services
│ │ ├── fetch/ # Custom fetch service
│ │ │ ├── index.ts # Main exports
│ │ │ ├── fetch-client.ts # Core fetch client
│ │ │ ├── interceptors.ts # Request/response interceptors
│ │ │ ├── retry.ts # Retry logic
│ │ │ ├── cache.ts # Request caching
│ │ │ ├── types.ts # TypeScript types
│ │ │ └── errors.ts # Custom error classes
│ │ └── storage/ # Storage service
│ │ ├── index.ts
│ │ ├── local-storage.ts
│ │ └── session-storage.ts
│ │
│ ├── dal/ # Data Access Layer
│ │ ├── index.ts # DAL exports
│ │ ├── base.dal.ts # Base DAL class
│ │ ├── auth.dal.ts # Authentication operations
│ │ ├── students.dal.ts # Student CRUD operations
│ │ ├── guardians.dal.ts # Guardian operations
│ │ ├── classes.dal.ts # Class operations
│ │ ├── fees.dal.ts # Fee items operations
│ │ ├── invoices.dal.ts # Invoice operations
│ │ ├── payments.dal.ts # Payment operations
│ │ ├── messages.dal.ts # Messaging operations
│ │ ├── reports.dal.ts # Reports operations
│ │ ├── settings.dal.ts # Settings operations
│ │ ├── users.dal.ts # User management operations
│ │ └── audit.dal.ts # Audit log operations
│ │
│ ├── dto/ # Data Transfer Objects
│ │ ├── index.ts # DTO exports
│ │ ├── common.dto.ts # Common/shared DTOs
│ │ ├── auth.dto.ts # Auth request/response DTOs
│ │ ├── student.dto.ts # Student DTOs
│ │ ├── guardian.dto.ts # Guardian DTOs
│ │ ├── class.dto.ts # Class DTOs
│ │ ├── fee.dto.ts # Fee DTOs
│ │ ├── invoice.dto.ts # Invoice DTOs
│ │ ├── payment.dto.ts # Payment DTOs
│ │ ├── message.dto.ts # Message DTOs
│ │ ├── report.dto.ts # Report DTOs
│ │ ├── settings.dto.ts # Settings DTOs
│ │ ├── user.dto.ts # User DTOs
│ │ └── audit.dto.ts # Audit DTOs
│ │
│ ├── mutations/ # TanStack Query mutations
│ │ ├── index.ts # Mutations exports
│ │ ├── auth.mutations.ts # Auth mutations
│ │ ├── students.mutations.ts # Student mutations
│ │ ├── guardians.mutations.ts # Guardian mutations
│ │ ├── fees.mutations.ts # Fee mutations
│ │ ├── invoices.mutations.ts # Invoice mutations
│ │ ├── payments.mutations.ts # Payment mutations
│ │ ├── messages.mutations.ts # Message mutations
│ │ ├── settings.mutations.ts # Settings mutations
│ │ └── users.mutations.ts # User mutations
│ │
│ ├── queries/ # TanStack Query queries
│ │ ├── index.ts # Queries exports
│ │ ├── query-keys.ts # Centralized query keys
│ │ ├── students.queries.ts # Student queries
│ │ ├── guardians.queries.ts # Guardian queries
│ │ ├── classes.queries.ts # Class queries
│ │ ├── fees.queries.ts # Fee queries
│ │ ├── invoices.queries.ts # Invoice queries
│ │ ├── payments.queries.ts # Payment queries
│ │ ├── messages.queries.ts # Message queries
│ │ ├── reports.queries.ts # Report queries
│ │ ├── settings.queries.ts # Settings queries
│ │ ├── users.queries.ts # User queries
│ │ └── dashboard.queries.ts # Dashboard data queries
│ │
│ ├── permissions/ # Permissions system
│ │ ├── index.ts # Permissions exports
│ │ ├── permissions.ts # Permission definitions
│ │ ├── roles.ts # Role definitions
│ │ ├── abilities.ts # CASL ability definitions
│ │ ├── hooks/
│ │ │ ├── use-permissions.ts # Permission hook
│ │ │ ├── use-can.ts # Can do check hook
│ │ │ └── use-role.ts # Role check hook
│ │ ├── components/
│ │ │ ├── can.tsx # Permission gate component
│ │ │ ├── permission-guard.tsx # Route guard component
│ │ │ └── role-gate.tsx # Role-based gate
│ │ └── utils/
│ │ ├── check-permission.ts # Permission check utility
│ │ └── filter-by-permission.ts # Data filtering utility
│ │
│ ├── hooks/ # Custom hooks
│ │ ├── use-auth.ts # Authentication hook
│ │ ├── use-school.ts # Current school context
│ │ ├── use-user.ts # Current user hook
│ │ ├── use-toast.ts # Toast notifications
│ │ ├── use-debounce.ts # Debounce hook
│ │ ├── use-local-storage.ts # Local storage hook
│ │ ├── use-media-query.ts # Responsive hook
│ │ ├── use-pagination.ts # Pagination state hook
│ │ ├── use-filters.ts # Filter state hook
│ │ ├── use-csv-import.ts # CSV import hook
│ │ └── use-copy-to-clipboard.ts # Clipboard hook
│ │
│ ├── stores/ # Zustand stores
│ │ ├── auth.store.ts # Auth state
│ │ ├── ui.store.ts # UI state (sidebar, modals)
│ │ └── filters.store.ts # Global filter state
│ │
│ ├── lib/ # Utility libraries
│ │ ├── utils.ts # General utilities (cn, etc.)
│ │ ├── validations/ # Zod schemas
│ │ │ ├── student.schema.ts
│ │ │ ├── guardian.schema.ts
│ │ │ ├── fee.schema.ts
│ │ │ ├── invoice.schema.ts
│ │ │ ├── payment.schema.ts
│ │ │ ├── message.schema.ts
│ │ │ ├── settings.schema.ts
│ │ │ └── user.schema.ts
│ │ ├── formatters/ # Formatting utilities
│ │ │ ├── currency.ts # GHS formatting
│ │ │ ├── date.ts # Date formatting
│ │ │ ├── phone.ts # Ghana phone formatting
│ │ │ └── status.ts # Status formatting
│ │ ├── constants/ # App constants
│ │ │ ├── routes.ts # Route paths
│ │ │ ├── api-endpoints.ts # API endpoints
│ │ │ ├── query-keys.ts # Query key factory
│ │ │ ├── status.ts # Status enums
│ │ │ └── ghana.ts # Ghana-specific (regions, networks)
│ │ └── helpers/ # Helper functions
│ │ ├── csv-parser.ts
│ │ ├── phone-validator.ts
│ │ ├── receipt-generator.ts
│ │ └── export-helpers.ts
│ │
│ ├── types/ # TypeScript types
│ │ ├── index.ts # Type exports
│ │ ├── api.types.ts # API response types
│ │ ├── auth.types.ts # Auth types
│ │ ├── entities.types.ts # Entity types
│ │ └── ui.types.ts # UI-specific types
│ │
│ ├── config/ # Configuration
│ │ ├── site.ts # Site configuration
│ │ ├── navigation.ts # Navigation config
│ │ └── dashboard.ts # Dashboard config
│ │
│ └── providers/ # React providers
│ ├── query-provider.tsx # TanStack Query provider
│ ├── auth-provider.tsx # Auth provider
│ ├── theme-provider.tsx # Theme provider
│ └── toast-provider.tsx # Toast provider
│
├── .env.example # Environment variables template
├── .env.local # Local environment (git ignored)
├── .eslintrc.json # ESLint configuration
├── .prettierrc # Prettier configuration
├── .gitignore # Git ignore rules
├── components.json # shadcn/ui configuration
├── next.config.js # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── postcss.config.js # PostCSS configuration
├── vitest.config.ts # Vitest configuration
├── playwright.config.ts # Playwright configuration
├── package.json # Dependencies
└── README.md # This file

text


---

## Architecture Patterns

### Overview

This frontend follows a **layered architecture** with clear separation of concerns:
┌─────────────────────────────────────────────────────────────┐
│ UI Layer │
│ (Pages, Components, Forms) │
├─────────────────────────────────────────────────────────────┤
│ Permissions Layer │
│ (Access control, data filtering, UI gates) │
├─────────────────────────────────────────────────────────────┤
│ State Management Layer │
│ (TanStack Query, Zustand, React Context) │
├──────────────────────────┬──────────────────────────────────┤
│ Mutations Layer │ Queries Layer │
│ (Create, Update, Delete)│ (Read, List, Search) │
├──────────────────────────┴──────────────────────────────────┤
│ Data Access Layer (DAL) │
│ (API calls, request/response handling) │
├─────────────────────────────────────────────────────────────┤
│ Data Transfer Objects (DTOs) │
│ (Type definitions, transformations) │
├─────────────────────────────────────────────────────────────┤
│ Custom Fetch Service │
│ (HTTP client, interceptors, retry, caching) │
└─────────────────────────────────────────────────────────────┘

text


---

## Getting Started

### Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm 9+ or pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
# or
pnpm dev
Available Scripts
Bash

# Development
npm run dev           # Start development server (port 3000)

# Building
npm run build         # Build for production
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run typecheck     # Run TypeScript compiler check

# Testing
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run Playwright E2E tests

# Utilities
npm run analyze       # Analyze bundle size
Environment Variables
Bash

# .env.example

# ===========================================
# Application
# ===========================================
NEXT_PUBLIC_APP_NAME="School Fee Recovery System"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# API Configuration
# ===========================================
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_API_TIMEOUT="30000"

# ===========================================
# Authentication
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"

# ===========================================
# Feature Flags
# ===========================================
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_ENABLE_SENTRY="false"
NEXT_PUBLIC_ENABLE_REQUEST_LOGGING="true"

# ===========================================
# Third Party Services (Optional)
# ===========================================
NEXT_PUBLIC_SENTRY_DSN=""
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
Fetch Service
The custom fetch service is the foundation of all HTTP communication. It provides a type-safe, feature-rich HTTP client built on top of the native fetch API.

Features
✅ Full TypeScript support with generics
✅ Request/Response interceptors
✅ Automatic retry with exponential backoff
✅ Request timeout handling
✅ Request cancellation via AbortController
✅ Automatic JSON parsing
✅ Custom error classes with detailed info
✅ Request/Response logging (dev mode)
✅ Query parameter serialization
✅ File upload support
✅ Download support (blob responses)
✅ Request deduplication
✅ Offline detection
Type Definitions
TypeScript

// src/services/fetch/types.ts

/**
 * HTTP methods supported by the fetch client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration options
 */
export interface RequestConfig<TBody = unknown> {
  /** HTTP method */
  method?: HttpMethod;
  
  /** Request headers */
  headers?: Record<string, string>;
  
  /** Request body (will be JSON stringified unless FormData) */
  body?: TBody;
  
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined | null>;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Number of retry attempts for failed requests */
  retries?: number;
  
  /** Retry delay in milliseconds (will use exponential backoff) */
  retryDelay?: number;
  
  /** AbortController signal for request cancellation */
  signal?: AbortSignal;
  
  /** Skip the default error handling */
  skipErrorHandling?: boolean;
  
  /** Skip authentication header */
  skipAuth?: boolean;
  
  /** Custom cache key for request deduplication */
  cacheKey?: string;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  
  /** Credentials mode */
  credentials?: RequestCredentials;
  
  /** Custom fetch implementation (for testing) */
  fetch?: typeof fetch;
}

/**
 * Response wrapper with metadata
 */
export interface ApiResponse<TData> {
  /** Response data */
  data: TData;
  
  /** HTTP status code */
  status: number;
  
  /** Status text */
  statusText: string;
  
  /** Response headers */
  headers: Headers;
  
  /** Request duration in milliseconds */
  duration: number;
  
  /** Whether response was from cache */
  cached: boolean;
}

/**
 * Interceptor function types
 */
export type RequestInterceptor = (
  url: string,
  config: RequestConfig
) => Promise<{ url: string; config: RequestConfig }> | { url: string; config: RequestConfig };

export type ResponseInterceptor<T = unknown> = (
  response: ApiResponse<T>
) => Promise<ApiResponse<T>> | ApiResponse<T>;

export type ErrorInterceptor = (
  error: FetchError
) => Promise<FetchError> | FetchError;

/**
 * Fetch client configuration
 */
export interface FetchClientConfig {
  /** Base URL for all requests */
  baseUrl: string;
  
  /** Default timeout in milliseconds */
  timeout?: number;
  
  /** Default headers for all requests */
  defaultHeaders?: Record<string, string>;
  
  /** Default number of retries */
  retries?: number;
  
  /** Default retry delay */
  retryDelay?: number;
  
  /** Enable request logging */
  enableLogging?: boolean;
  
  /** Request interceptors */
  requestInterceptors?: RequestInterceptor[];
  
  /** Response interceptors */
  responseInterceptors?: ResponseInterceptor[];
  
  /** Error interceptors */
  errorInterceptors?: ErrorInterceptor[];
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * API Error response from backend
 */
export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
  stack?: string;
}
Custom Error Classes
TypeScript

// src/services/fetch/errors.ts

import { ApiErrorResponse } from './types';

/**
 * Base error class for all fetch-related errors
 */
export class FetchError extends Error {
  public readonly name = 'FetchError';
  public readonly timestamp: Date;
  
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: Record<string, string[]>,
    public readonly originalError?: Error
  ) {
    super(message);
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }
  
  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * Network error (no internet, DNS failure, etc.)
 */
export class NetworkError extends FetchError {
  public readonly name = 'NetworkError';
  
  constructor(message = 'Network error. Please check your internet connection.', originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, undefined, originalError);
  }
}

/**
 * Request timeout error
 */
export class TimeoutError extends FetchError {
  public readonly name = 'TimeoutError';
  
  constructor(timeout: number, originalError?: Error) {
    super(
      `Request timed out after ${timeout}ms`,
      'TIMEOUT_ERROR',
      undefined,
      undefined,
      originalError
    );
  }
}

/**
 * Request was aborted (cancelled)
 */
export class AbortError extends FetchError {
  public readonly name = 'AbortError';
  
  constructor(message = 'Request was cancelled', originalError?: Error) {
    super(message, 'ABORT_ERROR', undefined, undefined, originalError);
  }
}

/**
 * HTTP error (4xx, 5xx responses)
 */
export class HttpError extends FetchError {
  public readonly name = 'HttpError';
  
  constructor(
    message: string,
    code: string,
    public readonly status: number,
    public readonly statusText: string,
    details?: Record<string, string[]>,
    public readonly responseBody?: unknown
  ) {
    super(message, code, status, details);
  }
  
  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
  
  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends HttpError {
  public readonly name = 'UnauthorizedError';
  
  constructor(message = 'Unauthorized. Please log in again.', details?: Record<string, string[]>) {
    super(message, 'UNAUTHORIZED', 401, 'Unauthorized', details);
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends HttpError {
  public readonly name = 'ForbiddenError';
  
  constructor(message = 'You do not have permission to perform this action.', details?: Record<string, string[]>) {
    super(message, 'FORBIDDEN', 403, 'Forbidden', details);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends HttpError {
  public readonly name = 'NotFoundError';
  
  constructor(message = 'The requested resource was not found.', details?: Record<string, string[]>) {
    super(message, 'NOT_FOUND', 404, 'Not Found', details);
  }
}

/**
 * Validation error (422)
 */
export class ValidationError extends HttpError {
  public readonly name = 'ValidationError';
  
  constructor(
    message = 'Validation failed. Please check your input.',
    public readonly validationErrors: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 422, 'Unprocessable Entity', validationErrors);
  }
  
  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.validationErrors[field] || [];
  }
  
  /**
   * Check if a field has errors
   */
  hasFieldError(field: string): boolean {
    return this.getFieldErrors(field).length > 0;
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends HttpError {
  public readonly name = 'RateLimitError';
  
  constructor(
    message = 'Too many requests. Please try again later.',
    public readonly retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT', 429, 'Too Many Requests');
  }
}

/**
 * Server error (500)
 */
export class ServerError extends HttpError {
  public readonly name = 'ServerError';
  
  constructor(message = 'An unexpected server error occurred. Please try again later.') {
    super(message, 'SERVER_ERROR', 500, 'Internal Server Error');
  }
}

/**
 * Create appropriate error from HTTP response
 */
export function createHttpError(
  status: number,
  statusText: string,
  body?: ApiErrorResponse
): HttpError {
  const message = body?.message || statusText;
  const code = body?.code || 'HTTP_ERROR';
  const details = body?.details;
  
  switch (status) {
    case 401:
      return new UnauthorizedError(message, details);
    case 403:
      return new ForbiddenError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 422:
      return new ValidationError(message, details || {});
    case 429:
      return new RateLimitError(message);
    case 500:
      return new ServerError(message);
    default:
      return new HttpError(message, code, status, statusText, details, body);
  }
}

/**
 * Check if an error is a FetchError
 */
export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof HttpError) {
    // Retry on 5xx errors and 429 (rate limit)
    return error.status >= 500 || error.status === 429;
  }
  return false;
}
Retry Logic
TypeScript

// src/services/fetch/retry.ts

import { isRetryableError, RateLimitError } from './errors';

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  
  /** Base delay between retries in ms */
  baseDelay: number;
  
  /** Maximum delay between retries in ms */
  maxDelay: number;
  
  /** Jitter factor (0-1) to add randomness to delays */
  jitterFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  jitterFactor: 0.2,
};

/**
 * Calculate delay for a given retry attempt using exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  // Exponential backoff: delay = baseDelay * 2^attempt
  const exponentialDelay = config.baseDelay * Math.pow(2, attempt);
  
  // Cap at maxDelay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = cappedDelay * config.jitterFactor * Math.random();
  
  return Math.floor(cappedDelay + jitter);
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if it's not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't retry if we've exhausted attempts
      if (attempt >= retryConfig.maxRetries) {
        throw error;
      }
      
      // Handle rate limit with Retry-After header
      let delay: number;
      if (error instanceof RateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      } else {
        delay = calculateRetryDelay(attempt, retryConfig);
      }
      
      console.warn(
        `Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries})`,
        error
      );
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}
Request Cache
TypeScript

// src/services/fetch/cache.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Simple in-memory cache for request deduplication
 */
class RequestCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  
  /**
   * Get cached data if valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Get or set pending request (for deduplication)
   */
  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) as Promise<T> | null;
  }
  
  /**
   * Set pending request
   */
  setPendingRequest<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
    
    // Clean up when request completes
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }
  
  /**
   * Generate cache key from URL and params
   */
  static generateKey(url: string, params?: Record<string, unknown>): string {
    const sortedParams = params
      ? JSON.stringify(Object.keys(params).sort().reduce((acc, key) => {
          acc[key] = params[key];
          return acc;
        }, {} as Record<string, unknown>))
      : '';
    
    return `${url}:${sortedParams}`;
  }
}

export const requestCache = new RequestCache();

// Clear expired entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    requestCache.clearExpired();
  }, 60000); // Every minute
}
Interceptors
TypeScript

// src/services/fetch/interceptors.ts

import {
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  RequestConfig,
  ApiResponse,
} from './types';
import { FetchError, UnauthorizedError } from './errors';

/**
 * Auth interceptor - adds authorization header
 */
export const authRequestInterceptor: RequestInterceptor = (url, config) => {
  if (config.skipAuth) {
    return { url, config };
  }
  
  const token = getAuthToken();
  
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  return { url, config };
};

/**
 * Logging interceptor for requests
 */
export const loggingRequestInterceptor: RequestInterceptor = (url, config) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`🚀 [${config.method || 'GET'}] ${url}`, {
      headers: config.headers,
      body: config.body,
      params: config.params,
    });
  }
  
  return { url, config };
};

/**
 * Logging interceptor for responses
 */
export const loggingResponseInterceptor: ResponseInterceptor = (response) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`✅ [${response.status}] Response received in ${response.duration}ms`, {
      data: response.data,
      cached: response.cached,
    });
  }
  
  return response;
};

/**
 * Error logging interceptor
 */
export const loggingErrorInterceptor: ErrorInterceptor = (error) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.error(`❌ Request failed:`, error.toJSON());
  }
  
  return error;
};

/**
 * Auth error interceptor - handle 401 errors
 */
export const authErrorInterceptor: ErrorInterceptor = (error) => {
  if (error instanceof UnauthorizedError) {
    // Clear auth state
    clearAuthToken();
    
    // Redirect to login (only in browser)
    if (typeof window !== 'undefined') {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        window.location.href = '/login';
      }
    }
  }
  
  return error;
};

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Clear auth token from storage
 */
function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

/**
 * Create interceptor chain runner for requests
 */
export function runRequestInterceptors(
  interceptors: RequestInterceptor[],
  url: string,
  config: RequestConfig
): Promise<{ url: string; config: RequestConfig }> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result.url, result.config);
    },
    Promise.resolve({ url, config })
  );
}

/**
 * Create interceptor chain runner for responses
 */
export function runResponseInterceptors<T>(
  interceptors: ResponseInterceptor<T>[],
  response: ApiResponse<T>
): Promise<ApiResponse<T>> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result) as Promise<ApiResponse<T>>;
    },
    Promise.resolve(response)
  );
}

/**
 * Create interceptor chain runner for errors
 */
export function runErrorInterceptors(
  interceptors: ErrorInterceptor[],
  error: FetchError
): Promise<FetchError> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result);
    },
    Promise.resolve(error)
  );
}
Core Fetch Client
TypeScript

// src/services/fetch/fetch-client.ts

import {
  HttpMethod,
  RequestConfig,
  ApiResponse,
  FetchClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  ApiErrorResponse,
} from './types';
import {
  FetchError,
  NetworkError,
  TimeoutError,
  AbortError,
  createHttpError,
  isFetchError,
} from './errors';
import { withRetry, DEFAULT_RETRY_CONFIG } from './retry';
import { requestCache } from './cache';
import {
  authRequestInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
  loggingErrorInterceptor,
  authErrorInterceptor,
  runRequestInterceptors,
  runResponseInterceptors,
  runErrorInterceptors,
} from './interceptors';

/**
 * Custom Fetch Client
 * 
 * A fully-featured HTTP client built on top of the native fetch API.
 */
class FetchClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private enableLogging: boolean;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];
  private errorInterceptors: ErrorInterceptor[];

  constructor(config: FetchClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultRetries = config.retries ?? DEFAULT_RETRY_CONFIG.maxRetries;
    this.defaultRetryDelay = config.retryDelay ?? DEFAULT_RETRY_CONFIG.baseDelay;
    this.enableLogging = config.enableLogging ?? process.env.NODE_ENV === 'development';

    // Set up default interceptors
    this.requestInterceptors = [
      authRequestInterceptor,
      ...(this.enableLogging ? [loggingRequestInterceptor] : []),
      ...(config.requestInterceptors || []),
    ];

    this.responseInterceptors = [
      ...(this.enableLogging ? [loggingResponseInterceptor] : []),
      ...(config.responseInterceptors || []),
    ];

    this.errorInterceptors = [
      ...(this.enableLogging ? [loggingErrorInterceptor] : []),
      authErrorInterceptor,
      ...(config.errorInterceptors || []),
    ];
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(
    timeout: number,
    externalSignal?: AbortSignal
  ): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    
    // Link external signal if provided
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => {
        controller.abort();
      });
    }

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    return { controller, timeoutId };
  }

  /**
   * Prepare request body
   */
  private prepareBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) {
      return undefined;
    }

    if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
      return body as BodyInit;
    }

    return JSON.stringify(body);
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(
    response: Response,
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  ): Promise<T> {
    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    // Use explicit response type if provided
    if (responseType) {
      switch (responseType) {
        case 'json':
          return response.json();
        case 'text':
          return response.text() as Promise<T>;
        case 'blob':
          return response.blob() as Promise<T>;
        case 'arrayBuffer':
          return response.arrayBuffer() as Promise<T>;
        case 'formData':
          return response.formData() as Promise<T>;
      }
    }

    // Auto-detect based on content-type
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    if (contentType.includes('text/')) {
      return response.text() as Promise<T>;
    }

    // Default to JSON
    try {
      return await response.json();
    } catch {
      return response.text() as Promise<T>;
    }
  }

  /**
   * Core request method
   */
  private async request<TResponse, TBody = unknown>(
    endpoint: string,
    config: RequestConfig<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const startTime = Date.now();

    // Merge config with defaults
    const mergedConfig: RequestConfig<TBody> = {
      method: 'GET',
      timeout: this.defaultTimeout,
      retries: this.defaultRetries,
      retryDelay: this.defaultRetryDelay,
      credentials: 'include',
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };

    // Remove Content-Type for FormData (browser sets it with boundary)
    if (mergedConfig.body instanceof FormData) {
      delete mergedConfig.headers!['Content-Type'];
    }

    // Build URL
    let url = this.buildUrl(endpoint, mergedConfig.params);

    // Run request interceptors
    const interceptedRequest = await runRequestInterceptors(
      this.requestInterceptors,
      url,
      mergedConfig
    );
    url = interceptedRequest.url;
    const finalConfig = interceptedRequest.config;

    // Check cache for GET requests
    const cacheKey = finalConfig.cacheKey || requestCache.constructor.generateKey(url, finalConfig.params);
    if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
      const cached = requestCache.get<TResponse>(cacheKey);
      if (cached) {
        return {
          data: cached,
          status: 200,
          statusText: 'OK (Cached)',
          headers: new Headers(),
          duration: Date.now() - startTime,
          cached: true,
        };
      }

      // Check for pending request (deduplication)
      const pending = requestCache.getPendingRequest<ApiResponse<TResponse>>(cacheKey);
      if (pending) {
        return pending;
      }
    }

    // Create the actual request
    const executeRequest = async (): Promise<ApiResponse<TResponse>> => {
      const { controller, timeoutId } = this.createAbortController(
        finalConfig.timeout!,
        finalConfig.signal
      );

      try {
        const response = await fetch(url, {
          method: finalConfig.method,
          headers: finalConfig.headers,
          body: this.prepareBody(finalConfig.body),
          signal: controller.signal,
          credentials: finalConfig.credentials,
        });

        clearTimeout(timeoutId);

        // Handle error responses
        if (!response.ok) {
          let errorBody: ApiErrorResponse | undefined;
          try {
            errorBody = await response.json();
          } catch {
            // Response body is not JSON
          }

          const httpError = createHttpError(response.status, response.statusText, errorBody);
          const processedError = await runErrorInterceptors(this.errorInterceptors, httpError);
          throw processedError;
        }

        // Parse successful response
        const data = await this.parseResponse<TResponse>(response, finalConfig.responseType);
        const duration = Date.now() - startTime;

        let apiResponse: ApiResponse<TResponse> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          duration,
          cached: false,
        };

        // Run response interceptors
        apiResponse = await runResponseInterceptors(
          this.responseInterceptors as ResponseInterceptor<TResponse>[],
          apiResponse
        );

        // Cache GET responses if cacheTTL is set
        if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
          requestCache.set(cacheKey, apiResponse.data, finalConfig.cacheTTL);
        }

        return apiResponse;
      } catch (error) {
        clearTimeout(timeoutId);

        // Handle different error types
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            if (finalConfig.signal?.aborted) {
              throw new AbortError('Request was cancelled by user');
            }
            throw new TimeoutError(finalConfig.timeout!);
          }

          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new NetworkError(undefined, error);
          }

          if (isFetchError(error)) {
            throw error;
          }

          // Unknown error
          const fetchError = new FetchError(
            error.message || 'An unexpected error occurred',
            'UNKNOWN_ERROR',
            undefined,
            undefined,
            error
          );
          const processedError = await runErrorInterceptors(this.errorInterceptors, fetchError);
          throw processedError;
        }

        throw error;
      }
    };

    // Execute with retry logic
    const requestPromise = withRetry(executeRequest, {
      maxRetries: finalConfig.retries!,
      baseDelay: finalConfig.retryDelay!,
    });

    // Store pending request for deduplication
    if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
      requestCache.setPendingRequest(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  /**
   * GET request
   */
  async get<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file(s)
   */
  async upload<TResponse>(
    endpoint: string,
    files: File | File[] | FormData,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    let formData: FormData;

    if (files instanceof FormData) {
      formData = files;
    } else {
      formData = new FormData();
      const fileArray = Array.isArray(files) ? files : [files];
      fileArray.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    return this.request<TResponse, FormData>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Download file
   */
  async download(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'responseType'>
  ): Promise<Blob> {
    const response = await this.request<Blob>(endpoint, {
      ...config,
      method: 'GET',
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Invalidate cache for a URL pattern
   */
  invalidateCache(pattern?: string): void {
    if (pattern) {
      // Would need to implement pattern matching
      // For now, just clear all
      requestCache.clear();
    } else {
      requestCache.clear();
    }
  }
}

// Create and export singleton instance
export const fetchClient = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true',
});

// Export class for testing or creating additional instances
export { FetchClient };
Fetch Service Index
TypeScript

// src/services/fetch/index.ts

// Main client
export { fetchClient, FetchClient } from './fetch-client';

// Types
export type {
  HttpMethod,
  RequestConfig,
  ApiResponse,
  FetchClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  PaginationParams,
  ApiErrorResponse,
} from './types';

// Errors
export {
  FetchError,
  NetworkError,
  TimeoutError,
  AbortError,
  HttpError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  createHttpError,
  isFetchError,
  isRetryableError,
} from './errors';

// Retry
export { withRetry, calculateRetryDelay, sleep, DEFAULT_RETRY_CONFIG } from './retry';
export type { RetryConfig } from './retry';

// Cache
export { requestCache } from './cache';

// Interceptors
export {
  authRequestInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
  loggingErrorInterceptor,
  authErrorInterceptor,
} from './interceptors';
Data Access Layer (DAL)
The DAL is the single point of contact between the frontend and backend API. All API calls MUST go through the DAL.

Principles
Single Responsibility: Each DAL file handles one entity/domain
Consistent Interface: All DAL methods return Promises with typed responses
Error Handling: Errors bubble up with proper types for the UI to handle
No Business Logic: DAL only handles data fetching/sending, not business rules
Uses Fetch Service: All HTTP calls go through the custom fetch service
Base DAL Class
TypeScript

// src/dal/base.dal.ts

import { fetchClient, ApiResponse, RequestConfig, ValidationError } from '@/services/fetch';
import { PaginatedResponse, PaginationMeta } from '@/dto/common.dto';

/**
 * Base DAL class with common functionality
 */
export abstract class BaseDAL {
  protected readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }

  /**
   * Build endpoint path with optional ID
   */
  protected path(id?: string, suffix?: string): string {
    let path = this.endpoint;
    if (id) path += `/${id}`;
    if (suffix) path += `/${suffix}`;
    return path;
  }

  /**
   * GET request helper
   */
  protected async get<T>(
    path: string,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<T> {
    const response = await fetchClient.get<T>(path, config);
    return response.data;
  }

  /**
   * POST request helper
   */
  protected async post<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.post<T, B>(path, body, config);
    return response.data;
  }

  /**
   * PATCH request helper
   */
  protected async patch<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.patch<T, B>(path, body, config);
    return response.data;
  }

  /**
   * PUT request helper
   */
  protected async put<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.put<T, B>(path, body, config);
    return response.data;
  }

  /**
   * DELETE request helper
   */
  protected async delete<T = void>(
    path: string,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<T> {
    const response = await fetchClient.delete<T>(path, config);
    return response.data;
  }

  /**
   * Handle paginated response transformation
   */
  protected toPaginatedResponse<T>(
    response: { data: T[]; pagination: PaginationMeta } | { items: T[]; meta: PaginationMeta }
  ): PaginatedResponse<T> {
    if ('data' in response) {
      return {
        data: response.data,
        pagination: response.pagination,
      };
    }
    return {
      data: response.items,
      pagination: response.meta,
    };
  }
}
Students DAL
TypeScript

// src/dal/students.dal.ts

import { BaseDAL } from './base.dal';
import { fetchClient } from '@/services/fetch';
import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentFilters,
  ImportStudentsRequest,
  ImportStudentsResponse,
  BulkPromoteRequest,
} from '@/dto/student.dto';
import { PaginatedResponse, PaginationParams } from '@/dto/common.dto';

class StudentsDAL extends BaseDAL {
  constructor() {
    super('/students');
  }

  /**
   * Get paginated list of students with optional filters
   */
  async list(
    params: PaginationParams & StudentFilters = {}
  ): Promise<PaginatedResponse<Student>> {
    const response = await this.get<{
      students: Student[];
      pagination: import('@/dto/common.dto').PaginationMeta;
    }>(this.path(), {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        class: params.class,
        status: params.status,
        sortBy: params.sortBy || 'lastName',
        sortOrder: params.sortOrder || 'asc',
        hasArrears: params.hasArrears,
        siblingGroupId: params.siblingGroupId,
      },
      // Cache student list for 30 seconds
      cacheTTL: 30000,
    });

    return {
      data: response.students,
      pagination: response.pagination,
    };
  }

  /**
   * Get single student by ID
   */
  async getById(id: string): Promise<Student> {
    const response = await this.get<{ student: Student }>(this.path(id), {
      cacheTTL: 60000, // Cache for 1 minute
    });
    return response.student;
  }

  /**
   * Create new student
   */
  async create(data: CreateStudentRequest): Promise<Student> {
    const response = await this.post<{ student: Student }, CreateStudentRequest>(
      this.path(),
      data
    );
    // Invalidate list cache
    fetchClient.invalidateCache();
    return response.student;
  }

  /**
   * Update student
   */
  async update(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await this.patch<{ student: Student }, UpdateStudentRequest>(
      this.path(id),
      data
    );
    // Invalidate cache
    fetchClient.invalidateCache();
    return response.student;
  }

  /**
   * Delete student (soft delete - changes status)
   */
  async delete(id: string): Promise<void> {
    await this.delete(this.path(id));
    fetchClient.invalidateCache();
  }

  /**
   * Import students from CSV
   */
  async import(data: ImportStudentsRequest): Promise<ImportStudentsResponse> {
    const response = await this.post<ImportStudentsResponse, ImportStudentsRequest>(
      this.path(undefined, 'import'),
      data
    );
    fetchClient.invalidateCache();
    return response;
  }

  /**
   * Bulk promote students to next class
   */
  async bulkPromote(data: BulkPromoteRequest): Promise<{ count: number }> {
    const response = await this.post<{ count: number }, BulkPromoteRequest>(
      this.path(undefined, 'promote'),
      data
    );
    fetchClient.invalidateCache();
    return response;
  }

  /**
   * Get students by family/sibling group
   */
  async getByFamily(siblingGroupId: string): Promise<Student[]> {
    const response = await this.get<{ students: Student[] }>(
      this.path(undefined, `family/${siblingGroupId}`),
      { cacheTTL: 60000 }
    );
    return response.students;
  }

  /**
   * Search students (quick search endpoint)
   */
  async search(query: string, limit = 10): Promise<Student[]> {
    const response = await this.get<{ students: Student[] }>(
      this.path(undefined, 'search'),
      {
        params: { q: query, limit },
        cacheTTL: 10000, // Short cache for search
      }
    );
    return response.students;
  }

  /**
   * Export students to CSV
   */
  async export(filters: StudentFilters = {}): Promise<Blob> {
    return fetchClient.download(this.path(undefined, 'export'), {
      params: filters as Record<string, string>,
    });
  }
}

// Export singleton instance
export const studentsDAL = new StudentsDAL();
Invoices DAL
TypeScript

// src/dal/invoices.dal.ts

import { BaseDAL } from './base.dal';
import { fetchClient } from '@/services/fetch';
import {
  Invoice,
  InvoiceDetail,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  GenerateBillsRequest,
  GenerateBillsResponse,
  InvoiceFilters,
  InvoiceStats,
} from '@/dto/invoice.dto';
import { PaginatedResponse, PaginationParams } from '@/dto/common.dto';

class InvoicesDAL extends BaseDAL {
  constructor() {
    super('/invoices');
  }

  /**
   * Get paginated list of invoices
   */
  async list(
    params: PaginationParams & InvoiceFilters = {}
  ): Promise<PaginatedResponse<Invoice>> {
    const response = await this.get<{
      invoices: Invoice[];
      pagination: import('@/dto/common.dto').PaginationMeta;
    }>(this.path(), {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        class: params.class,
        termId: params.termId,
        status: Array.isArray(params.status) ? params.status.join(',') : params.status,
        startDate: params.startDate,
        endDate: params.endDate,
        minBalance: params.minBalance,
        maxBalance: params.maxBalance,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      },
      cacheTTL: 15000, // Cache for 15 seconds
    });

    return {
      data: response.invoices,
      pagination: response.pagination,
    };
  }

  /**
   * Get invoice details including items and payments
   */
  async getById(id: string): Promise<InvoiceDetail> {
    const response = await this.get<{ invoice: InvoiceDetail }>(this.path(id), {
      cacheTTL: 30000,
    });
    return response.invoice;
  }

  /**
   * Get invoice by paylink ID (for payment portal - no auth required)
   */
  async getByPaylink(paylinkId: string): Promise<InvoiceDetail> {
    const response = await this.get<{ invoice: InvoiceDetail }>(
      this.path(undefined, `paylink/${paylinkId}`),
      { skipAuth: true }
    );
    return response.invoice;
  }

  /**
   * Generate bills for multiple students
   */
  async generateBills(data: GenerateBillsRequest): Promise<GenerateBillsResponse> {
    const response = await this.post<GenerateBillsResponse, GenerateBillsRequest>(
      this.path(undefined, 'generate'),
      data
    );
    fetchClient.invalidate