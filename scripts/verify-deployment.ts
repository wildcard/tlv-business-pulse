#!/usr/bin/env tsx

/**
 * Deployment Verification Script
 *
 * Automatically verifies that a deployment is working correctly by testing
 * all critical endpoints and functionality.
 *
 * Usage:
 *   npx tsx scripts/verify-deployment.ts https://your-app.vercel.app
 *
 * Example:
 *   npx tsx scripts/verify-deployment.ts https://tlv-business-pulse.vercel.app
 */

import axios, { AxiosError } from 'axios';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

const results: TestResult[] = [];

// Helper functions
function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, 'green');
}

function error(message: string) {
  log(`✗ ${message}`, 'red');
}

function info(message: string) {
  log(`ℹ ${message}`, 'cyan');
}

function warn(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

async function runTest(
  name: string,
  testFn: () => Promise<{ passed: boolean; message: string; details?: any }>
): Promise<void> {
  const startTime = Date.now();

  try {
    const result = await testFn();
    const duration = Date.now() - startTime;

    results.push({
      name,
      passed: result.passed,
      message: result.message,
      duration,
      details: result.details,
    });

    if (result.passed) {
      success(`${name} - ${result.message} (${duration}ms)`);
    } else {
      error(`${name} - ${result.message} (${duration}ms)`);
    }
  } catch (err: any) {
    const duration = Date.now() - startTime;
    const message = err.message || 'Unknown error';

    results.push({
      name,
      passed: false,
      message: `Error: ${message}`,
      duration,
    });

    error(`${name} - Error: ${message} (${duration}ms)`);
  }
}

// Test functions
async function testHealthEndpoint(baseUrl: string) {
  return runTest('Health Check', async () => {
    const response = await axios.get(`${baseUrl}/api/health`, {
      timeout: 10000,
    });

    if (response.status !== 200) {
      return {
        passed: false,
        message: `Expected status 200, got ${response.status}`,
      };
    }

    const data = response.data;

    if (data.status !== 'healthy') {
      return {
        passed: false,
        message: `Status is '${data.status}', expected 'healthy'`,
        details: data,
      };
    }

    // Check if database is up (if included in health check)
    if (data.services?.database) {
      if (data.services.database.status !== 'up') {
        return {
          passed: false,
          message: `Database status is '${data.services.database.status}'`,
          details: data,
        };
      }
    }

    return {
      passed: true,
      message: 'Healthy',
      details: {
        timestamp: data.timestamp,
        database: data.services?.database?.status || 'not checked',
      },
    };
  });
}

async function testHomepage(baseUrl: string) {
  return runTest('Homepage Load', async () => {
    const response = await axios.get(baseUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'TLV-Deployment-Verification/1.0',
      },
    });

    if (response.status !== 200) {
      return {
        passed: false,
        message: `Expected status 200, got ${response.status}`,
      };
    }

    const html = response.data;

    // Check for essential elements
    const checks = {
      hasHtml: html.includes('<html'),
      hasHead: html.includes('<head'),
      hasBody: html.includes('<body'),
      hasTitle: html.includes('<title>'),
      notError: !html.toLowerCase().includes('error occurred'),
    };

    const failed = Object.entries(checks).filter(([_, passed]) => !passed);

    if (failed.length > 0) {
      return {
        passed: false,
        message: `Missing elements: ${failed.map(([key]) => key).join(', ')}`,
        details: checks,
      };
    }

    return {
      passed: true,
      message: 'Loaded successfully',
      details: {
        contentLength: html.length,
      },
    };
  });
}

async function testBusinessesAPI(baseUrl: string) {
  return runTest('Businesses API', async () => {
    const response = await axios.get(`${baseUrl}/api/businesses?limit=1`, {
      timeout: 10000,
    });

    if (response.status !== 200) {
      return {
        passed: false,
        message: `Expected status 200, got ${response.status}`,
      };
    }

    const data = response.data;

    if (!Array.isArray(data)) {
      return {
        passed: false,
        message: `Expected array response, got ${typeof data}`,
        details: data,
      };
    }

    return {
      passed: true,
      message: `Returns array with ${data.length} items`,
      details: {
        count: data.length,
      },
    };
  });
}

