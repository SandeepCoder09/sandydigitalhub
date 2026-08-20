import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { Service } from '@/models/Service';
import { User } from '@/models/User';
import { PartnerAuditLog } from '@/models/PartnerAuditLog';
import bcrypt from 'bcryptjs';

// GET /api/admin/partners - List all partner centers with stats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const plan = searchParams.get('plan') || '';

    const query: any = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (plan && plan !== 'ALL') {
      query.plan = plan;
    }
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { partnerId: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
        { ownerName: { $regex: search.trim(), $options: 'i' } },
        { ownerEmail: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const partners = await Partner.find(query).sort({ createdAt: -1 }).lean();

    // Metrics summary
    const totalPartners = await Partner.countDocuments();
    const activePartners = await Partner.countDocuments({ status: 'ACTIVE' });
    const pendingPartners = await Partner.countDocuments({ status: 'PENDING' });
    const suspendedPartners = await Partner.countDocuments({ status: 'SUSPENDED' });

    return NextResponse.json({
      partners,
      metrics: {
        total: totalPartners,
        active: activePartners,
        pending: pendingPartners,
        suspended: suspendedPartners,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/partners:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST /api/admin/partners - Create new partner center
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const {
      name,
      ownerName,
      ownerEmail,
      ownerPhone,
      whatsapp,
      address,
      city,
      state,
      country,
      pincode,
      slug,
      plan = 'STARTER',
      status = 'ACTIVE',
      branding = {},
      commission = {},
      adminPassword,
    } = body;

    if (!name || !ownerName || !ownerEmail || !ownerPhone || !whatsapp || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields (name, ownerName, ownerEmail, ownerPhone, whatsapp, slug)' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    // Check slug uniqueness
    const existingSlug = await Partner.findOne({ slug: cleanSlug });
    if (existingSlug) {
      return NextResponse.json({ error: `The URL slug '${cleanSlug}' is already in use by another center.` }, { status: 400 });
    }

    // Generate unique Partner ID: SARA-XXXX
    const count = await Partner.countDocuments();
    const partnerId = `SARA-${String(count + 1).padStart(4, '0')}`;

    // Fetch existing global services to pre-populate assignedServices
    const globalServices = await Service.find({ status: 'ACTIVE' }).lean();
    const assignedServices = globalServices.map((srv) => ({
      serviceId: srv._id.toString(),
      title: srv.title,
      category: srv.category,
      enabled: true,
      basePrice: srv.price,
      customPrice: srv.price,
    }));

    // Create Partner Record
    const partner = await Partner.create({
      partnerId,
      slug: cleanSlug,
      name,
      ownerName,
      ownerEmail: ownerEmail.toLowerCase().trim(),
      ownerPhone,
      whatsapp,
      address: address || '',
      city: city || '',
      state: state || '',
      country: country || 'India',
      pincode: pincode || '',
      plan,
      status,
      branding: {
        logoUrl: branding.logoUrl || '',
        faviconUrl: branding.faviconUrl || '',
        bannerUrl: branding.bannerUrl || '',
        primaryColor: branding.primaryColor || '#7C3AED',
        accentColor: branding.accentColor || '#6D28D9',
        tagline: branding.tagline || 'Your Trusted Local Digital Service Center',
        description: branding.description || 'Authorized digital form assistance, document processing, and online facilitation services.',
        businessHours: branding.businessHours || 'Mon – Sat: 9:00 AM – 8:00 PM',
      },
      commission: {
        model: commission.model || 'PERCENTAGE',
        partnerShare: commission.partnerShare ?? 80,
        platformShare: commission.platformShare ?? 20,
        fixedPlatformFee: commission.fixedPlatformFee ?? 0,
      },
      assignedServices,
      onboarding: [
        { step: 'PROFILE', title: 'Complete Center Profile', completed: true },
        { step: 'BRANDING', title: 'Upload Logo & Set Colors', completed: Boolean(branding.logoUrl) },
        { step: 'SERVICES', title: 'Review Assigned Services', completed: true },
        { step: 'STAFF', title: 'Add Staff Members', completed: false },
        { step: 'TEST_ORDER', title: 'Test Public Center Page', completed: false },
      ],
    });

    // Create or Link Partner Admin User Account
    let user = await User.findOne({ email: ownerEmail.toLowerCase().trim() });
    if (!user) {
      const defaultPassword = adminPassword || 'Partner@2026';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      user = await User.create({
        name: ownerName,
        email: ownerEmail.toLowerCase().trim(),
        mobile: ownerPhone,
        password: hashedPassword,
        role: 'PARTNER_ADMIN',
        partnerId: partner.partnerId,
        permissions: ['all'],
        status: 'ACTIVE',
      });
    } else {
      user.role = 'PARTNER_ADMIN';
      user.partnerId = partner.partnerId;
      await user.save();
    }

    // Record Audit Log
    await PartnerAuditLog.create({
      actorId: session.user.id || 'admin',
      actorName: session.user.name || 'Super Admin',
      actorRole: session.user.role || 'SUPER_ADMIN',
      partnerId: partner.partnerId,
      action: 'PARTNER_CREATED',
      targetType: 'Partner',
      targetId: partner._id.toString(),
      details: { name: partner.name, slug: partner.slug, plan: partner.plan, ownerEmail: partner.ownerEmail },
    });

    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/admin/partners:', error);
    return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 });
  }
}
