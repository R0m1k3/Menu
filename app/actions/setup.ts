'use server';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Save the initial admin password.
 * @param formData - The form data containing the password.
 */
export async function setupAdmin(formData: FormData) {
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  if (!password || password !== confirm) {
    throw new Error('Les mots de passe ne correspondent pas.');
  }

  // Check if already setup
  const existing = await prisma.config.findUnique({
    where: { id: 'admin_password' },
  });

  if (existing) {
    throw new Error('La configuration a déjà été effectuée.');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.config.create({
    data: {
      id: 'admin_password',
      value: hashedPassword,
    },
  });

  redirect('/admin');
}

/**
 * Check if the application is configured.
 */
export async function isConfigured() {
  const config = await prisma.config.findUnique({
    where: { id: 'admin_password' },
  });
  return !!config;
}
