# Vercel Environment Variables Setup

Quick reference guide for configuring environment variables in Vercel dashboard.

## Access Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** tab
3. Click **Environment Variables** in left sidebar
4. Add each variable below

## Required Variables (Minimum for Deployment)

These are **REQUIRED** for the application to work:

### Database (Supabase)

```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get**:
- Supabase Dashboard → Project Settings → API
- Get all three values from the API settings page

**Environment**: All (Production, Preview, Development)

### AI Generation (OpenAI)

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to get**:
- https://platform.openai.com/api-keys
- Create new secret key named "TLV Business Pulse Production"

**Environment**: All (Production, Preview, Development)

### Site Configuration

```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Value**: Your actual Vercel deployment URL
**Environment**: All

## Optional Variables (Recommended for Full Features)

### Payment Processing (Stripe)

```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID_PREMIUM=price_your_premium_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
```

**Where to get**:
- https://dashboard.stripe.com/apikeys
- Use test keys (sk_test_) for preview deployments
- Use live keys (sk_live_) for production only

**Environment**:
- Production: Use live keys
- Preview/Development: Use test keys

### External Data Sources

```
# Tel Aviv Municipality API (if authentication required)
TLV_API_KEY=your-tel-aviv-api-key

# Google Places API (for location verification)
GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Israeli Companies Registry (if API available)
COMPANIES_REGISTRY_API_KEY=your-registry-api-key
```

**Where to get**:
- Tel Aviv: https://data.tel-aviv.gov.il (may not require key)
- Google Places: https://console.cloud.google.com/apis/credentials
- Companies Registry: Contact Israeli government for API access

**Environment**: All

### Notifications

```
# Email (for business owner notifications)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# SMS (for verification codes)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+972XXXXXXXXX

# Slack (for monitoring alerts)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

**Where to get**:
- SendGrid: https://app.sendgrid.com/settings/api_keys
- Twilio: https://console.twilio.com
- Slack: https://api.slack.com/messaging/webhooks

**Environment**: All

### Monitoring & Analytics

```
# Error Tracking
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/1234567

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Ads
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxxxx
```

**Where to get**:
- Sentry: https://sentry.io/settings/projects/
- Google Analytics: https://analytics.google.com/analytics/web/
- Google AdSense: https://www.google.com/adsense/

**Environment**:
- Sentry: All environments
- Analytics: Production only recommended
- Ads: Production only

### GitHub Integration (for automated commits)

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY=wildcard/tlv-business-pulse
```

**Where to get**:
- GitHub: Settings → Developer settings → Personal access tokens
- Repository: Your repository full name

**Permissions needed**: `repo`, `workflow`

**Environment**: Production only

## Feature Flags

```
ENABLE_SOCIAL_POSTS=true
ENABLE_NEWSLETTER=true
ENABLE_API_SUBSCRIPTIONS=true
ENABLE_ADS=false
```

**Value**: `true` or `false`
**Environment**: Can vary per environment

## Rate Limiting

```
API_RATE_LIMIT_PER_HOUR=100
API_RATE_LIMIT_PREMIUM_PER_HOUR=1000
```

**Value**: Numbers only
**Environment**: All

---

## Step-by-Step: Adding Variables in Vercel

### Method 1: Via Dashboard (Recommended)

1. **Navigate**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add Variable**:
   - Click "Add New"
   - Enter **Key** (e.g., `SUPABASE_URL`)
   - Enter **Value** (paste your actual value)
   - Select **Environments**: Production, Preview, Development (or specific ones)
   - Click "Save"
3. **Repeat** for each variable
4. **Redeploy**: Go to Deployments tab and click "Redeploy" on latest deployment

### Method 2: Via Vercel CLI

```bash
# Set a single variable for all environments
vercel env add SUPABASE_URL production preview development

# You'll be prompted to enter the value
# Paste your value and press Enter

# Set a variable for production only
vercel env add OPENAI_API_KEY production

# Import all from .env.local (interactive)
vercel env pull .env.vercel.local
```

### Method 3: Bulk Import

Create a file `vercel-env.txt`:

```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-proj-...
```

