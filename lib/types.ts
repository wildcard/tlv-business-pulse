// Core business types
export interface Business {
  id: string;
  external_id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  status: string | null;
  opened_date: string | null;
  location: string | null;
  latitude?: number;
  longitude?: number;
  last_seen: string;
  is_active: boolean;
  raw_data: any;
  created_at: string;
  updated_at: string;
}

// Insight/Article types
export interface Insight {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  seo_description: string;
  featured_businesses: FeaturedBusiness[];
  tags: string[];
  category: 'trends' | 'guides' | 'analysis';
  published_at: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturedBusiness {
  name: string;
  address: string;
  category: string;
  phone: string | null;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  newThisWeek: number;
  closedThisWeek: number;
  topCategories: CategoryStat[];
  topNeighborhoods: NeighborhoodStat[];
  recentChanges: BusinessChange[];
  trends: Trend[];
}

export interface CategoryStat {
  category: string;
  count: number;
  percentChange: number;
}

export interface NeighborhoodStat {
  neighborhood: string;
  count: number;
  growth: number;
}

export interface BusinessChange {
  business: Business;
  changeType: 'opened' | 'closed' | 'updated';
  date: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  metric: number;
  metricLabel: string;
  trend: 'up' | 'down' | 'stable';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Filter types
export interface BusinessFilters {
  category?: string;
  neighborhood?: string;
  status?: 'active' | 'closed' | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InsightFilters {
  category?: 'trends' | 'guides' | 'analysis' | 'all';
  tag?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Subscription types
export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  apiRateLimit: number;
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  created_at: string;
  updated_at: string;
}

// Map types
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface BusinessMarker {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'closed';
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

// Rate limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

// Health check
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    api: ServiceHealth;
    cache: ServiceHealth;
  };
  version: string;
}

export interface ServiceHealth {
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}
