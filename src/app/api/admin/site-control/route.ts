import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { SiteControl } from '@/models/SiteControl';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await SiteControl.findOne().lean();
    if (!settings) {
      settings = await SiteControl.create({});
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error in admin site-control GET:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    let settings = await SiteControl.findOne();
    if (!settings) {
      settings = new SiteControl(body);
    } else {
      if (typeof body.isEmergencyLockdown === 'boolean') settings.isEmergencyLockdown = body.isEmergencyLockdown;
      if (typeof body.maintenanceMessage === 'string') settings.maintenanceMessage = body.maintenanceMessage;
      if (typeof body.allowFileUploads === 'boolean') settings.allowFileUploads = body.allowFileUploads;
      if (Array.isArray(body.blockedPages)) settings.blockedPages = body.blockedPages;
      if (Array.isArray(body.blockedIps)) settings.blockedIps = body.blockedIps;
      if (Array.isArray(body.blockedEmails)) settings.blockedEmails = body.blockedEmails;
    }

    await settings.save();
    return NextResponse.json({ message: 'Site security & control settings updated successfully', settings });
  } catch (error: any) {
    console.error('Error updating admin site-control:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
