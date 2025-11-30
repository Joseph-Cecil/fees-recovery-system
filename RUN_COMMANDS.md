# Commands to Run the Application

## Complete Setup Sequence

### Step 1: Install All Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend:**
```bash
cd backend
# Copy .env.example to .env (if not exists)
# Edit .env and set:
# - DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_fees_db?schema=public"
# - JWT_ACCESS_SECRET="<generate with: openssl rand -base64 64>"
# - JWT_REFRESH_SECRET="<generate with: openssl rand -base64 64>"
```

**Frontend:**
```bash
cd frontend
# Copy .env.example to .env.local (if not exists)
# Edit .env.local and set:
# - NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
```

### Step 3: Start Database Services

```bash
cd backend
docker-compose up -d postgres redis

# Verify they're running
docker ps
```

### Step 4: Set Up Database

```bash
cd backend

# Generate Prisma Client (fixes PrismaClient import error)
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate
# When prompted, name the migration: init
```

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 8000
Database connection successful
Redis connection successful (or warning)
```

**Test it:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Step 6: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

**Open in browser:** http://localhost:3000

## Troubleshooting

### "Cannot find module '@prisma/client'"
**Solution:** Run `npm run prisma:generate` in the backend directory

### "Database connection failed"
**Solution:** 
1. Check Docker containers: `docker ps`
2. Verify DATABASE_URL in `.env`
3. Restart: `docker-compose restart postgres`

### "Port already in use"
**Solution:** Change PORT in backend/.env or kill the process using the port

### TypeScript errors persist
**Solution:** 
1. Make sure all dependencies are installed: `npm install`
2. Generate Prisma client: `npm run prisma:generate`
3. Check for any remaining issues: `npm run typecheck`

## Quick Test

Once both servers are running:

1. **Backend health:** http://localhost:8000/health
2. **API health:** http://localhost:8000/api/v1/health
3. **Frontend:** http://localhost:3000

All should return successfully! ✅


