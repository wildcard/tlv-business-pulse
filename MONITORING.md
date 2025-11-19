# TLV Business Pulse - Monitoring & Health Checks

## Quick Health Check Dashboard

Use this as your **daily 2-minute health check** to verify the autonomous business is running correctly.

```bash
# Run this comprehensive health check script
curl -s https://tlv-business-pulse.vercel.app/api/health | jq '.'
```

---

## Daily Health Check Procedure (2 Minutes)

### Morning Checklist (Every Day at 9:00 AM)

Perform these checks to verify the autonomous operations completed successfully overnight:

#### ✅ 1. Verify Daily Operations Ran Successfully

```bash
# Check if last workflow run was successful
gh run list --workflow=daily-operations.yml --limit=1

# Expected output: ✓ completed (successful)
# RED FLAG: If status shows "failure" or last run > 24 hours ago
```

**What to look for**:
- ✅ Status: Completed
- ✅ Conclusion: Success
- ✅ Run time: Within last 24 hours (should run at 6 AM IST)

#### ✅ 2. Verify New Content Was Published

```bash
# Check latest insights
curl -s https://tlv-business-pulse.vercel.app/api/insights?limit=1 | jq '.[0].created_at'

# Expected: Today's date
# RED FLAG: If date is from yesterday or older
```

**What to look for**:
- ✅ Created date: Today
- ✅ Content quality: Reads naturally, makes sense
- ✅ No errors or API response issues

#### ✅ 3. Verify Website is Accessible

```bash
# Quick website check
curl -I https://tlv-business-pulse.vercel.app

# Expected: HTTP/2 200
# RED FLAG: HTTP 4xx or 5xx errors
```

**What to look for**:
- ✅ HTTP Status: 200 OK
- ✅ Response time: < 2 seconds
- ✅ No certificate errors

#### ✅ 4. Check for Critical Errors

```bash
# View recent error logs
vercel logs --limit=50 | grep -i "error\|failed\|exception"

# Expected: No critical errors (minor warnings OK)
# RED FLAG: Database errors, API failures, authentication issues
```

**What to look for**:
- ✅ No critical errors
- ⚠️ Minor warnings acceptable (rate limits, timeouts with retries)
- ❌ RED FLAG: Database connection errors, API authentication failures

#### ✅ 5. Verify Resource Usage is Normal

**Quick Check via Dashboards**:
1. **Vercel**: https://vercel.com/dashboard → Check bandwidth and build minutes
2. **Supabase**: Supabase Dashboard → Database size should be < 400MB
3. **OpenAI**: Platform Dashboard → Monthly spend tracking

**Expected Values**:
- ✅ Vercel bandwidth: Growing steadily, not spiking
- ✅ Supabase storage: < 400MB (80% of free tier)
- ✅ OpenAI costs: ~$0.15-0.30 per day (~$5-10/month)

---

## Automated Health Checks (System Self-Monitoring)

The system performs automatic health checks every hour. You can review these to catch issues early.

### Hourly Health Check Workflow

**File**: `.github/workflows/health-check.yml`

**What it Monitors**:
1. Website uptime and response time
2. API endpoint functionality
3. Database connectivity
4. Critical environment variables
5. Disk space and resource usage

**How to Review**:
```bash
# Check recent health check runs
gh run list --workflow=health-check.yml --limit=24

# View latest health check details
gh run view $(gh run list --workflow=health-check.yml --limit=1 --json databaseId --jq '.[0].databaseId')
```

**Expected**: All checks passing with ✓ green status

---

## Weekly Deep Dive (30 Minutes)

Perform this every **Monday at 10:00 AM** to review the week's operations.

### 1. Review GitHub Actions Performance

```bash
# Get all workflow runs from last 7 days
gh run list --limit=50 --created=$(date -d '7 days ago' +%Y-%m-%d)

# Calculate success rate
# Expected: > 95% success rate
```

**Metrics to Check**:
- Total runs: ~200 (7 days × ~28 runs/day)
- Success rate: > 95%
- Average execution time: Stable (no significant increases)

### 2. Analyze Traffic and Engagement

**Vercel Analytics Dashboard**:
1. Go to https://vercel.com/dashboard
2. Select tlv-business-pulse project
3. Navigate to Analytics

