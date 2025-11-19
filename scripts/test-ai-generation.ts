/**
 * Test Script for AI Generation Pipeline
 *
 * Tests the complete generation system with sample Tel Aviv businesses
 * across different industries.
 */

import {
  generateWebsite,
  generateBusinessIntelligence,
  generateMenuItems,
  generateServices,
  generateProductCatalog,
  generateClassSchedule,
  generateTeamProfiles,
  generateTestimonials,
  generateSEOMetadata,
  generateSocialMediaPosts,
  type BusinessData,
} from '../lib/ai/generate';
import { getIndustryConfig } from '../lib/ai/industry-prompts';
import { generateCompleteLogo } from '../lib/ai/logo-generation';
import {
  validateGeneratedContent,
  generateValidationReport,
} from '../lib/generation/validation';

// Sample test businesses across different industries
const TEST_BUSINESSES: BusinessData[] = [
  {
    name: 'שמש Shemesh Cafe',
    owner: 'Yael Cohen',
    category: 'Restaurant',
    address: 'Rothschild Boulevard 42',
    city: 'Tel Aviv',
    registration_date: '2024-10-15',
    phone: '03-5555123',
    email: 'info@shemeshcafe.co.il',
    description: 'Cozy neighborhood cafe serving Israeli breakfast, specialty coffee, and fresh pastries',
    employees: 8,
    seating_capacity: 40,
  },
  {
    name: 'Noa Beauty Studio',
    owner: 'Noa Levi',
    category: 'Beauty Salon',
    address: 'Dizengoff Street 156',
    city: 'Tel Aviv',
    registration_date: '2024-11-01',
    phone: '03-5551234',
    email: 'noa@noabeauty.co.il',
    description: 'Premium beauty salon specializing in hair styling, color treatments, and bridal makeup',
    employees: 5,
  },
  {
    name: 'TechFlow Solutions',
    owner: 'David Mizrahi',
    category: 'Technology Services',
    address: 'Rothschild Boulevard 88',
    city: 'Tel Aviv',
    registration_date: '2024-09-20',
    phone: '03-5559999',
    email: 'hello@techflow.co.il',
    website: 'https://techflow.co.il',
    description: 'Software development and cloud consulting for startups and enterprises',
    employees: 15,
  },
  {
    name: 'PowerFit Studio',
    owner: 'Maya Goldstein',
    category: 'Fitness Center',
    address: 'Ben Yehuda Street 234',
    city: 'Tel Aviv',
    registration_date: '2024-10-05',
    phone: '03-5554321',
    email: 'info@powerfit.co.il',
    description: 'Boutique fitness studio offering HIIT, yoga, pilates, and personal training',
    employees: 10,
  },
  {
    name: 'Urban Style Boutique',
    owner: 'Ron Avraham',
    category: 'Retail Store',
    address: 'Sheinkin Street 78',
    city: 'Tel Aviv',
    registration_date: '2024-11-10',
    phone: '03-5556789',
    email: 'shop@urbanstyle.co.il',
    description: 'Trendy fashion boutique featuring local Israeli designers and sustainable brands',
    employees: 4,
  },
];

/**
 * Main test function
 */
async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  TLV BUSINESS PULSE - AI GENERATION PIPELINE TEST SUITE     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const results: any[] = [];
  let totalAPICallsUsed = 0;

  for (let i = 0; i < TEST_BUSINESSES.length; i++) {
    const business = TEST_BUSINESSES[i];

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`TEST ${i + 1}/${TEST_BUSINESSES.length}: ${business.name}`);
    console.log(`Category: ${business.category}`);
    console.log(`Location: ${business.address}, ${business.city}`);
    console.log(`${'═'.repeat(70)}\n`);

    try {
      const testResult = await testBusinessGeneration(business);
      results.push(testResult);
      totalAPICallsUsed += testResult.apiCallsUsed;

      console.log(`\n✅ Test completed for ${business.name}`);
      console.log(`   Quality Score: ${testResult.qualityScore}/100`);
      console.log(`   API Calls Used: ${testResult.apiCallsUsed}`);
      console.log(`   Generation Time: ${(testResult.generationTime / 1000).toFixed(2)}s`);
    } catch (error) {
      console.error(`\n❌ Test failed for ${business.name}:`, error);
      results.push({
        businessName: business.name,
        success: false,
        error: (error as Error).message,
        apiCallsUsed: 0,
        generationTime: 0,
        qualityScore: 0,
      });
    }

    // Add delay between tests to avoid rate limiting
    if (i < TEST_BUSINESSES.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Print summary report
  printSummaryReport(results, totalAPICallsUsed);
}

