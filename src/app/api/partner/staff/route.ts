import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyPartnerAccess } from '@/lib/tenant';
import bcrypt from 'bcryptjs';

// GET /api/partner/staff - List staff belonging to this partner
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const staff = await User.find({
      partnerId: access.partnerId,
      role: { $in: ['PARTNER_ADMIN', 'PARTNER_STAFF'] },
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ staff });
  } catch (error: any) {
    console.error('Error in GET /api/partner/staff:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/partner/staff - Add a new staff member
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized: Partner Admin required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const { name, email, mobile, password, permissions = ['create_request', 'view_requests', 'update_requests'] } = body;

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: 'Name, Email, Mobile and Password are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staffUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      mobile,
      password: hashedPassword,
      role: 'PARTNER_STAFF',
      partnerId: access.partnerId,
      permissions,
      status: 'ACTIVE',
    });

    return NextResponse.json({
      success: true,
      staff: {
        _id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        mobile: staffUser.mobile,
        role: staffUser.role,
        permissions: staffUser.permissions,
        status: staffUser.status,
      },
    });
  } catch (error: any) {
    console.error('Error in POST /api/partner/staff:', error);
    return NextResponse.json({ error: error.message || 'Failed to add staff' }, { status: 500 });
  }
}
