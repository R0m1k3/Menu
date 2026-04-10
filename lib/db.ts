import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';
    const filePath = dbUrl.replace('file:', '');
    
    console.log(`[DB Init] Attempting to connect to SQLite at: ${filePath}`);
    
    // Check if the URL is valid
    if (!filePath) {
      throw new Error("DATABASE_URL must be provided and contain a valid path.");
    }

    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    
    const client = new PrismaClient({ 
      adapter,
      log: ['error', 'warn']
    });

    console.log(`[DB Init] Prisma Client initialized successfully with adapter.`);
    return client;
  } catch (error) {
    console.error(`[DB Init Error] Critical failure during database initialization:`, error);
    // Rethrow to let Next.js handle the server component error
    throw error;
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
