import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { StatusIncident } from '@/models/StatusIncident';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

// GET /api/status — Returns live component status and incident timeline
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const activeIncidents = await StatusIncident.find({
      status: { $ne: 'RESOLVED' },
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const resolvedIncidents = await StatusIncident.find({
      status: 'RESOLVED',
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Map component statuses
    const components = ECOSYSTEM_CONFIG.platformComponents.map((c) => {
      const isAffected = activeIncidents.some((inc) =>
        inc.affectedComponents?.includes(c.id)
      );
      return {
        id: c.id,
        name: c.name,
        group: c.group,
        status: isAffected ? 'DEGRADED' : 'OPERATIONAL',
      };
    });

    const isAllOperational = activeIncidents.length === 0;

    return NextResponse.json({
      success: true,
      overallStatus: isAllOperational ? 'OPERATIONAL' : 'DEGRADED',
      components,
      activeIncidents,
      resolvedIncidents,
      lastCheckedAt: new Date(),
    });
  } catch (error: any) {
    console.error('[GET /api/status]', error);
    return NextResponse.json({
      success: true,
      overallStatus: 'OPERATIONAL',
      components: ECOSYSTEM_CONFIG.platformComponents.map((c) => ({
        id: c.id,
        name: c.name,
        group: c.group,
        status: 'OPERATIONAL',
      })),
      activeIncidents: [],
      resolvedIncidents: [],
      lastCheckedAt: new Date(),
    });
  }
}