/**
 * Test generation for a single business
 */
async function testBusinessGeneration(business: BusinessData): Promise<any> {
  const startTime = Date.now();
  let apiCallsUsed = 0;

  // 1. Generate main website content
  console.log('📝 Generating website content...');
  const website = await generateWebsite(business);
  apiCallsUsed++;

  console.log('   ✓ Website content generated');
  console.log(`     - Hero: "${website.heroTitle}"`);
  console.log(`     - Template: ${website.templateType}`);
  console.log(`     - Services: ${website.services.length} items`);

  // 2. Validate content
  console.log('\n🔍 Validating content quality...');
  const validation = validateGeneratedContent(website, business.name);

  console.log(`   Quality Score: ${validation.score}/100`);
  console.log(`   Errors: ${validation.errors.length}`);
  console.log(`   Warnings: ${validation.warnings.length}`);

  if (validation.errors.length > 0) {
    console.log('\n   ⚠️  Errors found:');
    validation.errors.slice(0, 3).forEach(err => {
      console.log(`      - [${err.severity}] ${err.field}: ${err.message}`);
    });
  }

  // 3. Generate industry-specific content
  console.log('\n🎯 Generating industry-specific content...');
  const industryConfig = getIndustryConfig(business.category);

  let industryContent: any = {};

  if (industryConfig.templateType === 'restaurant') {
    console.log('   → Generating menu items...');
    industryContent.menu = await generateMenuItems(business.name, business.category);
    apiCallsUsed++;
    console.log(`      Generated ${industryContent.menu.length} menu items`);
  } else if (industryConfig.templateType === 'fitness') {
    console.log('   → Generating class schedule...');
    industryContent.classes = await generateClassSchedule(business.name, 'fitness');
    apiCallsUsed++;
    console.log(`      Generated ${industryContent.classes.length} classes`);
  } else if (industryConfig.templateType === 'retail') {
    console.log('   → Generating product catalog...');
    industryContent.products = await generateProductCatalog(business.name, business.category);
    apiCallsUsed++;
    console.log(`      Generated ${industryContent.products.length} products`);
  } else if (industryConfig.templateType === 'professional_services' || industryConfig.templateType === 'tech') {
    console.log('   → Generating team profiles...');
    industryContent.team = await generateTeamProfiles(business.name, business.category, 4);
    apiCallsUsed++;
    console.log(`      Generated ${industryContent.team.length} team members`);
  } else {
    console.log('   → Generating services...');
    industryContent.services = await generateServices(business.name, business.category);
    apiCallsUsed++;
    console.log(`      Generated ${industryContent.services.length} services`);
  }

  // 4. Generate testimonials
  console.log('\n⭐ Generating testimonials...');
  const testimonials = await generateTestimonials(business.name, business.category, 6);
  apiCallsUsed++;
  console.log(`   Generated ${testimonials.length} testimonials`);

  // 5. Generate business intelligence
  console.log('\n💡 Generating business intelligence...');
  const intelligence = await generateBusinessIntelligence(business);
  apiCallsUsed++;
  console.log(`   ✓ Intelligence generated`);
  console.log(`     - Market position: ${intelligence.marketPosition}`);
  console.log(`     - Competitors: ~${intelligence.competitorCount}`);
  console.log(`     - Opportunities: ${intelligence.opportunities.length}`);
  console.log(`     - Recommendations: ${intelligence.recommendations.length}`);

  // 6. Generate SEO metadata
  console.log('\n🔍 Generating SEO metadata...');
  const seo = await generateSEOMetadata(business);
  apiCallsUsed++;
  console.log(`   ✓ SEO metadata generated`);
  console.log(`     - Title: "${seo.title}"`);
  console.log(`     - Keywords: ${seo.keywords.length} keywords`);

  // 7. Generate logo prompt (not actual image)
  console.log('\n🎨 Generating logo design...');
  const logo = await generateCompleteLogo(
    business.name,
    business.category,
    website.colorPalette,
    false // Don't generate actual image in tests
  );
  apiCallsUsed++;
  console.log(`   ✓ Logo prompt generated`);
  console.log(`     - Style: ${logo.prompt.style}`);
  console.log(`     - Placeholder: Generated`);

  // 8. Generate social media posts
  console.log('\n📱 Generating social media posts...');
  const socialPosts = await generateSocialMediaPosts(
    business,
    `https://tlv-business-pulse.vercel.app/business/${business.name.toLowerCase().replace(/\s+/g, '-')}`
  );
  apiCallsUsed++;
  console.log(`   ✓ Social posts generated for:`, Object.keys(socialPosts).join(', '));

  const endTime = Date.now();
  const generationTime = endTime - startTime;

  return {
    businessName: business.name,
    success: true,
    qualityScore: validation.score,
    website,
    industryContent,
    testimonials,
    intelligence,
    seo,
    logo,
    socialPosts,
    validation,
    apiCallsUsed,
    generationTime,
  };
}

