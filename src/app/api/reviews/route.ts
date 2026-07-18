/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const ordersWithReviews = await Order.find({
      rating: { $gte: 1 },
      reviewText: { $exists: true, $ne: '' }
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('userId', 'name role');

    const formattedReviews = ordersWithReviews.map((order: any) => ({
      id: order._id.toString(),
      name: order.userId?.name || 'Verified Customer',
      role: 'Verified Client',
      content: order.reviewText,
      rating: order.rating || 5,
      initials: order.userId?.name ? order.userId.name.slice(0, 2).toUpperCase() : 'VC',
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    return NextResponse.json({ reviews: [] });
  }
}