async function testVerificationAPI(baseUrl: string) {
  return runTest('Verification API', async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/verify/test-12345`, {
        timeout: 10000,
        validateStatus: () => true, // Accept any status code
      });

      // Accept 200 (success) or 500 (graceful error handling)
      if (response.status !== 200 && response.status !== 500) {
        return {
          passed: false,
          message: `Unexpected status ${response.status}`,
        };
      }

      const data = response.data;

      // Check response structure
      if (!data.business_id) {
        return {
          passed: false,
          message: 'Missing business_id in response',
          details: data,
        };
      }

      return {
        passed: true,
        message: 'API responding correctly',
        details: {
          status: response.status,
          verified: data.verified,
        },
      };
    } catch (err: any) {
      // Network errors are acceptable for this test (means endpoint exists)
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        return {
          passed: false,
          message: 'Request timed out',
        };
      }
      throw err;
    }
  });
}

async function testStaticPages(baseUrl: string) {
  const pages = [
    { path: '/about', name: 'About' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/transparency', name: 'Transparency' },
    { path: '/help', name: 'Help' },
  ];

  for (const page of pages) {
    await runTest(`${page.name} Page`, async () => {
      try {
        const response = await axios.get(`${baseUrl}${page.path}`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'TLV-Deployment-Verification/1.0',
          },
          validateStatus: (status) => status < 500, // Accept redirects and client errors
        });

        if (response.status >= 500) {
          return {
            passed: false,
            message: `Server error: ${response.status}`,
          };
        }

        if (response.status === 404) {
          return {
            passed: false,
            message: 'Page not found (404)',
          };
        }

        return {
          passed: true,
          message: `Loaded (${response.status})`,
        };
      } catch (err: any) {
        if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
          return {
            passed: false,
            message: 'Request timed out',
          };
        }
        throw err;
      }
    });
  }
}

async function testPerformance(baseUrl: string) {
  return runTest('Response Time', async () => {
    const iterations = 3;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await axios.get(`${baseUrl}/api/health`, { timeout: 10000 });
      times.push(Date.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);

    if (avgTime > 2000) {
      return {
        passed: false,
        message: `Average response time too high: ${avgTime.toFixed(0)}ms`,
        details: { avgTime, maxTime, times },
      };
    }

    return {
      passed: true,
      message: `Average ${avgTime.toFixed(0)}ms, max ${maxTime}ms`,
      details: { avgTime, maxTime, times },
    };
  });
}

async function testSSL(baseUrl: string) {
  return runTest('SSL Certificate', async () => {
    if (!baseUrl.startsWith('https://')) {
      return {
        passed: false,
        message: 'Not using HTTPS',
      };
    }

    try {
      await axios.get(baseUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TLV-Deployment-Verification/1.0',
        },
      });

      return {
        passed: true,
        message: 'HTTPS working correctly',
      };
    } catch (err: any) {
      if (err.code === 'CERT_HAS_EXPIRED') {
        return {
          passed: false,
          message: 'SSL certificate expired',
        };
      }
      if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return {
          passed: false,
          message: 'SSL certificate verification failed',
        };
      }
      throw err;
    }
  });
}

// Main function
async function main() {
  const baseUrl = process.argv[2];

  if (!baseUrl) {
    error('Usage: npx tsx scripts/verify-deployment.ts <BASE_URL>');
    error('Example: npx tsx scripts/verify-deployment.ts https://your-app.vercel.app');
    process.exit(1);
  }

  // Validate URL
  try {
    new URL(baseUrl);
  } catch {
    error(`Invalid URL: ${baseUrl}`);
    process.exit(1);
  }

  log('\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  TLV Business Pulse - Deployment Verification', 'cyan');
  log('═══════════════════════════════════════════════════════════\n', 'cyan');

  info(`Testing deployment at: ${baseUrl}\n`);

  // Run all tests
  await testSSL(baseUrl);
  await testHealthEndpoint(baseUrl);
  await testHomepage(baseUrl);
  await testBusinessesAPI(baseUrl);
  await testVerificationAPI(baseUrl);
  await testStaticPages(baseUrl);
  await testPerformance(baseUrl);

  // Summary
  log('\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  Test Summary', 'cyan');
  log('═══════════════════════════════════════════════════════════\n', 'cyan');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  log(`Total Tests:  ${total}`, 'gray');
  log(`Passed:       ${passed} ✓`, passed > 0 ? 'green' : 'gray');
  log(`Failed:       ${failed} ✗`, failed > 0 ? 'red' : 'gray');
  log(`Pass Rate:    ${passRate}%\n`, failed === 0 ? 'green' : 'yellow');

  // Failed tests details
  if (failed > 0) {
    log('═══════════════════════════════════════════════════════════', 'red');
    log('  Failed Tests', 'red');
    log('═══════════════════════════════════════════════════════════\n', 'red');

    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        error(`${r.name}: ${r.message}`);
        if (r.details) {
          log(`  Details: ${JSON.stringify(r.details, null, 2)}`, 'gray');
        }
      });

    log('');
  }

  // Recommendations
  if (failed > 0) {
    log('═══════════════════════════════════════════════════════════', 'yellow');
    log('  Recommendations', 'yellow');
    log('═══════════════════════════════════════════════════════════\n', 'yellow');

    const failedTests = results.filter((r) => !r.passed);

    if (failedTests.some((r) => r.name === 'Health Check')) {
      warn('• Check that environment variables are configured in Vercel');
      warn('• Verify Supabase database is accessible');
      warn('• Review Vercel deployment logs for errors');
    }

    if (failedTests.some((r) => r.name.includes('API'))) {
      warn('• Verify API routes are deployed correctly');
      warn('• Check that database schema is applied');
      warn('• Review function logs in Vercel dashboard');
    }

    if (failedTests.some((r) => r.name.includes('Page'))) {
      warn('• Check that all pages are included in build');
      warn('• Verify Next.js routing is configured correctly');
    }

    if (failedTests.some((r) => r.name === 'Response Time')) {
      warn('• Consider upgrading Vercel plan for better performance');
      warn('• Review database query optimization');
      warn('• Check if cold starts are affecting response times');
    }

    if (failedTests.some((r) => r.name === 'SSL Certificate')) {
      warn('• Ensure domain is properly configured in Vercel');
      warn('• Wait for Vercel to provision SSL certificate (can take up to 24 hours)');
    }

    log('');
  }

  // Final verdict
  log('═══════════════════════════════════════════════════════════', 'cyan');

  if (failed === 0) {
    log('  ✓ Deployment Verified Successfully!', 'green');
    log('═══════════════════════════════════════════════════════════\n', 'cyan');
    process.exit(0);
  } else if (failed <= 2) {
    log('  ⚠ Deployment Mostly Working (Minor Issues)', 'yellow');
    log('═══════════════════════════════════════════════════════════\n', 'cyan');
    process.exit(1);
  } else {
    log('  ✗ Deployment Has Critical Issues', 'red');
    log('═══════════════════════════════════════════════════════════\n', 'cyan');
    process.exit(1);
  }
}

// Run
main().catch((err) => {
  error(`\nUnexpected error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