/**
 * Print comprehensive summary report
 */
function printSummaryReport(results: any[], totalAPICallsUsed: number) {
  console.log('\n\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    SUMMARY REPORT                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`📊 OVERALL STATISTICS:`);
  console.log(`   Total Tests: ${results.length}`);
  console.log(`   ✓ Successful: ${successful.length}`);
  console.log(`   ✗ Failed: ${failed.length}`);
  console.log(`   Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  console.log();

  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.generationTime, 0) / successful.length;
    const avgQuality = successful.reduce((sum, r) => sum + r.qualityScore, 0) / successful.length;
    const estimatedCost = totalAPICallsUsed * 0.03; // Rough estimate

    console.log(`⏱️  PERFORMANCE METRICS:`);
    console.log(`   Average Generation Time: ${(avgTime / 1000).toFixed(2)}s`);
    console.log(`   Average Quality Score: ${avgQuality.toFixed(1)}/100`);
    console.log(`   Total API Calls: ${totalAPICallsUsed}`);
    console.log(`   Estimated Cost: $${estimatedCost.toFixed(2)}`);
    console.log();

    console.log(`🏆 QUALITY SCORES BY BUSINESS:`);
    successful.forEach((result, i) => {
      const emoji = result.qualityScore >= 90 ? '🥇' : result.qualityScore >= 80 ? '🥈' : result.qualityScore >= 70 ? '🥉' : '📊';
      console.log(`   ${emoji} ${result.businessName}: ${result.qualityScore}/100`);
    });
    console.log();

    console.log(`📋 CONTENT GENERATION BREAKDOWN:`);
    successful.forEach(result => {
      console.log(`\n   ${result.businessName}:`);
      console.log(`     - Website sections: ✓`);
      console.log(`     - Services/Products: ${result.website.services.length}`);
      if (result.industryContent.menu) {
        console.log(`     - Menu items: ${result.industryContent.menu.length}`);
      }
      if (result.industryContent.classes) {
        console.log(`     - Classes: ${result.industryContent.classes.length}`);
      }
      if (result.industryContent.products) {
        console.log(`     - Products: ${result.industryContent.products.length}`);
      }
      if (result.industryContent.team) {
        console.log(`     - Team members: ${result.industryContent.team.length}`);
      }
      console.log(`     - Testimonials: ${result.testimonials.length}`);
      console.log(`     - SEO keywords: ${result.seo.keywords.length}`);
      console.log(`     - Recommendations: ${result.intelligence.recommendations.length}`);
    });
    console.log();

    console.log(`🎨 DESIGN & BRANDING:`);
    successful.forEach(result => {
      console.log(`   ${result.businessName}:`);
      console.log(`     - Color scheme: ${result.website.colorPalette.primary}`);
      console.log(`     - Typography: ${result.website.typography.heading} / ${result.website.typography.body}`);
      console.log(`     - Logo style: ${result.logo.prompt.style}`);
    });
    console.log();

    console.log(`⚠️  COMMON ISSUES:`);
    const allWarnings = successful.flatMap(r => r.validation.warnings);
    const warningCounts: Record<string, number> = {};

    allWarnings.forEach(w => {
      const key = w.field;
      warningCounts[key] = (warningCounts[key] || 0) + 1;
    });

    const topWarnings = Object.entries(warningCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (topWarnings.length > 0) {
      topWarnings.forEach(([field, count]) => {
        console.log(`   - ${field}: ${count} occurrences`);
      });
    } else {
      console.log('   No significant issues detected! ✨');
    }
    console.log();
  }

  if (failed.length > 0) {
    console.log(`❌ FAILURES:`);
    failed.forEach(result => {
      console.log(`   ${result.businessName}:`);
      console.log(`     Error: ${result.error}`);
    });
    console.log();
  }

  console.log(`💰 COST ANALYSIS:`);
  console.log(`   Cost per business: $${(totalAPICallsUsed * 0.03 / results.length).toFixed(3)}`);
  console.log(`   Estimated monthly cost (100 businesses): $${(totalAPICallsUsed * 0.03 / results.length * 100).toFixed(2)}`);
  console.log();

  console.log(`📈 RECOMMENDATIONS:`);
  if (successful.length > 0) {
    const avgQuality = successful.reduce((sum, r) => sum + r.qualityScore, 0) / successful.length;

    if (avgQuality >= 85) {
      console.log(`   ✅ Excellent quality! System is production-ready.`);
    } else if (avgQuality >= 75) {
      console.log(`   ✓ Good quality. Consider minor prompt improvements.`);
    } else if (avgQuality >= 65) {
      console.log(`   ⚠️  Acceptable quality but needs improvement.`);
      console.log(`   → Review validation warnings and enhance prompts`);
    } else {
      console.log(`   ❌ Quality below acceptable threshold.`);
      console.log(`   → Significant prompt engineering needed`);
    }
  }

  if (totalAPICallsUsed > 50) {
    console.log(`   💡 High API usage detected. Consider:`);
    console.log(`      - Caching frequently generated content`);
    console.log(`      - Using cheaper models for less critical content`);
    console.log(`      - Batching requests where possible`);
  }

  console.log();
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     TEST COMPLETE                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
}

/**
 * Run specific industry test
 */
async function testSpecificIndustry(industry: string) {
  const business = TEST_BUSINESSES.find(b =>
    b.category.toLowerCase().includes(industry.toLowerCase())
  );

  if (!business) {
    console.error(`No test business found for industry: ${industry}`);
    return;
  }

  console.log(`\n🎯 Testing ${industry} industry with: ${business.name}\n`);
  const result = await testBusinessGeneration(business);

  console.log('\n' + '═'.repeat(70));
  console.log('DETAILED VALIDATION REPORT');
  console.log('═'.repeat(70));
  console.log(generateValidationReport(result.validation));
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

const args = process.argv.slice(2);

if (args.length > 0) {
  // Test specific industry
  const industry = args[0];
  testSpecificIndustry(industry).catch(console.error);
} else {
  // Run all tests
  runTests().catch(console.error);
}
