import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/models/Review';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET /api/reviews — Returns verified published reviews with aggregate metrics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division'); // 'SARA_HUB' | 'SANDY_STUDIO' | null
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const featuredOnly = searchParams.get('featured') === 'true';

    await connectDB();

    const query: any = {
      status: { $in: ['APPROVED', 'FEATURED'] },
    };

    if (division) {
      query.division = division;
    }

    if (featuredOnly) {
      query.featuredInHomepage = true;
    }

    const reviews = await Review.find(query)
      .sort({ featuredInHomepage: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    // Aggregate statistics across all approved reviews
    const allApproved = await Review.find({ status: { $in: ['APPROVED', 'FEATURED'] } }).lean();
    const totalReviews = allApproved.length;
    const verifiedCount = allApproved.filter((r) => r.verifiedOrder).length;
    const sumRatings = allApproved.reduce((acc, r) => acc + (r.rating || 5), 0);
    const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 5.0;

    return NextResponse.json({
      success: true,
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
    });
  } catch (err: any) {
    console.error('[GET /api/reviews]', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews — Submit a customer review with optional order verification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      rating,
      title,
      comment,
      serviceCategory,
      division,
      requestNumber,
    } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, rating (1-5), and review comment are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await getServerSession(authOptions);
    const customerId = (session?.user as any)?.id;

    // Check if requestNumber is provided and verify it
    let verifiedOrder = false;
    let orderRecord: any = null;

    if (requestNumber) {
      orderRecord = await Order.findOne({
        $or: [{ customOrderId: requestNumber.trim() }, { orderId: requestNumber.trim() }],
      }).lean();

      if (orderRecord) {
        verifiedOrder = true;
      }
    }

    const review = await Review.create({
      customerId: customerId || undefined,
      customerName: name.trim(),
      customerEmail: email ? email.trim() : undefined,
      customerPhone: phone ? phone.trim() : undefined,
      requestId: orderRecord?._id || undefined,
      requestNumber: orderRecord ? requestNumber.trim() : undefined,
      partnerId: orderRecord?.partnerId || undefined,
      serviceCategory: serviceCategory || orderRecord?.serviceName || 'Jan Seva / Digital Facilitation',
      division: division || 'SARA_HUB',
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? title.trim() : undefined,
      comment: comment.trim(),
      verifiedOrder,
      status: 'APPROVED', // Default approved, moderated by admin
      isApproved: true,
      featuredInHomepage: Number(rating) >= 4,
      verifiedAt: verifiedOrder ? new Date() : undefined,
      publishedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review._id,
        name: review.customerName,
        rating: review.rating,
        verifiedOrder: review.verifiedOrder,
        status: review.status,
      },
    });
  } catch (err: any) {
    console.error('[POST /api/reviews]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
