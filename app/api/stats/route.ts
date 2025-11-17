import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/supabase';
import type { ApiResponse } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface DashboardStatsResponse {
  totalBusinesses: number;
  newToday: number;
  closedToday: number;
  articlesPublished: number;
  apiCalls: number;
  revenue: number;
  uptime: number;
  lastUpdated: string;
}

/**
 * GET /api/stats
 *
 * Returns comprehensive dashboard statistics including:
 * - Total businesses count
 * - New businesses today
 * - Closed businesses today
 * - Articles published
 * - API call metrics
 * - Revenue data
 * - System uptime
 *
 * @returns JSON response with dashboard statistics
 */
export async function GET() {
  try {
    // Fetch comprehensive statistics from the database
    const stats = await getDashboardStats();

    const response: ApiResponse<DashboardStatsResponse> = {
      success: true,
      data: {
        totalBusinesses: stats.totalBusinesses,
        newToday: stats.newToday,
        closedToday: stats.closedToday,
        articlesPublished: stats.articlesPublished,
        apiCalls: stats.apiCalls,
        revenue: stats.revenue,
        uptime: stats.uptime,
        lastUpdated: stats.lastUpdated,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Cache for 30 seconds to reduce database load
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
    };

    return NextResponse.json(response, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * OPTIONS /api/stats
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
