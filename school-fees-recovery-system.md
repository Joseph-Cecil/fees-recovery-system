# THE SCHOOL FEE RECOVERY SYSTEM

> WhatsApp-first, MoMo-native fee collection and arrears recovery for Ghanaian schools.  
> Fast setup. Clean receipts. Fewer phone calls chasing parents.

---

## Table of Contents

1. [Overview](#overview)
2. [Target Market](#target-market)
3. [Core Value Proposition](#core-value-proposition)
4. [Must-Have Features (Sales-Ready v1)](#must-have-features-sales-ready-v1)
5. [Future Features Roadmap](#future-features-roadmap)
6. [System Architecture](#system-architecture)
7. [Data Models](#data-models)
8. [Third-Party Integrations](#third-party-integrations)
9. [Security Recommendations](#security-recommendations)
10. [Compliance (Ghana-Specific)](#compliance-ghana-specific)
11. [API Reference](#api-reference)
12. [Message Templates](#message-templates)
13. [Receipt Specifications](#receipt-specifications)
14. [Environment Variables](#environment-variables)
15. [Local Development Setup](#local-development-setup)
16. [Deployment Guide](#deployment-guide)
17. [Testing Strategy](#testing-strategy)
18. [Operational Playbooks](#operational-playbooks)
19. [Metrics and KPIs](#metrics-and-kpis)
20. [Pricing Strategy](#pricing-strategy)
21. [Sales and Onboarding](#sales-and-onboarding)
22. [Anti-Goals for v1](#anti-goals-for-v1)
23. [FAQ](#faq)
24. [Glossary](#glossary)
25. [License](#license)
26. [Contributing](#contributing)
27. [Changelog](#changelog)

---

## Overview

The School Fee Recovery System is a lightweight web application designed specifically for Ghanaian private schools to:

- **Bill students** by class/term with flexible fee structures
- **Collect payments** via MoMo, GhQR, and cards through secure paylinks
- **Automate reminders** on WhatsApp/SMS until fees are paid
- **Track arrears** in real-time with actionable defaulters lists
- **Generate receipts** instantly and maintain clean financial records

### Why This Exists

Ghanaian private schools lose significant revenue to:
- Forgotten or delayed fee payments
- Manual tracking errors
- Time-consuming phone calls and visits to chase parents
- Lost or disputed receipts
- Poor visibility into arrears

This system solves these problems with a WhatsApp-first, MoMo-native approach that meets parents where they are.

---

## Target Market

### Primary Customers

| Segment | Size | Characteristics |
|---------|------|-----------------|
| Private Basic Schools | KG–JHS | 100–800 students, 1–3 admin staff |
| Private SHS | 200–1500 students | More structured, higher fees |
| International Schools | 50–500 students | Premium, card payments common |
| Remedial/Tutorial Centers | 20–200 students | Term-based or monthly billing |
| Vocational Institutes | 50–400 students | Program-based fees |

### Key Users

| Role | Responsibilities | Key Needs |
|------|------------------|-----------|
| Proprietor/Owner | Oversight, decisions | Real-time collection stats, arrears visibility |
| Bursar/Accountant | Billing, reconciliation | Easy imports, exports, payment tracking |
| Admin Staff | Data entry, parent comms | Simple UI, bulk messaging |
| Parents/Guardians | Pay fees | Easy MoMo payment, instant receipts |

### Geographic Focus

- **Phase 1**: Greater Accra, Kumasi, Takoradi
- **Phase 2**: Cape Coast, Tamale, Koforidua, Sunyani
- **Phase 3**: Nationwide

---

## Core Value Proposition

### Quantified Outcomes

| Metric | Target Improvement |
|--------|-------------------|
| Collection Speed | 20–40% faster by mid-term |
| Arrears Recovery | 15–30% more recovered per term |
| Admin Time Saved | 10–15 hours/week on fee chasing |
| Receipt Disputes | Near zero (instant digital receipts) |
| Financial Visibility | Real-time vs. end-of-month |

### Key Differentiators

1. **WhatsApp-First**: No parent app required; meet them where they are
2. **MoMo-Native**: MTN, Vodafone, AirtelTigo out of the box
3. **Offline-Aware**: Designed for intermittent internet
4. **Ghana-Compliant**: GRA-ready exports, e-levy aware, Data Protection Commission ready
5. **Fast Setup**: School live in 48 hours, not 4 weeks
6. **Affordable**: Priced for private basic schools, not just elite institutions

---

## Must-Have Features (Sales-Ready v1)

> ⚠️ **Do not sell to any school until ALL features below are working end-to-end.**

### 1. Organization and Access Management

#### 1.1 School Profile
- [ ] School name, address, phone, email
- [ ] TIN (Tax Identification Number)
- [ ] Logo upload (for receipts and messages)
- [ ] Academic year and term configuration
- [ ] Bank account details (for reference only; PSP settles directly)

#### 1.2 User Roles and Permissions (RBAC)

| Role | Permissions |
|------|-------------|
| Owner | Full access; manage users, settings, billing |
| Admin | Billing, payments, messaging, reports |
| Finance | View payments, exports, reconciliation |
| Staff | Read-only access to student data |

- [ ] Role-based access control on every action
- [ ] Invite users via email
- [ ] Deactivate/remove users
- [ ] Audit log of user actions

#### 1.3 Authentication
- [ ] Email + OTP (passwordless) — **recommended**
- [ ] Email + password with strong password requirements (fallback)
- [ ] Session management (logout, session expiry)
- [ ] Password reset flow (if using passwords)

---

### 2. Data Import and Setup

#### 2.1 Student Management
- [ ] CSV import with validation and error reporting
- [ ] Manual add/edit/delete students
- [ ] Required fields: First Name, Last Name, Class
- [ ] Optional fields: Date of Birth, Gender, Admission Number
- [ ] Student status: Active, Graduated, Withdrawn, Suspended

#### 2.2 Class/Grade Management
- [ ] Create classes (KG 1, KG 2, Primary 1–6, JHS 1–3, etc.)
- [ ] Assign students to classes
- [ ] Bulk promote students to next class (end of year)

#### 2.3 Guardian Management
- [ ] Multiple guardians per student (Mother, Father, Sponsor, etc.)
- [ ] Required: Name, Phone (at least one)
- [ ] Optional: Email, Relationship, Preferred contact method
- [ ] Phone number normalization (+233/0)
- [ ] Guardian can be linked to multiple students (siblings)

#### 2.4 Sibling/Family Linking
- [ ] Family group identifier
- [ ] Family wallet view (all siblings' balances in one place)
- [ ] Sibling discounts (percentage or fixed amount)

#### 2.5 CSV Import Format

```csv
StudentFirstName,StudentLastName,Class,Gender,DateOfBirth,GuardianName,GuardianPhone,GuardianEmail,GuardianRelation,SiblingGroupId,CustomFeeAdjust
Ama,Mensah,Primary 5,Female,2014-03-15,Kofi Mensah,0244123456,kofi@email.com,Father,FAM-001,0
Kojo,Mensah,KG 2,Male,2018-07-22,Kofi Mensah,0244123456,kofi@email.com,Father,FAM-001,-50
Akua,Owusu,Primary 3,Female,2015-11-08,Yaa Owusu,0205987654,,Mother,FAM-002,0
```

3. Fee Configuration

3.1 Fee Items  
Create fee types: Tuition, PTA, Books, Uniform, Transport, Hostel, Exam, ICT, Sports, Other  
Fee amount per class or flat across school  
Term-specific fees (Term 1, 2, 3)  
Optional vs. mandatory fees  
One-time vs. recurring fees

3.2 Discounts and Waivers  
Sibling discount (e.g., 10% off for 2nd child, 15% for 3rd)  
Scholarship/bursary (percentage or fixed)  
Staff child discount  
Early payment discount (if paid before X date)  
Custom waivers with reason

3.3 Late Fees  
Optional late fee after due date  
Fixed amount or percentage  
Grace period configuration

4. Billing and Invoicing

4.1 Term Bill Generation  
One-click bill generation for entire class or school  
Preview before generation  
Include applicable discounts/waivers  
Set due date per term

4.2 Invoice Management  
View all invoices with filters (class, status, date range)  
Invoice statuses: Draft, Sent, Partially Paid, Paid, Overdue, Cancelled  
Invoice details: Student, Guardian, Items, Amounts, Balance  
Edit/adjust invoice (with audit trail)  
Cancel/void invoice (with reason)

4.3 Part Payments  
Accept partial payments  
Track payment history per invoice  
Show running balance

4.4 Payment Plans  
Split term fees into monthly installments  
Custom payment schedules  
Reminders for each installment due date

4.5 Manual Payment Capture  
Record cash payments at office  
Record bank deposits/transfers  
Attach proof (receipt photo, bank reference)  
Manual reconciliation queue

5. Payment Collection (PSP Integration)

5.1 Paylink Generation  
Unique paylink per invoice  
QR code for each paylink (printable)  
Paylink expiry (optional)  
Supports: MTN MoMo, Vodafone Cash, AirtelTigo Money, Cards, GhQR

5.2 Payment Page  
Mobile-optimized payment page  
School branding (logo, name)  
Invoice summary (student, amount, items)  
Clear fee display (include any service charges)  
Payment method selection  
Success/failure feedback

5.3 Webhook Handling  
Receive and verify PSP webhooks  
Signature verification (HMAC/RSA)  
Idempotency (prevent duplicate processing)  
Retry handling with exponential backoff  
Logging of all webhook events

5.4 Payment Status  
Real-time status: Pending, Successful, Failed, Refunded  
Link payment to invoice and student  
Update invoice balance automatically

5.5 E-Levy Handling  
Use merchant payment rails (GhQR, merchant pay) where applicable  
Display fees transparently at checkout  
Confirm current e-levy rules with PSP

6. Receipts

6.1 Automatic Receipt Generation  
Generate PDF receipt on successful payment  
Unique receipt number  
Store receipt in cloud storage

6.2 Receipt Content  
School name, address, TIN, logo  
Student name, class  
Invoice reference  
Itemized breakdown (optional) or total  
Amount paid  
Payment method (MoMo/Card/Cash/Bank)  
PSP transaction reference  
Date and time  
QR code for verification (optional)  
"Thank you" message  
Contact info

6.3 Receipt Delivery  
Send via WhatsApp (shareable link)  
Send via SMS (link)  
Email attachment (if email available)  
Downloadable from parent portal (future)

6.4 Receipt Resend  
Admin can resend receipt anytime  
Parent can request receipt via link

7. Messaging and Reminders

7.1 Message Channels  
WhatsApp (via shareable templates/links initially)  
SMS (via Hubtel/mNotify)  
Email (optional, lower priority in Ghana context)

7.2 Message Templates

| Template | Trigger | Content |
|----------|---------|---------|
| Bill Sent | Invoice created and sent | Invoice details + paylink |
| Reminder (Pre-Due) | 7 days before due | Friendly reminder + paylink |
| Due Today | On due date | Urgent reminder + paylink |
| Overdue (7 days) | 7 days after due | Escalation + paylink |
| Overdue (14 days) | 14 days after due | Final notice + bursar contact |
| Thank You | Payment received | Confirmation + receipt link |

7.3 Template Features  
English and Twi versions  
Merge fields: [ParentName], [StudentName], [Class], [Amount], [Balance], [DueDate], [PayLink], [ReceiptLink], [SchoolName], [BursarPhone]  
Preview before sending  
Edit templates

7.4 Sending Options  
Send to individual guardian  
Bulk send by class  
Bulk send to all defaulters  
Schedule sends (e.g., 8am on Monday)

7.5 Defaulters Workflow  
Automated reminder schedule:  
- 7 days before due  
- On due date  
- 7 days overdue  
- 14 days overdue  
Configurable by school  
Stop reminders on payment  
Generate call list for severe defaulters

7.6 Message Logs  
Log all sent messages  
Delivery status (Sent, Delivered, Failed)  
Retry failed messages

8. Dashboards and Reports

8.1 Owner/Admin Dashboard  
Total billed this term  
Total collected vs. target (progress bar/chart)  
Outstanding arrears  
Collection trend (daily/weekly)  
Top 10 defaulters  
Recent payments  
Quick actions: Send reminders, View defaulters, Export

8.2 Arrears Report  
Filter by: Class, Date Range, Amount Range  
Columns: Student, Class, Guardian, Phone, Total Billed, Paid, Balance, Days Overdue  
Sortable and searchable  
Export to CSV/Excel

8.3 Payments Report  
Filter by: Date Range, Payment Method, Class  
Columns: Date, Student, Class, Amount, Method, Reference, Status  
Totals by method  
Export to CSV/Excel

8.4 Collection Summary  
By class  
By fee type  
By payment method  
By date range

8.5 Family Statement  
All students in a family  
Combined balance  
Payment history  
Shareable link for guardian

8.6 Export to Accountant  
CSV/Excel with all transactions  
Format suitable for import into accounting software  
VAT-ready breakdown (if applicable)

9. Audit and Compliance

9.1 Audit Log  
Log all significant actions:  
- User login/logout  
- Invoice created/edited/cancelled  
- Payment recorded (manual)  
- Message sent  
- Settings changed  
- User added/removed  
Fields: Timestamp, User, Action, Entity, Entity ID, Details, IP Address

9.2 Data Integrity  
Invoices cannot be deleted (only cancelled with reason)  
Payments cannot be deleted (only refunded with reason)  
All changes tracked

10. Settings and Configuration

10.1 School Settings  
School profile (name, address, logo, TIN)  
Academic year and terms  
Default due date offset  
Late fee configuration  
Timezone (Africa/Accra)

10.2 Notification Settings  
Enable/disable automated reminders  
Reminder schedule customization  
SMS sender ID  
WhatsApp configuration

10.3 Payment Settings  
Connected PSP account  
Supported payment methods  
Fee display options

---

## Future Features Roadmap

Phase 2: Enhanced Parent Experience (Month 2–3)  
- Parent Portal (Web): View children's balances, payment history and receipts, download statements, update contact info; secure token link or optional login.  
- Payment Plans Self-Service: Parent requests plan, admin approves, auto-reminders for installments.  
- Saved Payment Methods: Tokenized cards, "Remind me next month" for MoMo.  
- Multi-Language Support: Twi, Hausa (future).

Phase 3: School Operations (Month 3–4)  
- Attendance Tracking: daily attendance by class, offline-capable with sync, reports.  
- Continuous Assessment: grade entry, auto-calc term totals.  
- Report Cards: printable A4, teacher comments, position in class.  
- Teacher Mobile App (Android): offline sync, attendance, assessments.

Phase 4: Extended Billing (Month 4–5)  
- Transport Fees, Hostel/Boarding Fees, Feeding Fees, Inventory Sales, Event Fees.

Phase 5: Finance and Compliance (Month 5–6)  
- Bank Reconciliation, GRA E-Invoicing Integration, VAT Handling, Multi-Currency, Bursary/Scholarship Management.

Phase 6: Communications (Month 6–7)  
- WhatsApp Business API, Voice Announcements, Push Notifications, Email Campaigns.

Phase 7: Multi-Branch and Scale (Month 7–9)  
- Multi-Campus Support, Denomination/Network View, Franchise Model.

Phase 8: Advanced Analytics (Month 9–12)  
- BI Dashboard, Cohort analysis, Prediction for likely defaulters, Benchmarking, Custom Reports Builder.

Phase 9: Platform Expansion (Year 2)  
- USSD Payments, Agent Network, API for Third Parties, Mobile App for Parents, Learning Management (LMS).

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                 │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Admin Web App  │  Parent Paylink │  Teacher App (Future)       │
│  (React/Next.js)│  (Mobile Web)   │  (React Native/Flutter)     │
└────────┬────────┴────────┬────────┴─────────────┬───────────────┘
         │                 │                      │
         ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY / LOAD BALANCER                 │
│                        (Cloudflare / Vercel Edge)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION SERVER                         │
│                    (Next.js API / Django)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │   Auth   │ │ Billing  │ │ Payments │ │ Messaging│            │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Students │ │ Reports  │ │ Receipts │ │  Audit   │            │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    PostgreSQL   │ │   Redis/Queue   │ │  Object Storage │
│   (Supabase/    │ │   (BullMQ/RQ)   │ │  (S3/R2)        │
│    Neon)        │ │                 │ │  Receipts, Docs │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Payment PSP   │  SMS Provider   │  WhatsApp (Links/API)       │
│ (Paystack/      │ (Hubtel/mNotify)│  (360dialog/Gupshup later)  │
│  Hubtel)        │                 │                              │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### Tech Stack (Recommended)

Layer | Technology | Notes
--- | --- | ---
Frontend | Next.js 14+ (App Router) | React, TypeScript, Tailwind CSS
Backend | Next.js API Routes or Django | Node.js or Python
Database | PostgreSQL | Supabase or Neon (managed)
ORM | Prisma (Node) or Django ORM | Type-safe queries
Queue | BullMQ (Node) or Celery (Python) | Background jobs, reminders
Cache | Redis | Session, rate limiting
Storage | S3-compatible | Supabase Storage, Cloudflare R2
Hosting | Vercel (Next.js) or Render/Fly | Auto-scaling, edge functions
CDN/WAF | Cloudflare | TLS, DDoS protection, caching
Monitoring | Sentry | Error tracking
Logs | Better Stack / Logtail | Centralized logging
Analytics | PostHog | Product analytics
BI | Metabase | Internal dashboards

Alternative Stack (Django)
- Backend: Django 4.2+ with Django REST Framework
- Frontend: Django Templates + HTMX or separate React SPA
- Database: PostgreSQL
- Queue: Celery + Redis
- Hosting: Render, Fly.io, Railway

---

## Data Models

### Entity Relationship Diagram (Simplified)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    School    │───┐   │     User     │       │  AuditLog    │
├──────────────┤   │   ├──────────────┤       ├──────────────┤
│ id           │   │   │ id           │       │ id           │
│ name         │   │   │ email        │       │ userId       │
│ address      │   │   │ phone        │       │ action       │
│ tin          │   │   │ role         │       │ entity       │
│ logo_url     │   ├──►│ schoolId     │       │ entityId     │
│ settings     │   │   │ status       │       │ details      │
│ createdAt    │   │   │ createdAt    │       │ ipAddress    │
└──────────────┘   │   └──────────────┘       │ createdAt    │
                   │                          └──────────────┘
                   │
    ┌──────────────┴─────────────────────────────────────┐
    │                                                    │
    ▼                                                    ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Student    │◄──────│StudentGuardian│─────►│   Guardian   |
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ studentId    │       │ id           │
│ firstName    │       │ guardianId   │       │ name         │
│ lastName     │       │ relation     │       │ phone        │
│ class        │       │ isPrimary    │       │ email        │
│ gender       │       └──────────────┘       │ schoolId     │
│ dateOfBirth  │                              └──────────────┘
│ admissionNo  │
│ siblingGroup │       ┌──────────────┐
│ status       │       │   FeeItem    │
│ schoolId     │       ├──────────────┤
│ createdAt    │       │ id           │
└──────┬───────┘       │ name         │
       │               │ type         │
       │               │ amount       │
       │               │ termId       │
       │               │ classFilter  │
       │               │ isMandatory  │
       │               │ schoolId     │
       │               └──────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────┐       ┌──────────────┐
│   Invoice    │◄──────│ InvoiceItem  │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ invoiceNo    │       │ invoiceId    │
│ studentId    │       │ feeItemId    │
│ termId       │       │ amount       │
│ totalAmount  │       │ discount     │
│ paidAmount   │       │ waiverReason │
│ balance      │       └──────────────┘
│ status       │
│ dueDate      │       ┌──────────────┐
│ paylinkId    │       │   Payment    │
│ paylinkUrl   │       ├──────────────┤
│ createdAt    │◄──────│ id           │
└──────────────┘       │ invoiceId    │
                       │ amount       │
                       │ method       │
                       │ pspReference │
                       │ pspProvider  │
                       │ status       │
                       │ paidAt       │
                       │ rawResponse  │
                       │ createdAt    │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐
│   Receipt    │       │   Message    │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ receiptNo    │       │ type         │
│ invoiceId    │       │ channel      │
│ paymentId    │       │ to           │
│ pdfUrl       │       │ content      │
│ sentAt       │       │ status       │
│ createdAt    │       │ sentAt       │
└──────────────┘       │ invoiceId    │
                       │ studentId    │
                       │ createdAt    │
                       └──────────────┘

┌──────────────┐
│MessageTemplate│
├──────────────┤
│ id           │
│ name         │
│ channel      │
│ language     │
│ content      │
│ schoolId     │
│ isDefault    │
└──────────────┘
```

### Detailed Schema (Prisma Example)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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
}

enum StudentStatus {
  ACTIVE
  GRADUATED
  WITHDRAWN
  SUSPENDED
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
  SUCCESSFUL
  FAILED
  REFUNDED
}

enum PaymentMethod {
  MTN_MOMO
  VODAFONE_CASH
  AIRTELTIGO_MONEY
  CARD
  GHQR
  CASH
  BANK_TRANSFER
}

enum MessageChannel {
  SMS
  WHATSAPP
  EMAIL
}

enum MessageStatus {
  QUEUED
  SENT
  DELIVERED
  FAILED
}

model School {
  id          String    @id @default(cuid())
  name        String
  address     String?
  phone       String?
  email       String?
  tin         String?
  logoUrl     String?
  settings    Json      @default("{}")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  users       User[]
  students    Student[]
  guardians   Guardian[]
  feeItems    FeeItem[]
  terms       Term[]
  templates   MessageTemplate[]
}

model User {
  id          String      @id @default(cuid())
  email       String      @unique
  phone       String?
  name        String?
  role        UserRole    @default(STAFF)
  status      UserStatus  @default(PENDING)
  schoolId    String
  school      School      @relation(fields: [schoolId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  auditLogs   AuditLog[]
}

model Student {
  id            String          @id @default(cuid())
  firstName     String
  lastName      String
  class         String
  gender        String?
  dateOfBirth   DateTime?
  admissionNo   String?
  siblingGroup  String?
  status        StudentStatus   @default(ACTIVE)
  schoolId      String
  school        School          @relation(fields: [schoolId], references: [id])
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  guardians     StudentGuardian[]