# Deploy TLV Business Pulse to Vercel

This guide will walk you through deploying the TLV Business Pulse autonomous business to Vercel in under 15 minutes.

## Prerequisites

Before you begin, ensure you have:
- [ ] GitHub account (free)
- [ ] Vercel account (free) - Sign up at https://vercel.com/signup
- [ ] Supabase account (free) - Sign up at https://supabase.com
- [ ] OpenAI API key - Get from https://platform.openai.com/api-keys

**Estimated Time**: 15 minutes
**Cost**: $0 upfront (uses free tiers, ~$5-10/month for OpenAI)

---

## Step 1: Prepare Required Services (10 minutes)

### A. Set Up Supabase Database

1. **Create New Project**:
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: `tlv-business-pulse`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you (e.g., `East US`)
   - Click "Create new project" (takes ~2 minutes)

2. **Get Connection Details**:
   - Go to Project Settings (gear icon) → API
   - Copy these values (you'll need them soon):
     ```
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=eyJhbGc...
     ```

3. **Create Database Tables**:
   - Go to SQL Editor (in left sidebar)
   - Click "New Query"
   - Paste and run this SQL:

```sql
-- Create businesses table
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  business_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Tel Aviv',
  category TEXT,
  registration_date DATE,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insights table
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags TEXT[],
  metadata JSONB,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API subscriptions table
CREATE TABLE api_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'premium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create metrics table
CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metadata JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_created ON businesses(created_at DESC);
CREATE INDEX idx_insights_published ON insights(published, created_at DESC);
CREATE INDEX idx_insights_slug ON insights(slug);
CREATE INDEX idx_metrics_name ON metrics(metric_name, recorded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for businesses" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Public read access for published insights" ON insights
  FOR SELECT USING (published = true);

CREATE POLICY "Public read access for metrics" ON metrics
  FOR SELECT USING (true);

-- Create policies for service role write access
CREATE POLICY "Service role can insert businesses" ON businesses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update businesses" ON businesses
  FOR UPDATE USING (true);

CREATE POLICY "Service role can insert insights" ON insights
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert metrics" ON metrics
  FOR INSERT WITH CHECK (true);
```

   - Click "Run" (should see "Success. No rows returned")

### B. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name: `tlv-business-pulse`
4. Copy the key (starts with `sk-proj-...`)
5. **IMPORTANT**: Save this key securely, you won't see it again!

**Note**: New accounts get $5 free credit. This project uses ~$0.30/day (~$9/month).

### C. Get Stripe Keys (Optional - for API subscriptions)

If you want to enable paid API subscriptions:

1. Sign up at https://stripe.com
2. Go to Developers → API Keys
3. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

**Note**: You can skip Stripe initially and add it later.

---

## Step 2: Deploy to Vercel (5 minutes)

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Find your `tlv-business-pulse` repo
   - Click "Import"

2. **Configure Project**:
   - Project Name: `tlv-business-pulse`
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (leave default)
   - Output Directory: `.next` (leave default)

3. **Add Environment Variables**:
   Click "Environment Variables" and add these:

   **Required Variables**:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   OPENAI_API_KEY=sk-proj-...
   NEXT_PUBLIC_SITE_URL=https://tlv-business-pulse.vercel.app
   ```

   **Optional Variables** (add later if needed):
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   GOOGLE_ADSENSE_CLIENT=ca-pub-...
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait ~2 minutes for build
   - You'll see "Congratulations!" when done

5. **Get Your Live URL**:
   - Copy your deployment URL (e.g., `https://tlv-business-pulse.vercel.app`)
   - Visit it to see your live site!

### Option B: Deploy via Vercel CLI

If you prefer command-line:

```bash
# 1. Login to Vercel
vercel login

# 2. Navigate to project
cd tlv-business-pulse

# 3. Deploy (follow prompts)
vercel

# 4. Set up environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# 5. Deploy to production
vercel --prod
```

---

## Step 3: Configure GitHub Actions (5 minutes)

GitHub Actions will run your autonomous operations. You need to add secrets so the workflows can access your services.

### Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click "New repository secret" and add each of these:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | `your_vercel_token` | Vercel Settings → Tokens |
| `VERCEL_ORG_ID` | `team_xxx` or `user_xxx` | Vercel Project Settings → General |
| `VERCEL_PROJECT_ID` | `prj_xxx` | Vercel Project Settings → General |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Project Settings → API |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | Supabase Project Settings → API → `service_role` key |
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI API Keys |

**How to Get Vercel Tokens**:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `github-actions`
4. Scope: Full Account
5. Click "Create"
6. Copy the token

**How to Get Vercel IDs**:
```bash
# Option 1: From Vercel Dashboard
# Go to Project Settings → General
# Find "Project ID" and "Team ID" (or "User ID")

# Option 2: From CLI
vercel project ls
# Shows project ID

# Check .vercel/project.json after running vercel link
cat .vercel/project.json
```

### Test GitHub Actions

1. Go to your repo → **Actions** tab
2. You should see workflows listed:
   - Daily Operations
   - Hourly Health Check
   - Weekly Optimization
   - Monthly Finance

3. **Test a workflow**:
   - Click "Daily Operations"
   - Click "Run workflow" dropdown
   - Click "Run workflow" button
   - Watch it execute (should take ~2-3 minutes)

4. **Verify success**:
   - Workflow should show ✓ green checkmark
   - Check your website for new content
   - Check Supabase database for new records

---

## Step 4: Verify Deployment (5 minutes)

### A. Test Website

```bash
# Check if website is live
curl -I https://tlv-business-pulse.vercel.app

# Expected: HTTP/2 200
```

Or visit in browser: `https://your-deployment-url.vercel.app`

**You should see**:
- ✅ Homepage loads
- ✅ "TLV Business Pulse" branding
- ✅ No errors in browser console

### B. Test API Endpoints

```bash
# Health check
curl https://tlv-business-pulse.vercel.app/api/health

# Should return: {"status":"ok",...}

# Insights endpoint
curl https://tlv-business-pulse.vercel.app/api/insights

# Should return: [] (empty initially, will populate after first run)
```

### C. Test Database Connection

```bash
# This endpoint tests database connectivity
curl https://tlv-business-pulse.vercel.app/api/health/db

# Expected: {"status":"connected","latency":"<100ms"}
```

### D. Run First Content Generation (Manual)

```bash
# Trigger the daily operations workflow manually
gh workflow run daily-operations.yml

# Monitor the run
gh run watch

# After completion, check for new content
curl https://tlv-business-pulse.vercel.app/api/insights?limit=1
```

---

## Step 5: Configure Scheduled Operations

Your GitHub Actions workflows will run automatically on schedule:

| Workflow | Schedule | What It Does |
|----------|----------|--------------|
| Daily Operations | 6:00 AM IST (daily) | Fetches data, generates content |
| Health Check | Every hour | Monitors system health |
| Weekly Optimization | Monday 3:00 AM IST | Optimizes performance |
| Monthly Finance | 1st of month, 4:00 AM IST | Financial reporting |

**No action needed** - these run automatically!

To verify schedules are active:
```bash
# List all workflows
gh workflow list

# Each should show "active" status
```

---

## Troubleshooting

### Issue: "Environment variable missing"

**Symptom**: Deployment fails with "Missing environment variable"

**Fix**:
```bash
# Add missing variable via CLI
vercel env add VARIABLE_NAME

# Or via dashboard:
# Vercel Project → Settings → Environment Variables → Add
```

### Issue: "Database connection failed"

**Symptom**: API returns database errors

**Fix**:
1. Verify `SUPABASE_URL` is correct
2. Verify `SUPABASE_ANON_KEY` is the **anon** key (not service_role)
3. Check Supabase project is active (not paused)

```bash
# Test connection
curl https://tlv-business-pulse.vercel.app/api/health/db
```

### Issue: "GitHub Actions not running"

**Symptom**: Workflows show as "disabled" or never run

**Fix**:
```bash
# Enable workflows
gh workflow enable daily-operations.yml
gh workflow enable health-check.yml
gh workflow enable weekly-optimization.yml
gh workflow enable monthly-finance.yml

# Trigger manual run to test
gh workflow run daily-operations.yml
```

### Issue: "OpenAI API errors"

**Symptom**: Content generation fails with OpenAI errors

**Fix**:
1. Verify API key is correct
2. Check you have credits: https://platform.openai.com/usage
3. Verify key has access to GPT-4 (or update code to use GPT-3.5)

### Issue: "Build fails on Vercel"

**Symptom**: Deployment shows red X, build failed

**Fix**:
```bash
# Test build locally first
npm install
npm run build

# If successful locally, check Vercel build logs:
# Vercel Dashboard → Deployment → View Build Logs

# Common fixes:
# - Add missing environment variables
# - Check for TypeScript errors
# - Verify Node version (should be 18+)
```

---

## Post-Deployment Checklist

After successful deployment, verify:

- [ ] Website is live and accessible
- [ ] API endpoints are responding
- [ ] Database connection is working
- [ ] GitHub Actions workflows are enabled
- [ ] First manual workflow run completed successfully
- [ ] Content appears on website
- [ ] No errors in Vercel logs
- [ ] Supabase database has data

---

## Next Steps

### 1. Set Up Monitoring

Add external monitoring (recommended):

**UptimeRobot** (Free):
1. Sign up at https://uptimerobot.com
2. Add monitor: `https://tlv-business-pulse.vercel.app`
3. Alert contact: Your email
4. Check interval: 5 minutes

### 2. Configure Custom Domain (Optional)

If you want a custom domain like `tlvbusinesspulse.com`:

1. Buy domain (e.g., from Namecheap, Google Domains)
2. In Vercel:
   - Project Settings → Domains
   - Add Domain
   - Follow DNS configuration steps

### 3. Set Up Google AdSense (Optional)

To monetize with ads:

1. Sign up at https://www.google.com/adsense
2. Add your domain
3. Get your publisher ID (looks like `ca-pub-1234567890`)
4. Add to Vercel environment variables:
   ```bash
   vercel env add GOOGLE_ADSENSE_CLIENT
   # Value: ca-pub-1234567890
   ```

### 4. Enable Stripe Payments (Optional)

To accept API subscription payments:

1. Add Stripe keys to Vercel environment variables
2. Set up webhook endpoint:
   - Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://tlv-business-pulse.vercel.app/api/webhook/stripe`
   - Select events: `customer.subscription.created`, `customer.subscription.deleted`
3. Copy webhook signing secret to Vercel:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   ```

### 5. Set Up Analytics (Optional)

Vercel Analytics is automatically enabled. To view:
- Go to Vercel Dashboard → Your Project → Analytics

For more detailed analytics, consider:
- Google Analytics
- Plausible Analytics
- PostHog

---

## Cost Expectations

### Free Tier Limits

| Service | Free Tier | Expected Usage | Status |
|---------|-----------|----------------|--------|
| Vercel | 100GB bandwidth | ~5-10GB/month | ✅ Safe |
| Supabase | 500MB database | ~50-100MB/month | ✅ Safe |
| GitHub Actions | 2000 min/month | ~500 min/month | ✅ Safe |
| OpenAI | $0 (pay-as-go) | ~$9/month | 💰 Paid |

### Monthly Cost Breakdown

**Month 1**:
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- GitHub Actions: $0 (free tier)
- OpenAI: ~$9 (3 insights/day × $0.30/day)
- **Total: ~$9/month**

**At Scale** (10K visitors/month):
- Vercel: $0 (still within free tier)
- Supabase: $0 (still within free tier)
- GitHub Actions: $0 (still within free tier)
- OpenAI: ~$9 (same usage)
- **Total: Still ~$9/month**

**Revenue Potential**:
- Month 1: $0-50 (AdSense + early API subs)
- Month 3: $50-200
- Month 6: $200-1000+

---

## Maintenance Schedule

### Daily (2 minutes)
- Check workflow ran successfully
- Verify new content published
- Quick visual check of website

### Weekly (30 minutes)
- Review performance metrics
- Check costs vs. budget
- Review content quality
- Check for security updates

### Monthly (2 hours)
- Full financial review
- Deep dive into metrics
- Plan optimizations
- Update dependencies

---

## Support & Resources

### Documentation
- **This Project**: See OPERATIONS.md and MONITORING.md
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs

### Getting Help
- **GitHub Issues**: Report bugs
- **GitHub Discussions**: Ask questions
- **Vercel Support**: help@vercel.com (for platform issues)
- **Supabase Support**: Community forum at supabase.com/support

---

## Success Criteria

Your deployment is successful when:

✅ Website loads at your Vercel URL
✅ API endpoints return data
✅ Database is connected and populated
✅ GitHub Actions run successfully
✅ First content is generated and published
✅ No critical errors in logs
✅ All services are in free tier (except OpenAI)

**Congratulations! Your autonomous business is now live! 🎉**

---

**Last Updated**: 2025-11-17
**Version**: 1.0.0
