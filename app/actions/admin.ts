'use server';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Handle admin login.
 * @param formData - The form data containing the password.
 */
export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string;

  const config = await prisma.config.findUnique({
    where: { id: 'admin_password' },
  });

  if (!config) {
    redirect('/setup');
  }

  const isValid = await verifyPassword(password, config.value);

  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    redirect('/admin');
  } else {
    throw new Error('Mot de passe incorrect.');
  }
}

/**
 * Logout admin.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/');
}

/**
 * Is authenticated check.
 */
export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has('admin_auth');
}

/**
 * Add a new menu button.
 */
export async function addButton(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');

  const name = formData.get('name') as string;
  const url = formData.get('url') as string;

  if (!name || !url) throw new Error('Champs requis manquants.');

  await prisma.button.create({
    data: { name, url, order: 0 },
  });

  // Revalidate both admin and home pages to reflect new button immediately
  revalidatePath('/admin');
  revalidatePath('/');
}

/**
 * Delete a menu button.
 */
export async function deleteButton(id: number) {
  if (!(await isAuthenticated())) throw new Error('Non autorisé');
  await prisma.button.delete({ where: { id } });

  // Revalidate both admin and home pages to reflect deletion immediately
  revalidatePath('/admin');
  revalidatePath('/');
}
