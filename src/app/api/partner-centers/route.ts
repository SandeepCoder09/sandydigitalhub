import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';

// GET /api/partner-centers — Returns public active partner centers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase();
    const city = searchParams.get('city')?.toLowerCase();

    await connectDB();

    const filter: any = {
      status: 'ACTIVE',
    };

    const partners = await Partner.find(filter)
      .select('name slug address city state pincode ownerPhone whatsapp branding services status assignedServices')
      .lean();

    let filtered = partners;

    if (city) {
      filtered = filtered.filter(
        (p) => p.city?.toLowerCase().includes(city) || p.address?.toLowerCase().includes(city)
      );
    }

    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.city?.toLowerCase().includes(query) ||
          p.state?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      centers: filtered.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        city: p.city || 'Fatehpur',
        state: p.state || 'Uttar Pradesh',
        address: p.address || '',
        phone: p.whatsapp || p.ownerPhone || '',
        logoUrl: p.branding?.logoUrl || null,
        tagline: p.branding?.tagline || 'Verified SARA Digital Center',
        businessHours: p.branding?.businessHours || '9:00 AM - 7:00 PM',
        assignedServicesCount: (p.assignedServices || []).filter((s: any) => s.enabled).length,
      })),
      totalCount: filtered.length,
    });
  } catch (error: any) {
    console.error('[GET /api/partner-centers]', error);
    return NextResponse.json({ error: 'Failed to fetch partner directory' }, { status: 500 });
  }
}
