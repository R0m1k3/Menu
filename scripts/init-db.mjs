#!/usr/bin/env node
/**
 * Database initialization script.
 * Run BEFORE the Next.js server starts (via entrypoint.sh).
 * Uses better-sqlite3 directly — no Prisma CLI dependency.
 */

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_URL = process.env.DATABASE_URL || 'file:/app/prisma/dev.db';
const DB_PATH = DB_URL.replace(/^file:/, '');

// Ensure the directory exists
const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
  console.log(`[init-db] Created directory: ${dir}`);
}

console.log(`[init-db] Initializing database at: ${DB_PATH}`);

const db = new Database(DB_PATH);

// Config table
db.exec(`
  CREATE TABLE IF NOT EXISTS "Config" (
    "id"    TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
  );
`);

// Button table
db.exec(`
  CREATE TABLE IF NOT EXISTS "Button" (
    "id"    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"  TEXT NOT NULL,
    "url"   TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
  );
`);

// Migration v2: icon column
try {
  db.exec(`ALTER TABLE "Button" ADD COLUMN "icon" TEXT;`);
  console.log('[init-db] Migration: Button.icon column added.');
} catch {
  // Column already exists — safe to ignore
}

db.close();
console.log('[init-db] Database ready.');
