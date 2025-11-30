# 🚀 Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- Docker Desktop installed (for PostgreSQL and Redis)
- npm or pnpm installed

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up Environment Variables

### Backend
```bash
cd backend
# Copy the example file
cp .env.example .env

# Edit .env and set these REQUIRED variables:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_ACCESS_SECRET (generate with: openssl rand -base64 64)
# - JWT_REFRESH_SECRET (generate with: openssl rand -base64 64)
```

**Generate JWT Secrets:**
```bash
# On Windows (PowerShell):
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# On Mac/Linux:
openssl rand -base64 64
```

### Frontend
```bash
cd frontend
# Copy the example file
cp .env.example .env.local

# Edit .env.local and set:
# - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Step 3: Start Database Services

```bash
# From project root
cd backend
docker-compose up -d postgres redis
```

Wait a few seconds for services to start, then verify:
```bash
docker ps
# You should see postgres and redis containers running
```

## Step 4: Set Up Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
# When prompted, name it: init
```

## Step 5: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 8000
Database connection successful
Redis connection successful (or warning if Redis unavailable)
```

Test the backend:
```bash
# Open in browser or use curl
curl http://localhost:8000/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Step 6: Start the Frontend

```bash
# Open a NEW terminal
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

Open http://localhost:3000 in your browser.

## Troubleshooting

### Backend won't start

1. **TypeScript errors:**
   ```bash
   cd backend
   npm run typecheck
   ```
   Fix any errors shown.

2. **Database connection failed:**
   - Check if PostgreSQL is running: `docker ps`
   - Verify DATABASE_URL in `.env` is correct
   - Try: `docker-compose restart postgres`

3. **Port already in use:**
   - Change PORT in backend/.env
   - Or kill the process using port 8000

4. **Prisma Client not generated:**
   ```bash
   cd backend
   npm run prisma:generate
   ```

5. **Module not found errors:**
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   ```

### Frontend won't start

1. **Module not found:**
   ```bash
   cd frontend
   npm install
   ```

2. **TypeScript errors:**
   ```bash
   cd frontend
   npm run typecheck
   ```

3. **Port already in use:**
   - Change the port in package.json scripts
   - Or kill the process using port 3000

### Common Issues

**"Cannot find module '@prisma/client'"**
- Run: `cd backend && npm run prisma:generate`

**"Path alias @/* not resolved"**
- Backend: Make sure `tsconfig-paths` is installed and scripts use `-r tsconfig-paths/register`
- Frontend: Next.js handles this automatically

**"Database connection failed"**
- Make sure Docker containers are running: `docker ps`
- Check DATABASE_URL in backend/.env
- Try: `docker-compose restart postgres`

**"Redis connection failed"**
- This is OK - caching will be disabled
- To fix: Make sure Redis container is running: `docker ps`

## Verification

### Backend Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","timestamp":"..."}

curl http://localhost:8000/api/v1/health
# Should return: {"status":"ok"}
```

### Frontend
- Open http://localhost:3000
- Should see "School Fee Recovery System" page
- No console errors in browser DevTools

## Next Steps

1. Create your first user via Prisma Studio:
   ```bash
   cd backend
   npm run prisma:studio
   ```
   - Open the User table
   - Create a user with email, password (hashed), role, schoolId

2. Test authentication:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password"}'
   ```

3. Continue development by implementing remaining modules!


