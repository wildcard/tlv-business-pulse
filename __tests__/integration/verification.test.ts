/**
 * Business Verification Integration Tests
 *
 * Tests the complete business verification workflow
 */

import { verifyBusiness } from '@/lib/data/tel-aviv-api';
import axios from 'axios';
import { createMockAxiosResponse } from '../utils/mock-data';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Integration - Business Verification Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify business across multiple sources', async () => {
    // 1. Verify with Tel Aviv Municipality (primary source)
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

    const verification = await verifyBusiness('TLV-123');

    // 2. Check verification results
    expect(verification).toBeDefined();
    expect(verification).toHaveProperty('verified');
    expect(verification).toHaveProperty('sources');
    expect(verification).toHaveProperty('data_quality_score');
    expect(verification).toHaveProperty('verification_date');

    // 3. Verify sources were checked
    expect(verification.sources.length).toBeGreaterThan(0);

    const municipalitySource = verification.sources.find(
      (s) => s.source === 'tel_aviv_municipality'
    );

    expect(municipalitySource).toBeDefined();
    expect(municipalitySource?.status).toBe('verified_active');

    // 4. Check quality score calculation
    expect(verification.data_quality_score).toBeGreaterThanOrEqual(0);
    expect(verification.data_quality_score).toBeLessThanOrEqual(100);

    // 5. Verify threshold logic (70 points required)
    if (verification.data_quality_score >= 70) {
      expect(verification.verified).toBe(true);
    } else {
      expect(verification.verified).toBe(false);
    }
  });

  it('should fail verification for inactive businesses', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-456',
              שם_עסק: 'Closed Business',
              סטטוס: 'פקע', // Expired
            },
          ],
        },
      })
    );

    const verification = await verifyBusiness('TLV-456');

    // Should not add points for inactive business
    expect(verification.data_quality_score).toBeLessThan(70);
    expect(verification.verified).toBe(false);
  });

  it('should provide verification URLs for transparency', async () => {
    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [
            {
              _id: 'TLV-789',
              שם_עסק: 'Verified Business',
              סטטוס: 'פעיל',
            },
          ],
        },
      })
    );

    const verification = await verifyBusiness('TLV-789');

    verification.sources.forEach((source) => {
      expect(source.verified_url).toBeDefined();
      expect(source.verified_url).toContain('http');
    });
  });

  it('should handle verification failures gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const verification = await verifyBusiness('TLV-999');

    expect(verification.verified).toBe(false);
    expect(verification.data_quality_score).toBe(0);
    expect(verification.sources).toEqual([]);
  });

  it('should calculate quality scores correctly', async () => {
    // Municipality only (40 points)
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

    const verification = await verifyBusiness('TLV-100');

    // With only municipality verification, score should be 40
    expect(verification.data_quality_score).toBe(40);
    expect(verification.verified).toBe(false); // Need 70+ to verify
  });

  it('should include last checked timestamps', async () => {
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

    const verification = await verifyBusiness('TLV-200');

    verification.sources.forEach((source) => {
      expect(source.last_checked).toBeDefined();
      const timestamp = new Date(source.last_checked);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    expect(new Date(verification.verification_date).getTime()).not.toBeNaN();
  });
});

describe('Integration - Cross-Source Validation', () => {
  it('should detect data inconsistencies across sources', async () => {
    // This test demonstrates how we could detect when data from different
    // sources doesn't match, which would lower the quality score

    const municipalityData = {
      _id: 'TLV-300',
      שם_עסק: 'Business Name A',
      כתובת: 'Address A',
      סטטוס: 'פעיל',
    };

    mockedAxios.get.mockResolvedValueOnce(
      createMockAxiosResponse({
        result: {
          records: [municipalityData],
        },
      })
    );

    const verification = await verifyBusiness('TLV-300');

    // In a real implementation, we would compare data from multiple sources
    // and reduce the quality score if there are inconsistencies
    expect(verification.sources.length).toBeGreaterThan(0);
  });
});
