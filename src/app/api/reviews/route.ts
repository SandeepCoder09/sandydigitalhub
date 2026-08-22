import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/models/Review';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { handleApiError, AppError } from '@/lib/errors';
import cache from '@/lib/cache';
import { createReviewSchema } from '@/lib/validation/schemas';

// GET /api/reviews — Returns verified published reviews with aggregate metrics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division')?.trim();
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const featuredOnly = searchParams.get('featured') === 'true';

    const cacheKey = cache.buildKey('reviews', {
      params: { division: division || 'ALL', limit, featuredOnly },
    });

    const result = await cache.getOrSet(
      cacheKey,
      60, // 60s cache
      async () => {
        await connectDB();

        const query: any = {
          status: { $in: ['APPROVED', 'FEATURED'] },
        };

        if (division && division !== 'ALL') {
          query.division = division;
        }

        if (featuredOnly) {
          query.featuredInHomepage = true;
        }

        const reviews = await Review.find(query)
          .sort({ featuredInHomepage: -1, publishedAt: -1 })
          .limit(limit)
          .select('customerName rating title comment serviceCategory division verifiedOrder requestNumber featuredInHomepage publishedAt createdAt')
          .lean();

        // Calculate aggregate statistics
        const allApproved = await Review.find({ status: { $in: ['APPROVED', 'FEATURED'] } })
          .select('rating verifiedOrder')
          .lean();

        const totalReviews = allApproved.length;
        const verifiedCount = allApproved.filter((r) => r.verifiedOrder).length;
        const sumRatings = allApproved.reduce((acc, r) => acc + (r.rating || 5), 0);
        const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 5.0;

        return {
          reviews: reviews.map((r) => ({
            id: r._id.toString(),
            name: r.customerName || (r as any).name || 'Verified Customer',
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            serviceCategory: r.serviceCategory,
            division: r.division || 'SARA_HUB',
            verifiedOrder: r.verifiedOrder ?? false,
            requestNumber: r.requestNumber,
            featured: r.featuredInHomepage,
            createdAt: r.publishedAt || r.createdAt,
          })),
          stats: {
            totalReviews,
            verifiedCount,
            averageRating,
          },
        };
      },
      120 // SWR window 120s
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return handleApiError(err, 'GET /api/reviews');
  }
}

// POST /api/reviews — Submit a customer review with optional order verification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createReviewSchema.parse({
      userName: body.name || body.userName,
      userEmail: body.email || body.userEmail,
      rating: body.rating,
      comment: body.comment,
      serviceName: body.serviceCategory || body.serviceName,
      requestNumber: body.requestNumber,
      division: body.division || 'SARA_HUB',
    });

    await connectDB();

    const session = await getServerSession(authOptions);
    const customerId = (session?.user as any)?.id;

    let verifiedOrder = false;
    if (validated.requestNumber) {
      const orderMatch = await Order.findOne({
        $or: [
          { customOrderId: validated.requestNumber.trim() },
          { orderId: validated.requestNumber.trim() },
        ],
      }).lean();

      if (orderMatch) {
        verifiedOrder = true;
      }
    }

    const review = await Review.create({
      customerId: customerId || undefined,
      customerName: validated.userName,
      customerEmail: validated.userEmail,
      rating: validated.rating,
      title: body.title ? String(body.title).trim().slice(0, 100) : `${validated.rating}-Star Experience`,
      comment: validated.comment,
      serviceCategory: validated.serviceName || 'Citizen Services',
      division: validated.division,
      verifiedOrder,
      requestNumber: validated.requestNumber ? validated.requestNumber.trim() : undefined,
      status: 'APPROVED', // Auto-publish genuine reviews
      publishedAt: new Date(),
    });

    // Invalidate cached review feeds immediately
    cache.invalidateReviews();

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your verified review has been published.',
        reviewId: review._id,
        verifiedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error, 'POST /api/reviews');
  }
}
