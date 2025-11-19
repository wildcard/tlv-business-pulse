/**
 * Test Helper Utilities
 *
 * Common helper functions for testing
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

/**
 * Mock axios for API testing
 */
export function mockAxios() {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  (axios.get as jest.Mock) = mockGet;
  (axios.post as jest.Mock) = mockPost;
  (axios.put as jest.Mock) = mockPut;
  (axios.delete as jest.Mock) = mockDelete;

  return {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  };
}

/**
 * Mock OpenAI client
 */
export function mockOpenAI() {
  return {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };
}

/**
 * Mock Supabase client
 */
export function mockSupabase() {
  const mockSelect = jest.fn().mockReturnThis();
  const mockInsert = jest.fn().mockReturnThis();
  const mockUpdate = jest.fn().mockReturnThis();
  const mockDelete = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockGte = jest.fn().mockReturnThis();
  const mockLte = jest.fn().mockReturnThis();
  const mockOr = jest.fn().mockReturnThis();
  const mockOrder = jest.fn().mockReturnThis();
  const mockRange = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  const mockSingle = jest.fn();

  const mockFrom = jest.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    gte: mockGte,
    lte: mockLte,
    or: mockOr,
    order: mockOrder,
    range: mockRange,
    limit: mockLimit,
    single: mockSingle,
  });

  return {
    from: mockFrom,
    rpc: jest.fn(),
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    mocks: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      gte: mockGte,
      lte: mockLte,
      or: mockOr,
      order: mockOrder,
      range: mockRange,
      limit: mockLimit,
      single: mockSingle,
    },
  };
}

/**
 * Wait for a specific amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Assert that an async function throws
 */
export async function expectAsyncThrow(fn: () => Promise<any>, errorMessage?: string) {
  try {
    await fn();
    throw new Error('Expected function to throw, but it did not');
  } catch (error) {
    if (errorMessage) {
      expect(error).toHaveProperty('message', errorMessage);
    }
  }
}

/**
 * Mock fetch for API route testing
 */
export function mockFetch() {
  const mockFetchFn = jest.fn();
  global.fetch = mockFetchFn;
  return mockFetchFn;
}

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockNextRequest(options: {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  searchParams?: Record<string, string>;
} = {}) {
  const url = new URL(options.url || 'http://localhost:3000/api/test');

  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return {
    url: url.toString(),
    method: options.method || 'GET',
    headers: new Headers(options.headers || {}),
    nextUrl: url,
    json: async () => options.body,
  };
}

/**
 * Extract JSON from NextResponse
 */
export async function extractJSON(response: any) {
  const text = await response.text();
  return JSON.parse(text);
}

/**
 * Validate SEO metadata
 */
export function validateSEOMetadata(metadata: {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}) {
  expect(metadata.seoTitle).toBeDefined();
  expect(metadata.seoTitle.length).toBeGreaterThan(0);
  expect(metadata.seoTitle.length).toBeLessThanOrEqual(60);

  expect(metadata.seoDescription).toBeDefined();
  expect(metadata.seoDescription.length).toBeGreaterThan(0);
  expect(metadata.seoDescription.length).toBeLessThanOrEqual(160);

  expect(metadata.keywords).toBeDefined();
  expect(Array.isArray(metadata.keywords)).toBe(true);
  expect(metadata.keywords.length).toBeGreaterThanOrEqual(3);
}

/**
 * Validate color hex codes
 */
export function validateHexColor(color: string) {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  expect(color).toMatch(hexRegex);
}

/**
 * Validate Israeli phone number format
 */
export function validateIsraeliPhone(phone: string) {
  // Israeli phone numbers: +972-XX-XXXXXXX or 0X-XXXXXXX
  const phoneRegex = /^(\+972|0)[2-9]\d{1,2}-?\d{7}$/;
  expect(phone.replace(/[^\d+]/g, '')).toMatch(/^(\+972|0)[2-9]\d{8,9}$/);
}

/**
 * Validate email format
 */
export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(email).toMatch(emailRegex);
}

/**
 * Generate random test data
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Test performance measurement
 */
export async function measurePerformance<T>(
  fn: () => Promise<T>,
  maxDuration: number
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  expect(duration).toBeLessThan(maxDuration);

  return { result, duration };
}

/**
 * Mock environment variables
 */
export function mockEnv(vars: Record<string, string>) {
  const original = { ...process.env };

  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  return () => {
    process.env = original;
  };
}

/**
 * Test rate limiting
 */
export async function testRateLimit(
  fn: () => Promise<any>,
  limit: number,
  windowMs: number
) {
  const results = [];

  for (let i = 0; i < limit + 5; i++) {
    try {
      const result = await fn();
      results.push({ success: true, result });
    } catch (error) {
      results.push({ success: false, error });
    }
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  expect(successful).toBeLessThanOrEqual(limit);
  expect(failed).toBeGreaterThan(0);
}

/**
 * Validate API response structure
 */
export function validateAPIResponse(response: any, options: {
  expectSuccess?: boolean;
  expectData?: boolean;
  expectPagination?: boolean;
} = {}) {
  expect(response).toHaveProperty('success');

  if (options.expectSuccess !== false) {
    expect(response.success).toBe(true);
  }

  if (options.expectData) {
    expect(response).toHaveProperty('data');
  }

  if (options.expectPagination) {
    expect(response).toHaveProperty('pagination');
    expect(response.pagination).toHaveProperty('page');
    expect(response.pagination).toHaveProperty('pageSize');
    expect(response.pagination).toHaveProperty('totalPages');
    expect(response.pagination).toHaveProperty('totalItems');
  }
}

/**
 * Test data consistency across sources
 */
export function validateBusinessDataConsistency(
  source1: any,
  source2: any,
  fields: string[]
) {
  fields.forEach((field) => {
    if (source1[field] && source2[field]) {
      expect(source1[field]).toBe(source2[field]);
    }
  });
}

/**
 * Snapshot testing helper
 */
export function sanitizeSnapshot(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeSnapshot);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove timestamps and IDs for consistent snapshots
    if (['id', 'created_at', 'updated_at', 'timestamp'].includes(key)) {
      sanitized[key] = '[SANITIZED]';
    } else {
      sanitized[key] = sanitizeSnapshot(value);
    }
  }

  return sanitized;
}
