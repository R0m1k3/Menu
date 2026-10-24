'use server';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  isRateLimited,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Handle admin login.
 */
async function clientKey(): Promise<string> {
  const h = await headers();
  // Behind the reverse proxy, the last X-Forwarded-For entry is the one it added.
  const forwarded = h.get('x-forwarded-for')?.split(',').pop()?.trim();
  return forwarded || h.get('x-real-ip') || 'unknown';
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string;

  const key = await clientKey();
  if (isRateLimited(key)) {
    throw new Error('Trop de tentatives. Réessayez dans quelques minutes.');
  }

  const config = await prisma.config.findUnique({
    where: { id: 'admin_password' },
  });

  if (!config) {
    redirect('/setup');
  }

  const isValid = !!password && (await verifyPassword(password, config.value));

  if (isValid) {
    clearFailedAttempts(key);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    redirect('/admin');
  } else {
    recordFailedAttempt(key);
    throw new Error('Mot de passe incorrect.');
  }
}

/**
 * Logout admin.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}

/**
 * Is authenticated check.
 */
export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

/**
 * Add a new menu button with optional icon.
 */
export async function addButton(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');

  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const icon = (formData.get('icon') as string) || null;

  if (!name || !url) throw new Error('Champs requis manquants.');

  await prisma.button.create({
    data: { name, url, icon, order: 0 },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

/**
 * Update an existing button (name, url, icon).
 */
export async function updateButton(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');

  const id = parseInt(formData.get('id') as string, 10);
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const icon = (formData.get('icon') as string) || null;

  if (!id || !name || !url) throw new Error('Champs requis manquants.');

  await prisma.button.update({
    where: { id },
    data: { name, url, icon },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

/**
 * Delete a menu button.
 */
export async function deleteButton(id: number) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');
  await prisma.button.delete({ where: { id } });

  revalidatePath('/admin');
  revalidatePath('/');
}

/**
 * Update global app title.
 */
export async function updateAppTitle(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');

  const title = formData.get('title') as string;
  if (!title) throw new Error('Titre requis.');

  await prisma.config.upsert({
    where: { id: 'app_title' },
    update: { value: title },
    create: { id: 'app_title', value: title },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}
