import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VisitorLog } from '@/models/VisitorLog';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer } = body || {};

    if (!path || path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';
    const forwardedFor = headerList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    let deviceType = 'Desktop';
    if (/mobile/i.test(userAgent)) {
      deviceType = 'Mobile';
    } else if (/ipad|tablet/i.test(userAgent)) {
      deviceType = 'Tablet';
    }

    await connectDB();

    // Debounce duplicate page views from same IP and path within 3 seconds
    const recentLog = await VisitorLog.findOne({
      ip,
      path,
      createdAt: { $gte: new Date(Date.now() - 3000) }
    }).lean();

    if (!recentLog) {
      await VisitorLog.create({
        path,
        ip,
        userAgent,
        deviceType,
        referrer: referrer || '',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Non-blocking catch
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
