import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { PartnerSidebar } from '@/components/partner/PartnerSidebar';

export default async function PartnerLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/partner/dashboard');
  }

  // Verify role
  const role = session.user.role;
  if (role !== 'PARTNER_ADMIN' && role !== 'PARTNER_STAFF' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    redirect('/account');
  }

  let partner = null;
  const user = session.user as any;
  if (user?.partnerId) {
    await connectDB();
    partner = await Partner.findOne({ partnerId: user.partnerId }).lean();
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] flex flex-col lg:flex-row antialiased">
      <PartnerSidebar partner={partner} />
      <main className="flex-1 p-2.5 sm:p-5 md:p-6 lg:p-8 min-w-0 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
