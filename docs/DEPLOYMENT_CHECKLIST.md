# Production Deployment Checklist

Complete checklist for deploying TLV Business Pulse to production safely and successfully.

---

## Pre-Deployment Checklist

### Code Readiness

- [ ] All tests passing locally (`npm test`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] TypeScript compilation successful (`npm run type-check` if available)
- [ ] No console errors in development mode
- [ ] All TODO comments reviewed and addressed
- [ ] Code reviewed by at least one other person (if team)
- [ ] Latest changes committed and pushed to GitHub

### Database Setup

- [ ] Supabase project created
- [ ] Database schema executed (`docs/DATABASE_SCHEMA.sql`)
- [ ] All 7 tables verified in Supabase Table Editor:
  - [ ] `businesses`
  - [ ] `generated_websites`
  - [ ] `subscriptions`
  - [ ] `analytics_events`
  - [ ] `verification_logs`
  - [ ] `insights`
  - [ ] `api_keys`
- [ ] Row Level Security (RLS) policies enabled and tested
- [ ] Test data inserted and retrieved successfully
- [ ] Database indexes created (automatically included in schema)
- [ ] Database backup configured (Supabase auto-backup enabled)

### API Keys & Credentials

#### Required (Minimum Viable Product)
- [ ] Supabase URL obtained
- [ ] Supabase anon key obtained
- [ ] Supabase service role key obtained (⚠️ KEEP SECRET)
- [ ] OpenAI API key created
- [ ] OpenAI account has sufficient credits ($10+ recommended)

#### Optional (Full Features)
- [ ] Stripe account created (if monetization enabled)
- [ ] Stripe test keys obtained
- [ ] Stripe production keys obtained
- [ ] Stripe products and prices created
- [ ] Stripe webhook endpoint configured
- [ ] SendGrid API key (if email notifications)
- [ ] Twilio credentials (if SMS notifications)
- [ ] Google Places API key (if location verification)
- [ ] Sentry DSN (if error monitoring)

### Security Review

- [ ] All API keys stored securely (not in code)
- [ ] `.env.local` in `.gitignore` (verify never committed)
- [ ] Service role key never exposed to client
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] SQL injection prevention verified (using Supabase client)
- [ ] XSS prevention verified (React escapes by default)
- [ ] Authentication flows tested (if implemented)
- [ ] Authorization policies verified (RLS rules)

### Performance Optimization

- [ ] Images optimized (using Next.js Image component)
- [ ] Fonts optimized (using next/font)
- [ ] Bundle size analyzed (`npm run build` check output)
- [ ] Lighthouse score checked (aim for 90+ performance)
- [ ] Database queries use proper indexes
- [ ] API routes have appropriate caching headers
- [ ] Static pages generated at build time where possible

---

## Vercel Deployment Steps

### 1. Connect Repository

- [ ] Push code to GitHub repository
- [ ] Log in to Vercel: https://vercel.com
- [ ] Click "Add New" → "Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"

### 2. Configure Project

- [ ] **Framework Preset**: Next.js (should auto-detect)
- [ ] **Root Directory**: `./` (default)
- [ ] **Build Command**: `npm run build` (default)
- [ ] **Output Directory**: `.next` (default)
- [ ] **Install Command**: `npm install` (default)
- [ ] **Node Version**: 18.x or higher

### 3. Add Environment Variables

**Method**: Vercel Dashboard → Settings → Environment Variables

Add each variable for **Production, Preview, and Development** (unless noted):

#### Required Variables
- [ ] `SUPABASE_URL` → All environments
- [ ] `SUPABASE_ANON_KEY` → All environments
- [ ] `SUPABASE_SERVICE_KEY` → All environments
- [ ] `OPENAI_API_KEY` → All environments
- [ ] `NEXT_PUBLIC_SITE_URL` → Production: `https://your-domain.com`, Preview: Auto-set by Vercel

#### Optional Variables (add as needed)
- [ ] `STRIPE_SECRET_KEY` → Production: live key, Preview: test key
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_ID_PREMIUM`
- [ ] `STRIPE_PRICE_ID_PRO`
- [ ] `SENDGRID_API_KEY`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`
- [ ] `GOOGLE_PLACES_API_KEY`
- [ ] `SENTRY_DSN`
- [ ] `GOOGLE_ANALYTICS_ID` → Production only
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` → Production only

### 4. Deploy

- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for any errors
- [ ] Note deployment URL

---

## Post-Deployment Verification

### Automated Health Checks

Run these curl commands (replace `your-app.vercel.app` with your actual domain):

#### 1. Health Check
```bash
curl https://your-app.vercel.app/api/health
```

**Expected**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T...",
  "services": {
    "database": { "status": "up" }
  }
}
```

