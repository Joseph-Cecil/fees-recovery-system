/**
 * Database service wrapper around Prisma Client
 */
import { prisma } from './prisma.client';

export class PrismaService {
  /**
   * Get Prisma client instance
   */
  get client() {
    return prisma;
  }

  /**
   * Execute a transaction
   */
  async transaction<T>(fn: (tx: typeof prisma) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn);
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }

  /**
   * Health check - test database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaService = new PrismaService();

