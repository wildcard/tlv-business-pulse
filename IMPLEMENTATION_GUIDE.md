# TLV Business Pulse - Implementation Guide

**Version**: 2.0
**Last Updated**: November 2025
**Target Audience**: Developers, Technical Contributors

This guide provides step-by-step instructions to implement the full TLV Business Pulse platform, from MVP to production.

---

## Table of Contents

1. [Quick Start (15 Minutes)](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: MVP Implementation](#phase-1-mvp-implementation)
4. [Phase 2: AI Integration](#phase-2-ai-integration)
5. [Phase 3: Automation](#phase-3-automation)
6. [Phase 4: Monetization](#phase-4-monetization)
7. [Deployment](#deployment)
8. [Testing Strategy](#testing-strategy)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### See It Working Now

```bash
# 1. Clone the repository
git clone https://github.com/wildcard/tlv-business-pulse.git
cd tlv-business-pulse

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys (see below)

# 4. Run development server
npm run dev

# 5. Visit demo page
open http://localhost:3000/demo

# 6. See live generated website
open http://localhost:3000/business/sabich-king
```

**You should now see**:
- ✅ Demo showcase page with 6 example businesses
- ✅ Working "Sabich King" restaurant website
- ✅ AI-generated content, menu, branding
- ✅ Mobile-responsive design

---

## Architecture Overview

### High-Level System Design

```
┌────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SYSTEMS                            │
├────────────────────────────────────────────────────────────────┤
│ Tel Aviv Municipality API  │  OpenAI GPT-4  │  Google Maps    │
└────────────────┬────────────┴────────┬───────┴────────┬────────┘
                 │                     │                 │
                 │ (1) New             │ (2) Generate    │ (3) Enrich
                 │  Business           │  Content        │  Data
                 │                     │                 │
                 ▼                     ▼                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    TLV BUSINESS PULSE PLATFORM                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│
│  │  Data Ingestion  │→ │  AI Generation   │→ │  Deployment  ││
│  │  Pipeline        │  │  Engine          │  │  Engine      ││
│  └──────────────────┘  └──────────────────┘  └──────────────┘│
│           │                     │                     │        │
│           ▼                     ▼                     ▼        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│
│  │  Supabase DB     │  │  Content Store   │  │  Vercel Edge ││
│  │  (PostgreSQL)    │  │  (S3/Storage)    │  │  (CDN)       ││
│  └──────────────────┘  └──────────────────┘  └──────────────┘│
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                 │                     │                 │
                 │ (4) Notify          │ (5) Track       │ (6) Serve
                 │  Owner              │  Analytics      │  Website
                 │                     │                 │
                 ▼                     ▼                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      BUSINESS OWNERS & VISITORS                 │
├────────────────────────────────────────────────────────────────┤
│  Email/SMS         │  Owner Dashboard  │  Public Websites      │
│  Notifications     │  Customization    │  businessname.tlv..  │
└────────────────────────────────────────────────────────────────┘
```

### Tech Stack Summary

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Next.js 14 + React | SSR, SEO, performance |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Backend** | Next.js API Routes | Serverless, scalable |
| **Database** | Supabase (PostgreSQL) | Real-time, auth, easy |
| **AI** | OpenAI GPT-4 | Best content generation |
| **Hosting** | Vercel | Edge network, auto-scale |
| **Automation** | GitHub Actions | Free CI/CD, scheduling |
| **Email** | SendGrid / Resend | Reliable delivery |
| **SMS** | Twilio | Global coverage |
| **Payments** | Stripe | Standard for SaaS |
| **Analytics** | Vercel Analytics | Built-in, fast |

---

## Phase 1: MVP Implementation

**Goal**: Generate basic websites automatically
**Timeline**: 2 weeks
**Features**: 5 templates, basic AI, subdomain deployment

### Step 1.1: Database Setup

**Create Supabase Tables**:

```sql
-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  owner_name TEXT,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Tel Aviv',
  phone TEXT,
  email TEXT,
  website TEXT,
  registration_date DATE NOT NULL,
  status TEXT DEFAULT 'active',

  -- Generated content
  generated_at TIMESTAMP WITH TIME ZONE,
  website_url TEXT UNIQUE,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated websites table
CREATE TABLE generated_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- AI-generated content
  hero_title TEXT,
  hero_subtitle TEXT,
  about_content TEXT,
  services JSONB,
  menu_items JSONB,

  -- Branding
  logo_url TEXT,
  color_palette JSONB,
  typography JSONB,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[],

  -- Template
  template_type TEXT DEFAULT 'professional_services',

  -- Status
  published BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  visitor_id TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_businesses_registration ON businesses(registration_date DESC);
CREATE INDEX idx_businesses_claimed ON businesses(claimed, created_at DESC);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_websites_business ON generated_websites(business_id);
CREATE INDEX idx_analytics_business ON analytics_events(business_id, created_at DESC);
CREATE INDEX idx_analytics_type ON analytics_events(event_type, created_at DESC);
```

### Step 1.2: AI Generation Service

**File**: `lib/ai/generate.ts` (already created)

**Key Functions**:
- `generateWebsite()` - Generates full website content
- `generateBusinessIntelligence()` - Creates growth recommendations
- `enrichBusinessData()` - Fetches additional data
- `generateWelcomeEmail()` - Creates personalized emails
- `generateMenuItems()` - For restaurants
- `generateServices()` - For service businesses

**Test It**:

```typescript
// test/ai-generation.test.ts
import { generateWebsite } from '@/lib/ai/generate';

const testBusiness = {
  name: 'Test Cafe',
  category: 'Coffee Shop',
  address: '123 Test Street, Tel Aviv',
  registration_date: '2024-11-15',
};

const result = await generateWebsite(testBusiness);

console.log('Generated Website:', result);
// Should output: heroTitle, aboutContent, services, etc.
```

### Step 1.3: Template System

**Already Implemented**:
- Restaurant template: `lib/templates/restaurant.tsx`

**To Implement** (5 more templates):

1. **Beauty/Salon** (`lib/templates/beauty.tsx`):
```typescript
export function BeautyTemplate({ business, generated, services }) {
  return (
    <div>
      {/* Hero with booking CTA */}
      {/* Services & Pricing */}
      {/* Team profiles */}
      {/* Online booking widget */}
      {/* Gallery */}
      {/* Contact */}
    </div>
  );
}
```

2. **Professional Services** (`lib/templates/professional.tsx`):
- B2B focused
- Consultation booking
- Case studies
- LinkedIn integration

3. **Retail** (`lib/templates/retail.tsx`):
- Product showcase
- Store hours
- Directions
- Newsletter signup

4. **Fitness** (`lib/templates/fitness.tsx`):
- Class schedule
- Membership options
- Instructor profiles
- Online booking

5. **Tech/Startup** (`lib/templates/tech.tsx`):
- Product demo
- Team page
- Blog section
- Career opportunities

**Template Registry**:

```typescript
// lib/templates/index.ts
import { RestaurantTemplate } from './restaurant';
import { BeautyTemplate } from './beauty';
import { ProfessionalTemplate } from './professional';
// ... import others

export const TEMPLATES = {
  restaurant: RestaurantTemplate,
  beauty: BeautyTemplate,
  professional_services: ProfessionalTemplate,
  retail: RetailTemplate,
  fitness: FitnessTemplate,
  tech: TechTemplate,
};

export function getTemplate(templateType: string) {
  return TEMPLATES[templateType] || TEMPLATES.professional_services;
}
```

### Step 1.4: Website Generation Pipeline

**Create**: `lib/generation/pipeline.ts`

```typescript
import { generateWebsite } from '@/lib/ai/generate';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function generateBusinessWebsite(businessData: any) {
  try {
    console.log('[Pipeline] Starting generation for:', businessData.name);

    // 1. Generate website content with AI
    console.log('[Pipeline] Calling AI generation...');
    const generated = await generateWebsite(businessData);

    // 2. Create slug for subdomain
    const slug = businessData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const websiteUrl = `https://${slug}.tlvpulse.com`;

    // 3. Save business to database
    console.log('[Pipeline] Saving to database...');
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .insert({
        business_id: businessData.business_id || `BIZ-${Date.now()}`,
        name: businessData.name,
        owner_name: businessData.owner,
        category: businessData.category,
        address: businessData.address,
        registration_date: businessData.registration_date,
        generated_at: new Date().toISOString(),
        website_url: websiteUrl,
      })
      .select()
      .single();

    if (bizError) throw bizError;

    // 4. Save generated website
    const { error: websiteError } = await supabase
      .from('generated_websites')
      .insert({
        business_id: business.id,
        hero_title: generated.heroTitle,
        hero_subtitle: generated.heroSubtitle,
        about_content: generated.aboutContent,
        services: generated.services,
        menu_items: generated.menu || [],
        color_palette: generated.colorPalette,
        typography: generated.typography,
        seo_title: generated.seoTitle,
        seo_description: generated.seoDescription,
        keywords: generated.keywords,
        template_type: generated.templateType,
      });

    if (websiteError) throw websiteError;

    console.log('[Pipeline] ✅ Website generated:', websiteUrl);

    return {
      success: true,
      business,
      websiteUrl,
      generated,
    };
  } catch (error) {
    console.error('[Pipeline] ❌ Error:', error);
    throw error;
  }
}
```

**Test Pipeline**:

```typescript
// scripts/test-generation.ts
import { generateBusinessWebsite } from '@/lib/generation/pipeline';

const testBusiness = {
  business_id: 'TEST-001',
  name: 'Sabich King',
  owner: 'Yossi Cohen',
  category: 'Fast Food Restaurant',
  address: '23 Herzl Street, Florentin, Tel Aviv',
  registration_date: '2024-11-15',
};

async function test() {
  const result = await generateBusinessWebsite(testBusiness);
  console.log('Success!', result);
}

test();
```

Run with:
```bash
npx tsx scripts/test-generation.ts
```

### Step 1.5: Dynamic Business Pages

**Already Implemented**: `app/business/[slug]/page.tsx`

**Make it Dynamic** (read from database):

```typescript
// app/business/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { getTemplate } from '@/lib/templates';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  // 1. Fetch business by slug (from website_url)
  const { data: business } = await supabase
    .from('businesses')
    .select('*, generated_websites(*)')
    .ilike('website_url', `%${params.slug}%`)
    .single();

  if (!business) {
    notFound();
  }

  // 2. Get the appropriate template
  const Template = getTemplate(business.generated_websites.template_type);

  // 3. Render template with data
  return (
    <Template
      business={{
        name: business.name,
        address: business.address,
        phone: business.phone,
        email: business.email,
      }}
      generated={business.generated_websites}
      menu={business.generated_websites.menu_items}
    />
  );
}
```

**Vercel Configuration for Wildcard Subdomains**:

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/:slug*",
      "destination": "/business/:slug*",
      "has": [
        {
          "type": "host",
          "value": "(?<slug>.*)\\.tlvpulse\\.com"
        }
      ]
    }
  ]
}
```

---

## Phase 2: AI Integration

**Goal**: Smart content generation and data enrichment
**Timeline**: 2 weeks

### Step 2.1: Enhanced AI Prompts

**Improve Content Quality**:

```typescript
// lib/ai/prompts.ts
export const WEBSITE_GENERATION_PROMPT = `You are an expert web designer and copywriter for small businesses.

Business Details:
- Name: {name}
- Category: {category}
- Location: {location}

Your Task:
Create compelling, professional website content that:
1. Captures the business's unique value proposition
2. Is optimized for local SEO (Tel Aviv/Israel context)
3. Uses persuasive copywriting techniques
4. Matches industry best practices for {category}
5. Is culturally appropriate for Israeli market

Generate in JSON format:
{
  "heroTitle": "Compelling 6-8 word headline",
  "heroSubtitle": "Engaging 12-15 word subtitle",
  "aboutContent": "3 paragraphs (150-250 words total) telling the business story",
  "services": [
    {
      "name": "Service name",
      "description": "30-50 word description",
      "price": "Realistic price in ₪ or 'Contact for quote'"
    }
  ],
  "seoTitle": "60 char SEO-optimized title",
  "seoDescription": "160 char meta description",
  "keywords": ["keyword1", "keyword2", ...],
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex"
  },
  "typography": {
    "heading": "Google Font name",
    "body": "Google Font name"
  },
  "templateType": "restaurant|beauty|professional_services|retail|fitness|tech"
}

IMPORTANT:
- Use Hebrew/English mix when appropriate
- Include local Tel Aviv references
- Match pricing to Israeli market
- Consider target demographic`;
```

### Step 2.2: Data Enrichment

**Google Places API Integration**:

```typescript
// lib/enrichment/google-places.ts
import axios from 'axios';

export async function enrichFromGooglePlaces(businessName: string, address: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    // 1. Search for the place
    const searchUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
    const searchResponse = await axios.get(searchUrl, {
      params: {
        input: `${businessName} ${address}`,
        inputtype: 'textquery',
        fields: 'place_id,name,formatted_address,rating,user_ratings_total',
        key: apiKey,
      },
    });

    if (searchResponse.data.candidates.length === 0) {
      return null;
    }

    const placeId = searchResponse.data.candidates[0].place_id;

    // 2. Get detailed info
    const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const detailsResponse = await axios.get(detailsUrl, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_phone_number,website,rating,user_ratings_total,photos,reviews,opening_hours',
        key: apiKey,
      },
    });

    const details = detailsResponse.data.result;

    return {
      phone: details.formatted_phone_number,
      website: details.website,
      rating: details.rating,
      reviewCount: details.user_ratings_total,
      photos: details.photos?.map((p: any) => p.photo_reference) || [],
      hours: details.opening_hours?.weekday_text || [],
      reviews: details.reviews || [],
    };
  } catch (error) {
    console.error('Google Places enrichment failed:', error);
    return null;
  }
}
```

**Social Media Discovery**:

```typescript
// lib/enrichment/social-media.ts
export async function findSocialProfiles(businessName: string) {
  // Simple approach: construct likely URLs and check if they exist
  const slug = businessName.toLowerCase().replace(/\s+/g, '');

  const potentialUrls = {
    facebook: `https://facebook.com/${slug}`,
    instagram: `https://instagram.com/${slug}`,
    linkedin: `https://linkedin.com/company/${slug}`,
  };

  // In production, use actual API calls to verify
  // For MVP, return potential URLs
  return potentialUrls;
}
```

### Step 2.3: Competitive Analysis

```typescript
// lib/intelligence/competitive-analysis.ts
import { createClient } from '@supabase/supabase-js';

