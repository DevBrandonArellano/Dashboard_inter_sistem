import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard — SEBDOM Reportes',
  description: 'Panel de reportes de inventario con comunicación cifrada',
};

/**
 * Dashboard page (Server Component).
 * Verifica la sesión y pasa los datos del usuario al componente cliente.
 */
export default async function DashboardPage() {
  const session = await getSession();

  if (!session.authenticated) {
    redirect('/login');
  }

  return <DashboardClient user={session.user} />;
}
