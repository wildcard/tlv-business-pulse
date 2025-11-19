import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 *
 * Simple health check endpoint that returns system status.
 * This endpoint doesn't require database connectivity.
 *
 * @returns JSON response with health status
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'tlv-business-pulse',
    version: '1.0.0',
    uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'N/A',
    environment: process.env.NODE_ENV || 'production',
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * OPTIONS /api/health
 *
 * CORS preflight request handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
