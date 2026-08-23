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
    const rateCheck = checkRateLimit(`track-order:${ip}`, { limit: 30, windowSeconds: 60 });
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

    let orders: any[] = [];

    // 1. Direct MongoDB ObjectId Match
    if (mongoose.Types.ObjectId.isValid(query) && query.length === 24) {
      orders = await Order.find({ _id: query })
        .sort({ createdAt: -1 })
        .populate('userId', 'name phone email')
        .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
        .lean();
    }

    // 2. Custom Order ID Exact / Case-Insensitive Match
    if (orders.length === 0) {
      orders = await Order.find({
        $or: [
          { customOrderId: query },
          { customOrderId: { $regex: `^${query}$`, $options: 'i' } },
        ],
      })
        .sort({ createdAt: -1 })
        .populate('userId', 'name phone email')
        .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
        .lean();
    }

    // 3. Branded Order ID Match (e.g. SDH-20260820-341D or suffix 341D)
    if (orders.length === 0) {
      const parts = query.split('-');
      const suffix = parts[parts.length - 1]?.trim().toLowerCase() || '';

      if (suffix.length >= 3 && suffix.length <= 8) {
        // Query candidates whose ObjectId string ends with the suffix
        const candidates = await Order.find({
          $expr: {
            $regexMatch: {
              input: { $toString: '$_id' },
              regex: `${suffix}$`,
              options: 'i',
            },
          },
        })
          .sort({ createdAt: -1 })
          .populate('userId', 'name phone email')
          .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
          .lean();

        if (candidates.length > 0) {
          // If the query contains SDH-... check for exact formatted match first
          const exactMatches = candidates.filter((c: any) =>
            formatOrderId(c._id.toString(), c.createdAt).toLowerCase() === query.toLowerCase()
          );

          orders = exactMatches.length > 0 ? exactMatches : candidates;
        }
      }
    }

    // 4. Mobile Number / Phone / Email lookup
    if (orders.length === 0) {
      const cleanDigits = query.replace(/[^\d]/g, '');
      if (cleanDigits.length >= 8) {
        const last10 = cleanDigits.slice(-10);
        const users = await User.find({
          $or: [
            { mobile: { $regex: last10, $options: 'i' } },
            { phone: { $regex: last10, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        })
          .select('_id')
          .lean();

        if (users.length > 0) {
          const userIds = users.map((u) => u._id);
          orders = await Order.find({ userId: { $in: userIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'name phone email')
            .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
            .lean();
        }
      }
    }

    // 5. Fallback: Scan recent orders and match against formatted branded ID
    if (orders.length === 0) {
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate('userId', 'name phone email')
        .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
        .lean();

      const matched = recentOrders.filter((o: any) => {
        const branded = formatOrderId(o._id.toString(), o.createdAt).toLowerCase();
        const q = query.toLowerCase();
        return branded === q || branded.includes(q) || o._id.toString().toLowerCase().includes(q);
      });

      if (matched.length > 0) {
        orders = matched;
      }
    }

    if (!orders || orders.length === 0) {
      throw AppError.notFound('No requests found matching the provided tracking information.');
    }

    // Map order fields for safe public tracking response (mask customer name for privacy)
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