export async function analyzeCompetition(business: any) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 1. Find competitors (same category, nearby)
  const { data: competitors } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', business.category)
    .eq('city', business.city)
    .neq('id', business.id)
    .limit(20);

  // 2. Analyze market position
  const analysis = {
    competitorCount: competitors?.length || 0,
    avgAge: calculateAvgAge(competitors),
    marketSaturation: competitors.length > 10 ? 'high' : competitors.length > 5 ? 'medium' : 'low',
    opportunities: [],
    threats: [],
  };

  // 3. Identify opportunities
  if (analysis.competitorCount < 5) {
    analysis.opportunities.push('Low competition - early market entrant advantage');
  }

  // 4. Use AI for deeper analysis
  const aiAnalysis = await generateBusinessIntelligence(business, competitors);

  return {
    ...analysis,
    ...aiAnalysis,
  };
}
```

---

## Phase 3: Automation

**Goal**: Fully autonomous operation
**Timeline**: 1 week

### Step 3.1: Business Detection Workflow

**GitHub Actions**: `.github/workflows/detect-new-businesses.yml`

```yaml
name: Detect New Businesses

on:
  schedule:
    # Run every 15 minutes
    - cron: '*/15 * * * *'
  workflow_dispatch:

jobs:
  detect-and-generate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Detect new businesses
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          TEL_AVIV_API_KEY: ${{ secrets.TEL_AVIV_API_KEY }}
        run: |
          npx tsx scripts/detect-new-businesses.ts
