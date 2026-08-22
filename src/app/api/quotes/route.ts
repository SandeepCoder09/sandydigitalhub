import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SDS-${year}-${randomSuffix}`;
}

// POST /api/quotes — Save a new estimate quotation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      companyName,
      projectType,
      scope,
      timelineWeeks,
      selectedItems,
      basePrice,
      addOnsPrice,
      estimatedSubtotal,
      taxRate,
      taxAmount,
      estimatedTotal,
      notes,
    } = body;

    if (!name || !email || !projectType || estimatedTotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required quotation fields (name, email, projectType, estimatedTotal)' },
        { status: 400 }
      );
    }

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
      name,
      email,
      phone: phone || '',
      companyName: companyName || '',
      projectType,
      scope: scope || 'Standard',
      timelineWeeks: timelineWeeks || 2,
      selectedItems: selectedItems || [],
      basePrice: basePrice || 0,
      addOnsPrice: addOnsPrice || 0,
      estimatedSubtotal: estimatedSubtotal || basePrice || 0,
      taxRate: taxRate || 0,
      taxAmount: taxAmount || 0,
      estimatedTotal: estimatedTotal,
      currency: 'INR',
      notes: notes || '',
      status: 'SAVED',
    });

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('[POST /api/quotes]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// GET /api/quotes — Fetch quotes (by quoteNumber or authenticated user/admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteNumber = searchParams.get('quoteNumber');

    await connectDB();

    if (quoteNumber) {
      const quote = await Quote.findOne({ quoteNumber }).lean();
      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, quote });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);
    const customerId = (session.user as any).id;

    const filter = isAdmin ? {} : { customerId };
    const quotes = await Quote.find(filter).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({ success: true, quotes });
  } catch (error: any) {
    console.error('[GET /api/quotes]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
