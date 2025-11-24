import { createClient } from '@supabase/supabase-js';
import type { Business } from '@/lib/types';
import type {
  GeneratedWebsite,
  InsertBusiness,
  UpdateBusiness,
  InsertGeneratedWebsite,
  UpdateGeneratedWebsite,
  InsertVerificationLog,
  VerificationLog,
  InsertAnalyticsEvent,
  BusinessQueryOptions,
  DashboardStats,
} from '@/lib/types/database';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Service role client for admin operations (bypasses RLS)
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) {
      throw new Error('SUPABASE_SERVICE_KEY not found in environment variables');
    }
    supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdmin;
}

// ============================================================================
// Business Query Functions
// ============================================================================

interface GetBusinessesOptions {
  limit?: number;
  offset?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
}

/**
 * Fetch businesses from the database with optional filters
 */
export async function getBusinesses(options: GetBusinessesOptions = {}): Promise<Business[]> {
  const { limit = 20, offset = 0, category, isActive, search } = options;

  let query = supabase.from('businesses').select('*');

  // Apply filters
  if (category) {
    query = query.eq('category', category);
  }

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
  }

  // Apply pagination and ordering
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching businesses:', error);
    throw new Error(`Failed to fetch businesses: ${error.message}`);
  }

  return (data || []) as Business[];
}

/**
 * Get total count of businesses matching filters
 */
export async function getBusinessCount(options: Omit<GetBusinessesOptions, 'limit' | 'offset'> = {}): Promise<number> {
  const { category, isActive, search } = options;

  let query = supabase.from('businesses').select('id', { count: 'exact', head: true });

  if (category) {
    query = query.eq('category', category);
  }

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error counting businesses:', error);
    throw new Error(`Failed to count businesses: ${error.message}`);
  }

  return count || 0;
}

/**
 * Get a single business by ID
 */
export async function getBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching business:', error);
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return data as Business;
}

// ============================================================================
// Dashboard Statistics Functions
// ============================================================================

