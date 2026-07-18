/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ChatMessage } from '@/models/ChatMessage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'guest';

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(100);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { message, sessionId, senderName, action } = body;

    const sid = sessionId || 'guest';
    const name = senderName || session?.user?.name || 'Client';

    // Handle "Talk to Real Agent" request
    if (action === 'REQUEST_ADMIN') {
      const adminReqMsg = await ChatMessage.create({
        senderName: name,
        senderRole: 'CUSTOMER',
        message: '🙋‍♂️ Customer requested to talk with a live Sandy Digital Hub agent.',
        sessionId: sid,
        userId: session?.user?.id || undefined,
        needsAdmin: true,
        adminRead: false,
      });

      const sysReply = await ChatMessage.create({
        senderName: 'Sandy Hub Support Bot 🤖',
        senderRole: 'SYSTEM',
        message: `Connecting you to a live Sandy Digital Hub agent! 🚨 Notification sent to our admin team. An agent will reply to your chat shortly.`,
        sessionId: sid,
      });

      return NextResponse.json({
        success: true,
        userMessage: adminReqMsg,
        botReply: sysReply,
      });
    }

    // Handle "Quit Session" request
    if (action === 'QUIT_SESSION') {
      const role = session?.user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
      const quitter = role === 'ADMIN' ? 'Admin Support Agent' : name;

      await ChatMessage.create({
        senderName: 'Sandy Hub Support Bot 🤖',
        senderRole: 'SYSTEM',
        message: `🔴 Chat session ended by ${quitter}. This conversation is now closed.`,
        sessionId: sid,
        needsAdmin: false,
        adminRead: true,
      });

      // Mark all messages in session as read and not needing admin
      await ChatMessage.updateMany({ sessionId: sid }, { needsAdmin: false, adminRead: true });

      return NextResponse.json({ success: true, quit: true });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const role = session?.user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    const userMsg = await ChatMessage.create({
      senderName: name,
      senderRole: role,
      message: message.trim(),
      sessionId: sid,
      userId: session?.user?.id || undefined,
      needsAdmin: role === 'CUSTOMER',
      adminRead: role === 'ADMIN',
    });

    // If sent by customer, check if admin has joined or send auto-bot helper
    let autoReply = null;
    if (role === 'CUSTOMER') {
      // Check if admin has recently replied in this session
      const adminReplied = await ChatMessage.findOne({ sessionId: sid, senderRole: 'ADMIN' });

      if (!adminReplied) {
        const lower = message.toLowerCase();
        let botResponse = '';

        if (lower.includes('aay') || lower.includes('jati') || lower.includes('niwas') || lower.includes('certificate') || lower.includes('income')) {
          botResponse = 'For e-District certificates (Aay, Jati, Niwas), processing takes 1-3 business days. Track status in "My Requests".';
        } else if (lower.includes('order') || lower.includes('status') || lower.includes('track')) {
          botResponse = 'You can track all service requests directly under "My Requests" or paste your Branded Order ID here!';
        } else if (lower.includes('website') || lower.includes('app') || lower.includes('development')) {
          botResponse = 'We build custom Next.js websites, E-commerce, & Apps! View options under "Services" or click "Talk to Real Agent" below.';
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('location')) {
          botResponse = 'Sandy Digital Hub is located at Bairi, Khakhreru, Fatehpur, UP. Helpline: +91 8756454282.';
        } else {
          botResponse = `Thanks for your message, ${name}! Click "🙋‍♂️ Talk to Real Agent" if you'd like to chat with an admin immediately.`;
        }

        autoReply = await ChatMessage.create({
          senderName: 'Sandy Hub Support Bot 🤖',
          senderRole: 'SYSTEM',
          message: botResponse,
          sessionId: sid,
        });
      }
    }

    return NextResponse.json({
      success: true,
      userMessage: userMsg,
      botReply: autoReply,
    });
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