**Key Metrics**:
| Metric | Week 1 Target | Growth Target |
|--------|---------------|---------------|
| Unique Visitors | 50+ | +20%/week |
| Page Views | 200+ | +25%/week |
| Avg. Session | 30s+ | Increasing |
| Bounce Rate | < 70% | Decreasing |

### 3. Review Content Quality

**Manual Spot Check**:
1. Read 3 random insights from the week
2. Verify they make factual sense
3. Check for repetitive patterns
4. Ensure SEO titles are unique

```bash
# Get random insights from this week
curl -s "https://tlv-business-pulse.vercel.app/api/insights?limit=21" | jq '.[] | .title'
```

**Quality Indicators**:
- ✅ Diverse topics (not repeating same theme)
- ✅ Factually accurate business data
- ✅ No obvious AI hallucinations
- ✅ Good SEO titles (unique, compelling)

### 4. Database Health Check

```bash
# Connect to Supabase and run these queries
```

**SQL Queries**:
```sql
-- Check total records
SELECT
  (SELECT COUNT(*) FROM businesses) as total_businesses,
  (SELECT COUNT(*) FROM insights) as total_insights,
  (SELECT COUNT(*) FROM api_subscriptions) as total_subscribers;

-- Check database size
SELECT pg_size_pretty(pg_database_size('postgres')) as db_size;

-- Check for slow queries (if enabled)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

**Expected Results**:
- Total businesses: Growing (new registrations > closures)
- Total insights: Growing (~21/week = 3/day)
- Database size: < 400MB
- No queries with exec_time > 1000ms

### 5. Review API and Service Costs

**Cost Tracking**:
```bash
# Expected monthly costs:
# - Vercel: $0 (Free tier)
# - Supabase: $0 (Free tier)
# - OpenAI: ~$5-10/month
# - GitHub Actions: $0 (Free tier - 2000 min/month)
# TOTAL: ~$5-10/month
```

**Check**:
1. **OpenAI**: https://platform.openai.com/usage
   - Should be ~$0.30/day or ~$9/month
   - RED FLAG if > $20/month

2. **Vercel**: https://vercel.com/dashboard/usage
   - Should be well within free tier (100GB bandwidth)
   - RED FLAG if approaching limits

3. **Supabase**: Dashboard → Settings → Usage
   - Database size: < 80% of free tier
   - Monthly queries: < 2M (free tier limit 2.5M)

---

## Monthly Review (2 Hours)

Perform on the **first Monday of each month**.

### 1. Financial Performance Review

**Revenue Streams**:
```bash
# Review Stripe dashboard for API subscriptions
# Review Google AdSense for ad revenue
# Calculate total monthly revenue
```

**Expected Month 1 Targets**:
- API Subscriptions: 0-5 subscribers ($0-95)
- AdSense Revenue: $0-50
- Total Revenue: $0-145

**Key Questions**:
1. Are we on track for $50+ revenue by Month 1?
2. Which revenue stream is performing best?
3. What can we optimize?

### 2. Technical Debt Assessment

**Review**:
- Dependency updates needed
- Security vulnerabilities (run `npm audit`)
- Code quality issues
- Performance bottlenecks

```bash
# Check for outdated dependencies
npm outdated

# Security audit
npm audit