interface DashboardStats {
  totalBusinesses: number;
  newToday: number;
  closedToday: number;
  articlesPublished: number;
  apiCalls: number;
  revenue: number;
  uptime: number;
  lastUpdated: string;
}

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStartISO = todayStart.toISOString();

  try {
    // Fetch total businesses count
    const { count: totalBusinesses } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // Fetch new businesses today
    const { count: newToday } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('created_at', todayStartISO);

    // Fetch closed businesses today (marked inactive today)
    const { count: closedToday } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', false)
      .gte('updated_at', todayStartISO);

    // Fetch total published articles
    const { count: articlesPublished } = await supabase
      .from('insights')
      .select('id', { count: 'exact', head: true });

    // Fetch API call statistics (last 24 hours)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // Calculate total API calls from all active keys in last 24h
    const { data: apiKeysData } = await supabase
      .from('api_keys')
      .select('requests_count')
      .gte('last_used', twentyFourHoursAgo);

    const totalApiCalls = apiKeysData?.reduce((sum, key) => sum + (key.requests_count || 0), 0) || 0;

    // Calculate monthly revenue (from active subscriptions)
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    // Estimate revenue (in cents, assuming $29/month per subscription)
    const monthlyRevenue = (subscriptions?.length || 0) * 2900;

    // Calculate system uptime (simplified - could be enhanced with actual uptime tracking)
    const uptime = 99.98; // Placeholder - could track actual downtime

    return {
      totalBusinesses: totalBusinesses || 0,
      newToday: newToday || 0,
      closedToday: closedToday || 0,
      articlesPublished: articlesPublished || 0,
      apiCalls: totalApiCalls,
      revenue: monthlyRevenue,
      uptime,
      lastUpdated: now.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error(`Failed to fetch dashboard statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Insights Query Functions
// ============================================================================

/**
 * Get recent insights/articles
 */
export async function getRecentInsights(limit = 10) {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching insights:', error);
    throw new Error(`Failed to fetch insights: ${error.message}`);
  }

  return data || [];
}

/**
 * Get insight by slug
 */
export async function getInsightBySlug(slug: string) {
  const { data, error } = await supabase.from('insights').select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching insight:', error);
    throw new Error(`Failed to fetch insight: ${error.message}`);
  }

  return data;
}

/**
 * Increment insight view count
 */
export async function incrementInsightViews(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { insight_id: id });

  if (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw - this is not critical
  }
}

// ============================================================================
// Subscription Functions
// ============================================================================

/**
 * Create a new subscription record
 */
export async function createSubscription(data: {
  userEmail: string;
  tierId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert({
      user_email: data.userEmail,
      tier_id: data.tierId,
      stripe_customer_id: data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      status: data.status,
      current_period_start: data.currentPeriodStart,
      current_period_end: data.currentPeriodEnd,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }

  return subscription;
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(stripeSubscriptionId: string, status: string) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', stripeSubscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

// ============================================================================
// API Key Management
// ============================================================================

/**
 * Create a new API key for a user
 */
export async function createApiKey(data: {
  key: string;
  userEmail: string;
  subscriptionId: string;
  rateLimit: number;
}) {
  const { data: apiKey, error } = await supabase
    .from('api_keys')
    .insert({
      key: data.key,
      user_email: data.userEmail,
      subscription_id: data.subscriptionId,
      rate_limit: data.rateLimit,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating API key:', error);
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  return apiKey;
}

/**
 * Validate and get API key details
 */
export async function validateApiKey(key: string) {
  const { data, error } = await supabase.from('api_keys').select('*').eq('key', key).eq('is_active', true).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error validating API key:', error);
    throw new Error(`Failed to validate API key: ${error.message}`);
  }

  return data;
}

/**
 * Increment API key request count
 */
export async function incrementApiKeyRequests(key: string): Promise<void> {
  // First get the current count
  const { data: currentData } = await supabase
    .from('api_keys')
    .select('requests_count')
    .eq('key', key)
    .single();

  const newCount = (currentData?.requests_count || 0) + 1;

  // Then update with the new count
  const { error } = await supabase
    .from('api_keys')
    .update({
      requests_count: newCount,
      last_used: new Date().toISOString(),
    })
    .eq('key', key);

  if (error) {
    console.error('Error incrementing API key requests:', error);
    // Don't throw - this is not critical
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get database health status
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; responseTime: number }> {
  const startTime = Date.now();

  try {
    const { error } = await supabase.from('businesses').select('id').limit(1);

    const responseTime = Date.now() - startTime;

    return {
      healthy: !error,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      healthy: false,
      responseTime,
    };
  }
}

// ============================================================================
// Business Create/Update Functions
// ============================================================================

/**
 * Create a new business in the database
 */
export async function createBusiness(data: InsertBusiness): Promise<Business> {
  const admin = getSupabaseAdmin();

  // Generate website slug from business name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const businessData = {
    ...data,
    website_slug: data.website_slug || slug,
    metadata: data.metadata || {},
  };

  const { data: business, error } = await admin
    .from('businesses')
    .insert(businessData)
    .select()
    .single();

  if (error) {
    console.error('Error creating business:', error);
    throw new Error(`Failed to create business: ${error.message}`);
  }

  return business as Business;
}

/**
 * Update an existing business
 */
export async function updateBusiness(id: string, updates: UpdateBusiness): Promise<Business> {
  const admin = getSupabaseAdmin();

  const { data: business, error } = await admin
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating business:', error);
    throw new Error(`Failed to update business: ${error.message}`);
  }

  return business as Business;
}

/**
 * Get business by slug (for public website access)
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('website_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching business by slug:', error);
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return data as Business;
}

/**
 * Search businesses with advanced filters
 */
export async function searchBusinesses(options: BusinessQueryOptions) {
  const {
    limit = 20,
    offset = 0,
    category,
    status,
    verified,
    claimed,
    search,
    neighborhood,
    minQualityScore,
  } = options;

  let query = supabase.from('businesses').select('*', { count: 'exact' });

  // Apply filters
  if (category) {
    query = query.eq('category', category);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (verified !== undefined) {
    query = query.eq('verified', verified);
  }

  if (claimed !== undefined) {
    query = query.eq('claimed', claimed);
  }

  if (neighborhood) {
    query = query.eq('neighborhood', neighborhood);
  }

  if (minQualityScore !== undefined) {
    query = query.gte('data_quality_score', minQualityScore);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,category.ilike.%${search}%`);
  }

  // Apply pagination and ordering
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error searching businesses:', error);
    throw new Error(`Failed to search businesses: ${error.message}`);
  }

  return {
    data: (data || []) as Business[],
    count: count || 0,
  };
}

