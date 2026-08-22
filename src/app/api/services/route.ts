import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ensureServicesSeeded } from '@/lib/seedServices';
import { cache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rateLimit';
import { handleApiError, AppError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim();

    const cacheKey = cache.buildKey('services:active', {
      params: { category: category || 'ALL' },
    });

    const services = await cache.getOrSet(
      cacheKey,
      60,
      async () => {
        await connectDB();
        await ensureServicesSeeded();

        const query: any = { status: 'ACTIVE' };
        if (category && category !== 'ALL') {
          query.category = category;
        }

        return Service.find(query)
          .sort({ category: 1, title: 1 })
          .select('title slug category description basePrice fastDeliveryAvailable documentRequirements formFields status')
          .lean();
      },
      300
    );

    const response = NextResponse.json({ success: true, services });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error: any) {
    return handleApiError(error, 'GET /api/services');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw AppError.unauthorized('Administrator privileges required to create services.');
    }

    const rateLimit = checkRateLimit(session.user.id || 'admin', { limit: 20, windowSeconds: 60 });
    if (!rateLimit.success) {
      throw AppError.rateLimited();
    }

    const data = await req.json();
    if (!data.title || !data.category || data.basePrice === undefined) {
      throw AppError.badRequest('Service title, category, and base price are required.');
    }

    await connectDB();
    const service = await Service.create(data);

    // Invalidate cached services so newly created services appear immediately
    cache.invalidateServices();

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/services');
  }
}
