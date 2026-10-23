import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return await verifyAdminToken(token);
}
