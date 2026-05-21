import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

/**
 * Página raíz: redirige al dashboard si está autenticado, al login si no.
 */
export default async function Home() {
  const session = await getSession();

  if (session.authenticated) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
