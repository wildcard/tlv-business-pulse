import { createClient } from '@supabase/supabase-js';
import type { Business } from '@/lib/types';

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
