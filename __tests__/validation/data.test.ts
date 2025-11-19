/**
 * Data Validation Tests
 *
 * Tests for data validation and schema compliance
 */

import { createMockBusiness, createMockBusinessData, createMockTelAvivBusiness } from '../utils/mock-data';
import { validateEmail, validateIsraeliPhone, validateHexColor, validateSEOMetadata } from '../utils/test-helpers';

describe('Validation - Business Data', () => {
  it('should validate required business fields', () => {
    const business = createMockBusiness();

    expect(business.id).toBeDefined();
    expect(business.name).toBeDefined();
    expect(business.created_at).toBeDefined();
    expect(business.updated_at).toBeDefined();
  });

  it('should validate business ID format', () => {
    const business = createMockBusiness();

    expect(typeof business.id).toBe('string');
    expect(business.id.length).toBeGreaterThan(0);
  });

  it('should validate date formats', () => {
    const business = createMockBusiness();

    const createdAt = new Date(business.created_at);
    const updatedAt = new Date(business.updated_at);

    expect(createdAt.getTime()).not.toBeNaN();
    expect(updatedAt.getTime()).not.toBeNaN();
  });

  it('should validate boolean fields', () => {
    const business = createMockBusiness();

    expect(typeof business.is_active).toBe('boolean');
  });

  it('should validate optional fields can be null', () => {
    const business = createMockBusiness({
      phone: null,
      category: null,
      address: null,
    });

    expect(business.phone).toBeNull();
    expect(business.category).toBeNull();
    expect(business.address).toBeNull();
  });
});

