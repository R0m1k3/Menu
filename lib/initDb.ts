import Database from 'better-sqlite3';
import path from 'path';

/**
 * Initializes the SQLite database schema using raw SQL.
 * Safe to run multiple times — uses IF NOT EXISTS and handles migrations.
 */
export function initializeDatabase(): void {
  const dbUrl = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';
  const filePath = dbUrl.replace(/^file:/, '');
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  console.log(`[DB Init] Ensuring schema at: ${resolvedPath}`);

  try {
    const db = new Database(resolvedPath);

    // Config table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "Config" (
        "id"    TEXT NOT NULL PRIMARY KEY,
        "value" TEXT NOT NULL
      );
    `);

    // Button table (base)
    db.exec(`
      CREATE TABLE IF NOT EXISTS "Button" (
        "id"    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name"  TEXT NOT NULL,
        "url"   TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Migration: add icon column if missing (added in v2)
    try {
      db.exec(`ALTER TABLE "Button" ADD COLUMN "icon" TEXT;`);
      console.log('[DB Init] Migration applied: Button.icon column added.');
    } catch {
      // Column already exists — no action needed
    }

    db.close();
    console.log('[DB Init] Schema ready.');
  } catch (err) {
    console.error('[DB Init Error] Failed to initialize schema:', err);
    throw err;
  }
}
