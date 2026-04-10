import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt.
 * @param password - The plain text password.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash.
 * @param password - The plain text password.
 * @param hash - The hashed password.
 * @returns True if the password matches.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
