import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Partner } from '@/models/Partner';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { isProtectedSuperAdmin } from '@/lib/rbac';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const requesterRole = (session?.user as any)?.role;

    if (!session || !isProtectedSuperAdmin(requesterRole)) {
      return NextResponse.json({ message: 'Unauthorized: Super Admin access required' }, { status: 401 });
    }

    await connectDB();
    const [users, partners] = await Promise.all([
      User.find().select('-password -resetPasswordToken').sort({ createdAt: -1 }).lean(),
      Partner.find({ status: { $in: ['ACTIVE', 'PENDING'] } }).select('_id name branchCode city state').lean(),
    ]);

    return NextResponse.json({
      users,
      partners: partners.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        branchCode: p.branchCode,
        city: p.city,
        state: p.state,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
  }
}
