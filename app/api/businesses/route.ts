import { NextRequest, NextResponse } from 'next/server';
import { getBusinesses, getBusinessCount } from '@/lib/db/supabase';
import type { ApiResponse, Business, PaginationInfo } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/businesses
 *
 * Fetches businesses from the database with pagination support.
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - category: Filter by category
 * - status: Filter by status (active/closed/all, default: active)
 * - search: Search by business name or address
 *
 * @returns JSON response with businesses array and pagination metadata
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    // Parse filter parameters
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search') || undefined;

    // Validate status parameter
    const validStatuses = ['active', 'closed', 'all'];
    const isActive = validStatuses.includes(status)
      ? status === 'active'
        ? true
        : status === 'closed'
        ? false
        : undefined
      : undefined;

    // Fetch businesses with filters
    const businesses = await getBusinesses({
      limit,
      offset,
      category,
      isActive,
      search,
    });

    // Get total count for pagination
    const totalItems = await getBusinessCount({
      category,
      isActive,
      search,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalItems / limit);
    const pagination: PaginationInfo = {
      page,
      pageSize: limit,
      totalPages,
      totalItems,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };

    const response: ApiResponse<Business[]> = {
      success: true,
      data: businesses,
      pagination,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);

    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch businesses',
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
 * OPTIONS /api/businesses
 *
 * CORS preflight request handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
