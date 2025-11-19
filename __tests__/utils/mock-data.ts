/**
 * Mock Data Generators for Testing
 *
 * These utilities create realistic test data for all entities in the system.
 */

import type { Business } from '@/lib/types';
import type { BusinessData, GeneratedWebsite, BusinessIntelligence } from '@/lib/ai/generate';
import type { TelAvivBusiness, BusinessVerification } from '@/lib/data/tel-aviv-api';

/**
 * Creates a mock Business object for testing
 */
export function createMockBusiness(overrides?: Partial<Business>): Business {
  const id = overrides?.id || `test-${Math.random().toString(36).substring(7)}`;
  const now = new Date().toISOString();

  return {
    id,
    external_id: `ext-${id}`,
    name: 'Test Restaurant',
    category: 'Restaurant',
    address: 'Dizengoff 123, Tel Aviv',
    phone: '+972-3-1234567',
    status: 'active',
    opened_date: '2024-01-15',
    location: 'Dizengoff Center',
    latitude: 32.0853,
    longitude: 34.7818,
    last_seen: now,
    is_active: true,
    raw_data: {},
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

/**
 * Creates a mock BusinessData object for AI generation
 */
export function createMockBusinessData(overrides?: Partial<BusinessData>): BusinessData {
  return {
    name: 'Test Cafe',
    category: 'Cafe',
    address: 'Rothschild Blvd 45, Tel Aviv',
    city: 'Tel Aviv',
    registration_date: '2024-01-01',
    phone: '+972-3-9876543',
    email: 'info@testcafe.com',
    website: 'https://testcafe.com',
    description: 'A cozy cafe in the heart of Tel Aviv',
    employees: 5,
    ...overrides,
  };
}

/**
 * Creates a mock GeneratedWebsite object
 */
export function createMockGeneratedWebsite(overrides?: Partial<GeneratedWebsite>): GeneratedWebsite {
  return {
    heroTitle: 'Welcome to Test Cafe',
    heroSubtitle: 'Your neighborhood coffee destination',
    aboutContent: 'We are a family-owned cafe serving the finest coffee and pastries in Tel Aviv. Our mission is to create a warm, welcoming space for the community.',
    services: [
      { name: 'Espresso', description: 'Classic Italian espresso', price: '₪12' },
      { name: 'Cappuccino', description: 'Rich and creamy cappuccino', price: '₪16' },
      { name: 'Croissant', description: 'Freshly baked buttery croissant', price: '₪14' },
    ],
    seoTitle: 'Test Cafe - Best Coffee in Tel Aviv',
    seoDescription: 'Visit Test Cafe for the finest coffee, pastries, and a welcoming atmosphere in the heart of Tel Aviv.',
    keywords: ['cafe', 'coffee', 'tel aviv', 'espresso', 'pastries'],
    colorPalette: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#FFD700',
    },
    typography: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
    logoPrompt: 'Modern minimalist logo for a cozy cafe with coffee cup symbol',
    templateType: 'restaurant',
    ...overrides,
  };
}

/**
 * Creates a mock BusinessIntelligence object
 */
export function createMockBusinessIntelligence(overrides?: Partial<BusinessIntelligence>): BusinessIntelligence {
  return {
    competitorCount: 8,
    marketPosition: 'Challenger in growing market',
    opportunities: [
      'Expand breakfast menu offerings',
      'Implement loyalty program',
      'Partner with local businesses for catering',
    ],
    recommendations: [
      {
        title: 'Launch Instagram Marketing',
        description: 'Build social media presence to attract younger customers',
        impact: 'high',
        effort: 'medium',
      },
      {
        title: 'Add Outdoor Seating',
        description: 'Increase capacity and appeal during nice weather',
        impact: 'medium',
        effort: 'high',
      },
    ],
    targetAudience: [
      'Young professionals (25-35)',
      'Remote workers seeking workspace',
      'Local residents',
    ],
    uniqueSellingPoints: [
      'Locally sourced organic coffee',
      'Homemade pastries',
      'Community gathering space',
    ],
    ...overrides,
  };
}

/**
 * Creates a mock TelAvivBusiness object
 */
export function createMockTelAvivBusiness(overrides?: Partial<TelAvivBusiness>): TelAvivBusiness {
  return {
    license_number: 'TLV-2024-12345',
    business_name: 'בית קפה בדיקה',
    business_name_en: 'Test Coffee House',
    owner_name: 'משה ישראלי',
    business_type: 'בית קפה',
    business_type_desc: 'Coffee House',
    street: 'דיזנגוף',
    house_number: '123',
    city: 'Tel Aviv-Yafo',
    neighborhood: 'צפון ישן',
    issue_date: '2024-01-15',
    expiry_date: '2025-01-14',
    status: 'active',
    coordinates: {
      lat: 32.0853,
      lon: 34.7818,
    },
    last_updated: new Date().toISOString(),
    data_source: 'tel_aviv_municipality',
    ...overrides,
  };
}

/**
 * Creates a mock BusinessVerification object
 */
export function createMockBusinessVerification(overrides?: Partial<BusinessVerification>): BusinessVerification {
  return {
    verified: true,
    sources: [
      {
        source: 'tel_aviv_municipality',
        status: 'verified_active',
        verified_url: 'https://data.tel-aviv.gov.il/verify/TLV-2024-12345',
        last_checked: new Date().toISOString(),
        data: {
          שם_עסק: 'בית קפה בדיקה',
          כתובת: 'דיזנגוף 123',
          סטטוס: 'פעיל',
        },
      },
    ],
    data_quality_score: 85,
    verification_date: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Creates an array of mock businesses
 */
export function createMockBusinessList(count: number): Business[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBusiness({
      id: `test-business-${i}`,
      name: `Test Business ${i}`,
    })
  );
}

/**
 * Mock OpenAI API responses
 */
export const mockOpenAIResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify(createMockGeneratedWebsite()),
      },
    },
  ],
};

export const mockOpenAIIntelligenceResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify(createMockBusinessIntelligence()),
      },
    },
  ],
};

/**
 * Mock Supabase responses
 */
export function createMockSupabaseResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
    count: null,
    status: error ? 500 : 200,
    statusText: error ? 'Error' : 'OK',
  };
}

/**
 * Mock axios responses for Tel Aviv API
 */
export function createMockAxiosResponse<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

/**
 * Setup mock database for testing
 */
export async function setupTestDatabase() {
  // In a real implementation, this would:
  // 1. Create a test database or use a test schema
  // 2. Run migrations
  // 3. Seed with test data
  // For now, this is a placeholder
  return {
    cleanup: cleanupTestData,
  };
}

/**
 * Clean up test data after tests
 */
export async function cleanupTestData() {
  // In a real implementation, this would:
  // 1. Delete all test data
  // 2. Reset auto-increment counters
  // 3. Clear caches
  // For now, this is a placeholder
}

/**
 * Mock Tel Aviv API responses
 */
export function mockTelAvivAPIResponse(businesses: TelAvivBusiness[]) {
  return {
    result: {
      records: businesses,
      total: businesses.length,
    },
  };
}

/**
 * Israeli phone number generator
 */
export function generateIsraeliPhone(): string {
  const prefixes = ['03', '04', '02', '08', '09']; // Common Israeli area codes
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+972-${prefix}-${number}`;
}

/**
 * Generate random Israeli business license number
 */
export function generateLicenseNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `TLV-${year}-${num}`;
}

/**
 * Generate slug from business name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Common test constants
 */
export const TEST_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 5000,
  API_RATE_LIMIT: 100,
  QUALITY_SCORE_THRESHOLD: 70,
  TEL_AVIV_COORDINATES: {
    lat: 32.0853,
    lon: 34.7818,
  },
};
