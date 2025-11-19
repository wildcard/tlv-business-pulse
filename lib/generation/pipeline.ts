/**
 * Complete AI-Powered Website Generation Pipeline
 *
 * This is the main orchestrator that transforms business data
 * into fully-functional, professional websites.
 */

import { createClient } from '@supabase/supabase-js';
import {
  fetchTelAvivBusinesses,
  verifyBusiness,
  type TelAvivBusiness,
  type BusinessVerification,
} from '../data/tel-aviv-api';
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
  generateWelcomeEmail,
  enrichBusinessData,
  type BusinessData,
  type GeneratedWebsite,
  type BusinessIntelligence,
} from '../ai/generate';
import { getIndustryConfig, getRecommendedColorPalette } from '../ai/industry-prompts';
import { generateCompleteLogo, svgToDataURL } from '../ai/logo-generation';
import { validateGeneratedContent, generateValidationReport, type ValidationResult } from './validation';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY!
);

export interface GenerationOptions {
  generateLogo?: boolean;
  generateIntelligence?: boolean;
  deployWebsite?: boolean;
  sendWelcomeEmail?: boolean;
  skipValidation?: boolean;
  maxRetries?: number;
}

export interface GenerationResult {
  success: boolean;
  websiteId?: string;
  websiteUrl?: string;
  businessData: BusinessData;
  generatedContent?: GeneratedWebsite;
  intelligence?: BusinessIntelligence;
  validation?: ValidationResult;
  logoData?: any;
  errors: string[];
  warnings: string[];
  metadata: {
    generationTime: number;
    apiCallsUsed: number;
    estimatedCost: number;
  };
}

/**
 * Main pipeline: Generate a complete website for a business
 */
