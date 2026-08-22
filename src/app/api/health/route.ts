import { NextResponse } from 'next/server';

export async function GET() {
  const healthData = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    service: 'sandy-digital-hub-api',
  };

  const response = NextResponse.json(healthData, { status: 200 });
  response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  return response;
}