```

**Detection Script**: `scripts/detect-new-businesses.ts`

```typescript
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { generateBusinessWebsite } from '@/lib/generation/pipeline';
import { sendWelcomeEmail } from '@/lib/notifications/email';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function detectNewBusinesses() {
  console.log('[Detect] Starting detection cycle...');

  try {
    // 1. Fetch new registrations from Tel Aviv API
    const response = await axios.get(
      'https://data.tel-aviv.gov.il/api/v1/business-registrations',
      {
        headers: {
          'Authorization': `Bearer ${process.env.TEL_AVIV_API_KEY}`,
        },
        params: {
          from_date: getYesterday(),
          to_date: getToday(),
        },
      }
    );

    const newBusinesses = response.data.registrations;
    console.log(`[Detect] Found ${newBusinesses.length} new registrations`);

    // 2. Check which ones we haven't processed
    const { data: existing } = await supabase
      .from('businesses')
      .select('business_id')
      .in('business_id', newBusinesses.map((b: any) => b.id));

    const existingIds = new Set(existing?.map(b => b.business_id) || []);
    const toProcess = newBusinesses.filter((b: any) => !existingIds.has(b.id));

    console.log(`[Detect] ${toProcess.length} new businesses to process`);

    // 3. Process each new business
    for (const bizData of toProcess) {
      try {
        console.log(`[Detect] Processing: ${bizData.name}`);

        // Generate website
        const result = await generateBusinessWebsite({
          business_id: bizData.id,
          name: bizData.name,
          owner: bizData.owner_name,
          category: bizData.category,
          address: bizData.address,
          registration_date: bizData.registration_date,
          phone: bizData.phone,
          email: bizData.email,
        });

        // Send welcome email
        if (bizData.email) {
          await sendWelcomeEmail({
            to: bizData.email,
            businessName: bizData.name,
            ownerName: bizData.owner_name,
            websiteUrl: result.websiteUrl,
          });
        }

        console.log(`[Detect] ✅ Success: ${bizData.name}`);
      } catch (error) {
        console.error(`[Detect] ❌ Failed: ${bizData.name}`, error);
        // Continue processing others
      }
    }

    console.log('[Detect] Detection cycle complete');
  } catch (error) {
    console.error('[Detect] Fatal error:', error);
    process.exit(1);
  }
}

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