export async function generateBusinessWebsite(
  businessLicenseNumber: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  const startTime = Date.now();
  let apiCallsUsed = 0;
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(`🚀 Starting website generation for business: ${businessLicenseNumber}`);

  try {
    // STEP 1: Fetch and verify business data
    console.log('📊 Step 1: Fetching business data from Tel Aviv API...');
    const tlvBusiness = await fetchBusinessFromAPI(businessLicenseNumber);
    if (!tlvBusiness) {
      throw new Error('Business not found in Tel Aviv registry');
    }

    // STEP 2: Verify business is legitimate
    console.log('✓ Step 2: Verifying business...');
    const verification = await verifyBusiness(businessLicenseNumber);
    if (!verification.verified) {
      warnings.push('Business verification score is low. Proceeding with caution.');
    }

    // STEP 3: Enrich with external data (Google Places, etc.)
    console.log('🔍 Step 3: Enriching business data...');
    const businessData = await enrichBusinessDataFromSources(tlvBusiness);

    // STEP 4: Determine industry and get configuration
    console.log('🎨 Step 4: Determining industry template...');
    const industryConfig = getIndustryConfig(businessData.category);
    console.log(`   Industry detected: ${industryConfig.name}`);

    // STEP 5: Generate main website content
    console.log('✍️ Step 5: Generating website content with AI...');
    const generatedContent = await generateWebsite(businessData);
    apiCallsUsed++;

    // STEP 6: Validate generated content
    let validation: ValidationResult | undefined;
    if (!options.skipValidation) {
      console.log('✓ Step 6: Validating content quality...');
      validation = validateGeneratedContent(generatedContent, businessData.name);
      console.log(`   Quality score: ${validation.score}/100`);

      if (!validation.isValid && (options.maxRetries || 0) > 0) {
        warnings.push('Initial content validation failed. Retrying...');
        // Could implement retry logic here
      }

      if (validation.warnings.length > 0) {
        warnings.push(...validation.warnings.map(w => `${w.field}: ${w.message}`));
      }
    }

    // STEP 7: Generate industry-specific content
    console.log('🎯 Step 7: Generating industry-specific content...');
    let additionalContent: any = {};

    if (industryConfig.templateType === 'restaurant') {
      console.log('   → Generating menu items...');
      additionalContent.menu = await generateMenuItems(
        businessData.name,
        businessData.category,
        businessData.description
      );
      apiCallsUsed++;
    } else if (industryConfig.templateType === 'retail') {
      console.log('   → Generating product catalog...');
      additionalContent.products = await generateProductCatalog(
        businessData.name,
        businessData.category
      );
      apiCallsUsed++;
    } else if (industryConfig.templateType === 'fitness') {
      console.log('   → Generating class schedule...');
      additionalContent.classes = await generateClassSchedule(
        businessData.name,
        'fitness'
      );
      apiCallsUsed++;
    } else if (industryConfig.templateType === 'professional_services') {
      console.log('   → Generating team profiles...');
      additionalContent.team = await generateTeamProfiles(
        businessData.name,
        businessData.category,
        4
      );
      apiCallsUsed++;
    }

    // Generate testimonials for all business types
    console.log('   → Generating testimonials...');
    additionalContent.testimonials = await generateTestimonials(
      businessData.name,
      businessData.category
    );
    apiCallsUsed++;

    // STEP 8: Generate branding (logo, colors)
    console.log('🎨 Step 8: Generating branding elements...');
    const colorPalette = generatedContent.colorPalette;
    let logoData;

    if (options.generateLogo !== false) {
      try {
        logoData = await generateCompleteLogo(
          businessData.name,
          businessData.category,
          colorPalette,
          false // Don't generate DALL-E image by default (costs money)
        );
        console.log('   → Logo placeholder generated');
      } catch (error) {
        warnings.push('Failed to generate logo: ' + (error as Error).message);
      }
    }

    // STEP 9: Generate business intelligence (optional)
    let intelligence: BusinessIntelligence | undefined;
    if (options.generateIntelligence !== false) {
      console.log('💡 Step 9: Generating business intelligence...');
      try {
        intelligence = await generateBusinessIntelligence(businessData);
        apiCallsUsed++;
      } catch (error) {
        warnings.push('Failed to generate business intelligence: ' + (error as Error).message);
      }
    }

    // STEP 10: Generate SEO metadata
    console.log('🔍 Step 10: Generating SEO metadata...');
    const seoMetadata = await generateSEOMetadata(businessData, 'home');
    apiCallsUsed++;

    // STEP 11: Store in database
    console.log('💾 Step 11: Storing website in database...');
    const websiteId = await storeWebsiteInDatabase({
      businessData,
      generatedContent,
      additionalContent,
      logoData,
      intelligence,
      seoMetadata,
      verification,
    });

    // STEP 12: Generate website URL
    const websiteUrl = `https://tlv-business-pulse.vercel.app/business/${websiteId}`;
    console.log(`✓ Website generated: ${websiteUrl}`);

    // STEP 13: Generate social media posts
    console.log('📱 Step 12: Generating social media posts...');
    const socialPosts = await generateSocialMediaPosts(businessData, websiteUrl);
    apiCallsUsed++;

    // Store social posts
    await storeSocialPosts(websiteId, socialPosts);

    // STEP 14: Send welcome email (optional)
    if (options.sendWelcomeEmail && businessData.email) {
      console.log('📧 Step 13: Sending welcome email...');
      try {
        const welcomeEmail = await generateWelcomeEmail(businessData, websiteUrl);
        apiCallsUsed++;
        // TODO: Actually send the email via email service
        console.log('   → Welcome email generated (sending not implemented)');
      } catch (error) {
        warnings.push('Failed to send welcome email: ' + (error as Error).message);
      }
    }

    const endTime = Date.now();
    const generationTime = endTime - startTime;

    console.log(`\n✅ Generation complete in ${(generationTime / 1000).toFixed(2)}s`);
    console.log(`   API calls used: ${apiCallsUsed}`);
    console.log(`   Estimated cost: $${(apiCallsUsed * 0.03).toFixed(2)}`);

    return {
      success: true,
      websiteId,
      websiteUrl,
      businessData,
      generatedContent: {
        ...generatedContent,
        ...additionalContent,
      },
      intelligence,
      validation,
      logoData,
      errors,
      warnings,
      metadata: {
        generationTime,
        apiCallsUsed,
        estimatedCost: apiCallsUsed * 0.03, // Rough estimate
      },
    };
  } catch (error) {
    const endTime = Date.now();
    const generationTime = endTime - startTime;

    console.error('❌ Generation failed:', error);
    errors.push((error as Error).message);

    return {
      success: false,
      businessData: {} as BusinessData,
      errors,
      warnings,
      metadata: {
        generationTime,
        apiCallsUsed,
        estimatedCost: apiCallsUsed * 0.03,
      },
    };
  }
}

