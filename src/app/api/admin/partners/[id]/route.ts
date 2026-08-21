import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { PartnerAuditLog } from '@/models/PartnerAuditLog';
import { notifyPartnerApproved, notifyPartnerSuspended } from '@/lib/notificationTriggers';

// GET /api/admin/partners/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const partner = await Partner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }],
    }).lean();

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Fetch partner staff
    const staff = await User.find({ partnerId: partner.partnerId })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch recent requests
    const recentOrders = await Order.find({ partnerId: partner.partnerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Audit logs
    const auditLogs = await PartnerAuditLog.find({ partnerId: partner.partnerId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      partner,
      staff,
      recentOrders,
      auditLogs,
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/partners/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch partner' }, { status: 500 });
  }
}

// PATCH /api/admin/partners/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const partner = await Partner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }],
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    const previousStatus = partner.status;

    // Apply allowed updates
    if (body.name !== undefined) partner.name = body.name;
    if (body.ownerName !== undefined) partner.ownerName = body.ownerName;
    if (body.ownerEmail !== undefined) partner.ownerEmail = body.ownerEmail;
    if (body.ownerPhone !== undefined) partner.ownerPhone = body.ownerPhone;
    if (body.whatsapp !== undefined) partner.whatsapp = body.whatsapp;
    if (body.address !== undefined) partner.address = body.address;
    if (body.city !== undefined) partner.city = body.city;
    if (body.state !== undefined) partner.state = body.state;
    if (body.pincode !== undefined) partner.pincode = body.pincode;
    if (body.plan !== undefined) partner.plan = body.plan;
    if (body.status !== undefined) partner.status = body.status;
    if (body.statusReason !== undefined) partner.statusReason = body.statusReason;
    if (body.branding !== undefined) partner.branding = { ...partner.branding, ...body.branding };
    if (body.commission !== undefined) partner.commission = { ...partner.commission, ...body.commission };
    if (body.whiteLabel !== undefined) partner.whiteLabel = { ...partner.whiteLabel, ...body.whiteLabel };
    if (body.assignedServices !== undefined) partner.assignedServices = body.assignedServices;

    await partner.save();

    // Log status transition if status changed
    if (body.status && body.status !== previousStatus) {
      await PartnerAuditLog.create({
        actorId: session.user.id || 'admin',
        actorName: session.user.name || 'Super Admin',
        actorRole: session.user.role || 'SUPER_ADMIN',
        partnerId: partner.partnerId,
        action: 'STATUS_CHANGED',
        targetType: 'Partner',
        targetId: partner._id.toString(),
        details: { from: previousStatus, to: partner.status, reason: partner.statusReason },
      });

      // Find the partner admin user to notify them
      const partnerAdminUser = await User.findOne({ partnerId: partner.partnerId, role: 'PARTNER_ADMIN' }).select('_id').lean();
      const partnerAdminUserId = partnerAdminUser?._id?.toString();

      if (partnerAdminUserId) {
        if (partner.status === 'ACTIVE' && previousStatus !== 'ACTIVE') {
          // Partner was just approved/reactivated
          await notifyPartnerApproved(partner.name, partnerAdminUserId).catch(console.error);
        } else if (partner.status === 'SUSPENDED') {
          await notifyPartnerSuspended(partner.name, partnerAdminUserId, partner.statusReason).catch(console.error);
        }
      }
    }

    return NextResponse.json({ success: true, partner });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/partners/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update partner' }, { status: 500 });
  }
}

// DELETE /api/admin/partners/[id] - Soft delete (Cancel)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const partner = await Partner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }],
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    partner.status = 'CANCELLED';
    partner.statusReason = 'Cancelled by platform super admin';
    await partner.save();

    await PartnerAuditLog.create({
      actorId: session.user.id || 'admin',
      actorName: session.user.name || 'Super Admin',
      actorRole: session.user.role || 'SUPER_ADMIN',
      partnerId: partner.partnerId,
      action: 'PARTNER_CANCELLED',
      targetType: 'Partner',
      targetId: partner._id.toString(),
    });

    return NextResponse.json({ success: true, message: 'Partner status set to CANCELLED' });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/partners/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to cancel partner' }, { status: 500 });
  }
}