detectNewBusinesses();
```

### Step 3.2: Notification System

**Email Service**: `lib/notifications/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({
  to,
  businessName,
  ownerName,
  websiteUrl,
}: {
  to: string;
  businessName: string;
  ownerName: string;
  websiteUrl: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'TLV Business Pulse <hello@tlvpulse.com>',
    to,
    subject: `🎉 Congrats on opening ${businessName}! Your website is ready`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .feature { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations, ${ownerName}!</h1>
            <p>Your business website is ready</p>
          </div>
          <div class="content">
            <p>Great news! We've created a professional website for <strong>${businessName}</strong> - completely free.</p>

            <p style="text-align: center;">
              <a href="${websiteUrl}" class="button">View Your Website →</a>
            </p>

            <div class="features">
              <h3>What's included:</h3>
              <div class="feature">✓ Professional design tailored to your industry</div>
              <div class="feature">✓ Mobile responsive (looks great on all devices)</div>
              <div class="feature">✓ Google Maps integration</div>
              <div class="feature">✓ Contact forms</div>
              <div class="feature">✓ Analytics dashboard</div>
              <div class="feature">✓ SEO optimized</div>
            </div>

            <h3>Next Steps:</h3>
            <ol>
              <li>Click the button above to view your site</li>
              <li>Click "Claim Website" to get full access</li>
              <li>Add your photos and customize (takes 5 minutes)</li>
              <li>Share with your customers!</li>
            </ol>

            <p>Welcome to the Tel Aviv business community!</p>

            <p>Best regards,<br>
            The TLV Business Pulse Team</p>

            <hr style="margin: 30px 0;">

            <p style="font-size: 12px; color: #666;">
              Your website: <a href="${websiteUrl}">${websiteUrl}</a><br>
              Questions? Reply to this email or visit our help center.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Email send failed:', error);
    throw error;
  }

  return data;
}
```

**SMS Service**: `lib/notifications/sms.ts`

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWelcomeSMS({
  to,
  businessName,
  websiteUrl,
}: {
  to: string;
  businessName: string;
  websiteUrl: string;
}) {
  try {
    const message = await client.messages.create({
      body: `🎉 Congrats! Tel Aviv welcomes ${businessName}. We created a free website for you: ${websiteUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return message;
  } catch (error) {
    console.error('SMS send failed:', error);
    throw error;
  }
}
```

---

## Phase 4: Monetization

**Goal**: Premium features and revenue generation
**Timeline**: 2 weeks

### Step 4.1: Pricing Tiers

**Database Schema**:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),

  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 4.2: Stripe Integration

**Stripe Checkout**: `app/api/stripe/create-checkout/route.ts`

```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { businessId, tier, returnUrl } = await req.json();

    const prices = {
      premium: 'price_premium_monthly',  // Create in Stripe dashboard
      pro: 'price_pro_monthly',
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[tier as keyof typeof prices],
          quantity: 1,
        },
      ],
      metadata: {
        businessId,
        tier,
      },
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}
```

**Stripe Webhooks**: `app/api/stripe/webhook/route.ts`

```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.businessId;
        const tier = session.metadata?.tier;

        // Create subscription record
        await supabase.from('subscriptions').insert({
          business_id: businessId,
          tier,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Mark as cancelled
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    );
  }
}
```

---

## Deployment

### Production Deployment Checklist

- [ ] 1. **Environment Variables Set**:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `OPENAI_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `RESEND_API_KEY` (or SendGrid)
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`

- [ ] 2. **Database Setup**:
  - Tables created in Supabase
  - Indexes created
  - RLS policies configured

- [ ] 3. **GitHub Actions**:
  - Secrets configured
  - Workflows enabled
  - Test run successful

- [ ] 4. **Vercel**:
  - Domain configured (tlvpulse.com)
  - Wildcard subdomain support
  - Environment variables synced
  - Edge functions enabled

- [ ] 5. **Stripe**:
  - Products created
  - Prices configured
  - Webhook endpoint added
  - Test mode transactions successful

- [ ] 6. **Monitoring**:
  - Vercel Analytics enabled
  - Error tracking (Sentry)
  - Uptime monitoring (UptimeRobot)

### Deploy Commands

```bash
# 1. Build locally first
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Test production
curl https://tlvpulse.com/api/health

