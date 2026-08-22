import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PricingConfig } from '@/models/PricingConfig';
import { DEFAULT_STUDIO_PACKAGES, DEFAULT_STUDIO_ADDONS } from '@/lib/pricingData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { cache } from '@/lib/cache';

// GET /api/pricing — Returns single source of truth for platform pricing
export async function GET(req: NextRequest) {
  try {
    const data = await cache.getOrSet(
      'public:pricing:v1',
      300, // 5 minutes cache
      async () => {
        await connectDB();
        const config = await PricingConfig.findOne({ version: 1 }).lean();

        return {
          packages: DEFAULT_STUDIO_PACKAGES,
          addOns: DEFAULT_STUDIO_ADDONS,
          taxRatePercentage: config?.taxRatePercentage ?? 0,
          taxMode: config?.taxMode ?? 'INCLUSIVE',
          currency: 'INR',
        };
      },
      600 // SWR window 10 minutes
    );

    const res = NextResponse.json({
      success: true,
      ...data,
    });
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res;
  } catch (error: any) {
    console.error('[GET /api/pricing]', error);
    // Fallback to static constants if DB isn't initialized yet
    const res = NextResponse.json({
      success: true,
      packages: DEFAULT_STUDIO_PACKAGES,
      addOns: DEFAULT_STUDIO_ADDONS,
      taxRatePercentage: 0,
      taxMode: 'INCLUSIVE',
      currency: 'INR',
    });
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res;
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

    // Invalidate public pricing cache immediately
    cache.invalidatePricing();

    const res = NextResponse.json({ success: true, config });
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return res;
  } catch (error: any) {
    console.error('[POST /api/pricing]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
