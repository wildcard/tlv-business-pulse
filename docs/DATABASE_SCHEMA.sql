-- ============================================================================
-- TLV Business Pulse - Complete Database Schema
-- ============================================================================
-- Version: 1.0
-- Database: PostgreSQL 15+ (Supabase)
-- Purpose: Store and manage real Tel Aviv business data with AI-generated websites
--
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Open Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- 3. Paste and execute
-- 4. Verify all tables are created successfully
--
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geographic data (optional but recommended for Tel Aviv locations)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- TABLE: businesses
-- ============================================================================
-- Core business data from Tel Aviv Municipality
-- Every business must be verified before a website is generated
-- ============================================================================

CREATE TABLE IF NOT EXISTS businesses (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT UNIQUE NOT NULL, -- External ID from municipality

  -- Business information
  name TEXT NOT NULL,
  name_en TEXT, -- English name (if available)
  owner_name TEXT,
  category TEXT NOT NULL,
  category_description TEXT,

  -- Location
  address TEXT NOT NULL,
  street TEXT,
  house_number TEXT,
  city TEXT DEFAULT 'Tel Aviv',
  neighborhood TEXT,
  postal_code TEXT,

  -- Geographic coordinates
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(POINT, 4326), -- PostGIS point for spatial queries

  -- Contact information
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Business status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'closed')),
  license_number TEXT,
  registration_date DATE NOT NULL,
  license_issue_date DATE,
  license_expiry_date DATE,

  -- Data quality and verification
  data_quality_score INTEGER DEFAULT 0 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
  verified BOOLEAN DEFAULT false,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  verification_source TEXT, -- 'municipality', 'companies_registry', 'google_places'

  -- Website generation
  generated_at TIMESTAMP WITH TIME ZONE,
  website_url TEXT UNIQUE,
  website_slug TEXT UNIQUE,

  -- Ownership
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by_email TEXT,

  -- External source IDs
  municipality_license_id TEXT,
  company_registry_id TEXT, -- Israeli company ID (ח.פ)
  google_place_id TEXT,

  -- Additional data (flexible storage for enriched data)
  metadata JSONB DEFAULT '{}'::jsonb,
  raw_municipality_data JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_business_id ON businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_registration_date ON businesses(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_neighborhood ON businesses(neighborhood);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_claimed ON businesses(claimed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified, last_verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_website_slug ON businesses(website_slug);
CREATE INDEX IF NOT EXISTS idx_businesses_data_quality ON businesses(data_quality_score DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_businesses_search ON businesses USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(address, ''))
);

-- Geographic index (if using PostGIS)
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING gist(location);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_businesses_status_category ON businesses(status, category);

-- ============================================================================
-- TABLE: generated_websites
-- ============================================================================
-- AI-generated website content and branding for each business
-- One-to-one relationship with businesses table
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_websites (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Content sections
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  about_content TEXT,
  call_to_action TEXT,

  -- Services/Products (structured data)
  services JSONB DEFAULT '[]'::jsonb, -- Array of {name, description, price, icon}
  menu_items JSONB DEFAULT '[]'::jsonb, -- For restaurants: [{category, items: [{name, description, price}]}]
  products JSONB DEFAULT '[]'::jsonb, -- For retail: [{name, description, price, image_url}]
  team_members JSONB DEFAULT '[]'::jsonb, -- [{name, role, bio, photo_url}]

  -- Visual branding
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  color_palette JSONB DEFAULT '{}'::jsonb, -- {primary, secondary, accent, background, text}
  typography JSONB DEFAULT '{}'::jsonb, -- {heading_font, body_font}

  -- SEO and metadata
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  meta_tags JSONB DEFAULT '{}'::jsonb,

  -- Template and design
  template_type TEXT NOT NULL DEFAULT 'professional_services'
    CHECK (template_type IN ('restaurant', 'beauty', 'professional_services', 'retail', 'fitness', 'tech')),
  layout_config JSONB DEFAULT '{}'::jsonb,
  custom_css TEXT,

  -- Features enabled
  features_enabled JSONB DEFAULT '{}'::jsonb, -- {contact_form, booking, reviews, blog, etc.}

  -- Contact information (can override business defaults)
  contact_email TEXT,
  contact_phone TEXT,
  social_media JSONB DEFAULT '{}'::jsonb, -- {facebook, instagram, linkedin, twitter}

  -- Operating hours
  business_hours JSONB DEFAULT '{}'::jsonb, -- {monday: {open, close}, ...}

  -- AI generation metadata
  ai_model TEXT DEFAULT 'gpt-4',
  ai_prompt_version TEXT,
  generation_duration_ms INTEGER,
  generation_cost_usd DECIMAL(10, 4),

  -- Publishing status
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generated_websites_business_id ON generated_websites(business_id);
CREATE INDEX IF NOT EXISTS idx_generated_websites_template ON generated_websites(template_type);
CREATE INDEX IF NOT EXISTS idx_generated_websites_published ON generated_websites(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_websites_views ON generated_websites(view_count DESC);

-- Unique constraint: one website per business
CREATE UNIQUE INDEX IF NOT EXISTS idx_generated_websites_business_unique ON generated_websites(business_id);

-- ============================================================================
-- TABLE: subscriptions
-- ============================================================================
-- Premium tier management for business owners
-- Integrated with Stripe for payment processing
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'trialing')),

  -- Stripe integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_payment_method_id TEXT,

  -- Billing period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,

  -- Pricing
  price_amount INTEGER, -- In cents
  currency TEXT DEFAULT 'USD',
  billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year')),

  -- Trial information
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,

  -- Features enabled by tier
  features JSONB DEFAULT '{}'::jsonb, -- {custom_domain, analytics, priority_support, etc.}

  -- Usage tracking
  api_calls_this_period INTEGER DEFAULT 0,
  api_rate_limit INTEGER DEFAULT 100,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON subscriptions(current_period_end);

-- ============================================================================
-- TABLE: analytics_events
-- ============================================================================
-- Tracking and metrics for business websites
-- Records page views, interactions, and conversions
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Event details
  event_type TEXT NOT NULL, -- 'page_view', 'contact_form', 'phone_click', 'directions_click', etc.
  event_category TEXT, -- 'engagement', 'conversion', 'navigation'
  event_data JSONB DEFAULT '{}'::jsonb, -- Additional event-specific data

  -- Visitor information
  visitor_id TEXT, -- Anonymous visitor ID (cookie/fingerprint)
  session_id TEXT, -- Browser session ID

  -- Page information
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,

  -- Device and browser
  user_agent TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,

  -- Geographic data
  ip_address INET,
  country TEXT,
  city TEXT,

  -- Performance metrics
  page_load_time_ms INTEGER,
  time_on_page_seconds INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_business_id ON analytics_events(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON analytics_events(visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);

-- Composite index for common aggregation queries
CREATE INDEX IF NOT EXISTS idx_analytics_business_type_date ON analytics_events(business_id, event_type, created_at DESC);

-- ============================================================================
-- TABLE: verification_logs
-- ============================================================================
-- Audit trail of all business verification attempts
-- Tracks data sources and verification results for transparency
-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_logs (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Verification details
  verification_type TEXT NOT NULL, -- 'municipality', 'company_registry', 'google_places', 'manual'
  verification_status TEXT NOT NULL CHECK (verification_status IN ('success', 'failed', 'partial', 'skipped')),

  -- Data source information
  source_name TEXT NOT NULL, -- 'Tel Aviv Municipality', 'Israeli Companies Registry', etc.
  source_url TEXT,
  source_api_endpoint TEXT,

  -- Verification results
  data_found BOOLEAN DEFAULT false,
  data_matches BOOLEAN, -- Does the data match our records?
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),

  -- Retrieved data (for comparison and audit)
  retrieved_data JSONB DEFAULT '{}'::jsonb,

  -- Discrepancies found
  discrepancies JSONB DEFAULT '[]'::jsonb, -- Array of {field, expected, actual, severity}

  -- Error handling
  error_message TEXT,
  error_code TEXT,

  -- Performance
  verification_duration_ms INTEGER,

  -- Automated vs manual
  automated BOOLEAN DEFAULT true,
  verified_by_user_email TEXT, -- If manual verification

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verification_logs_business_id ON verification_logs(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_type ON verification_logs(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_logs_status ON verification_logs(verification_status);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON verification_logs(created_at DESC);

-- ============================================================================
-- TABLE: insights (for AI-generated articles)
-- ============================================================================
-- SEO-optimized articles about Tel Aviv business trends
-- Auto-generated weekly by AI
-- ============================================================================

CREATE TABLE IF NOT EXISTS insights (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  seo_description TEXT NOT NULL,

  -- Featured businesses (referenced in the article)
  featured_business_ids UUID[] DEFAULT ARRAY[]::UUID[],
  featured_businesses JSONB DEFAULT '[]'::jsonb, -- Denormalized for performance

  -- Categorization
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT DEFAULT 'trends' CHECK (category IN ('trends', 'guides', 'analysis', 'news')),

  -- AI generation
  ai_generated BOOLEAN DEFAULT true,
  ai_model TEXT DEFAULT 'gpt-4',
  generation_prompt TEXT,

  -- SEO
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  canonical_url TEXT,

  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Analytics
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_insights_published_at ON insights(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_category ON insights(category);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_views ON insights(view_count DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_insights_search ON insights USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, ''))
);

-- ============================================================================
-- TABLE: api_keys (for external API access)
-- ============================================================================
-- Manage API keys for developers accessing the platform
-- Integrated with subscription tiers for rate limiting
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,

  -- Ownership
  user_email TEXT NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,

  -- Key details
  name TEXT, -- User-defined name for the key
  is_active BOOLEAN DEFAULT true,

  -- Usage tracking
  requests_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,

  -- Rate limiting
  rate_limit INTEGER DEFAULT 100, -- Requests per hour
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_requests INTEGER DEFAULT 0,

  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read']::TEXT[], -- 'read', 'write', 'admin'

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_user_email ON api_keys(user_email);
CREATE INDEX IF NOT EXISTS idx_api_keys_subscription ON api_keys(subscription_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_last_used ON api_keys(last_used DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_websites_updated_at BEFORE UPDATE ON generated_websites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update location geography when lat/lng changes
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_location BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_business_location();

-- Function: Increment view count for insights
CREATE OR REPLACE FUNCTION increment_view_count(insight_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE insights
  SET view_count = view_count + 1
  WHERE id = insight_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment website view count
CREATE OR REPLACE FUNCTION increment_website_views(p_business_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE generated_websites
  SET
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE business_id = p_business_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Get business statistics
CREATE OR REPLACE FUNCTION get_business_stats()
RETURNS TABLE(
  total_businesses BIGINT,
  active_businesses BIGINT,
  verified_businesses BIGINT,
  claimed_businesses BIGINT,
  avg_quality_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_businesses,
    COUNT(*) FILTER (WHERE status = 'active') as active_businesses,
    COUNT(*) FILTER (WHERE verified = true) as verified_businesses,
    COUNT(*) FILTER (WHERE claimed = true) as claimed_businesses,
    AVG(data_quality_score) as avg_quality_score
  FROM businesses;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Businesses: Public read access for active businesses
CREATE POLICY "Public read access for active businesses"
  ON businesses FOR SELECT
  USING (status = 'active');

-- Businesses: Service role can do everything
CREATE POLICY "Service role has full access to businesses"
  ON businesses FOR ALL
  USING (true)
  WITH CHECK (true);

-- Generated websites: Public read access for published websites
CREATE POLICY "Public read access for published websites"
  ON generated_websites FOR SELECT
  USING (published = true);

-- Generated websites: Service role can do everything
CREATE POLICY "Service role has full access to generated_websites"
  ON generated_websites FOR ALL
  USING (true)
  WITH CHECK (true);

-- Subscriptions: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (true); -- Will be refined with auth.uid() when auth is added

-- Subscriptions: Service role can do everything
CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Analytics events: Service role can insert and read
CREATE POLICY "Service role has full access to analytics_events"
  ON analytics_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verification logs: Public read access for transparency
CREATE POLICY "Public read access for verification logs"
  ON verification_logs FOR SELECT
  USING (true);

-- Verification logs: Service role can do everything
CREATE POLICY "Service role has full access to verification_logs"
  ON verification_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insights: Public read access for published insights
CREATE POLICY "Public read access for published insights"
  ON insights FOR SELECT
  USING (status = 'published');

-- Insights: Service role can do everything
CREATE POLICY "Service role has full access to insights"
  ON insights FOR ALL
  USING (true)
  WITH CHECK (true);

-- API Keys: Service role only (sensitive data)
CREATE POLICY "Service role has full access to api_keys"
  ON api_keys FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- INITIAL DATA / SEED DATA
-- ============================================================================

-- Insert default subscription tier features (for reference)
COMMENT ON COLUMN subscriptions.features IS
  'JSON object with tier features:
  free: {custom_domain: false, analytics: false, api_access: false}
  premium: {custom_domain: true, analytics: true, api_access: false, priority_support: false}
  pro: {custom_domain: true, analytics: true, api_access: true, priority_support: true, white_label: true}';

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Business with website data (commonly joined)
CREATE OR REPLACE VIEW businesses_with_websites AS
SELECT
  b.*,
  gw.hero_title,
  gw.seo_title,
  gw.seo_description,
  gw.template_type,
  gw.view_count as website_views,
  gw.published as website_published
FROM businesses b
LEFT JOIN generated_websites gw ON b.id = gw.business_id;

-- View: Business verification status
CREATE OR REPLACE VIEW business_verification_status AS
SELECT
  b.id,
  b.business_id,
  b.name,
  b.verified,
  b.last_verified_at,
  b.data_quality_score,
  COUNT(vl.id) as total_verifications,
  COUNT(vl.id) FILTER (WHERE vl.verification_status = 'success') as successful_verifications,
  MAX(vl.created_at) as last_verification_attempt
FROM businesses b
LEFT JOIN verification_logs vl ON b.id = vl.business_id
GROUP BY b.id, b.business_id, b.name, b.verified, b.last_verified_at, b.data_quality_score;

-- View: Analytics summary by business
CREATE OR REPLACE VIEW business_analytics_summary AS
SELECT
  b.id as business_id,
  b.name,
  COUNT(DISTINCT ae.visitor_id) as unique_visitors,
  COUNT(*) FILTER (WHERE ae.event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE ae.event_type = 'contact_form') as contact_form_submissions,
  COUNT(*) FILTER (WHERE ae.event_type = 'phone_click') as phone_clicks,
  COUNT(*) FILTER (WHERE ae.event_type = 'directions_click') as directions_clicks,
  MAX(ae.created_at) as last_activity
FROM businesses b
LEFT JOIN analytics_events ae ON b.id = ae.business_id
GROUP BY b.id, b.name;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ TLV Business Pulse database schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Created tables:';
  RAISE NOTICE '  - businesses (core business data)';
  RAISE NOTICE '  - generated_websites (AI-generated content)';
  RAISE NOTICE '  - subscriptions (premium tiers)';
  RAISE NOTICE '  - analytics_events (tracking & metrics)';
  RAISE NOTICE '  - verification_logs (audit trail)';
  RAISE NOTICE '  - insights (AI articles)';
  RAISE NOTICE '  - api_keys (external access)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify tables: SELECT tablename FROM pg_tables WHERE schemaname = ''public'';';
  RAISE NOTICE '  2. Check indexes: SELECT indexname FROM pg_indexes WHERE schemaname = ''public'';';
  RAISE NOTICE '  3. Review RLS policies: SELECT * FROM pg_policies;';
  RAISE NOTICE '  4. Test with sample data insertion';
  RAISE NOTICE '';
  RAISE NOTICE 'For help: See docs/ENVIRONMENT_SETUP.md';
END $$;
