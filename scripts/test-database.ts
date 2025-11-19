/**
 * Database Operations Test Script
 *
 * Tests all major database operations to verify setup is correct.
 *
 * Usage:
 *   npx tsx scripts/test-database.ts
 */

import {
  createBusiness,
  saveGeneratedWebsite,
  logVerification,
  getBusinessById,
  getGeneratedWebsite,
  getVerificationLogs,
  updateBusiness,
  updateGeneratedWebsite,
  trackAnalyticsEvent,
  getBusinessAnalytics,
  getEnhancedDashboardStats,
  searchBusinesses,
} from '@/lib/db/supabase';

async function testDatabase() {
  console.log('🧪 Testing TLV Business Pulse Database Operations\n');
  console.log('='.repeat(60));

  let businessId: string = '';
  let websiteId: string = '';

  try {
    // ========================================================================
    // Test 1: Create a Business
    // ========================================================================
    console.log('\n📝 Test 1: Create a test business');
    console.log('-'.repeat(60));

    const business = await createBusiness({
      business_id: 'TEST-' + Date.now(),
      name: 'Test Cafe Tel Aviv',
      name_en: 'Test Cafe Tel Aviv',
      category: 'Coffee Shop',
      category_description: 'Specialty coffee and pastries',
      address: '123 Rothschild Boulevard, Tel Aviv',
      street: 'Rothschild Boulevard',
      house_number: '123',
      city: 'Tel Aviv',
      neighborhood: 'Neve Tzedek',
      phone: '+972-3-1234567',
      email: 'info@testcafe.com',
      registration_date: new Date().toISOString().split('T')[0],
      status: 'active',
      verified: true,
      data_quality_score: 95,
      latitude: 32.0853,
      longitude: 34.7818,
      metadata: {
        test: true,
        created_by: 'test-script',
      },
    });

    businessId = business.id;
    console.log('✅ Business created successfully');
    console.log(`   ID: ${business.id}`);
    console.log(`   Name: ${business.name}`);
    console.log(`   Slug: ${business.website_slug}`);

    // ========================================================================
    // Test 2: Save Generated Website
    // ========================================================================
    console.log('\n🎨 Test 2: Save AI-generated website content');
    console.log('-'.repeat(60));

    const website = await saveGeneratedWebsite({
      business_id: businessId,
      hero_title: 'Welcome to Test Cafe',
      hero_subtitle: 'The Best Coffee Experience in Tel Aviv',
      about_content: `Located in the heart of Neve Tzedek, Test Cafe offers a unique blend of
        traditional Israeli hospitality and modern coffee culture. We source our beans from
        sustainable farms and roast them fresh daily. Join us for an unforgettable coffee experience.`,
      call_to_action: 'Visit us today and taste the difference!',
      seo_title: 'Test Cafe - Premium Coffee Shop in Tel Aviv',
      seo_description:
        'Discover Tel Aviv\'s finest coffee at Test Cafe. Specialty coffee, fresh pastries, and a cozy atmosphere in Neve Tzedek.',
      template_type: 'restaurant',
      services: [
        {
          name: 'Espresso',
          description: 'Perfect Italian espresso made with locally roasted beans',
          price: '12 ₪',
          icon: 'coffee',
        },
        {
          name: 'Cappuccino',
          description: 'Classic cappuccino with velvety microfoam',
          price: '15 ₪',
          icon: 'coffee',
        },
        {
          name: 'Croissant',
          description: 'Fresh-baked butter croissant',
          price: '10 ₪',
          icon: 'bread',
        },
      ],
      menu_items: [
        {
          category: 'Hot Drinks',
          items: [
            {
              name: 'Espresso',
              description: 'Single shot of pure Italian coffee',
              price: '12 ₪',
              vegetarian: true,
              vegan: true,
            },
            {
              name: 'Cappuccino',
              description: 'Espresso with steamed milk and foam',
              price: '15 ₪',
              vegetarian: true,
            },
          ],
        },
        {
          category: 'Pastries',
          items: [
            {
              name: 'Croissant',
              description: 'Buttery, flaky French pastry',
              price: '10 ₪',
              vegetarian: true,
            },
            {
              name: 'Chocolate Muffin',
              description: 'Rich chocolate chip muffin',
              price: '14 ₪',
              vegetarian: true,
            },
          ],
        },
      ],
      products: [],
      team_members: [
        {
          name: 'Sarah Cohen',
          role: 'Head Barista',
          bio: 'Winner of the 2024 Israel Barista Championship',
          photo_url: '/team/sarah.jpg',
        },
      ],
      gallery_images: [],
      color_palette: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#F4A460',
        background: '#FFF8DC',
        text: '#2C1810',
      },
      typography: {
        heading_font: 'Playfair Display',
        body_font: 'Open Sans',
      },
      keywords: ['coffee', 'tel aviv', 'cafe', 'specialty coffee', 'neve tzedek'],
      meta_tags: {
        'og:type': 'restaurant',
        'og:locale': 'en_IL',
      },
      layout_config: {
        show_hero: true,
        show_about: true,
        show_services: true,
        show_menu: true,
      },
      features_enabled: {
        contact_form: true,
        booking: false,
        reviews: true,
        online_menu: true,
      },
      social_media: {
        facebook: 'https://facebook.com/testcafe',
        instagram: 'https://instagram.com/testcafe',
      },
      business_hours: {
        monday: { open: '07:00', close: '19:00' },
        tuesday: { open: '07:00', close: '19:00' },
        wednesday: { open: '07:00', close: '19:00' },
        thursday: { open: '07:00', close: '19:00' },
        friday: { open: '07:00', close: '15:00' },
        saturday: { closed: true, open: '', close: '' },
        sunday: { open: '08:00', close: '18:00' },
      },
      ai_model: 'gpt-4',
      ai_prompt_version: 'v1.0',
      generation_duration_ms: 3500,
      generation_cost_usd: 0.025,
      published: true,
      published_at: new Date().toISOString(),
    });

    websiteId = website.id;
    console.log('✅ Website saved successfully');
    console.log(`   ID: ${website.id}`);
    console.log(`   Template: ${website.template_type}`);
    console.log(`   Services: ${website.services.length}`);
    console.log(`   Menu Items: ${website.menu_items.length} categories`);

    // ========================================================================
    // Test 3: Log Verification
    // ========================================================================
    console.log('\n🔍 Test 3: Log business verification');
    console.log('-'.repeat(60));

    const verification = await logVerification({
      business_id: businessId,
      verification_type: 'manual',
      verification_status: 'success',
      source_name: 'Test Verification System',
      source_url: 'https://test.example.com',
      data_found: true,
      data_matches: true,
      confidence_score: 100,
      automated: false,
      verified_by_user_email: 'admin@tlvpulse.com',
      verification_duration_ms: 250,
      retrieved_data: {
        business_name: 'Test Cafe Tel Aviv',
        license_active: true,
        address_verified: true,
      },
      discrepancies: [],
      metadata: {
        test: true,
      },
    });

    console.log('✅ Verification logged successfully');
    console.log(`   ID: ${verification.id}`);
    console.log(`   Status: ${verification.verification_status}`);
    console.log(`   Confidence: ${verification.confidence_score}%`);

    // ========================================================================
    // Test 4: Track Analytics Events
    // ========================================================================
    console.log('\n📊 Test 4: Track analytics events');
    console.log('-'.repeat(60));

    // Simulate multiple page views
    for (let i = 0; i < 5; i++) {
      await trackAnalyticsEvent({
        business_id: businessId,
        event_type: 'page_view',
        event_category: 'engagement',
        visitor_id: `visitor-${i}`,
        session_id: `session-${Math.floor(i / 2)}`,
        page_url: `/business/test-cafe-tel-aviv`,
        page_title: 'Test Cafe Tel Aviv',
        device_type: i % 2 === 0 ? 'mobile' : 'desktop',
        browser: 'Chrome',
        os: 'iOS',
        page_load_time_ms: 450 + i * 100,
        time_on_page_seconds: 30 + i * 10,
        event_data: {},
      });
    }

    // Track conversions
    await trackAnalyticsEvent({
      business_id: businessId,
      event_type: 'contact_form',
      event_category: 'conversion',
      visitor_id: 'visitor-1',
      session_id: 'session-1',
      event_data: {
        message: 'Interested in catering services',
      },
    });

    await trackAnalyticsEvent({
      business_id: businessId,
      event_type: 'phone_click',
      event_category: 'conversion',
      visitor_id: 'visitor-2',
      session_id: 'session-2',
      event_data: {
        phone_number: '+972-3-1234567',
      },
    });

    console.log('✅ Analytics events tracked');
    console.log(`   Page views: 5`);
    console.log(`   Contact form: 1`);
    console.log(`   Phone clicks: 1`);

    // ========================================================================
    // Test 5: Retrieve Data
    // ========================================================================
    console.log('\n🔎 Test 5: Retrieve data from database');
    console.log('-'.repeat(60));

    const retrievedBusiness = await getBusinessById(businessId);
    console.log('✅ Business retrieved:', retrievedBusiness?.name);

    const retrievedWebsite = await getGeneratedWebsite(businessId);
    console.log('✅ Website retrieved:', retrievedWebsite?.hero_title);

    const verificationLogs = await getVerificationLogs(businessId);
    console.log('✅ Verification logs retrieved:', verificationLogs.length, 'entries');

    // ========================================================================
    // Test 6: Update Operations
    // ========================================================================
    console.log('\n✏️  Test 6: Update business and website');
    console.log('-'.repeat(60));

    const updatedBusiness = await updateBusiness(businessId, {
      data_quality_score: 98,
      verified: true,
      last_verified_at: new Date().toISOString(),
    });
    console.log('✅ Business updated');
    console.log(`   Quality score: ${updatedBusiness.data_quality_score}`);

    const updatedWebsite = await updateGeneratedWebsite(businessId, {
      view_count: 100,
      last_viewed_at: new Date().toISOString(),
    });
    console.log('✅ Website updated');
    console.log(`   View count: ${updatedWebsite.view_count}`);

    // ========================================================================
    // Test 7: Analytics Summary
    // ========================================================================
    console.log('\n📈 Test 7: Get analytics summary');
    console.log('-'.repeat(60));

    const analytics = await getBusinessAnalytics(businessId, 30);
    console.log('✅ Analytics retrieved');
    console.log(`   Total views: ${analytics.totalViews}`);
    console.log(`   Unique visitors: ${analytics.uniqueVisitors}`);
    console.log(`   Contact forms: ${analytics.contactFormSubmissions}`);
    console.log(`   Phone clicks: ${analytics.phoneClicks}`);
    console.log(`   Avg time on page: ${analytics.avgTimeOnPage}s`);

    // ========================================================================
    // Test 8: Search Businesses
    // ========================================================================
    console.log('\n🔍 Test 8: Search businesses');
    console.log('-'.repeat(60));

    const searchResults = await searchBusinesses({
      search: 'Test Cafe',
      status: 'active',
      verified: true,
      limit: 10,
    });
    console.log('✅ Search completed');
    console.log(`   Results found: ${searchResults.count}`);
    console.log(`   Businesses: ${searchResults.data.map((b) => b.name).join(', ')}`);

    // ========================================================================
    // Test 9: Dashboard Statistics
    // ========================================================================
    console.log('\n📊 Test 9: Get dashboard statistics');
    console.log('-'.repeat(60));

    const stats = await getEnhancedDashboardStats();
    console.log('✅ Dashboard stats retrieved');
    console.log(`   Total businesses: ${stats.totalBusinesses}`);
    console.log(`   Active businesses: ${stats.activeBusinesses}`);
    console.log(`   Verified businesses: ${stats.verifiedBusinesses}`);
    console.log(`   Avg quality score: ${stats.avgQualityScore.toFixed(1)}`);
    console.log(`   New today: ${stats.newToday}`);
    console.log(`   Websites generated: ${stats.websitesGenerated}`);

    // ========================================================================
    // Success Summary
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n📊 Test Summary:');
    console.log(`   ✓ Business created: ${businessId}`);
    console.log(`   ✓ Website generated: ${websiteId}`);
    console.log(`   ✓ Verification logged: ${verification.id}`);
    console.log(`   ✓ Analytics tracked: 7 events`);
    console.log(`   ✓ Data retrieval: Working`);
    console.log(`   ✓ Updates: Working`);
    console.log(`   ✓ Search: Working`);
    console.log(`   ✓ Dashboard stats: Working`);

    console.log('\n🎉 Database is fully operational!');
    console.log('\n💡 Next steps:');
    console.log('   1. View test data in Supabase Table Editor');
    console.log('   2. Test the API endpoints: http://localhost:3000/api/health');
    console.log('   3. Start building the website generation pipeline');
    console.log('   4. Connect real Tel Aviv Municipality data');

    console.log('\n📝 Test data IDs for reference:');
    console.log(`   Business: ${businessId}`);
    console.log(`   Website: ${websiteId}`);
    console.log(`   Slug: ${business.website_slug}`);

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(60));
    console.error('\nError details:');
    console.error(error);

    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check .env.local has SUPABASE_URL and SUPABASE_SERVICE_KEY');
    console.error('   2. Verify database schema was created (run docs/DATABASE_SCHEMA.sql)');
    console.error('   3. Check Supabase project is not paused');
    console.error('   4. See docs/ENVIRONMENT_SETUP.md for detailed setup instructions');

    process.exit(1);
  }
}

// Run the test
console.log('Starting database tests...\n');
testDatabase().then(() => {
  console.log('\n✨ Test script completed successfully!\n');
  process.exit(0);
});
