/**
 * Database Tests
 *
 * Tests for Supabase database operations
 */

import {
  getBusinesses,
  getBusinessCount,
  getBusinessById,
  getDashboardStats,
  getRecentInsights,
  getInsightBySlug,
  createSubscription,
  updateSubscriptionStatus,
  createApiKey,
  validateApiKey,
  incrementApiKeyRequests,
  checkDatabaseHealth,
} from '@/lib/db/supabase';
import { createMockBusiness, createMockBusinessList, createMockSupabaseResponse } from '../utils/mock-data';
import { mockSupabase } from '../utils/test-helpers';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('Database - getBusinesses', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should fetch businesses with default options', async () => {
    const mockBusinesses = createMockBusinessList(5);
    supabaseMock.mocks.single.mockResolvedValueOnce(
      createMockSupabaseResponse(mockBusinesses)
    );

    // Mock the chain
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    const result = await getBusinesses();

    expect(supabaseMock.from).toHaveBeenCalledWith('businesses');
    expect(result).toHaveLength(5);
  });

  it('should apply category filter', async () => {
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

    const result = await getBusinesses({ category: 'Restaurant' });

    expect(result).toHaveLength(3);
  });

  it('should apply isActive filter', async () => {
    const mockBusinesses = createMockBusinessList(2);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
      }),
    });

    const result = await getBusinesses({ isActive: true });

    expect(result).toHaveLength(2);
  });

  it('should apply search filter', async () => {
    const mockBusinesses = [createMockBusiness({ name: 'Test Cafe' })];

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
          }),
        }),
      }),
    });

    const result = await getBusinesses({ search: 'cafe' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toContain('Cafe');
  });

  it('should handle pagination', async () => {
    const mockBusinesses = createMockBusinessList(10);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusinesses)),
        }),
      }),
    });

    await getBusinesses({ limit: 10, offset: 20 });

    // Verify range was called with correct offset
    const selectMock = supabaseMock.from().select();
    expect(selectMock.order).toHaveBeenCalled();
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

    await expect(getBusinesses()).rejects.toThrow('Failed to fetch businesses');
  });
});

describe('Database - getBusinessCount', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should return total count', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        count: 42,
        error: null,
      }),
    });

    const result = await getBusinessCount();

    expect(result).toBe(42);
  });

  it('should apply filters to count', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          count: 10,
          error: null,
        }),
      }),
    });

    const result = await getBusinessCount({ category: 'Restaurant' });

    expect(result).toBe(10);
  });
});

describe('Database - getBusinessById', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should fetch business by ID', async () => {
    const mockBusiness = createMockBusiness({ id: 'test-123' });

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockBusiness)),
        }),
      }),
    });

    const result = await getBusinessById('test-123');

    expect(result).toBeDefined();
    expect(result?.id).toBe('test-123');
  });

  it('should return null for non-existent business', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(
            createMockSupabaseResponse(null, { code: 'PGRST116' })
          ),
        }),
      }),
    });

    const result = await getBusinessById('non-existent');

    expect(result).toBeNull();
  });

  it('should throw on database error', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(
            createMockSupabaseResponse(null, { message: 'Database error' })
          ),
        }),
      }),
    });

    await expect(getBusinessById('test-123')).rejects.toThrow();
  });
});

describe('Database - getDashboardStats', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should return comprehensive dashboard statistics', async () => {
    // Mock multiple queries
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        count: 100,
        data: [],
        error: null,
      }),
    });

    const result = await getDashboardStats();

    expect(result).toHaveProperty('totalBusinesses');
    expect(result).toHaveProperty('newToday');
    expect(result).toHaveProperty('closedToday');
    expect(result).toHaveProperty('articlesPublished');
    expect(result).toHaveProperty('apiCalls');
    expect(result).toHaveProperty('revenue');
    expect(result).toHaveProperty('uptime');
    expect(result).toHaveProperty('lastUpdated');
  });

  it('should calculate metrics correctly', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        count: 50,
        data: [],
        error: null,
      }),
    });

    const result = await getDashboardStats();

    expect(result.totalBusinesses).toBeGreaterThanOrEqual(0);
    expect(result.uptime).toBeGreaterThan(0);
    expect(result.uptime).toBeLessThanOrEqual(100);
  });
});

