import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/models/Review';

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    console.error('Fetch reviews error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, serviceCategory, rating, comment } = await req.json();

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Name, rating, and review comment are required' }, { status: 400 });
    }

    await connectDB();

    const newReview = await Review.create({
      name: name.trim(),
      phone: phone ? phone.trim() : undefined,
      serviceCategory: serviceCategory || 'Jan Seva / General',
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err: any) {
    console.error('Create review error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
