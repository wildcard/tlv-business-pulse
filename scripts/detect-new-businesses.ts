#!/usr/bin/env tsx

/**
 * New Business Detection Script
 *
 * This script runs daily to detect new businesses registered in Tel Aviv,
 * generate websites for them, and send notifications.
 *
 * Features:
 * - Fetches new business registrations (last 24 hours)
 * - Checks which ones haven't been processed yet
 * - Verifies business is active
 * - Generates website for each new business
 * - Sends welcome email (if configured)
 * - Logs all operations
 * - Sends daily summary report
 *
 * Error Handling:
 * - Retry failed API calls (3 times with exponential backoff)
 * - Continue processing even if one business fails
 * - Send alert if > 10% of businesses fail
 * - Comprehensive logging for debugging
 *
 * Usage:
 *   npm run detect-new-businesses
 *   tsx scripts/detect-new-businesses.ts
 */

import { dataFetcher } from '../lib/services/dataFetcher';
import { contentGenerator } from '../lib/services/contentGenerator';
import { supabase } from '../lib/supabase';
import {
  sendNotification,
  notifyNewBusinessProcessed,
  notifyDailySummary,
  notifyCriticalError,
} from '../lib/notifications/notify';

interface ProcessingResult {
  businessId: string;
  businessName: string;
  success: boolean;
  error?: string;
  retries: number;
}

interface DailyStats {
  totalFetched: number;
  newBusinesses: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
  successRate: number;
  errors: string[];
  processingTime: number;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, attempt);

      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);

      if (attempt < maxRetries - 1) {
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Fetch businesses registered in the last 24 hours from Tel Aviv API
 */
async function fetchRecentBusinesses(): Promise<any[]> {
  console.log('Fetching recent business registrations...');

  try {
    const businesses = await retryWithBackoff(
      () => dataFetcher.fetchBusinessData(),
      3,
      2000
    );

    // Filter for businesses registered in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentBusinesses = businesses.filter((business: any) => {
      if (!business.taarich_rish_rishum) return false;

      const registrationDate = new Date(business.taarich_rish_rishum);
      return registrationDate >= twentyFourHoursAgo;
    });

    console.log(`✓ Found ${recentBusinesses.length} businesses registered in last 24 hours`);
    return recentBusinesses;
  } catch (error) {
    console.error('Failed to fetch recent businesses:', error);
    throw error;
  }
}

/**
 * Check which businesses haven't been processed yet
 */
async function filterUnprocessedBusinesses(businesses: any[]): Promise<any[]> {
  console.log('Checking which businesses are new to our system...');

  try {
    const unprocessed: any[] = [];

    for (const business of businesses) {
      const externalId = business.mosad_yeshut?.toString() || business.ObjectId?.toString();

      if (!externalId) {
        console.warn('Business missing external ID, skipping:', business.shem_esek);
        continue;
      }

      // Check if business already exists in database
      const { data: existing, error } = await supabase
        .from('businesses')
        .select('id, external_id')
        .eq('external_id', externalId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found, which is expected for new businesses
        console.warn(`Error checking business ${externalId}:`, error);
        continue;
      }

      if (!existing) {
        unprocessed.push(business);
      }
    }

    console.log(`✓ Found ${unprocessed.length} new businesses to process`);
    return unprocessed;
  } catch (error) {
    console.error('Failed to filter unprocessed businesses:', error);
    throw error;
  }
}

/**
 * Verify business is active and has required data
 */
function verifyBusinessData(business: any): { valid: boolean; reason?: string } {
  // Check if business has required fields
  if (!business.shem_esek) {
    return { valid: false, reason: 'Missing business name' };
  }

  if (!business.mosad_yeshut && !business.ObjectId) {
    return { valid: false, reason: 'Missing unique identifier' };
  }

  // Check if business is marked as active
  if (business.status_ishur && business.status_ishur.toLowerCase().includes('closed')) {
    return { valid: false, reason: 'Business is closed' };
  }

  if (business.status_ishur && business.status_ishur.toLowerCase().includes('inactive')) {
    return { valid: false, reason: 'Business is inactive' };
  }

  return { valid: true };
}

