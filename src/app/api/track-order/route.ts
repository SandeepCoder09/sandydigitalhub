import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery, sanitizeText } from '@/lib/validation/sanitize';
import { formatOrderId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`track-order:${ip}`, { limit: 120, windowSeconds: 60 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Too many tracking requests. Please wait a moment.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const rawQuery = (sanitizedBody?.trackingId || sanitizedBody?.phone || sanitizedBody?.query || '').toString().trim();
    const query = sanitizeText(rawQuery, 100);

    if (!query) {
      throw AppError.badRequest('Order ID, Tracking Code, or registered Mobile Number is required.');
    }

    await connectDB();

    const orConditions: any[] = [];

    // 1. Direct MongoDB ObjectId match
    if (mongoose.Types.ObjectId.isValid(query) && query.length === 24) {
      orConditions.push({ _id: new mongoose.Types.ObjectId(query) });
    }

    // 2. Custom Order ID match
    orConditions.push({ customOrderId: query });
    orConditions.push({ customOrderId: { $regex: `^${query}$`, $options: 'i' } });

    // 3. Hex Suffix matching (e.g. 59B5 or SDH-20260805-59B5)
    const suffix = query.split('-').pop()?.trim().toLowerCase() || '';
    if (suffix.length >= 3 && suffix.length <= 8 && /^[0-9a-f]+$/i.test(suffix)) {
      orConditions.push({
        $expr: {
          $regexMatch: {
            input: { $toString: '$_id' },
            regex: `${suffix}$`,
            options: 'i',
          },
        },
      });
    }

    // Execute fast primary search
    let orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name phone email')
      .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
      .lean();

    // If query has SDH-... prefix and multiple candidates returned, find exact branded match
    if (orders.length > 1 && query.toUpperCase().startsWith('SDH-')) {
      const exact = orders.filter((o: any) =>
        formatOrderId(o._id.toString(), o.createdAt).toUpperCase() === query.toUpperCase()
      );
      if (exact.length > 0) {
        orders = exact;
      }
    }

    // 4. If not found, check phone / email in parallel
    if (orders.length === 0) {
      const cleanDigits = query.replace(/[^\d]/g, '');
      if (cleanDigits.length >= 8) {
        const last10 = cleanDigits.slice(-10);
        const users = await User.find({
          $or: [
            { mobile: { $regex: last10 } },
            { phone: { $regex: last10 } },
            { email: { $regex: query, $options: 'i' } },
          ],
        })
          .select('_id')
          .lean();

        if (users.length > 0) {
          orders = await Order.find({ userId: { $in: users.map((u) => u._id) } })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name phone email')
            .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
            .lean();
        }
      }
    }

    // 5. Fallback scan for recent orders
    if (orders.length === 0) {
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('userId', 'name phone email')
        .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
        .lean();

      const matched = recentOrders.filter((o: any) => {
        const branded = formatOrderId(o._id.toString(), o.createdAt).toUpperCase();
        const q = query.toUpperCase();
        return branded === q || branded.includes(q) || o._id.toString().toUpperCase().includes(q);
      });

      if (matched.length > 0) {
        orders = matched;
      }
    }

    if (!orders || orders.length === 0) {
      throw AppError.notFound('No requests found matching the provided tracking information.');
    }

    // Safe public projection
    const formattedOrders = orders.map((o: any) => ({
      orderId: o._id.toString(),
      customOrderId: o.customOrderId || null,
      createdAt: o.createdAt,
      services: o.services,
      total: o.total,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      documentUrl: o.documentUrl,
      documentName: o.documentName,
      customerName: o.userId?.name ? `${o.userId.name.slice(0, 3)}***` : 'Customer',
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/track-order');
  }
}
