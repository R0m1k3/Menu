import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/db';

export const SESSION_COOKIE = 'admin_auth';
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24h, in seconds

let cachedSecret: string | null = null;

/**
 * Secret used to sign the admin session cookie.
 * Uses SESSION_SECRET when set, otherwise a random secret generated once
 * and persisted in the database (Config row "session_secret").
 */
async function getSessionSecret(): Promise<string> {
  if (cachedSecret) return cachedSecret;

  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    cachedSecret = fromEnv;
    return fromEnv;
  }
  if (fromEnv) {
    console.warn('[auth] SESSION_SECRET trop court (< 32 caractères), secret persistant utilisé à la place.');
  }

  const existing = await prisma.config.findUnique({ where: { id: 'session_secret' } });
  if (existing) {
    cachedSecret = existing.value;
    return existing.value;
  }

  const generated = randomBytes(48).toString('hex');
  await prisma.config.upsert({
    where: { id: 'session_secret' },
    update: {},
    create: { id: 'session_secret', value: generated },
  });
  // Re-read in case of a concurrent creation.
  const stored = await prisma.config.findUnique({ where: { id: 'session_secret' } });
  const secret = stored?.value ?? generated;
  cachedSecret = secret;
  return secret;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Create a signed session token: "<expiry>.<nonce>.<signature>".
 */
export async function createSessionToken(): Promise<string> {
  const secret = await getSessionSecret();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${expiresAt}.${randomBytes(16).toString('base64url')}`;
  return `${payload}.${sign(payload, secret)}`;
}

/**
 * Verify signature and expiry of a session token.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [exp, nonce, signature] = parts;
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) return false;

  const secret = await getSessionSecret();
  const expected = Buffer.from(sign(`${exp}.${nonce}`, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

// --- Basic in-memory login rate limiting -----------------------------------

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true when the key has exceeded the allowed number of failed attempts.
 */
export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.resetAt <= Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
  // Keep the map bounded.
  if (attempts.size > 10000) {
    for (const [k, v] of attempts) if (v.resetAt <= now) attempts.delete(k);
  }
}

export function clearFailedAttempts(key: string): void {
  attempts.delete(key);
}