// ============================================================================
// Generated Website Functions
// ============================================================================

/**
 * Get generated website content by business ID
 */
export async function getGeneratedWebsite(businessId: string): Promise<GeneratedWebsite | null> {
  const { data, error } = await supabase
    .from('generated_websites')
    .select('*')
    .eq('business_id', businessId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching generated website:', error);
    throw new Error(`Failed to fetch generated website: ${error.message}`);
  }

  return data as GeneratedWebsite;
}

/**
 * Get website by business slug (for public access)
 */
export async function getWebsiteBySlug(slug: string): Promise<{
  business: Business;
  website: GeneratedWebsite;
} | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select(
      `
      *,
      generated_websites (*)
    `
    )
    .eq('website_slug', slug)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching website by slug:', error);
    throw new Error(`Failed to fetch website: ${error.message}`);
  }

  if (!data || !data.generated_websites || data.generated_websites.length === 0) {
    return null;
  }

  return {
    business: data as Business,
    website: data.generated_websites[0] as GeneratedWebsite,
  };
}

/**
 * Save AI-generated website content
 */
export async function saveGeneratedWebsite(data: InsertGeneratedWebsite): Promise<GeneratedWebsite> {
  const admin = getSupabaseAdmin();

  // Ensure default values for JSONB fields
  const websiteData = {
    ...data,
    services: data.services || [],
    menu_items: data.menu_items || [],
    products: data.products || [],
    team_members: data.team_members || [],
    gallery_images: data.gallery_images || [],
    color_palette: data.color_palette || {},
    typography: data.typography || {},
    keywords: data.keywords || [],
    meta_tags: data.meta_tags || {},
    layout_config: data.layout_config || {},
    features_enabled: data.features_enabled || {},
    social_media: data.social_media || {},
    business_hours: data.business_hours || {},
  };

  const { data: website, error } = await admin
    .from('generated_websites')
    .insert(websiteData)
    .select()
    .single();

  if (error) {
    console.error('Error saving generated website:', error);
    throw new Error(`Failed to save generated website: ${error.message}`);
  }

  return website as GeneratedWebsite;
}

/**
 * Update generated website content
 */
export async function updateGeneratedWebsite(
  businessId: string,
  updates: UpdateGeneratedWebsite
): Promise<GeneratedWebsite> {
  const admin = getSupabaseAdmin();

  const { data: website, error } = await admin
    .from('generated_websites')
    .update(updates)
    .eq('business_id', businessId)
    .select()
    .single();

  if (error) {
    console.error('Error updating generated website:', error);
    throw new Error(`Failed to update generated website: ${error.message}`);
  }

  return website as GeneratedWebsite;
}

/**
 * Increment website view count
 */
export async function incrementWebsiteViews(businessId: string): Promise<void> {
  const admin = getSupabaseAdmin();

  const { error } = await admin.rpc('increment_website_views', {
    p_business_id: businessId,
  });

  if (error) {
    console.error('Error incrementing website views:', error);
    // Don't throw - this is not critical
  }
}

// ============================================================================
// Verification Log Functions
// ============================================================================

/**
 * Log a business verification attempt
 */
export async function logVerification(data: InsertVerificationLog): Promise<VerificationLog> {
  const admin = getSupabaseAdmin();

  const logData = {
    ...data,
    retrieved_data: data.retrieved_data || {},
    discrepancies: data.discrepancies || [],
    metadata: data.metadata || {},
  };

  const { data: log, error } = await admin
    .from('verification_logs')
    .insert(logData)
    .select()
    .single();

  if (error) {
    console.error('Error logging verification:', error);
    throw new Error(`Failed to log verification: ${error.message}`);
  }

  return log as VerificationLog;
}

/**
 * Get verification logs for a business
 */
