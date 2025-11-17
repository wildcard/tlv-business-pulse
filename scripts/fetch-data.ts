#!/usr/bin/env tsx

/**
 * Data Fetching Script
 *
 * This script is executed by GitHub Actions on a schedule (every 6 hours).
 * It fetches the latest business data from Tel Aviv's open data API and
 * updates the Supabase database.
 *
 * Autonomous Features:
 * - Fetches data from external API
 * - Detects changes (new/closed businesses)
 * - Updates database automatically
 * - Logs results for monitoring
 * - Handles errors gracefully
 *
 * Usage:
 *   npm run cron:fetch
 *   tsx scripts/fetch-data.ts
 */

import { dataFetcher } from '../lib/services/dataFetcher';

async function main() {
  console.log('========================================');
  console.log('TLV Business Pulse - Data Fetch Script');
  console.log('========================================');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch latest business data from Tel Aviv API
    console.log('Step 1: Fetching business data from Tel Aviv Open Data API...');
    const businesses = await dataFetcher.fetchBusinessData();
    console.log(`✓ Successfully fetched ${businesses.length} businesses\n`);

    // Step 2: Detect changes since last fetch
    console.log('Step 2: Detecting changes...');
    const changes = await dataFetcher.detectChanges(businesses);
    console.log(`✓ Changes detected:`);
    console.log(`  - New businesses: ${changes.newBusinesses.length}`);
    console.log(`  - Closed businesses: ${changes.closedBusinesses.length}`);
    console.log(`  - Total active: ${changes.totalActive}`);
    console.log(`  - Total changes: ${changes.changes}\n`);

    // Step 3: Save data to database
    console.log('Step 3: Saving to database...');
    await dataFetcher.saveToDatabase(businesses);
    console.log('✓ Database updated successfully\n');

    // Step 4: Generate daily statistics
    console.log('Step 4: Generating statistics...');
    const stats = await dataFetcher.generateDailyStats();
    console.log(`✓ Statistics generated:`);
    console.log(`  - Total businesses: ${stats.total}`);
    console.log(`  - Top category: ${Object.keys(stats.byCategory)[0] || 'N/A'}`);
    console.log(`  - Top neighborhood: ${Object.keys(stats.byNeighborhood)[0] || 'N/A'}\n`);

    // Step 5: Log notable changes
    if (changes.newBusinesses.length > 0) {
      console.log('Notable new businesses:');
      changes.newBusinesses.slice(0, 5).forEach((business) => {
        console.log(`  - ${business.shem_esek || 'Unknown'} (${business.sug_esek || 'N/A'})`);
      });
      console.log('');
    }

    if (changes.closedBusinesses.length > 0) {
      console.log('Recently closed businesses:');
      changes.closedBusinesses.slice(0, 5).forEach((business: any) => {
        console.log(`  - ${business.name || 'Unknown'} (${business.category || 'N/A'})`);
      });
      console.log('');
    }

    // Success summary
    console.log('========================================');
    console.log('✅ Data fetch completed successfully!');
    console.log('========================================');
    console.log(`Completed at: ${new Date().toISOString()}`);
    console.log(`Total businesses processed: ${businesses.length}`);
    console.log(`New businesses: ${changes.newBusinesses.length}`);
    console.log(`Closed businesses: ${changes.closedBusinesses.length}`);
    console.log('========================================\n');

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR: Data fetch failed!');
    console.error('========================================');
    console.error('Error details:', error);

    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }

    console.error('========================================');
    console.error(`Failed at: ${new Date().toISOString()}\n`);

    // Alert: In production, this could trigger an email/Slack notification
    console.error('⚠️  ALERT: Manual intervention may be required');
    console.error('⚠️  Check logs and investigate the error\n');

    // Exit with error code
    process.exit(1);
  }
}

// Execute main function
main();