- [ ] Health check returns 200 OK
- [ ] Database status is "up"

#### 2. Business API
```bash
curl https://your-app.vercel.app/api/businesses?limit=1
```

**Expected**: JSON array (empty `[]` if no businesses yet)

- [ ] Returns 200 OK
- [ ] No error messages

#### 3. Verification API
```bash
curl https://your-app.vercel.app/api/verify/test-123
```

**Expected**: Verification report (may show not verified for test ID)

- [ ] Returns 200 OK or 500 with graceful error
- [ ] No crashes

### Manual Testing

#### Homepage
- [ ] Navigate to `https://your-app.vercel.app`
- [ ] Page loads without errors
- [ ] All images display correctly
- [ ] Hero section visible
- [ ] Navigation works
- [ ] Footer links work
- [ ] No console errors in browser DevTools

#### Key Pages
- [ ] `/businesses` - Business directory loads
- [ ] `/transparency` - Transparency page displays
- [ ] `/about` - About page loads
- [ ] `/pricing` - Pricing page shows plans
- [ ] `/help` - Help center works

#### Business Flow (if test data exists)
- [ ] Business detail page loads
- [ ] Verification badge shows
- [ ] Contact form displays
- [ ] Social links work

#### Mobile Responsiveness
- [ ] Test on mobile viewport (DevTools → Toggle device toolbar)
- [ ] Navigation menu works on mobile
- [ ] Forms usable on mobile
- [ ] Text readable without zooming

### Performance Testing

#### Lighthouse Audit
- [ ] Open homepage in Chrome
- [ ] Press F12 → Lighthouse tab
- [ ] Run audit (Mobile)
- [ ] Check scores:
  - [ ] Performance: 80+ (aim for 90+)
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+

#### Load Time
- [ ] Homepage loads in < 3 seconds
- [ ] Business pages load in < 2 seconds
- [ ] API responses in < 500ms

### Database Verification

#### Check Supabase Dashboard
- [ ] Go to Supabase project dashboard
- [ ] Table Editor → `businesses` table
- [ ] Verify RLS policies active (shield icon)
- [ ] Check no sensitive data exposed publicly
- [ ] Test query from Supabase SQL editor works

#### Test Database Operations
- [ ] Create a test business (if admin access)
- [ ] Verify it appears on website
- [ ] Update business data
- [ ] Verify changes reflected
- [ ] Delete test business
- [ ] Verify removed from site

### Error Monitoring

#### Check Vercel Logs
- [ ] Vercel Dashboard → Deployments → Latest
- [ ] Click "Functions" tab
- [ ] Review logs for any errors
- [ ] Address any red error messages

#### Sentry (if configured)
- [ ] Log in to Sentry dashboard
- [ ] Check for any new errors
- [ ] Verify error tracking working (trigger test error)

---

## DNS & Custom Domain (Optional)

### Add Custom Domain

- [ ] Purchase domain (e.g., `tlvpulse.com`)
- [ ] Vercel Dashboard → Settings → Domains
- [ ] Click "Add"
- [ ] Enter domain name
- [ ] Follow DNS configuration instructions:
  - [ ] Add A record: `76.76.21.21`
  - [ ] Add CNAME record: `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Verify domain works
- [ ] Update `NEXT_PUBLIC_SITE_URL` to new domain
- [ ] Redeploy

### SSL Certificate

- [ ] Vercel auto-provisions SSL (should be automatic)
- [ ] Verify HTTPS works
- [ ] Check certificate valid in browser (padlock icon)
- [ ] Force HTTPS redirect enabled

---

## External Services Configuration

### Stripe Webhooks (if using Stripe)

- [ ] Stripe Dashboard → Developers → Webhooks
- [ ] Click "Add endpoint"
- [ ] URL: `https://your-app.vercel.app/api/webhooks/stripe`
- [ ] Events to send:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Copy webhook signing secret
- [ ] Add to Vercel env as `STRIPE_WEBHOOK_SECRET`
- [ ] Test webhook with Stripe CLI

