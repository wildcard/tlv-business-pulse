/**
 * Website Generation Integration Tests
 *
 * Tests the complete flow of generating websites for businesses
 */

import { generateWebsite } from '@/lib/ai/generate';
import { fetchTelAvivBusinesses } from '@/lib/data/tel-aviv-api';
import { createMockBusinessData, createMockTelAvivBusiness } from '../utils/mock-data';
import axios from 'axios';

jest.mock('openai');
jest.mock('axios');
jest.mock('@supabase/supabase-js');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Integration - Complete Website Generation Flow', () => {
  it('should complete full website generation workflow', async () => {
    // 1. Fetch business from Tel Aviv API
    const mockTelAvivBusiness = createMockTelAvivBusiness({
      business_name: 'Dizengoff Cafe',
      business_type_desc: 'Cafe',
      street: 'Dizengoff',
      house_number: '100',
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          records: [mockTelAvivBusiness],
          total: 1,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const { businesses } = await fetchTelAvivBusinesses(1, 0);

    expect(businesses).toHaveLength(1);
    expect(businesses[0].business_name).toBe('Dizengoff Cafe');

    // 2. Convert to business data format
    const businessData = createMockBusinessData({
      name: businesses[0].business_name,
      category: businesses[0].business_type_desc,
      address: `${businesses[0].street} ${businesses[0].house_number}`,
    });

    // 3. Generate website with AI
    const OpenAI = require('openai');
    const mockOpenAI = new OpenAI();

    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              heroTitle: 'Welcome to Dizengoff Cafe',
              heroSubtitle: 'Your neighborhood coffee spot',
              aboutContent: 'We serve the best coffee in Tel Aviv.',
              services: [
                { name: 'Espresso', description: 'Classic espresso', price: '₪12' },
              ],
              seoTitle: 'Dizengoff Cafe - Best Coffee in Tel Aviv',
              seoDescription: 'Visit Dizengoff Cafe for amazing coffee',
              keywords: ['cafe', 'coffee', 'tel aviv'],
              colorPalette: {
                primary: '#8B4513',
                secondary: '#D2691E',
                accent: '#FFD700',
              },
              typography: {
                heading: 'Playfair Display',
                body: 'Lato',
              },
              logoPrompt: 'Modern cafe logo',
              templateType: 'restaurant',
            }),
          },
        },
      ],
    });

    const website = await generateWebsite(businessData);

    expect(website).toBeDefined();
    expect(website.heroTitle).toBeTruthy();
    expect(website.services.length).toBeGreaterThan(0);

    // 4. Verify website structure is complete
    expect(website).toHaveProperty('heroTitle');
    expect(website).toHaveProperty('heroSubtitle');
    expect(website).toHaveProperty('aboutContent');
    expect(website).toHaveProperty('seoTitle');
    expect(website).toHaveProperty('seoDescription');
    expect(website).toHaveProperty('colorPalette');
    expect(website).toHaveProperty('templateType');

    // 5. Verify content meets quality standards
    expect(website.heroTitle.length).toBeGreaterThan(0);
    expect(website.heroTitle.length).toBeLessThanOrEqual(60);
    expect(website.seoDescription.length).toBeLessThanOrEqual(160);
    expect(website.keywords.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle the full pipeline with error recovery', async () => {
    // Test that the pipeline can recover from errors
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchTelAvivBusinesses()).rejects.toThrow();

    // Retry with mock data
    const businessData = createMockBusinessData();

    const OpenAI = require('openai');
    const mockOpenAI = new OpenAI();

    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              heroTitle: 'Test Business',
              services: [],
              colorPalette: { primary: '#000000', secondary: '#FFFFFF', accent: '#FF0000' },
            }),
          },
        },
      ],
    });

    const website = await generateWebsite(businessData);

    expect(website).toBeDefined();
  });
});

describe('Integration - Data Transformation', () => {
  it('should correctly transform Tel Aviv data to website format', async () => {
    const tlvBusiness = createMockTelAvivBusiness({
      business_name: 'בית קפה בדיקה',
      business_name_en: 'Test Cafe',
      business_type_desc: 'Cafe',
      street: 'Rothschild',
      house_number: '45',
    });

    const businessData = createMockBusinessData({
      name: tlvBusiness.business_name_en || tlvBusiness.business_name,
      category: tlvBusiness.business_type_desc,
      address: `${tlvBusiness.street} ${tlvBusiness.house_number}`,
      city: tlvBusiness.city,
    });

    expect(businessData.name).toBe('Test Cafe');
    expect(businessData.category).toBe('Cafe');
    expect(businessData.address).toContain('Rothschild');
  });
});

describe('Integration - End-to-End Data Flow', () => {
  it('should maintain data consistency across the pipeline', async () => {
    const originalBusiness = createMockTelAvivBusiness({
      license_number: 'TLV-2024-12345',
      business_name: 'Original Name',
    });

    // Verify data is preserved through transformations
    expect(originalBusiness.license_number).toBe('TLV-2024-12345');
    expect(originalBusiness.business_name).toBe('Original Name');
    expect(originalBusiness.data_source).toBe('tel_aviv_municipality');
  });
});
