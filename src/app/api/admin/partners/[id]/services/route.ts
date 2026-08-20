import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { Service } from '@/models/Service';
import { PartnerAuditLog } from '@/models/PartnerAuditLog';

// GET /api/admin/partners/[id]/services - Get available and assigned services
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

    // Fetch all active global services
    const globalServices = await Service.find({ status: 'ACTIVE' }).lean();

    // Map assigned services status
    const assignedMap = new Map();
    (partner.assignedServices || []).forEach((as: any) => {
      assignedMap.set(as.serviceId, as);
    });

    const combinedServices = globalServices.map((gs) => {
      const assigned = assignedMap.get(gs._id.toString());
      return {
        serviceId: gs._id.toString(),
        title: gs.title,
        category: gs.category,
        basePrice: gs.price,
        image: gs.image,
        enabled: assigned ? assigned.enabled : false,
        customPrice: assigned?.customPrice ?? gs.price,
        customDescription: assigned?.customDescription ?? gs.description,
      };
    });

    return NextResponse.json({ services: combinedServices });
  } catch (error: any) {
    console.error('Error in GET /api/admin/partners/[id]/services:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/admin/partners/[id]/services - Update service assignments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const { assignedServices } = body;

    if (!Array.isArray(assignedServices)) {
      return NextResponse.json({ error: 'assignedServices must be an array' }, { status: 400 });
    }

    const partner = await Partner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }],
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    partner.assignedServices = assignedServices;
    await partner.save();

    await PartnerAuditLog.create({
      actorId: session.user.id || 'admin',
      actorName: session.user.name || 'Super Admin',
      actorRole: session.user.role || 'SUPER_ADMIN',
      partnerId: partner.partnerId,
      action: 'SERVICES_UPDATED',
      targetType: 'PartnerServices',
      targetId: partner._id.toString(),
      details: { count: assignedServices.filter((s: any) => s.enabled).length },
    });

    return NextResponse.json({ success: true, assignedServices: partner.assignedServices });
  } catch (error: any) {
    console.error('Error in POST /api/admin/partners/[id]/services:', error);
    return NextResponse.json({ error: error.message || 'Failed to update services' }, { status: 500 });
  }
}