# 4. Trigger first detection
gh workflow run detect-new-businesses.yml
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/ai-generation.test.ts
import { generateWebsite } from '@/lib/ai/generate';

describe('AI Generation', () => {
  it('generates valid website content', async () => {
    const result = await generateWebsite({
      name: 'Test Business',
      category: 'Restaurant',
      address: 'Test St, Tel Aviv',
      registration_date: '2024-01-01',
    });

    expect(result.heroTitle).toBeDefined();
    expect(result.heroTitle.length).toBeLessThan(60);
    expect(result.seoDescription.length).toBeLessThan(160);
  });
});
```

### Integration Tests

```typescript
// __tests__/e2e/generation-pipeline.test.ts
import { generateBusinessWebsite } from '@/lib/generation/pipeline';

describe('Generation Pipeline E2E', () => {
  it('creates business website end-to-end', async () => {
    const result = await generateBusinessWebsite({
      business_id: 'TEST-E2E-001',
      name: 'E2E Test Cafe',
      category: 'Coffee Shop',
      address: 'Test Address',
      registration_date: '2024-11-15',
    });

    expect(result.success).toBe(true);
    expect(result.websiteUrl).toMatch(/tlvpulse\.com/);

    // Verify in database
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('business_id', 'TEST-E2E-001')
      .single();

    expect(data).toBeDefined();
    expect(data.website_url).toBe(result.websiteUrl);
  });
});
```

---

## Performance Optimization

### 1. Edge Caching

```typescript
// app/business/[slug]/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  // Pre-generate top 100 businesses
  const { data } = await supabase
    .from('businesses')
    .select('website_url')
    .limit(100);

  return data?.map(b => ({
    slug: getSlugFromUrl(b.website_url),
  })) || [];
}
```

### 2. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/business-photos/photo.jpg"
  alt="Business photo"
  width={800}
  height={600}
  quality={85}
  loading="lazy"
/>
```

