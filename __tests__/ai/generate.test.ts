/**
 * AI Generation Tests
 *
 * Tests for the AI-powered website generation functionality
 */

import {
  generateWebsite,
  generateBusinessIntelligence,
  enrichBusinessData,
  generateWelcomeEmail,
  generateMenuItems,
  generateServices,
} from '@/lib/ai/generate';
import {
  createMockBusinessData,
  mockOpenAIResponse,
  mockOpenAIIntelligenceResponse,
} from '../utils/mock-data';
import { validateSEOMetadata, validateHexColor } from '../utils/test-helpers';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('AI Generation - generateWebsite', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    const OpenAI = require('openai');
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  it('should generate a complete website for a business', async () => {
    const business = createMockBusinessData({
      name: 'Shlomo Restaurant',
      category: 'Restaurant',
    });

    mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await generateWebsite(business);

    expect(result).toHaveProperty('heroTitle');
    expect(result).toHaveProperty('heroSubtitle');
    expect(result).toHaveProperty('aboutContent');
    expect(result).toHaveProperty('services');
    expect(result).toHaveProperty('seoTitle');
    expect(result).toHaveProperty('seoDescription');
    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('colorPalette');
    expect(result).toHaveProperty('typography');
    expect(result).toHaveProperty('logoPrompt');
    expect(result).toHaveProperty('templateType');

    // Verify OpenAI was called
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it('should enforce content length constraints', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await generateWebsite(business);

    // Hero title max 60 chars
    expect(result.heroTitle.length).toBeLessThanOrEqual(60);

    // Hero subtitle max 120 chars
    expect(result.heroSubtitle.length).toBeLessThanOrEqual(120);

    // SEO title max 60 chars
    expect(result.seoTitle.length).toBeLessThanOrEqual(60);

    // SEO description max 160 chars
    expect(result.seoDescription.length).toBeLessThanOrEqual(160);
  });

  it('should validate SEO metadata', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await generateWebsite(business);

    validateSEOMetadata({
      seoTitle: result.seoTitle,
      seoDescription: result.seoDescription,
      keywords: result.keywords,
    });
  });

  it('should generate appropriate color palette', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await generateWebsite(business);

    expect(result.colorPalette).toHaveProperty('primary');
    expect(result.colorPalette).toHaveProperty('secondary');
    expect(result.colorPalette).toHaveProperty('accent');

    validateHexColor(result.colorPalette.primary);
    validateHexColor(result.colorPalette.secondary);
    validateHexColor(result.colorPalette.accent);
  });

  it('should handle all industry types', async () => {
    const industries = [
      'restaurant',
      'retail',
      'professional_services',
      'beauty',
      'tech',
      'fitness',
      'education',
      'entertainment',
    ];

    for (const industry of industries) {
      const business = createMockBusinessData({ category: industry });
      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

      const result = await generateWebsite(business);

      expect(result.templateType).toBeDefined();
      expect(typeof result.templateType).toBe('string');
    }
  });

  it('should include at least 3 services', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await generateWebsite(business);

    expect(Array.isArray(result.services)).toBe(true);
    expect(result.services.length).toBeGreaterThanOrEqual(3);

    result.services.forEach((service) => {
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service.name).toBeTruthy();
      expect(service.description).toBeTruthy();
    });
  });

  it('should handle API errors gracefully', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockRejectedValueOnce(
      new Error('OpenAI API error')
    );

    await expect(generateWebsite(business)).rejects.toThrow(
      'Failed to generate website content'
    );
  });

  it('should provide fallback values when AI returns incomplete data', async () => {
    const business = createMockBusinessData({ name: 'Test Business' });

    // Mock incomplete response
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: '{}', // Empty response
          },
        },
      ],
    });

    const result = await generateWebsite(business);

    // Should have fallback values
    expect(result.heroTitle).toBe(business.name);
    expect(result.services).toEqual([]);
    expect(result.colorPalette).toBeDefined();
  });
});

describe('AI Generation - generateBusinessIntelligence', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    const OpenAI = require('openai');
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  it('should generate business intelligence', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(
      mockOpenAIIntelligenceResponse
    );

    const result = await generateBusinessIntelligence(business);

    expect(result).toHaveProperty('competitorCount');
    expect(result).toHaveProperty('marketPosition');
    expect(result).toHaveProperty('opportunities');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('targetAudience');
    expect(result).toHaveProperty('uniqueSellingPoints');
  });

  it('should provide actionable recommendations', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(
      mockOpenAIIntelligenceResponse
    );

    const result = await generateBusinessIntelligence(business);

    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);

    result.recommendations.forEach((rec) => {
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('description');
      expect(rec).toHaveProperty('impact');
      expect(rec).toHaveProperty('effort');
      expect(['high', 'medium', 'low']).toContain(rec.impact);
      expect(['high', 'medium', 'low']).toContain(rec.effort);
    });
  });

  it('should identify target audience segments', async () => {
    const business = createMockBusinessData();
    mockOpenAI.chat.completions.create.mockResolvedValueOnce(
      mockOpenAIIntelligenceResponse
    );

    const result = await generateBusinessIntelligence(business);

    expect(Array.isArray(result.targetAudience)).toBe(true);
    expect(result.targetAudience.length).toBeGreaterThan(0);
  });
});

describe('AI Generation - generateWelcomeEmail', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    const OpenAI = require('openai');
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  it('should generate welcome email with subject and body', async () => {
    const business = createMockBusinessData();
    const websiteUrl = 'https://example.com/business/test-cafe';

    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              subject: 'Welcome to TLV Business Pulse',
              body: '<p>Welcome email content</p>',
            }),
          },
        },
      ],
    });

    const result = await generateWelcomeEmail(business, websiteUrl);

    expect(result).toHaveProperty('subject');
    expect(result).toHaveProperty('body');
    expect(result.subject).toBeTruthy();
    expect(result.body).toContain('</p>'); // Should be HTML
  });
});

describe('AI Generation - generateMenuItems', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    const OpenAI = require('openai');
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  it('should generate menu items for a restaurant', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              menu: [
                {
                  name: 'Shakshuka',
                  description: 'Traditional Israeli breakfast',
                  price: '₪45',
                  category: 'main',
                },
              ],
            }),
          },
        },
      ],
    });

    const result = await generateMenuItems('Test Restaurant', 'Israeli');

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((item) => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('category');
    });
  });

  it('should use Israeli Shekels for pricing', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              menu: [
                {
                  name: 'Test Item',
                  description: 'Test description',
                  price: '₪50',
                  category: 'main',
                },
              ],
            }),
          },
        },
      ],
    });

    const result = await generateMenuItems('Test Restaurant', 'Israeli');

    expect(result[0].price).toContain('₪');
  });
});

describe('AI Generation - generateServices', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    const OpenAI = require('openai');
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  it('should generate service offerings', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              services: [
                {
                  name: 'Haircut',
                  description: 'Professional haircut service',
                  duration: '30 minutes',
                  price: '₪100',
                },
              ],
            }),
          },
        },
      ],
    });

    const result = await generateServices('Test Salon', 'Beauty');

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((service) => {
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
    });
  });
});

describe('AI Generation - enrichBusinessData', () => {
  it('should enrich business data with additional information', async () => {
    const business = createMockBusinessData({
      name: 'Test Business',
      phone: undefined,
      email: undefined,
    });

    const result = await enrichBusinessData(business);

    expect(result).toHaveProperty('phone');
    expect(result).toHaveProperty('email');
  });
});
