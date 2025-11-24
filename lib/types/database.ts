/**
 * TLV Business Pulse - Database TypeScript Types
 *
 * These types match the database schema exactly.
 * Auto-generated types can be created with: npx supabase gen types typescript
 *
 * @see docs/DATABASE_SCHEMA.sql
 */

// ============================================================================
// ENUMS
// ============================================================================

export type BusinessStatus = 'active' | 'expired' | 'suspended' | 'closed';

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export type VerificationStatus = 'success' | 'failed' | 'partial' | 'skipped';

export type VerificationType = 'municipality' | 'company_registry' | 'google_places' | 'manual';

export type TemplateType = 'restaurant' | 'beauty' | 'professional_services' | 'retail' | 'fitness' | 'tech';

export type InsightCategory = 'trends' | 'guides' | 'analysis' | 'news';

export type InsightStatus = 'draft' | 'published' | 'archived';

export type BillingInterval = 'month' | 'year';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type ApiKeyScope = 'read' | 'write' | 'admin';

// ============================================================================
// CORE TABLES
// ============================================================================

/**
 * Business entity from Tel Aviv Municipality
 * Represents a real business with active license
 */
export interface Business {
  // Primary identifiers
  id: string; // UUID
  business_id: string; // External ID from municipality

  // Business information
  name: string;
  name_en?: string | null;
  owner_name?: string | null;
  category: string;
  category_description?: string | null;

  // Location
  address: string;
  street?: string | null;
  house_number?: string | null;
  city: string; // Default: 'Tel Aviv'
  neighborhood?: string | null;
  postal_code?: string | null;

  // Geographic coordinates
  latitude?: number | null;
  longitude?: number | null;
  location?: string | null; // PostGIS GEOGRAPHY type

  // Contact information
  phone?: string | null;
  email?: string | null;
  website?: string | null;

  // Business status
  status: BusinessStatus;
  license_number?: string | null;
  registration_date: string; // ISO date string
  license_issue_date?: string | null;
  license_expiry_date?: string | null;

  // Data quality and verification
  data_quality_score: number; // 0-100
  verified: boolean;
  last_verified_at?: string | null; // ISO datetime
  verification_source?: string | null;

  // Website generation
  generated_at?: string | null; // ISO datetime
  website_url?: string | null;
  website_slug?: string | null;

  // Ownership
  claimed: boolean;
  claimed_at?: string | null; // ISO datetime
  claimed_by_email?: string | null;

  // External source IDs
  municipality_license_id?: string | null;
  company_registry_id?: string | null;
  google_place_id?: string | null;

  // Additional data
  metadata: Record<string, any>;
  raw_municipality_data?: Record<string, any> | null;

  // Timestamps
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * AI-generated website content and branding
 * One-to-one relationship with Business
 */
export interface GeneratedWebsite {
  // Primary identifiers
  id: string; // UUID
  business_id: string; // UUID, foreign key to businesses

  // Content sections
  hero_title: string;
  hero_subtitle?: string | null;
  about_content?: string | null;
  call_to_action?: string | null;

  // Services/Products (structured data)
  services: Service[];
  menu_items: MenuItem[];
  products: Product[];
  team_members: TeamMember[];

  // Visual branding
  logo_url?: string | null;
  cover_image_url?: string | null;
  gallery_images: string[];
  color_palette: ColorPalette;
  typography: Typography;

  // SEO and metadata
  seo_title: string;
  seo_description: string;
  keywords: string[];
  meta_tags: Record<string, any>;

  // Template and design
  template_type: TemplateType;
  layout_config: Record<string, any>;
  custom_css?: string | null;

  // Features enabled
  features_enabled: FeaturesConfig;

  // Contact information
  contact_email?: string | null;
  contact_phone?: string | null;
  social_media: SocialMediaLinks;

  // Operating hours
  business_hours: BusinessHours;

  // AI generation metadata
  ai_model: string;
  ai_prompt_version?: string | null;
  generation_duration_ms?: number | null;
  generation_cost_usd?: number | null;

  // Publishing status
  published: boolean;
  published_at?: string | null; // ISO datetime
  version: number;

  // Analytics
  view_count: number;
  last_viewed_at?: string | null; // ISO datetime

