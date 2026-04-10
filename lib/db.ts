import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Creates the Prisma client.
 * Schema initialization is handled by scripts/init-db.mjs (run at startup).
 */
const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';
  console.log(`[DB] Connecting to: ${dbUrl}`);
  
  // Wrap with the Prisma driver adapter
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
