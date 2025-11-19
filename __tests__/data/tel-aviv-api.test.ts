/**
 * Tel Aviv API Tests
 *
 * Tests for Tel Aviv Municipality Open Data API integration
 */

import axios from 'axios';
import {
  fetchTelAvivBusinesses,
  fetchNewBusinessRegistrations,
  verifyBusiness,
  getTelAvivStatistics,
} from '@/lib/data/tel-aviv-api';
import {
  createMockTelAvivBusiness,
  mockTelAvivAPIResponse,
  createMockAxiosResponse,
} from '../utils/mock-data';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Tel Aviv API - fetchTelAvivBusinesses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch businesses from Tel Aviv API', async () => {
    const mockBusinesses = [
      createMockTelAvivBusiness(),
      createMockTelAvivBusiness({ license_number: 'TLV-2024-54321' }),
    ];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    const result = await fetchTelAvivBusinesses(10, 0);

    expect(result.businesses).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should apply pagination parameters', async () => {
    const mockBusinesses = [createMockTelAvivBusiness()];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    await fetchTelAvivBusinesses(20, 40);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          limit: 20,
          offset: 40,
        }),
      })
    );
  });

  it('should apply status filter', async () => {
    const mockBusinesses = [createMockTelAvivBusiness({ status: 'active' })];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    await fetchTelAvivBusinesses(10, 0, { status: 'active' });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          filters: expect.stringContaining('active'),
        }),
      })
    );
  });

  it('should map Hebrew fields to English', async () => {
    const mockBusinesses = [
      {
        _id: 'TLV-123',
        שם_עסק: 'בית קפה',
        סוג_עסק: 'קפה',
        רחוב: 'דיזנגוף',
        מספר_בית: '123',
        שכונה: 'צפון ישן',
        תאריך_הנפקה: '2024-01-01',
        תאריך_פקיעה: '2025-01-01',
        סטטוס: 'פעיל',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses as any))
    );

    const result = await fetchTelAvivBusinesses(10, 0);

    expect(result.businesses[0]).toHaveProperty('business_name');
    expect(result.businesses[0]).toHaveProperty('business_type');
    expect(result.businesses[0]).toHaveProperty('street');
    expect(result.businesses[0]).toHaveProperty('house_number');
    expect(result.businesses[0].status).toBe('active');
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchTelAvivBusinesses()).rejects.toThrow(
      'Failed to fetch Tel Aviv business data'
    );
  });

  it('should include data source in response', async () => {
    const mockBusinesses = [createMockTelAvivBusiness()];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    const result = await fetchTelAvivBusinesses();

    expect(result.businesses[0].data_source).toBe('tel_aviv_municipality');
  });

  it('should handle coordinates when available', async () => {
    const mockBusinesses = [
      createMockTelAvivBusiness({
        coordinates: { lat: 32.0853, lon: 34.7818 },
      }),
    ];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    const result = await fetchTelAvivBusinesses();

    expect(result.businesses[0].coordinates).toBeDefined();
    expect(result.businesses[0].coordinates?.lat).toBe(32.0853);
    expect(result.businesses[0].coordinates?.lon).toBe(34.7818);
  });
});

describe('Tel Aviv API - fetchNewBusinessRegistrations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch new registrations from last N days', async () => {
    const mockBusinesses = [createMockTelAvivBusiness()];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    const result = await fetchNewBusinessRegistrations(7);

    expect(Array.isArray(result)).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          resource_id: 'new-business-registrations',
        }),
      })
    );
  });

  it('should filter by issue date', async () => {
    const mockBusinesses = [createMockTelAvivBusiness()];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    await fetchNewBusinessRegistrations(1);

    const callArgs = mockedAxios.get.mock.calls[0][1];
    expect(callArgs?.params.filters).toBeDefined();
  });

  it('should handle empty results', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse([]))
    );

    const result = await fetchNewBusinessRegistrations(1);

    expect(result).toEqual([]);
  });

  it('should return empty array on error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const result = await fetchNewBusinessRegistrations(1);

    expect(result).toEqual([]);
  });
});

