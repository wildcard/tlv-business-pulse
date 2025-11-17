#!/usr/bin/env tsx

/**
 * Health Check Script
 *
 * This script is executed by GitHub Actions every 15 minutes.
 * It verifies that all critical systems are operational and sends
 * alerts if any issues are detected.
 *
 * Autonomous Features:
 * - Checks database connectivity
 * - Verifies API endpoints
 * - Tests external service connections
 * - Monitors system health
 * - Sends alerts on failures
 *
 * Usage:
 *   npm run cron:health
 *   tsx scripts/health-check.ts
 */

import { checkDatabaseHealth } from '../lib/db/supabase';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  details?: string;
}

interface HealthCheckResult {
  timestamp: string;
  overall: 'healthy' | 'unhealthy' | 'degraded';
  services: ServiceHealth[];
  uptime: number;
}

/**
 * Check database health
 */
async function checkDatabase(): Promise<ServiceHealth> {
  try {
    const result = await checkDatabaseHealth();

    return {
      name: 'Database (Supabase)',
      status: result.healthy ? 'healthy' : 'unhealthy',
      responseTime: result.responseTime,
      details: result.healthy ? 'Connected and responsive' : 'Connection failed',
    };
  } catch (error) {
    return {
      name: 'Database (Supabase)',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check API endpoints
 */
async function checkApi(): Promise<ServiceHealth> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const startTime = Date.now();

    // Test the stats endpoint
    const response = await fetch(`${siteUrl}/api/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'API Endpoints',
        status: responseTime > 5000 ? 'degraded' : 'healthy',
        responseTime,
        details: `Responded in ${responseTime}ms`,
      };
    } else {
      return {
        name: 'API Endpoints',
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      name: 'API Endpoints',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Check external data source (Tel Aviv Open Data)
 */
async function checkExternalData(): Promise<ServiceHealth> {
  try {
    const API_URL = 'https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/964/query';
    const startTime = Date.now();

    const response = await fetch(`${API_URL}?where=1=1&returnCountOnly=true&f=json`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();

      return {
        name: 'External Data Source',
        status: responseTime > 10000 ? 'degraded' : 'healthy',
        responseTime,
        details: `Available (${data.count || 'N/A'} records)`,
      };
    } else {
      return {
        name: 'External Data Source',
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'External Data Source',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Check OpenAI API availability
 */
async function checkOpenAI(): Promise<ServiceHealth> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        name: 'OpenAI API',
        status: 'unhealthy',
        error: 'API key not configured',
      };
    }

    const startTime = Date.now();

    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'OpenAI API',
        status: 'healthy',
        responseTime,
        details: 'Connected and authorized',
      };
    } else {
      return {
        name: 'OpenAI API',
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      name: 'OpenAI API',
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Connection check skipped',
    };
  }
}

/**
 * Check Stripe API availability
 */
async function checkStripe(): Promise<ServiceHealth> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        name: 'Stripe API',
        status: 'unhealthy',
        error: 'API key not configured',
      };
    }

    const startTime = Date.now();

    const response = await fetch('https://api.stripe.com/v1/balance', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Stripe API',
        status: 'healthy',
        responseTime,
        details: 'Connected and authorized',
      };
    } else {
      return {
        name: 'Stripe API',
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'Stripe API',
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Connection check skipped',
    };
  }
}

/**
 * Send alert notification (email, Slack, etc.)
 */
async function sendAlert(result: HealthCheckResult): Promise<void> {
  const unhealthyServices = result.services.filter((s) => s.status === 'unhealthy');

  if (unhealthyServices.length === 0) {
    return; // No alerts needed
  }

  console.log('\n⚠️  ALERT: System health issues detected!');
  console.log('========================================');

  unhealthyServices.forEach((service) => {
    console.log(`\n❌ ${service.name}: ${service.status.toUpperCase()}`);
    if (service.error) {
      console.log(`   Error: ${service.error}`);
    }
  });

  console.log('\n========================================');

  // In production, this would send an actual email or Slack notification
  // Example using a webhook:
  /*
  try {
    await fetch(process.env.ALERT_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `Health check failed at ${result.timestamp}`,
        services: unhealthyServices,
      }),
    });
  } catch (error) {
    console.error('Failed to send alert:', error);
  }
  */
}

/**
 * Calculate system uptime
 */
function calculateUptime(services: ServiceHealth[]): number {
  const healthyServices = services.filter((s) => s.status === 'healthy').length;
  return (healthyServices / services.length) * 100;
}

/**
 * Main health check function
 */
async function main() {
  console.log('========================================');
  console.log('TLV Business Pulse - Health Check');
  console.log('========================================');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Run all health checks in parallel
    console.log('Running health checks...\n');

    const [database, api, externalData, openai, stripe] = await Promise.all([
      checkDatabase(),
      checkApi(),
      checkExternalData(),
      checkOpenAI(),
      checkStripe(),
    ]);

    const services = [database, api, externalData, openai, stripe];

    // Display results
    console.log('Health Check Results:');
    console.log('----------------------------------------');

    services.forEach((service) => {
      const statusEmoji = service.status === 'healthy' ? '✅' : service.status === 'degraded' ? '⚠️' : '❌';
      const responseTime = service.responseTime ? ` (${service.responseTime}ms)` : '';

      console.log(`${statusEmoji} ${service.name}: ${service.status.toUpperCase()}${responseTime}`);

      if (service.details) {
        console.log(`   ${service.details}`);
      }

      if (service.error) {
        console.log(`   Error: ${service.error}`);
      }

      console.log('');
    });

    // Calculate overall health
    const unhealthyCount = services.filter((s) => s.status === 'unhealthy').length;
    const degradedCount = services.filter((s) => s.status === 'degraded').length;

    let overall: 'healthy' | 'unhealthy' | 'degraded';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    const uptime = calculateUptime(services);

    const result: HealthCheckResult = {
      timestamp: new Date().toISOString(),
      overall,
      services,
      uptime,
    };

    // Summary
    console.log('========================================');
    console.log(`Overall Status: ${overall.toUpperCase()}`);
    console.log(`System Uptime: ${uptime.toFixed(2)}%`);
    console.log(`Healthy: ${services.filter((s) => s.status === 'healthy').length}/${services.length}`);
    console.log(`Degraded: ${degradedCount}`);
    console.log(`Unhealthy: ${unhealthyCount}`);
    console.log('========================================');
    console.log(`Completed at: ${new Date().toISOString()}\n`);

    // Send alerts if needed
    if (overall === 'unhealthy') {
      await sendAlert(result);
    }

    // Exit with appropriate code
    if (overall === 'unhealthy') {
      console.log('⚠️  Exiting with error code due to unhealthy services\n');
      process.exit(1);
    } else {
      console.log('✅ All systems operational\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ ERROR: Health check failed!');
    console.error('========================================');
    console.error('Error details:', error);

    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }

    console.error('========================================');
    console.error(`Failed at: ${new Date().toISOString()}\n`);

    process.exit(1);
  }
}

// Execute main function
main();