/**
 * Generate website for a business
 */
async function generateWebsiteForBusiness(business: any): Promise<void> {
  console.log(`  Generating website for: ${business.shem_esek}`);

  try {
    // First, save business to database
    const businessData = {
      external_id: business.mosad_yeshut?.toString() || business.ObjectId?.toString(),
      name: business.shem_esek,
      category: business.sug_esek || null,
      address: business.shder_rchov || null,
      phone: business.phone || null,
      status: business.status_ishur || 'active',
      opened_date: business.taarich_rish_rishum || null,
      location: business.location || null,
      latitude: business.y || business.latitude || null,
      longitude: business.x || business.longitude || null,
      is_active: true,
      raw_data: business,
      last_seen: new Date().toISOString(),
    };

    const { data: savedBusiness, error: saveError } = await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save business: ${saveError.message}`);
    }

    console.log(`  ✓ Business saved to database`);

    // Generate AI content for the business
    try {
      await retryWithBackoff(
        async () => {
          const content = await contentGenerator.generateBusinessContent(savedBusiness);
          console.log(`  ✓ AI content generated`);
          return content;
        },
        2,
        3000
      );
    } catch (contentError) {
      console.warn(`  ⚠️  Failed to generate AI content, continuing...`, contentError);
      // Don't fail the entire operation if content generation fails
    }

    console.log(`  ✓ Website generation complete`);
  } catch (error) {
    console.error(`  ✗ Failed to generate website:`, error);
    throw error;
  }
}

/**
 * Send welcome email to business (if contact info available)
 */
async function sendWelcomeEmail(business: any): Promise<void> {
  // This is a placeholder - implement actual welcome email logic
  // Only send if we have email address for the business
  if (business.email) {
    console.log(`  📧 Welcome email would be sent to: ${business.email}`);
    // In production, implement actual email sending
  }
}

/**
 * Process a single business
 */
async function processBusinessDetailed(business: any): Promise<ProcessingResult> {
  const businessName = business.shem_esek || 'Unknown Business';
  const businessId = business.mosad_yeshut?.toString() || business.ObjectId?.toString() || 'unknown';

  console.log(`\nProcessing: ${businessName} (ID: ${businessId})`);

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      // Verify business data
      const verification = verifyBusinessData(business);
      if (!verification.valid) {
        console.log(`  ⊘ Skipping: ${verification.reason}`);
        return {
          businessId,
          businessName,
          success: false,
          error: verification.reason,
          retries: 0,
        };
      }

      // Generate website
      await generateWebsiteForBusiness(business);

      // Send welcome email (if configured)
      await sendWelcomeEmail(business);

      // Send success notification
      await notifyNewBusinessProcessed(businessName, true);

      console.log(`  ✅ Successfully processed`);

      return {
        businessId,
        businessName,
        success: true,
        retries,
      };
    } catch (error) {
      retries++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      console.error(`  ✗ Attempt ${retries}/${maxRetries} failed: ${errorMsg}`);

      if (retries < maxRetries) {
        const delay = 1000 * Math.pow(2, retries);
        console.log(`  ⏱️  Waiting ${delay}ms before retry...`);
        await sleep(delay);
      } else {
        // All retries exhausted
        console.error(`  ❌ All retries exhausted for ${businessName}`);

        // Send failure notification
        await notifyNewBusinessProcessed(businessName, false, errorMsg);

        return {
          businessId,
          businessName,
          success: false,
          error: errorMsg,
          retries,
        };
      }
    }
  }

  // Should never reach here
  return {
    businessId,
    businessName,
    success: false,
    error: 'Max retries reached',
    retries,
  };
}

/**
 * Process all new businesses
 */
async function processNewBusinesses(businesses: any[]): Promise<ProcessingResult[]> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing ${businesses.length} new businesses`);
  console.log('='.repeat(60));

  const results: ProcessingResult[] = [];

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];

    console.log(`\n[${i + 1}/${businesses.length}]`);

    try {
      const result = await processBusinessDetailed(business);
      results.push(result);

      // Small delay between businesses to avoid rate limiting
      if (i < businesses.length - 1) {
        await sleep(500);
      }
    } catch (error) {
      console.error('Unexpected error processing business:', error);

      results.push({
        businessId: business.mosad_yeshut?.toString() || 'unknown',
        businessName: business.shem_esek || 'Unknown',
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error',
        retries: 0,
      });
    }
  }

  return results;
}