  // Timestamps
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * Subscription management for premium features
 */
export interface Subscription {
  // Primary identifiers
  id: string; // UUID
  business_id?: string | null; // UUID, foreign key to businesses

  // Subscription details
  tier: SubscriptionTier;
  status: SubscriptionStatus;

  // Stripe integration
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_payment_method_id?: string | null;

  // Billing period
  current_period_start?: string | null; // ISO datetime
  current_period_end?: string | null; // ISO datetime
  cancel_at_period_end: boolean;
  cancelled_at?: string | null; // ISO datetime

  // Pricing
  price_amount?: number | null; // In cents
  currency: string; // Default: 'USD'
  billing_interval: BillingInterval;

  // Trial information
  trial_start?: string | null; // ISO datetime
  trial_end?: string | null; // ISO datetime

  // Features enabled by tier
  features: SubscriptionFeatures;

  // Usage tracking
  api_calls_this_period: number;
  api_rate_limit: number;

  // Metadata
  metadata: Record<string, any>;

  // Timestamps
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * Analytics event tracking
 */
export interface AnalyticsEvent {
  // Primary identifiers
  id: string; // UUID
  business_id?: string | null; // UUID, foreign key to businesses

  // Event details
  event_type: string; // 'page_view', 'contact_form', 'phone_click', etc.
  event_category?: string | null; // 'engagement', 'conversion', 'navigation'
  event_data: Record<string, any>;

  // Visitor information
  visitor_id?: string | null;
  session_id?: string | null;

  // Page information
  page_url?: string | null;
  page_title?: string | null;
  referrer?: string | null;

  // Device and browser
  user_agent?: string | null;
  device_type?: DeviceType | null;
  browser?: string | null;
  os?: string | null;

  // Geographic data
  ip_address?: string | null;
  country?: string | null;
  city?: string | null;

  // Performance metrics
  page_load_time_ms?: number | null;
  time_on_page_seconds?: number | null;

  // Timestamp
  created_at: string; // ISO datetime
}

/**
 * Business verification audit trail
 */
export interface VerificationLog {
  // Primary identifiers
  id: string; // UUID
  business_id?: string | null; // UUID, foreign key to businesses

  // Verification details
  verification_type: VerificationType;
  verification_status: VerificationStatus;

  // Data source information
  source_name: string;
  source_url?: string | null;
  source_api_endpoint?: string | null;

  // Verification results
  data_found: boolean;
  data_matches?: boolean | null;
  confidence_score?: number | null; // 0-100

  // Retrieved data
  retrieved_data: Record<string, any>;

  // Discrepancies found
  discrepancies: Discrepancy[];

  // Error handling
  error_message?: string | null;
  error_code?: string | null;

  // Performance
  verification_duration_ms?: number | null;

  // Automated vs manual
  automated: boolean;
  verified_by_user_email?: string | null;

  // Metadata
  metadata: Record<string, any>;

  // Timestamp
  created_at: string; // ISO datetime
}

/**
 * AI-generated insights/articles
 */
export interface Insight {
  // Primary identifiers
  id: string; // UUID

  // Content
  title: string;
  slug: string;
  content: string;
  summary: string;
  seo_description: string;

  // Featured businesses
  featured_business_ids: string[]; // UUID[]
  featured_businesses: FeaturedBusinessInfo[];

  // Categorization
  tags: string[];
  category: InsightCategory;

  // AI generation
  ai_generated: boolean;
  ai_model: string;
  generation_prompt?: string | null;

  // SEO
  keywords: string[];
  canonical_url?: string | null;

  // Publishing
  published_at?: string | null; // ISO datetime
  status: InsightStatus;

  // Analytics
  view_count: number;
  share_count: number;

  // Timestamps
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * API key management
 */
export interface ApiKey {
  // Primary identifiers
  id: string; // UUID
  key: string;

  // Ownership
  user_email: string;
  subscription_id?: string | null; // UUID, foreign key to subscriptions

  // Key details
  name?: string | null;
  is_active: boolean;

  // Usage tracking
  requests_count: number;
  last_used?: string | null; // ISO datetime

  // Rate limiting
  rate_limit: number;
  current_period_start: string; // ISO datetime
  current_period_requests: number;

