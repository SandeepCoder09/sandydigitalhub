import { AnnouncementManager } from '@/components/admin/AnnouncementManager';

export const metadata = {
  title: 'Announcements & Notifications — Sandy Digital Hub Admin',
  description: 'Create, schedule, target and publish platform-wide announcements and notifications',
};

export default function AnnouncementsPage() {
  return <AnnouncementManager />;
}
