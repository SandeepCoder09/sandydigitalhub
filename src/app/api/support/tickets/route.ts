import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SupportTicket } from '@/models/SupportTicket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { handleApiError, AppError } from '@/lib/errors';
import { createTicketSchema, addTicketMessageSchema } from '@/lib/validation/schemas';

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
      throw AppError.unauthorized();
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userPartnerId = (session.user as any).partnerId;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const ticketNumber = searchParams.get('ticketNumber')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status')?.trim();
    const category = searchParams.get('category')?.trim();

    if (ticketNumber) {
      const ticket = await SupportTicket.findOne({ ticketNumber }).lean();
      if (!ticket) {
        throw AppError.notFound('Ticket not found with provided reference number.');
      }

      // Role authorization check (IDOR prevention)
      const isOwner = ticket.customerId.toString() === userId;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
      const isPartner =
        ['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole) &&
        ticket.partnerId &&
        ticket.partnerId.toString() === userPartnerId;

      if (!isOwner && !isAdmin && !isPartner) {
        throw AppError.forbidden('You do not have permission to view this ticket.');
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
      if (!userPartnerId) {
        throw AppError.forbidden('User is not assigned to any partner center.');
      }
      filter = { partnerId: userPartnerId };
    } else if (['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      const partnerParam = searchParams.get('partnerId');
      if (partnerParam) filter.partnerId = partnerParam;
    }

    if (status && status !== 'ALL') filter.status = status;
    if (category && category !== 'ALL') filter.category = category;

    const total = await SupportTicket.countDocuments(filter);
    const tickets = await SupportTicket.find(filter)
      .sort({ lastActivityAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('ticketNumber subject category priority status customerName messages lastActivityAt createdAt')
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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/support/tickets');
  }
}

// POST /api/support/tickets — Create a new ticket or append a message to an existing ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw AppError.unauthorized();
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userName = (session.user as any).name || 'User';
    const userEmail = (session.user as any).email || '';
    const userPartnerId = (session.user as any).partnerId;

    const body = await req.json();
    await connectDB();

    // ── Scenario A: Append a message to existing ticket ──
    if (body.ticketId) {
      const validated = addTicketMessageSchema.parse(body);
      const ticket = await SupportTicket.findOne({
        $or: [{ _id: validated.ticketId }, { ticketNumber: validated.ticketId }],
      });

      if (!ticket) {
        throw AppError.notFound('Ticket not found.');
      }

      // Verify access
      const isOwner = ticket.customerId.toString() === userId;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
      const isPartner =
        ['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole) &&
        ticket.partnerId &&
        ticket.partnerId.toString() === userPartnerId;

      if (!isOwner && !isAdmin && !isPartner) {
        throw AppError.forbidden('You do not have permission to comment on this ticket.');
      }

      // Customer cannot create internal notes
      const isInternal = (!isOwner && (isAdmin || isPartner)) ? !!validated.isInternalNote : false;

      ticket.messages.push({
        senderId: userId,
        senderRole: userRole,
        senderName: userName,
        message: validated.message,
        isInternalNote: isInternal,
        attachments: validated.attachments || [],
        createdAt: new Date(),
      });

      // Update status on response
      if (isOwner && ticket.status === 'WAITING_ON_CUSTOMER') {
        ticket.status = 'IN_PROGRESS';
      } else if (!isOwner && !isInternal) {
        ticket.status = 'WAITING_ON_CUSTOMER';
      }

      ticket.lastActivityAt = new Date();
      await ticket.save();

      return NextResponse.json({
        success: true,
        message: 'Message added to ticket thread successfully.',
      });
    }

    // ── Scenario B: Create a brand new ticket ──
    const validated = createTicketSchema.parse(body);

    let ticketNumber = generateTicketNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await SupportTicket.findOne({ ticketNumber });
      if (!existing) isUnique = true;
      else ticketNumber = generateTicketNumber();
      attempts++;
    }

    const ticket = await SupportTicket.create({
      ticketNumber,
      customerId: userId,
      customerName: userName,
      customerEmail: userEmail,
      partnerId: userPartnerId || undefined,
      subject: validated.subject,
      category: validated.category,
      priority: validated.priority || 'MEDIUM',
      relatedRequestNumber: validated.relatedRequestNumber || undefined,
      status: 'OPEN',
      messages: [
        {
          senderId: userId,
          senderRole: userRole,
          senderName: userName,
          message: validated.message,
          isInternalNote: false,
          attachments: [],
          createdAt: new Date(),
        },
      ],
      lastActivityAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        ticketNumber: ticket.ticketNumber,
        message: 'Support ticket created successfully.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error, 'POST /api/support/tickets');
  }
}
