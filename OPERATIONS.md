# TLV Business Pulse - Operations Guide

## Overview

This guide explains how to operate and maintain the TLV Business Pulse autonomous business. The system is designed to run 24/7 with minimal human intervention, but operators should perform regular health checks to ensure everything is functioning correctly.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Automated Operations](#automated-operations)
3. [Operator Responsibilities](#operator-responsibilities)
4. [Health Check Procedures](#health-check-procedures)
5. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
6. [Emergency Procedures](#emergency-procedures)
7. [Performance Optimization](#performance-optimization)

---

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub Actions                       │
│  (Orchestrates all automated operations)                │
└───────────────┬─────────────────────────────────────────┘
                │
                ├──> Daily Data Fetch (6:00 AM IST)
                ├──> Hourly Health Checks
                ├──> Weekly Optimization
                └──> Monthly Financial Reports
                │
┌───────────────▼─────────────────────────────────────────┐
│                    Vercel Deployment                     │
│  - Next.js Application                                   │
│  - API Routes (Public & Cron)                           │
│  - Edge Functions                                        │
└───────────────┬─────────────────────────────────────────┘
                │
                ├──> Supabase (Database)
                ├──> OpenAI (Content Generation)
                ├──> Stripe (Payments)
                └──> External APIs (Business Data)
```

### Data Flow

1. **Data Collection**: GitHub Actions trigger data fetch from Tel Aviv business registry
2. **Processing**: Changes are detected and stored in Supabase
3. **Content Generation**: OpenAI generates insights from new data
4. **Publishing**: Content is automatically published to the website
5. **Analytics**: Metrics are tracked and stored
6. **Revenue**: Payments processed through Stripe

---

## Automated Operations

### Daily Operations (6:00 AM IST)

**Workflow**: `.github/workflows/daily-operations.yml`

**What Happens**:
1. Fetches latest Tel Aviv business data
2. Identifies new businesses (registrations)
3. Identifies closed businesses (deregistrations)
4. Generates 3 AI-powered insights:
   - New business trend analysis
   - Industry sector changes
   - Geographic distribution updates
5. Publishes content to website
6. Updates SEO metadata
7. Generates social media posts (if configured)
8. Updates public metrics dashboard

**Expected Duration**: 5-10 minutes

**Success Criteria**:
- ✅ New data fetched successfully
- ✅ At least 1 insight generated
- ✅ Content published to website
- ✅ No API errors logged

### Hourly Health Checks

**Workflow**: `.github/workflows/health-check.yml`

**What Happens**:
1. Pings main website endpoint
2. Checks API response times
3. Verifies database connectivity
4. Checks disk space and memory
5. Validates environment variables
6. Tests critical API endpoints
7. Auto-heals common issues

**Expected Duration**: 1-2 minutes

**Success Criteria**:
- ✅ All endpoints responding (< 2s response time)
- ✅ Database queries executing (< 500ms)
- ✅ No critical errors in logs

### Weekly Optimization

**Workflow**: `.github/workflows/weekly-optimization.yml`

**What Happens**:
1. Analyzes traffic patterns
2. Identifies popular content
3. Optimizes images and assets
4. Updates caching strategies
5. Cleans up old data
6. Generates weekly performance report

**Expected Duration**: 10-15 minutes

**Success Criteria**:
- ✅ Performance report generated
- ✅ No degradation in metrics
- ✅ Cache hit rate > 80%

### Monthly Financial Operations

**Workflow**: `.github/workflows/monthly-finance.yml`

**What Happens**:
1. Calculates total revenue (ads + API subscriptions)
2. Itemizes operational costs
3. Calculates profit/loss
4. Generates transparency report
5. Publishes financial summary
6. Archives monthly data

**Expected Duration**: 5-10 minutes

**Success Criteria**:
- ✅ Revenue report generated
- ✅ All transactions reconciled
- ✅ Report published publicly

---

## Operator Responsibilities

### Daily Checks (5 minutes)

**Morning Review** (9:00 AM):
1. Verify daily operations completed successfully
2. Review generated content quality
3. Check error logs for anomalies
4. Verify website is accessible

**Quick Checklist**:
```bash
# Check latest workflow run
gh run list --limit 1 --workflow=daily-operations.yml

# View website status
curl -I https://tlv-business-pulse.vercel.app

# Check recent errors
vercel logs --limit=50 | grep ERROR
```

### Weekly Review (30 minutes)

**Every Monday**:
1. Review weekly performance report
2. Analyze traffic trends
3. Check API subscription metrics
4. Review revenue vs. projections
5. Identify optimization opportunities

**Checklist**:
- [ ] Review GitHub Actions execution times
- [ ] Check Vercel deployment health
- [ ] Review Supabase database size
- [ ] Verify API quota usage (OpenAI, external APIs)
- [ ] Check SEO rankings (optional)

### Monthly Review (2 hours)

**First Monday of Month**:
1. Deep dive into financial report
2. Review all automated workflows
3. Update dependencies (security patches)
4. Test disaster recovery procedures
5. Plan optimizations for next month

**Checklist**:
- [ ] Review monthly transparency report
- [ ] Audit API costs vs. revenue
- [ ] Update documentation (if needed)
- [ ] Test backup/restore procedures
- [ ] Review and update KPIs

---

## Health Check Procedures

### 1. Website Accessibility

**Check**: Website loads and responds quickly

```bash
# Manual check
curl -w "@curl-format.txt" -o /dev/null -s https://tlv-business-pulse.vercel.app

# Expected: HTTP 200, response time < 2s
```

**Indicators**:
- ✅ GREEN: Response time < 2s, HTTP 200
- ⚠️ YELLOW: Response time 2-5s, HTTP 200
- ❌ RED: Response time > 5s or HTTP error

### 2. API Endpoints

**Check**: All API endpoints functional

```bash
# Health endpoint
curl https://tlv-business-pulse.vercel.app/api/health

# Expected: {"status":"ok","timestamp":"..."}

# Public API
curl https://tlv-business-pulse.vercel.app/api/insights

# Expected: JSON array of insights
```

**Indicators**:
- ✅ GREEN: All endpoints return valid JSON, < 1s
- ⚠️ YELLOW: Some slowness (1-3s) but functional
- ❌ RED: Errors or timeouts

### 3. Database Connectivity

**Check**: Supabase database responding

```bash
# Via Supabase dashboard
# Check "Database" > "Health Check"

# Or via API
curl https://tlv-business-pulse.vercel.app/api/health/db
```

**Indicators**:
- ✅ GREEN: Query time < 500ms, connections available
- ⚠️ YELLOW: Query time 500-1000ms
- ❌ RED: Query failures or connection pool exhausted

### 4. Content Generation

**Check**: New content being generated daily

```bash
# Check recent insights
curl https://tlv-business-pulse.vercel.app/api/insights?limit=3

# Verify newest insight is from today
```

**Indicators**:
- ✅ GREEN: New content published today
- ⚠️ YELLOW: Last content from yesterday
- ❌ RED: No new content in 48+ hours

### 5. GitHub Actions Status

**Check**: All workflows executing successfully

```bash
# Check workflow runs
gh run list --limit 10

# View specific workflow
gh run view <run-id>
```

**Indicators**:
- ✅ GREEN: Last 5 runs successful
- ⚠️ YELLOW: 1-2 failures in last 5 runs
- ❌ RED: 3+ consecutive failures

### 6. Resource Usage

**Check**: System resources within limits

**Vercel**:
- Bandwidth: < 80% of plan limit
- Build minutes: < 80% of plan limit
- Function executions: Distributed evenly

**Supabase**:
- Database size: < 400MB (free tier limit: 500MB)
- Monthly queries: < 2M (free tier limit: 2.5M)

**OpenAI**:
- Monthly token usage: Track costs
- Expected: ~$5-10/month for 3 insights/day

**Indicators**:
- ✅ GREEN: All resources < 70% of limits
- ⚠️ YELLOW: Any resource 70-90% of limits
- ❌ RED: Any resource > 90% of limits

---

## Common Issues & Troubleshooting

### Issue 1: Daily Operations Failed

**Symptoms**:
- GitHub Actions workflow shows failure
- No new content generated
- Error in workflow logs

**Diagnosis**:
```bash
# View failed workflow
gh run list --workflow=daily-operations.yml --status=failure --limit=1
gh run view <run-id> --log-failed
```

**Common Causes**:
1. **API Rate Limit**: Tel Aviv data API may be down or rate-limited
2. **OpenAI API Error**: Token limit exceeded or service outage
3. **Database Connection**: Supabase connection timeout

**Solutions**:
```bash
# Retry the workflow manually
gh workflow run daily-operations.yml

# Check API health
curl https://data.tel-aviv.gov.il/api/health

# Verify environment variables in Vercel
vercel env ls
```

### Issue 2: Website is Slow

**Symptoms**:
- Response times > 5 seconds
- User complaints about performance
- High CPU usage

**Diagnosis**:
```bash
# Check Vercel analytics
vercel inspect <deployment-url>

# View recent logs
vercel logs --limit=100
```

**Solutions**:
1. Clear caches: Redeploy to clear edge cache
2. Optimize images: Check for large unoptimized images
3. Database indexes: Verify Supabase indexes are created
4. Review recent code changes: Rollback if issue started recently

### Issue 3: No Revenue Being Tracked

**Symptoms**:
- Dashboard shows $0 revenue
- Stripe webhook not firing
- AdSense not showing impressions

**Diagnosis**:
```bash
# Check Stripe webhooks
curl https://tlv-business-pulse.vercel.app/api/webhook/stripe \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'

# Verify environment variables
vercel env ls | grep STRIPE
```

**Solutions**:
1. Verify Stripe webhook URL is configured correctly
2. Check AdSense code is properly placed
3. Ensure site has traffic (revenue requires visitors)

### Issue 4: Database Storage Full

**Symptoms**:
- Supabase shows > 90% storage used
- Write operations failing
- Error: "Database storage quota exceeded"

**Diagnosis**:
```bash
# Check database size
# Via Supabase dashboard: Settings > Usage
```

**Solutions**:
1. **Immediate**: Archive old data to external storage
2. **Short-term**: Upgrade Supabase plan
3. **Long-term**: Implement data retention policy

```sql
-- Archive old insights (older than 6 months)
DELETE FROM insights WHERE created_at < NOW() - INTERVAL '6 months';

-- Vacuum database
VACUUM FULL;
```

### Issue 5: GitHub Actions Not Running

**Symptoms**:
- Scheduled workflows not executing
- Cron jobs missed
- Last run was days ago

**Diagnosis**:
```bash
# Check workflow status
gh workflow list
gh workflow view daily-operations.yml
```

**Common Causes**:
1. Repository not active (GitHub disables actions on inactive repos)
2. Workflow disabled manually
3. GitHub Actions outage

**Solutions**:
```bash
# Re-enable workflow
gh workflow enable daily-operations.yml

# Trigger manual run
gh workflow run daily-operations.yml

# Check GitHub status
curl https://www.githubstatus.com/api/v2/status.json
```

---

## Emergency Procedures

### Emergency 1: Complete Site Down

**Severity**: CRITICAL

**Immediate Actions** (Within 5 minutes):
1. Check Vercel status: https://vercel-status.com
2. Check deployment logs: `vercel logs --follow`
3. Verify DNS: `nslookup tlv-business-pulse.vercel.app`
4. Rollback to last working deployment: `vercel rollback`

**Communication**:
- Post status update to GitHub Issues
- Update any status page (if configured)

### Emergency 2: Data Breach Suspected

**Severity**: CRITICAL

**Immediate Actions**:
1. Rotate all API keys immediately
2. Review Vercel and Supabase access logs
3. Check for unauthorized database access
4. Disable API endpoints if necessary

```bash
# Rotate environment variables
vercel env rm OPENAI_API_KEY
vercel env add OPENAI_API_KEY

# Check Supabase logs
# Go to Supabase Dashboard > Logs > API
```

### Emergency 3: Unexpected High Costs

**Severity**: HIGH

**Immediate Actions**:
1. Check API usage in all services
2. Set up billing alerts if not already configured
3. Temporarily disable non-critical workflows

```bash
# Disable daily operations temporarily
gh workflow disable daily-operations.yml

# Check recent API usage
# OpenAI: https://platform.openai.com/usage
# Vercel: vercel inspect --usage
```

### Emergency 4: Content Quality Issues

**Severity**: MEDIUM

**Immediate Actions**:
1. Pause content generation workflow
2. Review recently generated content
3. Check OpenAI API logs for errors
4. Manually review/edit problematic content

```bash
# Disable content generation
gh workflow disable daily-operations.yml

# Review recent content
curl https://tlv-business-pulse.vercel.app/api/insights?limit=10
```

---

## Performance Optimization

### Regular Optimizations

**Weekly**:
- Review slow API endpoints (> 1s response time)
- Optimize database queries
- Update caching strategies
- Compress images and assets

**Monthly**:
- Update dependencies
- Review and optimize bundle size
- Database maintenance (vacuum, reindex)
- Review and update SEO strategies

### Monitoring Metrics

**Key Performance Indicators (KPIs)**:

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Website Response Time | < 2s | > 5s |
| API Response Time | < 500ms | > 2s |
| Database Query Time | < 200ms | > 1s |
| Daily Uptime | 99.9% | < 99% |
| Content Generation Success | 100% | < 90% |
| Monthly Revenue | > $50 | < $20 |
| Cost per Insight | < $0.50 | > $2 |

### Scaling Considerations

**When to Scale**:
- Consistent traffic > 10,000 daily visitors
- API subscriptions > 50 users
- Database size > 400MB
- Function execution time consistently > 5s

**Scaling Actions**:
1. Upgrade Vercel plan for better performance
2. Upgrade Supabase plan for more storage
3. Implement CDN for static assets
4. Add caching layers (Redis)
5. Optimize database with read replicas

---

## Appendix

### Useful Commands Reference

```bash
# Deployment
vercel deploy --prod                    # Deploy to production
vercel rollback                         # Rollback to previous deployment
vercel inspect <url>                    # Inspect deployment

# Logs
vercel logs --follow                    # Real-time logs
vercel logs --limit=100 | grep ERROR   # Recent errors

# Environment Variables
vercel env ls                           # List all env vars
vercel env add KEY                      # Add new env var
vercel env rm KEY                       # Remove env var

# GitHub Actions
gh run list --limit 10                  # Recent workflow runs
gh run view <run-id>                    # View specific run
gh workflow run <workflow-name>         # Trigger manual run
gh workflow disable <workflow-name>     # Disable workflow
gh workflow enable <workflow-name>      # Enable workflow

# Database (via Supabase SQL Editor)
SELECT COUNT(*) FROM insights;          # Total insights
SELECT COUNT(*) FROM businesses;        # Total businesses
SELECT pg_size_pretty(pg_database_size('postgres'));  # DB size
```

### Contact & Support

**For Issues**:
- GitHub Issues: https://github.com/yourusername/tlv-business-pulse/issues
- GitHub Discussions: https://github.com/yourusername/tlv-business-pulse/discussions

**Service Status Pages**:
- Vercel: https://vercel-status.com
- GitHub: https://www.githubstatus.com
- OpenAI: https://status.openai.com
- Supabase: https://status.supabase.com

---

**Last Updated**: 2025-11-17
**Version**: 1.0.0
