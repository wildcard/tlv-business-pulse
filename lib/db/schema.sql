-- TLV Business Pulse Database Schema
-- This schema supports the autonomous business directory

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Businesses table (main data)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  phone TEXT,
  status TEXT,
  opened_date TEXT,
  location GEOGRAPHY(POINT, 4326),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insights table (AI-generated articles)
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (API access)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  api_key TEXT UNIQUE,
  api_calls_limit INTEGER DEFAULT 100,
  api_calls_used INTEGER DEFAULT 0,
  api_calls_reset_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  requests_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Metrics table (for dashboard)
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  businesses_total INTEGER DEFAULT 0,
  businesses_new INTEGER DEFAULT 0,
  businesses_closed INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health checks table
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  insight_id UUID REFERENCES insights(id),
  posted_at TIMESTAMP WITH TIME ZONE,
  post_id TEXT,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_businesses_external_id ON businesses(external_id);

CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_insights_published_at ON insights(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_category ON insights(category);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_subscription ON api_keys(subscription_id);

CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date DESC);

CREATE INDEX IF NOT EXISTS idx_health_checks_service ON health_checks(service);
CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON health_checks(checked_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access for businesses and insights
CREATE POLICY "Businesses are viewable by everyone" ON businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Insights are viewable by everyone" ON insights
  FOR SELECT USING (true);

-- Only authenticated users can modify
CREATE POLICY "Only service can insert businesses" ON businesses
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service can update businesses" ON businesses
  FOR UPDATE USING (auth.role() = 'service_role');

-- Insert initial metrics row
INSERT INTO metrics (date, businesses_total) 
VALUES (CURRENT_DATE, 0)
ON CONFLICT (date) DO NOTHING;