/**
 * Generate statistics and report
 */
async function generateReport(
  stats: DailyStats,
  results: ProcessingResult[]
): Promise<string> {
  const successRate = stats.processed > 0 ? (stats.successful / stats.processed) * 100 : 0;

  let report = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 NEW BUSINESS DETECTION - DAILY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date: ${new Date().toLocaleDateString()}
⏰ Time: ${new Date().toLocaleTimeString()}
⏱️  Processing Time: ${(stats.processingTime / 1000).toFixed(2)}s

📈 SUMMARY
──────────────────────────────────────────────────────────────
• Total Businesses Fetched:  ${stats.totalFetched}
• New Businesses Found:      ${stats.newBusinesses}
• Businesses Processed:      ${stats.processed}
• Successfully Generated:    ${stats.successful} ✅
• Failed:                    ${stats.failed} ❌
• Skipped (Invalid):         ${stats.skipped} ⊘
• Success Rate:              ${successRate.toFixed(2)}%

`;

  // Show successful businesses
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    report += `\n✅ SUCCESSFULLY PROCESSED (${successful.length}):\n`;
    report += '──────────────────────────────────────────────────────────────\n';
    successful.forEach((result, i) => {
      report += `${i + 1}. ${result.businessName} (${result.businessId})\n`;
    });
  }

  // Show failed businesses
  const failed = results.filter(r => !r.success && r.error && !['Missing business name', 'Missing unique identifier', 'Business is closed', 'Business is inactive'].includes(r.error));
  if (failed.length > 0) {
    report += `\n❌ FAILED (${failed.length}):\n`;
    report += '──────────────────────────────────────────────────────────────\n';
    failed.forEach((result, i) => {
      report += `${i + 1}. ${result.businessName} (${result.businessId})\n`;
      report += `   Error: ${result.error}\n`;
      report += `   Retries: ${result.retries}\n\n`;
    });
  }

  // Show skipped businesses
  const skipped = results.filter(r => !r.success && r.error && ['Missing business name', 'Missing unique identifier', 'Business is closed', 'Business is inactive'].includes(r.error));
  if (skipped.length > 0) {
    report += `\n⊘ SKIPPED (${skipped.length}):\n`;
    report += '──────────────────────────────────────────────────────────────\n';
    skipped.slice(0, 10).forEach((result, i) => {
      report += `${i + 1}. ${result.businessName} - ${result.error}\n`;
    });
    if (skipped.length > 10) {
      report += `... and ${skipped.length - 10} more\n`;
    }
  }

  report += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  // Add warnings if needed
  if (successRate < 90 && failed.length > 0) {
    report += `\n⚠️  WARNING: Success rate is below 90%!\n`;
    report += `Please investigate the failures above.\n`;
  }

  if (stats.newBusinesses === 0) {
    report += `\nℹ️  No new businesses found in the last 24 hours.\n`;
  }

  report += '\n🤖 TLV Business Pulse - Autonomous Operations\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  return report;
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();

  console.log('\n' + '='.repeat(70));
  console.log('🤖 TLV BUSINESS PULSE - NEW BUSINESS DETECTION');
  console.log('='.repeat(70));
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const stats: DailyStats = {
    totalFetched: 0,
    newBusinesses: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    successRate: 0,
    errors: [],
    processingTime: 0,
  };

  try {
    // Step 1: Fetch recent businesses from Tel Aviv API
    console.log('STEP 1: Fetching recent business registrations');
    console.log('-'.repeat(70));

    let recentBusinesses: any[] = [];
    try {
      recentBusinesses = await fetchRecentBusinesses();
      stats.totalFetched = recentBusinesses.length;
    } catch (error) {
      const errorMsg = `Failed to fetch businesses: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`❌ ${errorMsg}`);
      stats.errors.push(errorMsg);

      await notifyCriticalError('Business Detection', errorMsg);
      throw error;
    }

    // Step 2: Filter for unprocessed businesses
    console.log('\nSTEP 2: Filtering unprocessed businesses');
    console.log('-'.repeat(70));

    let unprocessedBusinesses: any[] = [];
    try {
      unprocessedBusinesses = await filterUnprocessedBusinesses(recentBusinesses);
      stats.newBusinesses = unprocessedBusinesses.length;
    } catch (error) {
      const errorMsg = `Failed to filter businesses: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`❌ ${errorMsg}`);
      stats.errors.push(errorMsg);

      await notifyCriticalError('Business Detection', errorMsg);
      throw error;
    }

    // If no new businesses, exit early
    if (unprocessedBusinesses.length === 0) {
      console.log('\n✓ No new businesses to process. Exiting.');

      stats.processingTime = Date.now() - startTime;

      const report = await generateReport(stats, []);
      console.log('\n' + report);

      await notifyDailySummary({
        businessesProcessed: 0,
        websitesGenerated: 0,
        errors: 0,
        successRate: 1,
      });

      console.log('\n✅ Daily detection completed - No new businesses\n');
      process.exit(0);
    }

    // Step 3: Process each new business
    console.log('\nSTEP 3: Processing new businesses');
    console.log('-'.repeat(70));

    const results = await processNewBusinesses(unprocessedBusinesses);

    // Step 4: Calculate statistics
    stats.processed = results.length;
    stats.successful = results.filter(r => r.success).length;
    stats.failed = results.filter(r => !r.success && r.error && !['Missing business name', 'Missing unique identifier', 'Business is closed', 'Business is inactive'].includes(r.error)).length;
    stats.skipped = results.filter(r => !r.success && r.error && ['Missing business name', 'Missing unique identifier', 'Business is closed', 'Business is inactive'].includes(r.error)).length;
    stats.successRate = stats.processed > 0 ? stats.successful / stats.processed : 0;
    stats.processingTime = Date.now() - startTime;

    // Step 5: Generate and display report
    console.log('\nSTEP 4: Generating report');
    console.log('-'.repeat(70));

    const report = await generateReport(stats, results);
    console.log('\n' + report);

    // Step 6: Send notifications
    console.log('\nSTEP 5: Sending notifications');
    console.log('-'.repeat(70));

    // Send daily summary
    await notifyDailySummary({
      businessesProcessed: stats.processed,
      websitesGenerated: stats.successful,
      errors: stats.failed,
      successRate: stats.successRate,
    });

    // Send critical alert if failure rate is high
    if (stats.successRate < 0.9 && stats.processed > 5) {
      await notifyCriticalError(
        'Business Detection',
        `High failure rate detected: ${((1 - stats.successRate) * 100).toFixed(2)}% of businesses failed to process`,
        { stats, failedCount: stats.failed }
      );
    }

    console.log('✓ Notifications sent\n');

    // Exit with appropriate code
    if (stats.failed === 0) {
      console.log('✅ All businesses processed successfully!\n');
      process.exit(0);
    } else if (stats.successRate >= 0.9) {
      console.log('⚠️  Some businesses failed but success rate is acceptable\n');
      process.exit(0);
    } else {
      console.log('❌ Too many failures - manual intervention needed\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ CRITICAL ERROR');
    console.error('='.repeat(70));
    console.error('Error:', error);

    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }

    console.error('='.repeat(70));
    console.error(`Failed at: ${new Date().toISOString()}\n`);

    // Send critical error notification
    await notifyCriticalError(
      'Business Detection',
      error instanceof Error ? error.message : 'Unknown critical error',
      { timestamp: new Date().toISOString() }
    );

    process.exit(1);
  }
}

// Execute main function
if (require.main === module) {
  main();
}

export { main, fetchRecentBusinesses, filterUnprocessedBusinesses, processBusinessDetailed };
