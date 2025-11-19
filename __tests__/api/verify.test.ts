/**
 * Business Verification API Tests
 *
 * Tests for the /api/verify/[businessId] endpoint
 */

import { GET, OPTIONS } from '@/app/api/verify/[businessId]/route';
import { NextRequest } from 'next/server';
import axios from 'axios';
import { createMockAxiosResponse } from '../utils/mock-data';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API - /api/verify/[businessId] - GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify a valid business', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-123',
              שם_עסק: 'Test Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-123' } });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty('business_id');
    expect(data).toHaveProperty('verified');
    expect(data).toHaveProperty('verification_date');
    expect(data).toHaveProperty('data_quality_score');
    expect(data).toHaveProperty('sources');
  });

  it('should include verification criteria', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-456',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-456' } });
    const data = await response.json();

    expect(data).toHaveProperty('verification_criteria');
    expect(data.verification_criteria).toHaveProperty('minimum_score');
    expect(data.verification_criteria.minimum_score).toBe(70);
  });

  it('should include how to verify independently', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-789',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-789' } });
    const data = await response.json();

    expect(data).toHaveProperty('how_to_verify_independently');
    expect(data.how_to_verify_independently).toHaveProperty('municipality');
    expect(data.how_to_verify_independently).toHaveProperty('companies_registry');
    expect(data.how_to_verify_independently).toHaveProperty('google_maps');
  });

  it('should provide report issue information', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-100',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-100' } });
    const data = await response.json();

    expect(data).toHaveProperty('report_issue');
    expect(data.report_issue).toHaveProperty('url');
    expect(data.report_issue).toHaveProperty('method');
    expect(data.report_issue.method).toBe('POST');
  });

  it('should include CORS headers', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-200',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-200' } });

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should have cache headers', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-300',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-300' } });

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage');
  });

  it('should handle verification errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-ERROR' } });

    expect(response.status).toBe(500);

    const data = await response.json();

    expect(data).toHaveProperty('verified');
    expect(data.verified).toBe(false);
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('how_to_verify_manually');
  });

  it('should format source data correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-400',
              שם_עסק: 'בית קפה',
              כתובת: 'דיזנגוף 123',
              סטטוס: 'פעיל',
              תאריך_פקיעה: '2025-01-01',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-400' } });
    const data = await response.json();

    const municipalitySource = data.sources.find(
      (s: any) => s.source_name === 'tel_aviv_municipality'
    );

    expect(municipalitySource).toBeDefined();
    expect(municipalitySource.details).toBeDefined();
    expect(municipalitySource.details).toHaveProperty('business_name');
    expect(municipalitySource.details).toHaveProperty('status');
  });
});

describe('API - /api/verify/[businessId] - OPTIONS', () => {
  it('should return 200 for CORS preflight', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
  });

  it('should include CORS headers', async () => {
    const response = await OPTIONS();

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
  });
});

describe('API - /api/verify/[businessId] - Transparency', () => {
  it('should provide all verification URLs', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-500',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-500' } });
    const data = await response.json();

    // Should provide URLs for independent verification
    data.sources.forEach((source: any) => {
      expect(source.verification_url).toBeDefined();
      expect(source.verification_url).toMatch(/^https?:\/\//);
    });
  });

  it('should explain verification criteria', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-600',
              שם_עסק: 'Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { businessId: 'TLV-600' } });
    const data = await response.json();

    expect(data.verification_criteria.required_sources).toContain('tel_aviv_municipality');
    expect(Array.isArray(data.verification_criteria.optional_sources)).toBe(true);
  });
});