### 3. Database Query Optimization

```sql
-- Materialized view for analytics
CREATE MATERIALIZED VIEW business_stats AS
SELECT
  b.id,
  b.name,
  COUNT(DISTINCT a.visitor_id) as unique_visitors,
  COUNT(*) FILTER (WHERE a.event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE a.event_type = 'contact_form') as leads
FROM businesses b
LEFT JOIN analytics_events a ON b.id = a.business_id
GROUP BY b.id, b.name;

-- Refresh every hour
CREATE INDEX idx_business_stats_id ON business_stats(id);
```

---

## Troubleshooting

### Common Issues

**Issue**: Website generation fails with OpenAI error

**Solution**:
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check quota
# Visit: https://platform.openai.com/usage
```

**Issue**: Supabase connection timeout

**Solution**:
```typescript
// Increase timeout
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
  realtime: {
    timeout: 30000, // 30 seconds
  },
});
```

**Issue**: GitHub Actions workflow not running

**Solution**:
```bash
# Check if workflows are enabled
gh workflow list

# Enable workflow
gh workflow enable detect-new-businesses.yml

# View recent runs
gh run list --limit 10

# View logs
gh run view --log
```

---

## Next Steps

**You now have everything to build the complete platform!**

1. **Start with MVP** (Phase 1) - 2 weeks
2. **Add AI features** (Phase 2) - 2 weeks
3. **Enable automation** (Phase 3) - 1 week
4. **Launch monetization** (Phase 4) - 2 weeks

**Total**: ~7 weeks to full platform

**Need help? Check:**
- PRODUCT_VISION.md - For feature details
- COMMUNITY_PRESENTATION.md - For business context
- OPERATIONS.md - For running the platform
- MONITORING.md - For health checks

**Let's build the future of business onboarding! 🚀**