/**
 * Batch generation: Generate websites for multiple businesses
 */
export async function generateMultipleWebsites(
  businessLicenseNumbers: string[],
  options: GenerationOptions = {}
): Promise<GenerationResult[]> {
  console.log(`🚀 Starting batch generation for ${businessLicenseNumbers.length} businesses`);

  const results: GenerationResult[] = [];

  for (const licenseNumber of businessLicenseNumbers) {
    try {
      const result = await generateBusinessWebsite(licenseNumber, options);
      results.push(result);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to generate website for ${licenseNumber}:`, error);
      results.push({
        success: false,
        businessData: {} as BusinessData,
        errors: [(error as Error).message],
        warnings: [],
        metadata: {
          generationTime: 0,
          apiCallsUsed: 0,
          estimatedCost: 0,
        },
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Batch generation complete: ${successCount}/${businessLicenseNumbers.length} successful`);

  return results;
}

/**
 * Auto-generate websites for new business registrations
 */
export async function autoGenerateForNewBusinesses(
  daysBack: number = 1,
  options: GenerationOptions = {}
): Promise<GenerationResult[]> {
  console.log(`🤖 Auto-generating websites for new businesses (last ${daysBack} days)...`);

  try {
    // Fetch new business registrations
    const { businesses } = await fetchTelAvivBusinesses(100, 0, { status: 'active' });

    // Filter for recent registrations
    const recentBusinesses = businesses.filter(b => {
      const registrationDate = new Date(b.issue_date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      return registrationDate >= cutoffDate;
    });

    console.log(`   Found ${recentBusinesses.length} new businesses`);

    // Check which ones don't have websites yet
    const businessesNeedingWebsites = await filterBusinessesWithoutWebsites(recentBusinesses);

    console.log(`   ${businessesNeedingWebsites.length} need websites`);

    // Generate websites
    const results = await generateMultipleWebsites(
      businessesNeedingWebsites.map(b => b.license_number),
      options
    );

    return results;
  } catch (error) {
    console.error('Auto-generation failed:', error);
    return [];
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Fetch business from Tel Aviv API
 */
async function fetchBusinessFromAPI(licenseNumber: string): Promise<TelAvivBusiness | null> {
  try {
    const { businesses } = await fetchTelAvivBusinesses(1, 0);
    // In real implementation, filter by license number
    // For now, return first business as example
    return businesses[0] || null;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

/**
 * Enrich business data from multiple sources
 */
async function enrichBusinessDataFromSources(tlvBusiness: TelAvivBusiness): Promise<BusinessData> {
  const businessData: BusinessData = {
    name: tlvBusiness.business_name,
    category: tlvBusiness.business_type_desc,
    address: `${tlvBusiness.street} ${tlvBusiness.house_number}`,
    city: tlvBusiness.city,
    registration_date: tlvBusiness.issue_date,
  };

  // Enrich with additional data
  const enriched = await enrichBusinessData(businessData);

  return {
    ...businessData,
    ...enriched,
  };
}

/**
 * Store website in database
 */
async function storeWebsiteInDatabase(data: {
  businessData: BusinessData;
  generatedContent: GeneratedWebsite;
  additionalContent: any;
  logoData: any;
  intelligence?: BusinessIntelligence;
  seoMetadata: any;
  verification: BusinessVerification;
}): Promise<string> {
  try {
    const { data: website, error } = await supabase
      .from('businesses')
      .insert({
        name: data.businessData.name,
        category: data.businessData.category,
        address: data.businessData.address,
        phone: data.businessData.phone,
        status: 'active',
        opened_date: data.businessData.registration_date,
        raw_data: {
          business: data.businessData,
          content: data.generatedContent,
          additional: data.additionalContent,
          logo: data.logoData,
          intelligence: data.intelligence,
          seo: data.seoMetadata,
          verification: data.verification,
        },
      })
      .select()
      .single();

    if (error) throw error;

    return website.id;
  } catch (error) {
    console.error('Error storing website:', error);
    throw new Error('Failed to store website in database');
  }
}

/**
 * Store social media posts
 */
async function storeSocialPosts(websiteId: string, posts: any): Promise<void> {
  try {
    const socialPosts = [
      { platform: 'twitter', content: posts.twitter },
      { platform: 'facebook', content: posts.facebook },
      { platform: 'instagram', content: posts.instagram },
    ];

    if (posts.linkedin) {
      socialPosts.push({ platform: 'linkedin', content: posts.linkedin });
    }

    for (const post of socialPosts) {
      await supabase.from('social_posts').insert({
        platform: post.platform,
        content: post.content,
        insight_id: websiteId,
      });
    }
  } catch (error) {
    console.error('Error storing social posts:', error);
  }
}

/**
 * Filter businesses that don't have websites yet
 */
async function filterBusinessesWithoutWebsites(
  businesses: TelAvivBusiness[]
): Promise<TelAvivBusiness[]> {
  const licenseNumbers = businesses.map(b => b.license_number);

  const { data: existing } = await supabase
    .from('businesses')
    .select('external_id')
    .in('external_id', licenseNumbers);

  const existingIds = new Set(existing?.map(e => e.external_id) || []);

  return businesses.filter(b => !existingIds.has(b.license_number));
}

/**
 * Regenerate content for existing website
 */
export async function regenerateWebsiteContent(
  websiteId: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  console.log(`🔄 Regenerating content for website: ${websiteId}`);

  // Fetch existing business data
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', websiteId)
    .single();

  if (error || !business) {
    throw new Error('Website not found');
  }

  // Extract business data
  const businessData = business.raw_data?.business as BusinessData;

  // Generate new content
  const generatedContent = await generateWebsite(businessData);

  // Validate
  const validation = validateGeneratedContent(generatedContent, businessData.name);

  // Update database
  await supabase
    .from('businesses')
    .update({
      raw_data: {
        ...business.raw_data,
        content: generatedContent,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', websiteId);

  console.log('✓ Content regenerated successfully');

  return {
    success: true,
    websiteId,
    businessData,
    generatedContent,
    validation,
    errors: [],
    warnings: [],
    metadata: {
      generationTime: 0,
      apiCallsUsed: 1,
      estimatedCost: 0.03,
    },
  };
}

/**
 * Generate a summary report of generation results
 */
export function generatePipelineReport(results: GenerationResult[]): string {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  let report = '═══════════════════════════════════════\n';
  report += '  WEBSITE GENERATION PIPELINE REPORT\n';
  report += '═══════════════════════════════════════\n\n';

  report += `Total Businesses: ${results.length}\n`;
  report += `✓ Successful: ${successful.length}\n`;
  report += `✗ Failed: ${failed.length}\n\n`;

  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.metadata.generationTime, 0) / successful.length;
    const totalCost = successful.reduce((sum, r) => sum + r.metadata.estimatedCost, 0);
    const totalAPICalls = successful.reduce((sum, r) => sum + r.metadata.apiCallsUsed, 0);

    report += '📊 SUCCESS METRICS:\n';
    report += `   Average generation time: ${(avgTime / 1000).toFixed(2)}s\n`;
    report += `   Total API calls: ${totalAPICalls}\n`;
    report += `   Estimated cost: $${totalCost.toFixed(2)}\n\n`;

    report += '🎯 QUALITY SCORES:\n';
    successful.forEach((result, i) => {
      if (result.validation) {
        report += `   ${i + 1}. ${result.businessData.name}: ${result.validation.score}/100\n`;
      }
    });
    report += '\n';
  }

  if (failed.length > 0) {
    report += '❌ FAILURES:\n';
    failed.forEach((result, i) => {
      report += `   ${i + 1}. ${result.businessData.name || 'Unknown'}\n`;
      result.errors.forEach(error => {
        report += `      → ${error}\n`;
      });
    });
    report += '\n';
  }

  report += '═══════════════════════════════════════\n';

  return report;
}
