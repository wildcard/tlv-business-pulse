/**
 * Health Check API Tests
 *
 * Tests for the /api/health endpoint
 */

import { GET, OPTIONS } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

describe('API - /api/health - GET', () => {
  it('should return 200 status', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('should return health status object', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('environment');
  });

  it('should have healthy status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.status).toBe('healthy');
  });

  it('should include service name', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.service).toBe('tlv-business-pulse');
  });

  it('should include version', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.version).toBe('1.0.0');
  });

  it('should include valid timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp.getTime()).not.toBeNaN();

    // Should be recent (within last minute)
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    expect(diff).toBeLessThan(60000); // 1 minute
  });

  it('should have no-cache headers', async () => {
    const response = await GET();

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('no-cache');
    expect(cacheControl).toContain('no-store');
  });

  it('should have correct content-type', async () => {
    const response = await GET();

    const contentType = response.headers.get('Content-Type');
    expect(contentType).toBe('application/json');
  });

  it('should include uptime if available', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('uptime');
  });
});

describe('API - /api/health - OPTIONS', () => {
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

  it('should have max-age header', async () => {
    const response = await OPTIONS();

    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400');
  });
});

describe('API - /api/health - Response Validation', () => {
  it('should match expected schema', async () => {
    const response = await GET();
    const data = await response.json();

    // Validate all required fields are present
    const requiredFields = ['status', 'timestamp', 'service', 'version', 'environment'];

    requiredFields.forEach((field) => {
      expect(data).toHaveProperty(field);
      expect(data[field]).toBeTruthy();
    });
  });

  it('should return consistent structure', async () => {
    const response1 = await GET();
    const data1 = await response1.json();

    const response2 = await GET();
    const data2 = await response2.json();

    // Same keys in both responses
    expect(Object.keys(data1).sort()).toEqual(Object.keys(data2).sort());
  });
});
