#!/usr/bin/env tsx

/**
 * Content Generation Script
 *
 * This script is executed by GitHub Actions daily at 09:00 UTC.
 * It uses OpenAI GPT-4 to generate 3 high-quality articles about
 * Tel Aviv business trends based on the latest data.
 *
 * Autonomous Features:
 * - Analyzes recent business data for trends
 * - Generates 3 unique, SEO-optimized articles
 * - Saves articles to database
 * - Creates social media posts
 * - Operates without human intervention
 *
 * Usage:
 *   npm run cron:generate
 *   tsx scripts/generate-content.ts
 */

import { contentGenerator } from '../lib/services/contentGenerator';
import { dataFetcher } from '../lib/services/dataFetcher';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function main() {
  console.log('========================================');
  console.log('TLV Business Pulse - Content Generation');
  console.log('========================================');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch recent business data for analysis
    console.log('Step 1: Fetching recent business data...');
    const businesses = await dataFetcher.fetchBusinessData();
    console.log(`✓ Fetched ${businesses.length} businesses\n`);

    // Step 2: Detect recent changes
    console.log('Step 2: Analyzing business changes...');
    const changes = await dataFetcher.detectChanges(businesses);
    console.log(`✓ Analysis complete:`);
    console.log(`  - New businesses: ${changes.newBusinesses.length}`);
    console.log(`  - Closed businesses: ${changes.closedBusinesses.length}\n`);

    // Step 3: Generate statistics
    console.log('Step 3: Generating statistics...');
    const stats = await dataFetcher.generateDailyStats();
    console.log(`✓ Statistics generated`);
    console.log(`  - Total: ${stats.total}`);
    console.log(`  - Categories: ${Object.keys(stats.byCategory).length}\n`);

    // Step 4: Generate AI-powered insights
    console.log('Step 4: Generating AI insights (this may take a minute)...');
    const insights = await contentGenerator.generateInsights({
      newBusinesses: changes.newBusinesses,
      closedBusinesses: changes.closedBusinesses,
      stats,
    });
    console.log(`✓ Generated ${insights.length} insights:\n`);

    // Display generated insights
    insights.forEach((insight, index) => {
      console.log(`${index + 1}. ${insight.title}`);
      console.log(`   Category: ${insight.category}`);
      console.log(`   Slug: ${insight.slug}`);
      console.log(`   Tags: ${insight.tags.join(', ')}`);
      console.log(`   Summary: ${insight.summary.substring(0, 100)}...`);
      console.log('');
    });

    // Step 5: Save insights to database
    console.log('Step 5: Saving insights to database...');
    await contentGenerator.saveInsights(insights);
    console.log('✓ All insights saved successfully\n');

    // Step 6: Generate social media posts (optional)
    if (process.env.ENABLE_SOCIAL_POSTS === 'true') {
      console.log('Step 6: Generating social media posts...');

      for (const insight of insights) {
        try {
          const socialPosts = await contentGenerator.generateSocialMediaPosts(insight);

          console.log(`\nSocial posts for: "${insight.title}"`);
          console.log('Twitter:', socialPosts.twitter);
          console.log('LinkedIn:', socialPosts.linkedin);
          console.log('Facebook:', socialPosts.facebook);

          // Save social posts to database for later publishing
          await supabase.from('social_posts').insert({
            insight_id: insight.slug,
            platform: 'twitter',
            content: socialPosts.twitter,
            scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
          });

          await supabase.from('social_posts').insert({
            insight_id: insight.slug,
            platform: 'linkedin',
            content: socialPosts.linkedin,
            scheduled_for: new Date(Date.now() + 120 * 60 * 1000).toISOString(), // 2 hours from now
          });

          await supabase.from('social_posts').insert({
            insight_id: insight.slug,
            platform: 'facebook',
            content: socialPosts.facebook,
            scheduled_for: new Date(Date.now() + 180 * 60 * 1000).toISOString(), // 3 hours from now
          });

          console.log('✓ Social posts scheduled');
        } catch (error) {
          console.error(`Failed to generate social posts for "${insight.title}":`, error);
          // Continue with other insights
        }
      }

      console.log('\n✓ Social media posts generated and scheduled\n');
    } else {
      console.log('Step 6: Skipping social media posts (disabled)\n');
    }

    // Success summary
    console.log('========================================');
    console.log('✅ Content generation completed!');
    console.log('========================================');
    console.log(`Completed at: ${new Date().toISOString()}`);
    console.log(`Articles generated: ${insights.length}`);
    console.log(`Businesses analyzed: ${businesses.length}`);
    console.log(`New insights published: ${insights.length}`);

    if (insights.length > 0) {
      console.log('\nGenerated articles:');
      insights.forEach((insight, i) => {
        console.log(`${i + 1}. ${insight.title} [${insight.category}]`);
      });
    }

    console.log('========================================\n');

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR: Content generation failed!');
    console.error('========================================');
    console.error('Error details:', error);

    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }

    console.error('========================================');
    console.error(`Failed at: ${new Date().toISOString()}\n`);

    // Alert: In production, this could trigger an email/Slack notification
    console.error('⚠️  ALERT: Content generation failure');
    console.error('⚠️  Check OpenAI API quota and configuration\n');

    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('💡 TIP: Check OPENAI_API_KEY environment variable');
      } else if (error.message.includes('quota')) {
        console.error('💡 TIP: OpenAI API quota may be exceeded');
      } else if (error.message.includes('rate limit')) {
        console.error('💡 TIP: Rate limit reached, will retry next scheduled run');
      }
    }

    // Exit with error code
    process.exit(1);
  }
}

// Execute main function
main();
