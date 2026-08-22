import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SupportTicket } from '@/models/SupportTicket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SDH-TKT-${year}-${randomSuffix}`;
}

// GET /api/support/tickets — Role-based tenant-isolated ticket list
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userPartnerId = (session.user as any).partnerId;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const ticketNumber = searchParams.get('ticketNumber');

    if (ticketNumber) {
      const ticket = await SupportTicket.findOne({ ticketNumber }).lean();
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      // Role authorization check
      const isOwner = ticket.customerId.toString() === userId;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
      const isPartner =
        ['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole) &&
        ticket.partnerId &&
        ticket.partnerId.toString() === userPartnerId;

      if (!isOwner && !isAdmin && !isPartner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Filter internal notes if user is a customer
      const sanitizedMessages = (ticket.messages || []).filter(
        (m: any) => !m.isInternalNote || isAdmin || isPartner
      );

      return NextResponse.json({
        success: true,
        ticket: { ...ticket, messages: sanitizedMessages },
      });
    }

    // List tickets based on role
    let filter: any = {};

    if (userRole === 'CUSTOMER') {
      filter = { customerId: userId };
    } else if (['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole)) {
      filter = { partnerId: userPartnerId };
    } else if (['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      filter = {}; // Admins see all authorized tickets
    }

    const tickets = await SupportTicket.find(filter)
      .sort({ lastActivityAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      tickets: tickets.map((t) => ({
        id: t._id.toString(),
        ticketNumber: t.ticketNumber,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        customerName: t.customerName,
        messageCount: t.messages?.length || 0,
        lastActivityAt: t.lastActivityAt,
        createdAt: t.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('[GET /api/support/tickets]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/support/tickets — Create a new ticket or append a message to an existing ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userName = session.user.name || 'User';
    const userEmail = session.user.email || '';
    const userRole = (session.user as any).role || 'CUSTOMER';
    const userPartnerId = (session.user as any).partnerId;

    const body = await req.json();
    const {
      ticketNumber, // If appending to existing ticket
      subject,
      category,
      priority,
      message,
      relatedRequestNumber,
      isInternalNote,
      attachments,
    } = body;

    await connectDB();

    // CASE 1: Appending a reply/message to an existing ticket
    if (ticketNumber) {
      const ticket = await SupportTicket.findOne({ ticketNumber });
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      const isOwner = ticket.customerId.toString() === userId;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
      const isPartner =
        ['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole) &&
        ticket.partnerId &&
        ticket.partnerId.toString() === userPartnerId;

      if (!isOwner && !isAdmin && !isPartner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const newMsg = {
        senderId: userId,
        senderName: userName,
        senderRole: userRole as any,
        content: message.trim(),
        isInternalNote: Boolean(isInternalNote && (isAdmin || isPartner)),
        attachments: attachments || [],
        createdAt: new Date(),
      };

      ticket.messages.push(newMsg as any);
      ticket.lastActivityAt = new Date();

      // Update status if replied
      if (isOwner && ticket.status === 'WAITING_FOR_USER') {
        ticket.status = 'IN_PROGRESS';
      } else if (!isOwner && !isInternalNote) {
        ticket.status = 'WAITING_FOR_USER';
      }

      await ticket.save();

      return NextResponse.json({ success: true, message: newMsg });
    }

    // CASE 2: Creating a new support ticket
    if (!subject || !message || !category) {
      return NextResponse.json(
        { error: 'Subject, category, and initial message are required' },
        { status: 400 }
      );
    }

    let newTicketNumber = generateTicketNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await SupportTicket.findOne({ ticketNumber: newTicketNumber });
      if (!existing) isUnique = true;
      else newTicketNumber = generateTicketNumber();
      attempts++;
    }

    const ticket = await SupportTicket.create({
      ticketNumber: newTicketNumber,
      customerId: userId,
      customerName: userName,
      customerEmail: userEmail,
      partnerId: userPartnerId || undefined,
      category: category,
      priority: priority || 'NORMAL',
      subject: subject.trim(),
      relatedRequestNumber: relatedRequestNumber ? relatedRequestNumber.trim() : undefined,
      status: 'OPEN',
      messages: [
        {
          senderId: userId,
          senderName: userName,
          senderRole: userRole as any,
          content: message.trim(),
          isInternalNote: false,
          attachments: attachments || [],
          createdAt: new Date(),
        },
      ],
      lastActivityAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[POST /api/support/tickets]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