export async function getVerificationLogs(
  businessId: string,
  limit = 10
): Promise<VerificationLog[]> {
  const { data, error } = await supabase
    .from('verification_logs')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching verification logs:', error);
    throw new Error(`Failed to fetch verification logs: ${error.message}`);
  }

  return (data || []) as VerificationLog[];
}

/**
 * Get latest verification status for a business
 */
export async function getLatestVerification(businessId: string): Promise<VerificationLog | null> {
  const { data, error } = await supabase
    .from('verification_logs')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching latest verification:', error);
    throw new Error(`Failed to fetch latest verification: ${error.message}`);
  }

  return data as VerificationLog;
}

// ============================================================================
// Analytics Functions
// ============================================================================

/**
 * Track an analytics event
 */
export async function trackAnalyticsEvent(data: InsertAnalyticsEvent): Promise<void> {
  const admin = getSupabaseAdmin();

  const eventData = {
    ...data,
    event_data: data.event_data || {},
  };

  const { error } = await admin.from('analytics_events').insert(eventData);

  if (error) {
    console.error('Error tracking analytics event:', error);
    // Don't throw - analytics should not break the app
  }
}

/**
 * Get analytics summary for a business
 */
export async function getBusinessAnalytics(
  businessId: string,
  daysBack = 30
): Promise<{
  totalViews: number;
  uniqueVisitors: number;
  contactFormSubmissions: number;
  phoneClicks: number;
  directionsClicks: number;
  avgTimeOnPage: number;
}> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('business_id', businessId)
    .gte('created_at', since.toISOString());

  if (error) {
    console.error('Error fetching business analytics:', error);
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }

  const events = data || [];

  const uniqueVisitors = new Set(events.map((e) => e.visitor_id).filter(Boolean)).size;

  const totalViews = events.filter((e) => e.event_type === 'page_view').length;

  const contactFormSubmissions = events.filter((e) => e.event_type === 'contact_form').length;

  const phoneClicks = events.filter((e) => e.event_type === 'phone_click').length;

  const directionsClicks = events.filter((e) => e.event_type === 'directions_click').length;

  const timesOnPage = events
    .map((e) => e.time_on_page_seconds)
    .filter((t): t is number => t !== null && t !== undefined);

  const avgTimeOnPage = timesOnPage.length > 0 ? timesOnPage.reduce((a, b) => a + b, 0) / timesOnPage.length : 0;

  return {
    totalViews,
    uniqueVisitors,
    contactFormSubmissions,
    phoneClicks,
    directionsClicks,
    avgTimeOnPage: Math.round(avgTimeOnPage),
  };
}

// ============================================================================
// Dashboard Statistics (Enhanced)
// ============================================================================

/**
 * Get comprehensive dashboard statistics
 */
export async function getEnhancedDashboardStats(): Promise<DashboardStats> {
  const admin = getSupabaseAdmin();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStartISO = todayStart.toISOString();

  try {
    // Use the database function for business stats
    const { data: businessStats } = await admin.rpc('get_business_stats');

    const stats = businessStats?.[0] || {
      total_businesses: 0,
      active_businesses: 0,
      verified_businesses: 0,
      claimed_businesses: 0,
      avg_quality_score: 0,
    };

    // Fetch new businesses today
    const { count: newToday } = await admin
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStartISO);

    // Count websites generated
    const { count: websitesGenerated } = await admin
      .from('generated_websites')
      .select('id', { count: 'exact', head: true });

    // Count active subscriptions
    const { count: activeSubscriptions } = await admin
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total page views (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const { count: totalPageViews } = await admin
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', thirtyDaysAgo.toISOString());

    return {
      totalBusinesses: Number(stats.total_businesses) || 0,
      activeBusinesses: Number(stats.active_businesses) || 0,
      verifiedBusinesses: Number(stats.verified_businesses) || 0,
      claimedBusinesses: Number(stats.claimed_businesses) || 0,
      avgQualityScore: Number(stats.avg_quality_score) || 0,
      newToday: newToday || 0,
      websitesGenerated: websitesGenerated || 0,
      totalPageViews: totalPageViews || 0,
      activeSubscriptions: activeSubscriptions || 0,
    };
  } catch (error) {
    console.error('Error fetching enhanced dashboard stats:', error);
    throw new Error(`Failed to fetch dashboard statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
