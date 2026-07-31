import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { SecurityLog } from '@/models/SecurityLog';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const logs = await SecurityLog.find().sort({ createdAt: -1 }).limit(50).lean();
    const criticalCount = await SecurityLog.countDocuments({ severity: 'CRITICAL' });
    const totalThreats = await SecurityLog.countDocuments();

    return NextResponse.json({ logs, criticalCount, totalThreats });
  } catch (error: any) {
    console.error('Error in security-logs GET:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await SecurityLog.deleteMany({});
    return NextResponse.json({ message: 'Security logs cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing security-logs:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
