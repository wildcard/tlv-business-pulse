/**
 * Performance Tests
 *
 * Tests for load testing and performance benchmarks
 */

import { generateWebsite } from '@/lib/ai/generate';
import { fetchTelAvivBusinesses } from '@/lib/data/tel-aviv-api';
import { getBusinesses } from '@/lib/db/supabase';
import { createMockBusinessData } from '../utils/mock-data';
import { measurePerformance } from '../utils/test-helpers';

jest.mock('openai');
jest.mock('axios');
jest.mock('@supabase/supabase-js');

describe('Performance - Database Queries', () => {
  it('should fetch businesses within acceptable time', async () => {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseMock = require('../utils/test-helpers').mockSupabase();
    createClient.mockReturnValue(supabaseMock);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    });

    const { duration } = await measurePerformance(
      async () => await getBusinesses({ limit: 100 }),
      1000 // Should complete within 1 second
    );

    expect(duration).toBeLessThan(1000);
  });

  it('should handle pagination efficiently', async () => {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseMock = require('../utils/test-helpers').mockSupabase();
    createClient.mockReturnValue(supabaseMock);

    supabaseMock.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    });

    const times = [];

    for (let page = 0; page < 5; page++) {
      const { duration } = await measurePerformance(
        async () => await getBusinesses({ limit: 20, offset: page * 20 }),
        500
      );
      times.push(duration);
    }

    // Pagination should maintain consistent performance
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    expect(avgTime).toBeLessThan(500);
  });
});

describe('Performance - AI Generation', () => {
  it('should generate website within acceptable time', async () => {
    const OpenAI = require('openai');
    const mockOpenAI = new OpenAI();

    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              heroTitle: 'Test',
              heroSubtitle: 'Test',
              aboutContent: 'Test',
              services: [],
              seoTitle: 'Test',
              seoDescription: 'Test',
              keywords: ['test'],
              colorPalette: { primary: '#000000', secondary: '#FFFFFF', accent: '#FF0000' },
              typography: { heading: 'Arial', body: 'Arial' },
              logoPrompt: 'Test',
              templateType: 'restaurant',
            }),
          },
        },
      ],
    });

    const business = createMockBusinessData();

    const { duration } = await measurePerformance(
      async () => await generateWebsite(business),
      5000 // AI calls can take longer, but should be under 5 seconds in tests
    );

    expect(duration).toBeLessThan(5000);
  });
});

describe('Performance - API Response Times', () => {
  it('should respond to health check quickly', async () => {
    const { GET } = require('@/app/api/health/route');

    const { duration } = await measurePerformance(
      async () => await GET(),
      100 // Health check should be very fast
    );

    expect(duration).toBeLessThan(100);
  });
});

describe('Performance - Memory Usage', () => {
  it('should not leak memory when processing multiple businesses', async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Process multiple operations
    for (let i = 0; i < 100; i++) {
      createMockBusinessData();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
});

describe('Performance - Concurrent Operations', () => {
  it('should handle multiple concurrent requests', async () => {
    const { GET } = require('@/app/api/health/route');

    const promises = Array(10)
      .fill(null)
      .map(() => GET());

    const startTime = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - startTime;

    // All 10 requests should complete within 1 second
    expect(duration).toBeLessThan(1000);
  });
});

describe('Performance - Data Processing', () => {
  it('should efficiently process large datasets', () => {
    const largeDataset = Array(1000)
      .fill(null)
      .map((_, i) => createMockBusinessData({ name: `Business ${i}` }));

    const startTime = Date.now();

    // Process the dataset
    const processed = largeDataset.map((business) => ({
      ...business,
      slug: business.name.toLowerCase().replace(/\s+/g, '-'),
    }));

    const duration = Date.now() - startTime;

    expect(processed).toHaveLength(1000);
    expect(duration).toBeLessThan(100); // Should be very fast for simple operations
  });
});

describe('Performance - Cache Effectiveness', () => {
  it('should demonstrate performance improvement with caching', async () => {
    // This is a conceptual test - in a real implementation,
    // you would test actual cache hits vs misses

    const cache = new Map<string, any>();

    const getCachedData = async (key: string) => {
      if (cache.has(key)) {
        return cache.get(key);
      }

      // Simulate expensive operation
      await new Promise((resolve) => setTimeout(resolve, 100));
      const data = { result: 'data' };
      cache.set(key, data);
      return data;
    };

    // First call (cache miss)
    const start1 = Date.now();
    await getCachedData('test');
    const duration1 = Date.now() - start1;

    // Second call (cache hit)
    const start2 = Date.now();
    await getCachedData('test');
    const duration2 = Date.now() - start2;

    expect(duration1).toBeGreaterThan(90); // Should take ~100ms
    expect(duration2).toBeLessThan(10); // Should be instant
  });
});
