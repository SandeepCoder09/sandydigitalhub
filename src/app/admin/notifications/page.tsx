import { AdminNotificationsPage } from '@/components/admin/AdminNotificationsPage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Notification Center — Sandy Digital Hub Admin',
  description: 'All platform activity, order events, customer registrations and announcements in one place.',
};

export default async function AdminNotificationsRoute() {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/login');
  }

  return <AdminNotificationsPage />;
}