# Check bundle size
npm run build
# Review .next/analyze output
```

### 3. SEO Performance

**Check Google Search Console** (if set up):
- Impressions trend
- Click-through rate
- Average position
- Index coverage issues

**Manual Search Test**:
```bash
# Test if content is being indexed
site:tlv-business-pulse.vercel.app
```

### 4. Disaster Recovery Test

**Backup Verification**:
1. Export Supabase database
2. Verify export completes successfully
3. Test restoration to dev environment (optional)

```bash
# Export database (via Supabase dashboard)
# Projects → Database → Backups → Download
```

### 5. Update Documentation

**Review and update**:
- OPERATIONS.md - Any new procedures
- MONITORING.md - Updated metrics/thresholds
- README.md - Current stats and status
- CHANGELOG.md - Notable changes this month

---

## Alert Thresholds & Escalation

### Critical Alerts (Immediate Action Required)

| Alert | Threshold | Action |
|-------|-----------|--------|
| Website Down | HTTP 5xx for > 5 min | Check Vercel status, rollback deployment |
| Database Unavailable | Connection errors | Check Supabase status, verify credentials |
| No Content Generated | 48+ hours no new insights | Check workflow logs, trigger manual run |
| Cost Spike | Daily cost > $5 | Review API usage, disable workflows if needed |
| Security Breach | Unauthorized access detected | Rotate all credentials, review access logs |

### Warning Alerts (Check Within 24 Hours)

| Alert | Threshold | Action |
|-------|-----------|--------|
| Slow Response Time | API > 5s response time | Review logs, optimize queries |
| Low Storage | Supabase > 80% full | Archive old data, plan upgrade |
| Workflow Failures | 3+ consecutive failures | Review logs, fix underlying issue |
| Traffic Drop | 50% decrease week-over-week | Check for issues, review SEO |

### Info Alerts (Review Weekly)

| Alert | Threshold | Action |
|-------|-----------|--------|
| Resource Usage High | Any service > 70% quota | Monitor, plan for scaling |
| Content Quality | Manual review flags issues | Adjust prompts, review AI output |
| API Rate Limits | Hitting rate limits regularly | Implement caching, request limit increase |

---

## Monitoring Tools & Dashboards

### Primary Dashboards

1. **Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Shows: Deployments, analytics, logs, bandwidth
   - Check: Daily

2. **Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Shows: Database health, API usage, storage
   - Check: Weekly

3. **GitHub Actions**
   - URL: https://github.com/yourusername/tlv-business-pulse/actions
   - Shows: Workflow runs, failures, execution times
   - Check: Daily

4. **OpenAI Usage Dashboard**
   - URL: https://platform.openai.com/usage
   - Shows: Token usage, costs
   - Check: Weekly

### Custom Health Check Endpoint

The application provides a custom health check endpoint:

```bash
# Comprehensive health check
curl https://tlv-business-pulse.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-11-17T10:00:00Z",
  "checks": {
    "database": "ok",
    "api": "ok",
    "cache": "ok"
  },
  "metrics": {
    "uptime": "99.9%",
    "responseTime": "245ms",
    "lastContentGenerated": "2025-11-17T06:15:00Z"
  }
}
```

### Setting Up Monitoring Alerts (Optional)

**External Monitoring Services** (Recommended):
1. **UptimeRobot** (Free): Website uptime monitoring
2. **Better Uptime** (Free tier): Advanced monitoring + status page
3. **Sentry** (Free tier): Error tracking and performance

**Configuration**:
```bash
# Example: UptimeRobot setup
# 1. Sign up at https://uptimerobot.com
# 2. Add monitor: https://tlv-business-pulse.vercel.app
# 3. Set alert contact (email)
# 4. Monitor interval: 5 minutes
```

---

## Troubleshooting Common Issues

### Issue: "No New Content Today"

**Diagnostic Steps**:
```bash
# 1. Check if workflow ran
gh run list --workflow=daily-operations.yml --limit=1

# 2. If it failed, view logs
gh run view <run-id> --log-failed

# 3. Common causes:
# - OpenAI API rate limit
# - Tel Aviv data API unavailable
# - Database connection timeout
```

**Fix**:
```bash
# Trigger manual run
gh workflow run daily-operations.yml

# Monitor the run
gh run watch
```

### Issue: "Website Slow"

**Diagnostic Steps**:
```bash
# 1. Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://tlv-business-pulse.vercel.app

# 2. Check Vercel logs for errors
vercel logs --limit=100 | grep -E "error|slow|timeout"

# 3. Check database query performance
# (Run slow query check in Supabase SQL editor)
```

**Fix**:
- Clear edge cache: `vercel deploy --force`
- Optimize database queries
- Review recent code changes

### Issue: "High Costs"

**Diagnostic Steps**:
```bash
# 1. Check OpenAI usage
# Go to: https://platform.openai.com/usage