### GitHub Actions (for automation)

- [ ] Repository → Settings → Secrets and variables → Actions
- [ ] Add secrets:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `OPENAI_API_KEY`
- [ ] Verify workflows in `.github/workflows/` are enabled
- [ ] Check Actions tab → Recent workflow runs
- [ ] All workflows passing

### Google Search Console (SEO)

- [ ] Go to https://search.google.com/search-console
- [ ] Add property with your domain
- [ ] Verify ownership (Vercel DNS TXT record)
- [ ] Submit sitemap: `https://your-domain.com/sitemap.xml`
- [ ] Request indexing for homepage

---

## Launch Day Checklist

### 24 Hours Before Launch

- [ ] Final full test of all features
- [ ] Database backup created
- [ ] All team members aware of launch time
- [ ] Monitoring alerts configured
- [ ] Support email/system ready
- [ ] Social media accounts ready (if announcing)
- [ ] Press release prepared (if applicable)

### Launch Day

- [ ] Deploy to production (if not already)
- [ ] Verify all systems operational
- [ ] Monitor logs for first 2 hours
- [ ] Test key user flows
- [ ] Announce launch (social media, etc.)
- [ ] Monitor error rates
- [ ] Be available for quick fixes

### Week 1 Post-Launch

- [ ] Daily health checks
- [ ] Monitor error rates in Sentry
- [ ] Review Vercel analytics
- [ ] Check user feedback
- [ ] Address any critical bugs
- [ ] Optimize based on real usage data

---

## Rollback Plan

### If Critical Issues Occur

1. **Immediate Rollback**:
   ```bash
   # In Vercel Dashboard
   Deployments → Previous successful deployment → "Promote to Production"
   ```

2. **Identify Issue**:
   - [ ] Check Vercel logs
   - [ ] Check Sentry errors
   - [ ] Review recent commits
   - [ ] Test locally

3. **Fix and Redeploy**:
   - [ ] Fix issue in code
   - [ ] Test thoroughly locally
   - [ ] Deploy to preview first
   - [ ] Test preview deployment
   - [ ] Promote to production

---

## Success Metrics

### Technical Metrics (Week 1)

- [ ] Uptime: > 99.9%
- [ ] Error rate: < 0.1%
- [ ] API response time: < 500ms (p95)
- [ ] Page load time: < 3s (p95)
- [ ] Core Web Vitals passing

### Business Metrics (Month 1)

- [ ] X businesses generated
- [ ] X website visits
- [ ] X businesses claimed (if claiming feature)
- [ ] X premium subscriptions (if monetization)
- [ ] User satisfaction: Gather feedback

---

## Ongoing Maintenance

### Daily
- [ ] Check Vercel Analytics dashboard
- [ ] Review Sentry for new errors
- [ ] Monitor automated workflows (GitHub Actions)

### Weekly
- [ ] Review performance metrics
- [ ] Check database size and usage
- [ ] Review API usage and costs (OpenAI, etc.)
- [ ] Update dependencies if security patches

### Monthly
- [ ] Full backup of database
- [ ] Review and rotate API keys
- [ ] Analyze user feedback and feature requests
- [ ] Plan next features/improvements
- [ ] Review costs and optimize

---

## Emergency Contacts

```
Vercel Status:     https://www.vercel-status.com
Supabase Status:   https://status.supabase.com
OpenAI Status:     https://status.openai.com
Stripe Status:     https://status.stripe.com

Support:
- Vercel:   https://vercel.com/support
- Supabase: https://supabase.com/support
- OpenAI:   https://help.openai.com
```

---

## Final Checklist Summary

**Before clicking "Deploy"**:
- [ ] All required environment variables added
- [ ] Database schema applied and tested
- [ ] Code tested locally
- [ ] No console errors
- [ ] Build succeeds

**After deployment**:
- [ ] Health check passes
- [ ] All pages load correctly
- [ ] No errors in Vercel logs
- [ ] Lighthouse score acceptable
- [ ] Mobile responsive

**Within 24 hours**:
- [ ] Monitor error rates
- [ ] Check analytics
- [ ] Test key user flows
- [ ] Gather initial feedback

---

**You're ready to deploy!** 🚀

If everything above is checked, your deployment should be successful and stable.

---

**Last Updated**: January 2025
**Version**: 1.0
