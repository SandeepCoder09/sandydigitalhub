import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { verifyPartnerAccess } from '@/lib/tenant';

// GET /api/partner/branding
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const partner = await Partner.findOne({ partnerId: access.partnerId }).lean();
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: partner.name,
      slug: partner.slug,
      ownerPhone: partner.ownerPhone,
      whatsapp: partner.whatsapp,
      address: partner.address,
      city: partner.city,
      state: partner.state,
      branding: partner.branding,
      whiteLabel: partner.whiteLabel,
    });
  } catch (error: any) {
    console.error('Error in GET /api/partner/branding:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch branding' }, { status: 500 });
  }
}

// PATCH /api/partner/branding
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const partner = await Partner.findOne({ partnerId: access.partnerId });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    if (body.name) partner.name = body.name;
    if (body.ownerPhone) partner.ownerPhone = body.ownerPhone;
    if (body.whatsapp) partner.whatsapp = body.whatsapp;
    if (body.address) partner.address = body.address;
    if (body.city) partner.city = body.city;

    if (body.branding) {
      partner.branding = {
        ...partner.branding,
        ...body.branding,
      };
    }

    await partner.save();

    return NextResponse.json({ success: true, partner });
  } catch (error: any) {
    console.error('Error in PATCH /api/partner/branding:', error);
    return NextResponse.json({ error: error.message || 'Failed to update branding' }, { status: 500 });
  }
}
