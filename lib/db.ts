import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { initializeDatabase } from './initDb';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';
    console.log(`[DB] Connecting to: ${dbUrl}`);

    // Ensure schema exists before creating the Prisma client
    initializeDatabase();

    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    const client = new PrismaClient({ adapter });

    console.log('[DB] Prisma client ready.');
    return client;
  } catch (error) {
    console.error('[DB] Critical initialization failure:', error);
    throw error;
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
