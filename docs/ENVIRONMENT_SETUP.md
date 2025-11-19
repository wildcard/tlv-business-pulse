# Environment Setup Guide

Complete guide to setting up your development and production environment for TLV Business Pulse.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Migration](#database-migration)
4. [Environment Variables](#environment-variables)
5. [Local Development](#local-development)
6. [Testing Database](#testing-database)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

```bash
# Verify installations
node --version  # Should be v18.x.x or higher
npm --version   # Should be v9.x.x or higher
git --version   # Any recent version
```

---

## Supabase Setup

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email address

### Step 2: Create a New Project

1. Click "New Project" from your dashboard
2. Choose your organization (or create a new one)
3. Fill in project details:
   - **Project Name**: `tlv-business-pulse` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `eu-west-1` for Europe)
   - **Pricing Plan**: Start with Free tier
4. Click "Create new project"
5. Wait 2-3 minutes for project provisioning

### Step 3: Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy the following values:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**⚠️ IMPORTANT**:
- The `service_role` key has admin access - **NEVER expose this in client-side code**
- Only use `service_role` key in server-side code and CI/CD pipelines
- The `anon` key is safe for client-side use (it respects Row Level Security)

---

## Database Migration

### Step 1: Open SQL Editor

1. In your Supabase project, click **SQL Editor** in the sidebar
2. Click **New Query**

### Step 2: Run the Schema

1. Open the file `docs/DATABASE_SCHEMA.sql` in this repository
2. Copy the entire contents
3. Paste into the SQL Editor in Supabase
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for execution to complete (usually 5-10 seconds)

You should see:
```
✅ TLV Business Pulse database schema created successfully!

Created tables:
  - businesses (core business data)
  - generated_websites (AI-generated content)
  - subscriptions (premium tiers)
  - analytics_events (tracking & metrics)
  - verification_logs (audit trail)
  - insights (AI articles)
  - api_keys (external access)

Next steps:
  ...
```

### Step 3: Verify Tables Created

1. Click **Table Editor** in the Supabase sidebar
2. You should see all 7 tables listed:
   - `businesses`
   - `generated_websites`
   - `subscriptions`
   - `analytics_events`
   - `verification_logs`
   - `insights`
   - `api_keys`

### Step 4: Check Row Level Security (RLS)

1. In the **Table Editor**, click on any table
2. Click the **RLS** tab
3. You should see policies enabled and configured
4. Example for `businesses`:
   - ✓ "Public read access for active businesses"
   - ✓ "Service role has full access to businesses"

---

## Environment Variables

### Step 1: Copy Example File

```bash
# In your project root directory
cp .env.example .env.local
```

### Step 2: Fill in Values

Open `.env.local` and update the following **required** variables:

```bash
# ============================================================================
# REQUIRED: Database Configuration (Supabase)
# ============================================================================

SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx

# ============================================================================
# REQUIRED: AI Configuration (OpenAI)
# ============================================================================

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================================================
# OPTIONAL (but recommended): Payment Processing (Stripe)
# ============================================================================

STRIPE_SECRET_KEY=sk_test_your_stripe_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID_PREMIUM=price_your_premium_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id

# ============================================================================
# OPTIONAL: Site Configuration
# ============================================================================

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Get OpenAI API Key

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Click **Create new secret key**
5. Name it `TLV Business Pulse`
6. Copy the key (starts with `sk-proj-` or `sk-`)
7. Paste into your `.env.local` file

**Cost Estimate**: ~$0.01-0.05 per website generation with GPT-4

### Step 4: Optional - Stripe Setup (for monetization)

Only needed if you want to enable premium subscriptions:

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a Stripe account
3. Get your test API keys from [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
4. Create products and prices in the Stripe Dashboard
5. Copy the price IDs to your `.env.local`

---

## Local Development

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Next.js (React framework)
- Supabase client
- OpenAI SDK
- Stripe SDK
- All TypeScript types and development tools

### Step 2: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.3
- Local:        http://localhost:3000
- Environment:  development

✓ Ready in 2.1s
```

### Step 3: Verify Database Connection

Open your browser and visit:

```
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T10:30:00.000Z",
  "services": {
    "database": {
      "status": "up",
      "responseTime": 45
    },
    "api": {
      "status": "up"
    }
  }
}
```

If you see errors, check:
1. `.env.local` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Database schema was run successfully
3. Network connectivity to Supabase

---

## Testing Database

### Test 1: Create a Test Business

Create a file `scripts/test-database.ts`:

```typescript
import {
  createBusiness,
  saveGeneratedWebsite,
  logVerification,
  getBusinessById,
  getGeneratedWebsite,
} from '@/lib/db/supabase';

async function testDatabase() {
  console.log('🧪 Testing database operations...\n');

  try {
    // Test 1: Create a business
    console.log('1️⃣ Creating test business...');
    const business = await createBusiness({
      business_id: 'TEST-' + Date.now(),
      name: 'Test Cafe Tel Aviv',
      category: 'Coffee Shop',
      address: '123 Rothschild Boulevard, Tel Aviv',
      registration_date: new Date().toISOString().split('T')[0],
      status: 'active',
      verified: true,
      data_quality_score: 95,
      metadata: {},
    });
    console.log('✅ Business created:', business.id);

    // Test 2: Save generated website
    console.log('\n2️⃣ Saving generated website...');
    const website = await saveGeneratedWebsite({
      business_id: business.id,
      hero_title: 'Welcome to Test Cafe',
      hero_subtitle: 'Best coffee in Tel Aviv',
      about_content: 'We serve amazing coffee and pastries.',
      seo_title: 'Test Cafe - Tel Aviv Coffee Shop',
      seo_description: 'Premium coffee and pastries in the heart of Tel Aviv',
      template_type: 'restaurant',
      services: [
        {
          name: 'Espresso',
          description: 'Perfect Italian espresso',
          price: '12 ₪',
        },
      ],
      menu_items: [],
      products: [],
      team_members: [],
      gallery_images: [],
      color_palette: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#F4A460',
      },
      typography: {
        heading_font: 'Playfair Display',
        body_font: 'Open Sans',
      },
      keywords: ['coffee', 'tel aviv', 'cafe'],
      meta_tags: {},
      layout_config: {},
      features_enabled: {
        contact_form: true,
        booking: false,
      },
      social_media: {},
      business_hours: {},
      ai_model: 'gpt-4',
      published: true,
    });
    console.log('✅ Website saved:', website.id);

    // Test 3: Log verification
    console.log('\n3️⃣ Logging verification...');
    const verification = await logVerification({
      business_id: business.id,
      verification_type: 'manual',
      verification_status: 'success',
      source_name: 'Test Verification',
      data_found: true,
      data_matches: true,
      confidence_score: 100,
      automated: false,
      retrieved_data: {},
      discrepancies: [],
      metadata: {},
    });
    console.log('✅ Verification logged:', verification.id);

    // Test 4: Retrieve data
    console.log('\n4️⃣ Retrieving business...');
    const retrieved = await getBusinessById(business.id);
    console.log('✅ Retrieved business:', retrieved?.name);

    console.log('\n5️⃣ Retrieving website...');
    const retrievedWebsite = await getGeneratedWebsite(business.id);
    console.log('✅ Retrieved website:', retrievedWebsite?.hero_title);

    console.log('\n✅ All tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   - Business ID: ${business.id}`);
    console.log(`   - Website ID: ${website.id}`);
    console.log(`   - Verification ID: ${verification.id}`);
    console.log(`   - Website URL: ${business.website_url || business.website_slug}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testDatabase();
```

Run the test:

```bash
npx tsx scripts/test-database.ts
```

Expected output:
```
🧪 Testing database operations...

1️⃣ Creating test business...
✅ Business created: abc123...

2️⃣ Saving generated website...
✅ Website saved: def456...

3️⃣ Logging verification...
✅ Verification logged: ghi789...

4️⃣ Retrieving business...
✅ Retrieved business: Test Cafe Tel Aviv

5️⃣ Retrieving website...
✅ Retrieved website: Welcome to Test Cafe

✅ All tests passed!
```

### Test 2: Query Data in Supabase Dashboard

1. Go to Supabase **Table Editor**
2. Click on `businesses` table
3. You should see your test business
4. Click on `generated_websites` table
5. You should see the generated website
6. Click on `verification_logs` table
7. You should see the verification entry

---

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup with database"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In Vercel project settings, go to **Environment Variables**
   - Add all variables from your `.env.local` file
   - **Important**: Use **production** Supabase keys, not test keys
   - **Important**: Use **production** Stripe keys if enabled

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Visit your production URL

### Verify Production Database

```bash
curl https://your-app.vercel.app/api/health
```

Should return healthy status.

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**:
1. Verify `.env.local` exists in project root
2. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
3. Restart your dev server: `npm run dev`

### Issue: "Failed to fetch businesses: relation does not exist"

**Solution**:
1. Database schema not created
2. Go to Supabase SQL Editor
3. Run `docs/DATABASE_SCHEMA.sql` again
4. Verify tables appear in Table Editor

### Issue: "SUPABASE_SERVICE_KEY not found"

**Solution**:
1. Add `SUPABASE_SERVICE_KEY` to `.env.local`
2. Get it from Supabase Project Settings > API > service_role key
3. Restart server

### Issue: OpenAI API errors

**Solution**:
1. Verify API key is correct (starts with `sk-proj-` or `sk-`)
2. Check you have credits: [https://platform.openai.com/usage](https://platform.openai.com/usage)
3. Verify API key has proper permissions

### Issue: Row Level Security (RLS) blocking queries

**Solution**:
1. For admin operations, use `getSupabaseAdmin()` instead of `supabase`
2. Check RLS policies in Supabase Table Editor > RLS tab
3. For public access, ensure `published = true` and `status = 'active'`

### Issue: Database connection timeout

**Solution**:
1. Check network connectivity
2. Verify Supabase project is not paused (free tier pauses after 1 week inactivity)
3. Check Supabase status: [https://status.supabase.com](https://status.supabase.com)

---

## Database Backup & Restore

### Backup (Weekly Recommended)

```bash
# Using Supabase CLI
npx supabase db dump -f backup-$(date +%Y%m%d).sql

# Or download from Supabase Dashboard
# Settings > Database > Backups > Download
```

### Restore

```bash
# Using Supabase CLI
npx supabase db push backup-20250119.sql

# Or use SQL Editor in Supabase Dashboard
```

---

## Next Steps

✅ **Database is set up!** Now you can:

1. **Generate your first website**: Run `npm run dev` and test the generation pipeline
2. **Connect real data**: Set up Tel Aviv Municipality API integration
3. **Deploy to production**: Push to Vercel and go live
4. **Enable monitoring**: Set up Sentry for error tracking
5. **Add analytics**: Configure Vercel Analytics

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx tsx scripts/test-database.ts    # Test database operations

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

### Essential URLs

- **Supabase Dashboard**: https://app.supabase.com/project/[project-id]
- **SQL Editor**: https://app.supabase.com/project/[project-id]/sql
- **Table Editor**: https://app.supabase.com/project/[project-id]/editor
- **API Settings**: https://app.supabase.com/project/[project-id]/settings/api
- **OpenAI Dashboard**: https://platform.openai.com/usage
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## Getting Help

- **Documentation**: See `IMPLEMENTATION_GUIDE.md` for detailed feature implementation
- **GitHub Issues**: Report bugs and request features
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: TLV Business Pulse Team
