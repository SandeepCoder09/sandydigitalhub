/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ensureServicesSeeded } from '@/lib/seedServices';
import { cache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    // In-memory caching with 60-second TTL to avoid hitting DB repeatedly under high traffic
    const services = await cache.getOrSet('services:active', 60, async () => {
      await connectDB();
      await ensureServicesSeeded();
      return Service.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).lean();
    });

    const response = NextResponse.json({ services });
    
    // HTTP / CDN Edge Caching header to offload requests from server
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(session.user.id || 'admin', { limit: 20, windowSeconds: 60 });
    if (!rateLimit.success) {
      return NextResponse.json({ message: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const data = await req.json();
    await connectDB();
    
    const service = await Service.create(data);

    // Invalidate cached services so newly created services show up immediately
    cache.invalidate('services');

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating service' }, { status: 500 });
  }
}
