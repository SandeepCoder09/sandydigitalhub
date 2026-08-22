import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery, sanitizeText } from '@/lib/validation/sanitize';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`track-order:${ip}`, { limit: 20, windowSeconds: 60 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Too many tracking requests. Please wait a moment.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const trackingId = sanitizedBody?.trackingId ? sanitizeText(String(sanitizedBody.trackingId), 100) : '';
    const phone = sanitizedBody?.phone ? sanitizeText(String(sanitizedBody.phone), 20) : '';

    if (!trackingId && !phone) {
      throw AppError.badRequest('Order ID or registered Mobile Number is required.');
    }

    await connectDB();

    let orders: any[] = [];

    if (trackingId) {
      if (mongoose.Types.ObjectId.isValid(trackingId)) {
        orders = await Order.find({ _id: trackingId })
          .sort({ createdAt: -1 })
          .populate('userId', 'name phone email')
          .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
          .lean();
      } else {
        // Search by customOrderId or match by pattern
        orders = await Order.find({
          $or: [
            { customOrderId: trackingId },
            { customOrderId: { $regex: trackingId, $options: 'i' } },
          ],
        })
          .sort({ createdAt: -1 })
          .populate('userId', 'name phone email')
          .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
          .lean();
      }
    } else if (phone) {
      const matchedUser = await User.findOne({ mobile: phone }).select('_id').lean();
      if (!matchedUser) {
        throw AppError.notFound('No requests found for this mobile number.');
      }
      orders = await Order.find({ userId: matchedUser._id })
        .sort({ createdAt: -1 })
        .populate('userId', 'name phone email')
        .select('customOrderId services total paymentMethod paymentStatus orderStatus documentUrl documentName createdAt userId')
        .lean();
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
