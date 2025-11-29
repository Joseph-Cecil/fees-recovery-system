/**
 * Transaction utilities
 */
import { prisma } from './prisma.client';

/**
 * Execute a function within a database transaction
 */
export async function withTransaction<T>(
  fn: (tx: typeof prisma) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn);
}