# 2. Review daily token consumption
# Expected: ~3,000-5,000 tokens/day (3 insights)
# RED FLAG: > 20,000 tokens/day
```

**Fix**:
- Review prompts for efficiency
- Check for runaway generation loops
- Temporarily disable workflows: `gh workflow disable daily-operations.yml`

---

## Automation Validation Checklist

Use this checklist to verify the autonomous system is functioning correctly:

### Daily Automation ✓

- [ ] Daily operations workflow executed at 6 AM IST
- [ ] New business data fetched successfully
- [ ] 3 new insights generated and published
- [ ] Website updated with new content
- [ ] No critical errors in logs
- [ ] All API endpoints responding correctly

### Weekly Automation ✓

- [ ] Weekly optimization workflow executed
- [ ] Performance report generated
- [ ] Database maintenance completed
- [ ] Caching strategies updated
- [ ] No degradation in metrics

### Monthly Automation ✓

- [ ] Monthly financial report generated
- [ ] Revenue accurately calculated
- [ ] Transparency report published
- [ ] All transactions reconciled
- [ ] Metrics archived

---

## Success Metrics & KPIs

### Operational Health

| Metric | Target | Status |
|--------|--------|--------|
| Website Uptime | 99.9% | 🟢 Monitor daily |
| Average Response Time | < 2s | 🟢 Monitor daily |
| Daily Operation Success Rate | 100% | 🟢 Monitor daily |
| Content Generation Success | 100% | 🟢 Monitor daily |

### Business Health

| Metric | Month 1 Target | Month 6 Target |
|--------|----------------|----------------|
| Daily Visitors | 100+ | 5,000+ |
| Monthly Revenue | $50+ | $1,000+ |
| API Subscribers | 5+ | 100+ |
| Content Pieces | 90+ | 540+ |

### Cost Efficiency

| Metric | Target | Alert If |
|--------|--------|----------|
| Cost per Insight | < $0.50 | > $2.00 |
| Monthly Operating Cost | < $15 | > $50 |
| Revenue per Visit | > $0.01 | < $0.001 |

---

## Emergency Contacts & Resources

### Service Status Pages
- **Vercel**: https://vercel-status.com
- **GitHub**: https://www.githubstatus.com
- **OpenAI**: https://status.openai.com
- **Supabase**: https://status.supabase.com

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API Docs**: https://platform.openai.com/docs

### Support Channels
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Community support and questions
- **Service Support**: Contact respective service providers for platform issues

---

## Appendix: Monitoring Scripts

### A. Daily Health Check Script

Create `scripts/health-check.sh`:

```bash
#!/bin/bash

echo "🏥 TLV Business Pulse - Daily Health Check"
echo "=========================================="

# 1. Website Check
echo -n "1. Website Status: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://tlv-business-pulse.vercel.app)
if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ OK ($HTTP_CODE)"
else
  echo "❌ FAILED ($HTTP_CODE)"
fi

# 2. Latest Content Check
echo -n "2. Latest Content: "
LATEST=$(curl -s https://tlv-business-pulse.vercel.app/api/insights?limit=1 | jq -r '.[0].created_at' | cut -d'T' -f1)
TODAY=$(date +%Y-%m-%d)
if [ "$LATEST" == "$TODAY" ]; then
  echo "✅ Published today"
else
  echo "⚠️  Last published: $LATEST"
fi

# 3. Workflow Status
echo -n "3. Daily Workflow: "
gh run list --workflow=daily-operations.yml --limit=1 --json conclusion --jq '.[0].conclusion' | \
  grep -q "success" && echo "✅ Success" || echo "❌ Failed"

# 4. API Check
echo -n "4. API Health: "
curl -s https://tlv-business-pulse.vercel.app/api/health | jq -r '.status' | \
  grep -q "healthy" && echo "✅ Healthy" || echo "❌ Unhealthy"

echo "=========================================="
echo "Health check complete!"
```

### B. Cost Monitoring Script

Create `scripts/cost-check.sh`:

```bash
#!/bin/bash

echo "💰 TLV Business Pulse - Cost Check"
echo "=================================="

# Estimated daily costs
OPENAI_DAILY=0.30
VERCEL_DAILY=0.00
SUPABASE_DAILY=0.00

TOTAL_DAILY=$(echo "$OPENAI_DAILY + $VERCEL_DAILY + $SUPABASE_DAILY" | bc)
TOTAL_MONTHLY=$(echo "$TOTAL_DAILY * 30" | bc)

echo "Estimated Daily Cost: \$$TOTAL_DAILY"
echo "Estimated Monthly Cost: \$$TOTAL_MONTHLY"
echo ""
echo "Verify actual costs at:"
echo "- OpenAI: https://platform.openai.com/usage"
echo "- Vercel: https://vercel.com/dashboard/usage"
echo "- Supabase: Dashboard → Settings → Usage"
```

---

**Last Updated**: 2025-11-17
**Version**: 1.0.0