describe('Tel Aviv API - verifyBusiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify business with municipality', async () => {
    const mockRecord = {
      _id: 'TLV-123',
      שם_עסק: 'Test Business',
      סטטוס: 'פעיל',
    };

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [mockRecord],
        },
      })
    );

    const result = await verifyBusiness('TLV-123');

    expect(result.verified).toBe(false); // No additional sources, score < 70
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.data_quality_score).toBeGreaterThan(0);
  });

  it('should calculate data quality score', async () => {
    const mockRecord = {
      _id: 'TLV-123',
      שם_עסק: 'Test Business',
      סטטוס: 'פעיל',
    };

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [mockRecord],
        },
      })
    );

    const result = await verifyBusiness('TLV-123');

    expect(result.data_quality_score).toBeGreaterThanOrEqual(0);
    expect(result.data_quality_score).toBeLessThanOrEqual(100);
  });

  it('should verify only active businesses', async () => {
    const mockRecord = {
      _id: 'TLV-123',
      שם_עסק: 'Test Business',
      סטטוס: 'פעיל',
    };

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [mockRecord],
        },
      })
    );

    const result = await verifyBusiness('TLV-123');

    const municipalitySource = result.sources.find(
      (s) => s.source === 'tel_aviv_municipality'
    );

    expect(municipalitySource).toBeDefined();
    expect(municipalitySource?.status).toBe('verified_active');
  });

  it('should include verification URLs', async () => {
    const mockRecord = {
      _id: 'TLV-123',
      שם_עסק: 'Test Business',
      סטטוס: 'פעיל',
    };

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [mockRecord],
        },
      })
    );

    const result = await verifyBusiness('TLV-123');

    expect(result.sources[0].verified_url).toContain('data.tel-aviv.gov.il');
  });

  it('should require minimum score of 70 for verification', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));

    const result = await verifyBusiness('invalid');

    expect(result.data_quality_score).toBeLessThan(70);
    expect(result.verified).toBe(false);
  });

  it('should handle verification errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const result = await verifyBusiness('TLV-123');

    expect(result).toBeDefined();
    expect(result.sources).toEqual([]);
    expect(result.verified).toBe(false);
  });
});

describe('Tel Aviv API - getTelAvivStatistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch comprehensive statistics', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 1000 },
        })
      )
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 800 },
        })
      )
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 25 },
        })
      );

    const result = await getTelAvivStatistics();

    expect(result).toHaveProperty('total_businesses');
    expect(result).toHaveProperty('active_businesses');
    expect(result).toHaveProperty('new_this_month');
    expect(result).toHaveProperty('closed_this_month');
    expect(result).toHaveProperty('by_category');
    expect(result).toHaveProperty('by_neighborhood');
    expect(result).toHaveProperty('last_updated');
  });

  it('should return valid counts', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 500 },
        })
      )
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 450 },
        })
      )
      .mockResolvedValueOnce(
        createMockAxiosResponse({
          result: { total: 10 },
        })
      );

    const result = await getTelAvivStatistics();

    expect(result.total_businesses).toBeGreaterThanOrEqual(0);
    expect(result.active_businesses).toBeGreaterThanOrEqual(0);
    expect(result.new_this_month).toBeGreaterThanOrEqual(0);
  });

  it('should include timestamp', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(createMockAxiosResponse({ result: { total: 100 } }))
      .mockResolvedValueOnce(createMockAxiosResponse({ result: { total: 80 } }))
      .mockResolvedValueOnce(createMockAxiosResponse({ result: { total: 5 } }));

    const result = await getTelAvivStatistics();

    expect(result.last_updated).toBeDefined();
    expect(new Date(result.last_updated).getTime()).not.toBeNaN();
  });

  it('should handle API errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(getTelAvivStatistics()).rejects.toThrow();
  });
});

describe('Tel Aviv API - Data Mapping', () => {
  it('should correctly map status values', async () => {
    const testCases = [
      { hebrew: 'פעיל', expected: 'active' },
      { hebrew: 'פקע', expected: 'expired' },
      { hebrew: 'מושעה', expected: 'suspended' },
    ];

    for (const testCase of testCases) {
      const mockBusinesses = [
        {
          _id: 'TLV-123',
          שם_עסק: 'Test',
          סוג_עסק: 'Test',
          רחוב: 'Test',
          מספר_בית: '1',
          שכונה: 'Test',
          תאריך_הנפקה: '2024-01-01',
          תאריך_פקיעה: '2025-01-01',
          סטטוס: testCase.hebrew,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses as any))
      );

      const result = await fetchTelAvivBusinesses(1, 0);

      expect(result.businesses[0].status).toBe(testCase.expected);
    }
  });

  it('should set city to Tel Aviv-Yafo', async () => {
    const mockBusinesses = [createMockTelAvivBusiness()];

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse(mockTelAvivAPIResponse(mockBusinesses))
    );

    const result = await fetchTelAvivBusinesses();

    expect(result.businesses[0].city).toBe('Tel Aviv-Yafo');
  });
});

describe('Tel Aviv API - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle network timeouts', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('ETIMEDOUT'));

    await expect(fetchTelAvivBusinesses()).rejects.toThrow();
  });

  it('should handle malformed responses', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({ invalid: 'data' })
    );

    await expect(fetchTelAvivBusinesses()).rejects.toThrow();
  });

  it('should provide helpful error messages', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('404 Not Found'));

    try {
      await fetchTelAvivBusinesses();
    } catch (error: any) {
      expect(error.message).toContain('data.tel-aviv.gov.il');
    }
  });
});
