/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ChatMessage } from '@/models/ChatMessage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Group chat messages by sessionId to return active chat conversations
    const sessions = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$message' },
          lastSender: { $first: '$senderName' },
          lastSenderRole: { $first: '$senderRole' },
          updatedAt: { $first: '$createdAt' },
          needsAdmin: { $max: '$needsAdmin' },
          adminRead: { $min: '$adminRead' },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    // Count unread sessions requiring admin attention
    const alertCount = sessions.filter((s: any) => s.needsAdmin && !s.adminRead).length;

    return NextResponse.json({ sessions, alertCount });
  } catch (error) {
    console.error('Error in admin chat GET:', error);
    return NextResponse.json({ sessions: [], alertCount: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { sessionId, message } = body;

    if (!sessionId || !message || !message.trim()) {
      return NextResponse.json({ message: 'sessionId and message are required' }, { status: 400 });
    }

    // Mark previous messages in this session as read by admin
    await ChatMessage.updateMany({ sessionId }, { adminRead: true });

    // Save admin agent message
    const adminMsg = await ChatMessage.create({
      senderName: session.user.name || 'Admin Support Agent 👨‍💼',
      senderRole: 'ADMIN',
      message: message.trim(),
      sessionId,
      userId: session.user.id,
      adminRead: true,
      needsAdmin: false,
    });

    return NextResponse.json({ success: true, message: adminMsg });
  } catch (error) {
    console.error('Error in admin chat POST:', error);
    return NextResponse.json({ message: 'Failed to send admin response' }, { status: 500 });
  }
}