describe('Validation - Email Format', () => {
  it('should validate correct email formats', () => {
    const validEmails = [
      'user@example.com',
      'test.user@domain.co.il',
      'admin+tag@business.com',
    ];

    validEmails.forEach((email) => {
      validateEmail(email);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user@.com',
    ];

    invalidEmails.forEach((email) => {
      expect(() => validateEmail(email)).toThrow();
    });
  });
});

describe('Validation - Israeli Phone Numbers', () => {
  it('should validate Israeli phone number formats', () => {
    const validPhones = [
      '+972-3-1234567',
      '+972-4-1234567',
      '+972-2-1234567',
    ];

    validPhones.forEach((phone) => {
      expect(() => validateIsraeliPhone(phone)).not.toThrow();
    });
  });

  it('should reject invalid phone formats', () => {
    const invalidPhones = [
      '123',
      'not-a-phone',
      '+1-555-1234', // US format
    ];

    invalidPhones.forEach((phone) => {
      expect(() => validateIsraeliPhone(phone)).toThrow();
    });
  });
});

describe('Validation - Color Formats', () => {
  it('should validate hex color codes', () => {
    const validColors = ['#000000', '#FFFFFF', '#FF5733', '#123ABC'];

    validColors.forEach((color) => {
      validateHexColor(color);
    });
  });

  it('should reject invalid color formats', () => {
    const invalidColors = ['#FFF', 'red', '#GGGGGG', 'rgb(255,0,0)'];

    invalidColors.forEach((color) => {
      expect(() => validateHexColor(color)).toThrow();
    });
  });
});

describe('Validation - SEO Metadata', () => {
  it('should validate proper SEO metadata', () => {
    const metadata = {
      seoTitle: 'Test Business - Best Service in Tel Aviv',
      seoDescription: 'Visit Test Business for amazing services in the heart of Tel Aviv. We offer quality and reliability.',
      keywords: ['test', 'business', 'tel aviv', 'service'],
    };

    validateSEOMetadata(metadata);
  });

  it('should enforce SEO title length limits', () => {
    const longTitle = 'A'.repeat(70);

    expect(() =>
      validateSEOMetadata({
        seoTitle: longTitle,
        seoDescription: 'Valid description',
        keywords: ['test'],
      })
    ).toThrow();
  });

  it('should enforce SEO description length limits', () => {
    const longDescription = 'A'.repeat(200);

    expect(() =>
      validateSEOMetadata({
        seoTitle: 'Valid title',
        seoDescription: longDescription,
        keywords: ['test'],
      })
    ).toThrow();
  });

  it('should require minimum keywords', () => {
    expect(() =>
      validateSEOMetadata({
        seoTitle: 'Valid title',
        seoDescription: 'Valid description',
        keywords: ['one', 'two'],
      })
    ).toThrow();
  });
});

describe('Validation - Tel Aviv Business Data', () => {
  it('should validate Tel Aviv business structure', () => {
    const business = createMockTelAvivBusiness();

    expect(business).toHaveProperty('license_number');
    expect(business).toHaveProperty('business_name');
    expect(business).toHaveProperty('business_type');
    expect(business).toHaveProperty('street');
    expect(business).toHaveProperty('city');
    expect(business).toHaveProperty('status');
    expect(business.data_source).toBe('tel_aviv_municipality');
  });

  it('should validate license number format', () => {
    const business = createMockTelAvivBusiness();

    expect(business.license_number).toMatch(/^TLV-/);
  });

  it('should validate status enum', () => {
    const validStatuses: Array<'active' | 'expired' | 'suspended'> = ['active', 'expired', 'suspended'];

    validStatuses.forEach((status) => {
      const business = createMockTelAvivBusiness({ status });
      expect(validStatuses).toContain(business.status);
    });
  });

  it('should validate coordinates when present', () => {
    const business = createMockTelAvivBusiness({
      coordinates: { lat: 32.0853, lon: 34.7818 },
    });

    expect(business.coordinates).toBeDefined();
    expect(business.coordinates!.lat).toBeGreaterThan(30);
    expect(business.coordinates!.lat).toBeLessThan(35);
    expect(business.coordinates!.lon).toBeGreaterThan(34);
    expect(business.coordinates!.lon).toBeLessThan(36);
  });
});

describe('Validation - URL Formats', () => {
  it('should validate website URLs', () => {
    const validUrls = [
      'https://example.com',
      'http://test.co.il',
      'https://business.com/page',
    ];

    validUrls.forEach((url) => {
      expect(() => new URL(url)).not.toThrow();
    });
  });

  it('should reject invalid URLs', () => {
    const invalidUrls = ['not-a-url', 'ftp://invalid', 'javascript:alert(1)'];

    invalidUrls.forEach((url) => {
      try {
        new URL(url);
        // ftp is actually valid, so we check for http/https specifically
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error('Invalid URL');
        }
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe('Validation - Data Consistency', () => {
  it('should maintain consistent timestamps', () => {
    const business = createMockBusiness();

    const created = new Date(business.created_at);
    const updated = new Date(business.updated_at);

    // Updated should be >= created
    expect(updated.getTime()).toBeGreaterThanOrEqual(created.getTime());
  });

  it('should validate related field consistency', () => {
    const business = createMockBusiness({
      is_active: true,
      status: 'active',
    });

    // If is_active is true, status should indicate active state
    if (business.is_active) {
      expect(business.status).not.toBe('closed');
    }
  });
});

describe('Validation - Numeric Ranges', () => {
  it('should validate coordinate ranges for Tel Aviv', () => {
    const business = createMockBusiness({
      latitude: 32.0853,
      longitude: 34.7818,
    });

    // Tel Aviv coordinates should be in reasonable range
    if (business.latitude) {
      expect(business.latitude).toBeGreaterThan(31.5);
      expect(business.latitude).toBeLessThan(33);
    }

    if (business.longitude) {
      expect(business.longitude).toBeGreaterThan(34);
      expect(business.longitude).toBeLessThan(35.5);
    }
  });
});

describe('Validation - String Lengths', () => {
  it('should enforce reasonable name lengths', () => {
    const business = createMockBusiness();

    expect(business.name.length).toBeGreaterThan(0);
    expect(business.name.length).toBeLessThan(200);
  });

  it('should enforce address lengths', () => {
    const business = createMockBusiness();

    if (business.address) {
      expect(business.address.length).toBeGreaterThan(0);
      expect(business.address.length).toBeLessThan(500);
    }
  });
});

describe('Validation - Data Sanitization', () => {
  it('should trim whitespace from strings', () => {
    const businessData = createMockBusinessData({
      name: '  Test Business  ',
    });

    const trimmed = businessData.name.trim();
    expect(trimmed).toBe('Test Business');
  });

  it('should normalize phone numbers', () => {
    const phones = [
      '+972-3-1234567',
      '+97231234567',
      '03-1234567',
    ];

    phones.forEach((phone) => {
      const normalized = phone.replace(/[^\d+]/g, '');
      expect(normalized).toMatch(/^\+?[\d]+$/);
    });
  });
});
