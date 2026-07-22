// app/page.tsx
import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Jika sudah login, secara default arahkan ke Dashboard
  redirect('/dashboard');
}