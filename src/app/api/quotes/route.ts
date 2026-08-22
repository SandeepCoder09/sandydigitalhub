import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { handleApiError, AppError } from '@/lib/errors';
import { createQuoteSchema } from '@/lib/validation/schemas';

function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SDS-${year}-${randomSuffix}`;
}

// POST /api/quotes — Save a new estimate quotation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createQuoteSchema.parse({
      name: body.name,
      email: body.email,
      phone: body.phone,
      packageId: body.packageId || body.projectType || 'custom',
      packageName: body.packageName || body.projectType || 'Custom Project',
      projectType: body.projectType || 'Custom Development',
      selectedAddons: body.selectedItems || body.selectedAddons || [],
      basePrice: Number(body.basePrice || 0),
      addonsPrice: Number(body.addOnsPrice || body.addonsPrice || 0),
      estimatedTotal: Number(body.estimatedTotal || 0),
      timelineWeeks: Number(body.timelineWeeks || 2),
      notes: body.notes,
    });

    await connectDB();

    const session = await getServerSession(authOptions);
    const customerId = (session?.user as any)?.id;

    // Generate unique quote number
    let quoteNumber = generateQuoteNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await Quote.findOne({ quoteNumber });
      if (!existing) isUnique = true;
      else quoteNumber = generateQuoteNumber();
      attempts++;
    }

    const quote = await Quote.create({
      quoteNumber,
      customerId: customerId || undefined,
      name: validated.name,
      email: validated.email,
      phone: validated.phone || '',
      companyName: body.companyName ? String(body.companyName).trim().slice(0, 100) : '',
      projectType: validated.projectType,
      scope: body.scope ? String(body.scope).trim().slice(0, 100) : 'Standard',
      timelineWeeks: validated.timelineWeeks,
      selectedItems: validated.selectedAddons,
      basePrice: validated.basePrice,
      addOnsPrice: validated.addonsPrice,
      estimatedSubtotal: validated.basePrice + validated.addonsPrice,
      taxRate: Number(body.taxRate || 0),
      taxAmount: Number(body.taxAmount || 0),
      estimatedTotal: validated.estimatedTotal,
      currency: 'INR',
      notes: validated.notes || '',
      status: 'SAVED',
    });

    return NextResponse.json(
      {
        success: true,
        quoteNumber: quote.quoteNumber,
        quote: {
          id: quote._id,
          quoteNumber: quote.quoteNumber,
          name: quote.name,
          email: quote.email,
          projectType: quote.projectType,
          estimatedTotal: quote.estimatedTotal,
          timelineWeeks: quote.timelineWeeks,
          expiresAt: quote.expiresAt,
          createdAt: quote.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error, 'POST /api/quotes');
  }
}

// GET /api/quotes — Fetch quotes (by quoteNumber or authenticated user/admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteNumber = searchParams.get('quoteNumber')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    await connectDB();

    if (quoteNumber) {
      const quote = await Quote.findOne({ quoteNumber }).lean();
      if (!quote) {
        throw AppError.notFound('Quotation not found with provided reference number.');
      }
      return NextResponse.json({ success: true, quote });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw AppError.unauthorized();
    }

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);
    const customerId = (session.user as any).id;

    const filter = isAdmin ? {} : { customerId };
    const total = await Quote.countDocuments(filter);
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('quoteNumber name email projectType estimatedTotal timelineWeeks status expiresAt createdAt')
      .lean();

    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/quotes');
  }
}