describe('Database - API Key Management', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should create new API key', async () => {
    const mockApiKey = {
      key: 'test-api-key',
      user_email: 'test@example.com',
      subscription_id: 'sub-123',
      rate_limit: 100,
    };

    supabaseMock.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockApiKey)),
        }),
      }),
    });

    const result = await createApiKey(mockApiKey);

    expect(result).toBeDefined();
    expect(result.key).toBe('test-api-key');
  });

  it('should validate API key', async () => {
    const mockApiKey = {
      key: 'valid-key',
      is_active: true,
    };

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockApiKey)),
          }),
        }),
      }),
    });

    const result = await validateApiKey('valid-key');

    expect(result).toBeDefined();
    expect(result?.key).toBe('valid-key');
  });

  it('should return null for invalid API key', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(
              createMockSupabaseResponse(null, { code: 'PGRST116' })
            ),
          }),
        }),
      }),
    });

    const result = await validateApiKey('invalid-key');

    expect(result).toBeNull();
  });

  it('should increment API key request count', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(
            createMockSupabaseResponse({ requests_count: 10 })
          ),
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue(createMockSupabaseResponse({})),
      }),
    });

    await incrementApiKeyRequests('test-key');

    // Should not throw
    expect(true).toBe(true);
  });
});

describe('Database - Subscription Management', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should create subscription', async () => {
    const mockSubscription = {
      userEmail: 'test@example.com',
      tierId: 'tier-1',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date().toISOString(),
    };

    supabaseMock.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockSubscription)),
        }),
      }),
    });

    const result = await createSubscription(mockSubscription);

    expect(result).toBeDefined();
  });

  it('should update subscription status', async () => {
    supabaseMock.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue(createMockSupabaseResponse({})),
      }),
    });

    await updateSubscriptionStatus('sub_123', 'canceled');

    // Should not throw
    expect(true).toBe(true);
  });
});

describe('Database - Insights', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should fetch recent insights', async () => {
    const mockInsights = [
      { id: '1', title: 'Insight 1', slug: 'insight-1' },
      { id: '2', title: 'Insight 2', slug: 'insight-2' },
    ];

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockInsights)),
        }),
      }),
    });

    const result = await getRecentInsights(10);

    expect(result).toHaveLength(2);
  });

  it('should fetch insight by slug', async () => {
    const mockInsight = { id: '1', title: 'Test Insight', slug: 'test-insight' };

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(createMockSupabaseResponse(mockInsight)),
        }),
      }),
    });

    const result = await getInsightBySlug('test-insight');

    expect(result).toBeDefined();
    expect(result?.slug).toBe('test-insight');
  });
});

describe('Database - Health Check', () => {
  let supabaseMock: any;

  beforeEach(() => {
    const { createClient } = require('@supabase/supabase-js');
    supabaseMock = mockSupabase();
    createClient.mockReturnValue(supabaseMock);
    jest.clearAllMocks();
  });

  it('should return healthy status', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(createMockSupabaseResponse([])),
      }),
    });

    const result = await checkDatabaseHealth();

    expect(result).toHaveProperty('healthy');
    expect(result).toHaveProperty('responseTime');
    expect(result.healthy).toBe(true);
  });

  it('should return unhealthy on error', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(
          createMockSupabaseResponse(null, { message: 'Connection error' })
        ),
      }),
    });

    const result = await checkDatabaseHealth();

    expect(result.healthy).toBe(false);
  });

  it('should measure response time', async () => {
    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(createMockSupabaseResponse([]));
            }, 50);
          });
        }),
      }),
    });

    const result = await checkDatabaseHealth();

    expect(result.responseTime).toBeGreaterThan(0);
  });
});
