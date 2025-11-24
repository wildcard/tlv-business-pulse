/**
 * Businesses API Tests
 *
 * Tests for the /api/businesses endpoint
 */

import { GET, OPTIONS } from '@/app/api/businesses/route';
import { NextRequest } from 'next/server';
import { createMockBusinessList, createMockSupabaseResponse } from '../utils/mock-data';
import { mockSupabase } from '../utils/test-helpers';

jest.mock('@supabase/supabase-js');

describe('API - /api/businesses - GET', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should return businesses with default pagination', async () => {
    const mockBusinesses = createMockBusinessList(20);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 100, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('pagination');
  });

  it('should apply pagination parameters', async () => {
    const mockBusinesses = createMockBusinessList(10);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 50, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?page=2&limit=10');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(data.pagination.page).toBe(2);
    expect(data.pagination.pageSize).toBe(10);
  });

  it('should enforce maximum page size', async () => {
    const mockBusinesses = createMockBusinessList(20);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 200, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?limit=500');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    // Should be capped at 100
    expect(data.pagination.pageSize).toBeLessThanOrEqual(100);
  });

  it('should filter by category', async () => {
    const mockBusinesses = createMockBusinessList(5);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 5, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?category=Restaurant');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it('should filter by status', async () => {
    const mockBusinesses = createMockBusinessList(3);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 3, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?status=active');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
  });

  it('should support search query', async () => {
    const mockBusinesses = createMockBusinessList(2);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({ count: 2, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?search=cafe');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
  });

  it('should return pagination metadata', async () => {
    const mockBusinesses = createMockBusinessList(20);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 100, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses?page=2&limit=20');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('pageSize');
    expect(data.pagination).toHaveProperty('totalPages');
    expect(data.pagination).toHaveProperty('totalItems');
    expect(data.pagination).toHaveProperty('hasNext');
    expect(data.pagination).toHaveProperty('hasPrevious');

    expect(data.pagination.page).toBe(2);
    expect(data.pagination.hasPrevious).toBe(true);
  });

  it('should have cache headers', async () => {
    const mockBusinesses = createMockBusinessList(5);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 5, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage');
  });

  it('should handle database errors', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(
            createMockSupabaseResponse(null, { message: 'Database error' })
          ),
        }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);

    expect(response.status).toBe(500);

    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data).toHaveProperty('error');
  });
});

describe('API - /api/businesses - OPTIONS', () => {
  it('should return 200 for CORS preflight', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
  });

  it('should include CORS headers', async () => {
    const response = await OPTIONS();

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });
});

describe('API - /api/businesses - Response Validation', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should return valid API response structure', async () => {
    const mockBusinesses = createMockBusinessList(5);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    supabaseMock.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 5, error: null }),
      }),
    });

    const url = new URL('http://localhost:3000/api/businesses');
    const request = { nextUrl: url } as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    // Should match ApiResponse<Business[]> type
    expect(data).toMatchObject({
      success: expect.any(Boolean),
      data: expect.any(Array),
      pagination: expect.objectContaining({
        page: expect.any(Number),
        pageSize: expect.any(Number),
        totalPages: expect.any(Number),
        totalItems: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrevious: expect.any(Boolean),
      }),
    });
  });
});
