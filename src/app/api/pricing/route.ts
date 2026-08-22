import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PricingConfig } from '@/models/PricingConfig';
import { DEFAULT_STUDIO_PACKAGES, DEFAULT_STUDIO_ADDONS } from '@/lib/pricingData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET /api/pricing — Returns single source of truth for platform pricing
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const config = await PricingConfig.findOne({ version: 1 }).lean();

    return NextResponse.json({
      success: true,
      packages: DEFAULT_STUDIO_PACKAGES,
      addOns: DEFAULT_STUDIO_ADDONS,
      taxRatePercentage: config?.taxRatePercentage ?? 0,
      taxMode: config?.taxMode ?? 'INCLUSIVE',
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('[GET /api/pricing]', error);
    // Fallback to static constants if DB isn't initialized yet
    return NextResponse.json({
      success: true,
      packages: DEFAULT_STUDIO_PACKAGES,
      addOns: DEFAULT_STUDIO_ADDONS,
      taxRatePercentage: 0,
      taxMode: 'INCLUSIVE',
      currency: 'INR',
    });
  }
}

// POST /api/pricing — Admin only: update tax rate or custom items
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const config = await PricingConfig.findOneAndUpdate(
      { version: 1 },
      {
        $set: {
          taxRatePercentage: body.taxRatePercentage,
          taxMode: body.taxMode,
          partnerBasePlatformFee: body.partnerBasePlatformFee,
          updatedBy: session.user.email,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('[POST /api/pricing]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
