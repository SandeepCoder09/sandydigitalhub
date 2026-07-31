import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteControl } from '@/models/SiteControl';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteControl.findOne().lean();
    if (!settings) {
      settings = await SiteControl.create({});
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error fetching public site control settings:', error);
    return NextResponse.json({
      settings: {
        isEmergencyLockdown: false,
        maintenanceMessage: '',
        allowFileUploads: true,
        blockedPages: [],
        blockedIps: [],
        blockedEmails: [],
      }
    });
  }
}
