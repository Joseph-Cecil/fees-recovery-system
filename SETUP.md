# Setup Instructions

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL and Redis:**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Set up database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Manual Steps

1. **Generate JWT secrets:**
   ```bash
   openssl rand -base64 64
   ```
   Add these to your backend `.env` file as `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

2. **Configure payment providers:**
   - Add Paystack or Hubtel credentials to backend `.env`
   - Configure SMS provider credentials

3. **Set up storage:**
   - Configure S3-compatible storage or use local storage
   - Update `STORAGE_PROVIDER` in backend `.env`

## Next Steps

- Complete remaining module implementations (users, students, invoices, etc.)
- Add integration tests
- Set up CI/CD pipeline
- Configure production environment variables

