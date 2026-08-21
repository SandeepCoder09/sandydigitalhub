import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { CustomerNotificationsPage } from '@/components/notifications/CustomerNotificationsPage';

export const metadata = {
  title: 'My Notifications — Sandy Digital Hub',
  description: 'View all your order updates, platform announcements and important notices.',
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Admins go to the admin version
  if (['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/admin/notifications');
  }

  return <CustomerNotificationsPage />;
}