Then in Vercel Dashboard:
1. Click "Add New" → "Bulk Add from .env"
2. Paste contents of your file
3. Select environments
4. Click "Add"

---

## Environment-Specific Configuration

### Production Environment

**Purpose**: Live public website
**Requirements**:
- ✅ All required variables
- ✅ Production Stripe keys (if using)
- ✅ Production monitoring (Sentry)
- ✅ Real email/SMS credentials
- ✅ Analytics enabled

### Preview Environment

**Purpose**: Testing pull requests before merging
**Requirements**:
- ✅ All required variables
- ✅ Test Stripe keys
- ✅ Same Supabase (or separate staging database)
- ⚠️ Can use same OpenAI key (just monitor costs)

### Development Environment

**Purpose**: Local development with Vercel features
**Requirements**:
- ✅ Same as Preview
- ⚠️ Use `.env.local` file locally instead

---

## Verification

After adding environment variables:

### 1. Check Health Endpoint

```bash
curl https://your-app.vercel.app/api/health
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
    }
  }
}
```

### 2. Test Database Connection

```bash
curl https://your-app.vercel.app/api/businesses?limit=1
```

Should return data or empty array `[]` if no businesses yet.

### 3. Check Vercel Logs

1. Vercel Dashboard → Deployments → Click latest deployment
2. Click "Functions" tab
3. Look for any errors mentioning missing environment variables

Common error patterns:
- ❌ `Missing Supabase URL` → Add `SUPABASE_URL`
- ❌ `OpenAI API key not found` → Add `OPENAI_API_KEY`
- ❌ `fetch failed` → Check database is accessible

---

## Security Best Practices

### ✅ DO:
- Use Vercel's encrypted environment variables
- Use different API keys for production vs preview
- Rotate keys every 90 days
- Set `NEXT_PUBLIC_*` only for values safe to expose to client
- Use Stripe test keys for preview environments

### ❌ DON'T:
- Never commit `.env.local` to git (already in `.gitignore`)
- Never expose `SUPABASE_SERVICE_KEY` in client code
- Never use production Stripe keys in preview/dev
- Never share environment variable values in public issues

---

## Troubleshooting

### Issue: "Missing environment variable" error in production

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Verify the variable exists and is set for "Production"
3. If missing, add it
4. Redeploy: Deployments → Latest → "Redeploy"

### Issue: Different values in preview vs production

**Solution**:
- Vercel allows environment-specific values
- Check which environment the variable is set for
- Edit variable and select correct environments

### Issue: Changes not taking effect

**Solution**:
- Environment variables are read at build time
- After adding/changing variables, you MUST redeploy
- Go to Deployments → Click "Redeploy" with existing code

### Issue: "fetch failed" errors in logs

**Solution**:
1. Check `SUPABASE_URL` is correct and reachable
2. Verify Supabase project is not paused (free tier)
3. Check Supabase API keys are valid
4. Test connection: `curl https://your-supabase-url.supabase.co`

---

## Quick Start Checklist

For a working deployment, add these in order:

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] Redeploy in Vercel
- [ ] Test health endpoint
- [ ] Verify no errors in logs

**Everything else is optional** and can be added as you need those features.

---

## Cost Estimates (for planning)

**Required services**:
- Supabase: Free tier (up to 500MB database, 50,000 monthly active users)
- OpenAI: ~$0.01-0.05 per website generation (GPT-4)
- Vercel: Free tier (100GB bandwidth, 100 hours serverless function time)

**Optional services**:
- Stripe: Free (2.9% + $0.30 per transaction)
- SendGrid: Free tier (100 emails/day)
- Twilio: Pay-as-you-go (~$0.0075 per SMS)
- Sentry: Free tier (5,000 errors/month)

**Estimated monthly cost**: $5-20/month for 1,000 website generations

---

## Need Help?

- **Supabase docs**: https://supabase.com/docs/guides/api
- **Vercel docs**: https://vercel.com/docs/concepts/projects/environment-variables
- **OpenAI docs**: https://platform.openai.com/docs/api-reference/authentication
- **Project docs**: See `docs/ENVIRONMENT_SETUP.md` for detailed setup

---

**Last Updated**: January 2025
**Version**: 1.0
