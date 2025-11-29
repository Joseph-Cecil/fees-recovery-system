/**
 * Database configuration
 */
export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/school_fees_db?schema=public',
  poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
  poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
};