  // Permissions
  scopes: ApiKeyScope[];

  // Metadata
  metadata: Record<string, any>;

  // Timestamps
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

// ============================================================================
// NESTED TYPES (for JSONB fields)
// ============================================================================

export interface Service {
  name: string;
  description: string;
  price?: string | number;
  icon?: string;
  duration?: string;
}

export interface MenuItem {
  category: string;
  items: {
    name: string;
    description?: string;
    price: string | number;
    allergens?: string[];
    vegetarian?: boolean;
    vegan?: boolean;
  }[];
}

export interface Product {
  name: string;
  description: string;
  price: string | number;
  image_url?: string;
  in_stock?: boolean;
  category?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  text?: string;
}

export interface Typography {
  heading_font: string;
  body_font: string;
}

export interface FeaturesConfig {
  contact_form?: boolean;
  booking?: boolean;
  reviews?: boolean;
  blog?: boolean;
  online_menu?: boolean;
  ecommerce?: boolean;
  chat?: boolean;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed?: boolean;
}

export interface SubscriptionFeatures {
  custom_domain?: boolean;
  analytics?: boolean;
  api_access?: boolean;
  priority_support?: boolean;
  white_label?: boolean;
  advanced_customization?: boolean;
  team_members?: number;
}

export interface Discrepancy {
  field: string;
  expected: any;
  actual: any;
  severity: 'low' | 'medium' | 'high';
}

export interface FeaturedBusinessInfo {
  name: string;
  address: string;
  category: string;
  phone?: string | null;
}

// ============================================================================
// DATABASE VIEWS
// ============================================================================

export interface BusinessWithWebsite extends Business {
  hero_title?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  template_type?: TemplateType | null;
  website_views?: number | null;
  website_published?: boolean | null;
}

export interface BusinessVerificationStatus {
  id: string;
  business_id: string;
  name: string;
  verified: boolean;
  last_verified_at?: string | null;
  data_quality_score: number;
  total_verifications: number;
  successful_verifications: number;
  last_verification_attempt?: string | null;
}

export interface BusinessAnalyticsSummary {
  business_id: string;
  name: string;
  unique_visitors: number;
  page_views: number;
  contact_form_submissions: number;
  phone_clicks: number;
  directions_clicks: number;
  last_activity?: string | null;
}

// ============================================================================
// HELPER TYPES FOR INSERTS/UPDATES
// ============================================================================

export type InsertBusiness = Omit<Business, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBusiness = Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>;

export type InsertGeneratedWebsite = Omit<GeneratedWebsite, 'id' | 'created_at' | 'updated_at'>;
export type UpdateGeneratedWebsite = Partial<Omit<GeneratedWebsite, 'id' | 'created_at' | 'updated_at'>>;

export type InsertSubscription = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSubscription = Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;

export type InsertAnalyticsEvent = Omit<AnalyticsEvent, 'id' | 'created_at'>;

export type InsertVerificationLog = Omit<VerificationLog, 'id' | 'created_at'>;

export type InsertInsight = Omit<Insight, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInsight = Partial<Omit<Insight, 'id' | 'created_at' | 'updated_at'>>;

export type InsertApiKey = Omit<ApiKey, 'id' | 'created_at' | 'updated_at'>;
export type UpdateApiKey = Partial<Omit<ApiKey, 'id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// QUERY RESULT TYPES
// ============================================================================

export interface BusinessQueryOptions {
  limit?: number;
  offset?: number;
  category?: string;
  status?: BusinessStatus;
  verified?: boolean;
  claimed?: boolean;
  search?: string;
  neighborhood?: string;
  minQualityScore?: number;
}

export interface DashboardStats {
  totalBusinesses: number;
  activeBusinesses: number;
  verifiedBusinesses: number;
  claimedBusinesses: number;
  avgQualityScore: number;
  newToday: number;
  websitesGenerated: number;
  totalPageViews: number;
  activeSubscriptions: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================================================
// FUNCTION RETURN TYPES
// ============================================================================

export interface BusinessStatsResult {
  total_businesses: number;
  active_businesses: number;
  verified_businesses: number;
  claimed_businesses: number;
  avg_quality_score: number;
}

export interface DatabaseHealth {
  healthy: boolean;
  responseTime: number;
}
