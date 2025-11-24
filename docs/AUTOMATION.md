# TLV Business Pulse - Automation Documentation

## Overview

TLV Business Pulse runs 24/7 with **zero human intervention** using GitHub Actions to orchestrate all operations. This document describes the complete automation system.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Workflows](#workflows)
3. [Scripts](#scripts)
4. [Notification System](#notification-system)
5. [Configuration](#configuration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Development Guide](#development-guide)

---

## System Architecture

### Core Principles

- **Fully Autonomous**: Zero human intervention required
- **Self-Healing**: Automatic recovery from common failures
- **Transparent**: All operations logged and reported
- **Resilient**: Retry logic and graceful degradation

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Daily Ops    │  │ Health Check │  │ Deployments  │     │
│  │ (6 AM IST)   │  │ (Every 15min)│  │ (On commit)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Weekly Opt   │  │ Monthly Fin  │  │ Daily Backup │     │
│  │ (Mondays)    │  │ (1st of mo.) │  │ (Midnight)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      TypeScript Scripts                     │
│  • detect-new-businesses.ts                                 │
│  • fetch-data.ts                                            │
│  • generate-content.ts                                      │
│  • health-check.ts                                          │
│  • generate-monitoring-report.ts                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│  • Supabase (Database)                                      │
│  • OpenAI (AI Content)                                      │
│  • Tel Aviv API (Business Data)                             │
│  • Stripe (Payments)                                        │
│  • Vercel (Hosting)                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Notification Channels                      │
│  • Email (SendGrid/Resend/SMTP)                             │
│  • SMS (Twilio - Critical alerts only)                      │
│  • Slack (Webhook - Optional)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflows

### 1. Autonomous Operations (`autonomous-operations.yml`)

**Schedule**: Daily at 6 AM IST (3 AM UTC)
**Purpose**: Main daily operations workflow

#### Operations:
1. **Detect New Businesses**
   - Fetches businesses registered in last 24 hours
   - Filters for unprocessed businesses
   - Generates websites for each new business
   - Sends notifications

2. **Fetch Business Data**
   - Updates existing business information
   - Detects changes and closures
   - Updates database

3. **Generate AI Content**
   - Creates insights and articles
   - Generates business descriptions
   - Updates SEO metadata

4. **Publish Content**
   - Publishes new content to website
   - Updates sitemaps
   - Notifies search engines

5. **Monitoring Report**
   - Generates system health report
   - Tracks performance metrics
   - Saves reports for analysis

6. **Health Check**
   - Verifies all systems operational
   - Tests critical endpoints
   - Sends alerts if issues detected

#### Error Handling:
- Each operation has `continue-on-error: true`
- Failures don't stop subsequent operations
- All errors logged and reported
- Email alerts sent on critical failures

#### Manual Trigger:
```bash
# Via GitHub UI: Actions → Autonomous Operations → Run workflow
# Or via CLI:
gh workflow run autonomous-operations.yml -f operation=all
```

---

### 2. Health Check (`health-check.yml`)

**Schedule**: Every 15 minutes
**Purpose**: Continuous system monitoring

#### Checks:
- ✅ Database connectivity (Supabase)
- ✅ API endpoints response
- ✅ Website accessibility
- ✅ External APIs (Tel Aviv, OpenAI, Stripe)
- ✅ Response time monitoring (< 2s acceptable)

#### Auto-Healing:
- Cache clearing
- Service verification
- Database connection reset

#### Alerts:
- **Email**: Sent on any critical failure
- **Slack**: Sent on critical failures (if configured)
- **SMS**: Reserved for persistent failures

#### Manual Trigger:
```bash
gh workflow run health-check.yml
```

---

### 3. Test Suite (`test.yml`)

**Schedule**: On every push
**Purpose**: Automated testing and quality assurance

#### Test Types:
1. **Linting**
   - ESLint code quality checks
   - TypeScript type checking

2. **Unit Tests**
   - Component tests
   - Utility function tests
   - Coverage reporting

3. **Integration Tests**
   - API endpoint tests
   - Database operations
   - Service integration

4. **E2E Tests**
   - Full user flows
   - Page navigation
   - Critical functionality

5. **Build Verification**
   - Next.js build success
   - Asset generation
   - Build size check

6. **Security Audit**
   - npm audit for vulnerabilities
   - Dependency checking
   - Security best practices

#### Results:
- Test summary posted to PR
- Coverage reports uploaded
- Blocks merge if tests fail

---

### 4. Weekly Optimization (`weekly-optimization.yml`)

**Schedule**: Every Monday at 3 AM IST
**Purpose**: System maintenance and optimization

#### Tasks:
1. **Traffic Analysis**
   - Analyze weekly patterns
   - Identify peak usage times
   - Generate traffic reports

2. **Performance Optimization**
   - Identify slow pages
   - Database query optimization
   - Image optimization

3. **Cache Management**
   - Clear stale caches
   - Update cache strategies
   - Optimize cache hit rates

4. **Database Maintenance**
   - VACUUM operations
   - ANALYZE statistics
   - Index optimization
   - Cleanup old data

5. **SEO Optimization**
   - Meta tag verification
   - Sitemap updates
   - Schema markup check
   - Internal linking analysis

#### Report:
- Weekly performance summary
- Improvement recommendations
- Resource usage statistics
- Emailed to administrators

---

### 5. Monthly Finance (`monthly-finance.yml`)

**Schedule**: 1st of each month at 4 AM IST
**Purpose**: Financial transparency and reporting

#### Operations:
1. **Revenue Calculation**
   - Stripe subscription revenue
   - API usage revenue
   - Total monthly revenue

2. **Cost Calculation**
   - Vercel hosting costs
   - Supabase database costs
   - OpenAI API costs
   - Other service costs

3. **Report Generation**
   - Detailed financial breakdown
   - Usage statistics
   - Cost optimization opportunities
   - Transparency commitment

4. **Data Archival**
   - Archive monthly data
   - Store historical reports
   - Maintain audit trail

#### Transparency:
- Reports published to repository
- Available in `reports/financial/`
- Committed to git history
- Publicly accessible

---

### 6. Database Backup (`backup.yml`)

**Schedule**: Daily at midnight IST
**Purpose**: Data safety and disaster recovery

#### Backup Process:
1. **Export Schema**
   - PostgreSQL schema dump
   - Table structures
   - Indexes and constraints

2. **Export Data**
   - Business records
   - Insights content
   - User data (if any)
   - System metadata

3. **Archive Creation**
   - Compressed tar.gz archive
   - SHA256 checksum generation
   - Manifest file creation

4. **Verification**
   - Checksum verification
   - Archive integrity test
   - Extraction test

5. **Storage**
   - GitHub Artifacts (90 days)
   - Optional: S3/Cloud storage
   - Retention policy enforcement

6. **Cleanup**
   - Remove backups > 90 days
   - Free up storage space

#### Recovery:
- Backups can be downloaded from GitHub
- Restoration instructions in manifest
- Test restorations monthly

---

### 7. Deployment (`deploy.yml`)

**Schedule**: On push to `main` branch
**Purpose**: Automated deployment with verification

#### Pipeline:
1. **Test**
   - Run linter
   - Check TypeScript
   - Run test suite

2. **Build**
   - Build Next.js application
   - Verify build artifacts
   - Check build size

3. **Deploy**
   - Deploy to Vercel production
   - Get deployment URL
   - Wait for propagation

4. **Smoke Tests**
   - Test homepage accessibility
   - Test API endpoints
   - Measure response times
   - Verify critical functionality

5. **Notifications**
   - **Success**: Email confirmation
   - **Failure**: Critical alert
   - **Slack**: Deployment status (optional)

#### Rollback:
- Vercel automatic rollback on failure
- Previous deployment remains accessible
- Manual rollback via Vercel dashboard

---

## Scripts

### 1. `scripts/detect-new-businesses.ts`

Detects and processes new business registrations.

#### Features:
- Fetches last 24 hours of registrations
- Filters for unprocessed businesses
- Verifies business data validity
- Generates website for each business
- Sends welcome emails (if configured)
- Comprehensive error handling
- Retry logic (3 attempts with backoff)

#### Usage:
```bash
npm run cron:detect
```

#### Error Handling:
- Retries failed API calls
- Continues on individual failures
- Alerts if > 10% fail
- Detailed logging for debugging

---

### 2. `scripts/fetch-data.ts`

Fetches and updates business data from Tel Aviv API.

#### Features:
- Fetches all business data
- Detects changes since last run
- Updates database
- Generates statistics

#### Usage:
```bash
npm run cron:fetch
```

---

### 3. `scripts/generate-content.ts`

Generates AI content for businesses and insights.

#### Features:
- Uses OpenAI GPT models
- Generates business descriptions
- Creates insight articles
- Updates SEO metadata

#### Usage:
```bash
npm run cron:generate
```

---

### 4. `scripts/health-check.ts`

Comprehensive system health verification.

#### Checks:
- Database connectivity
- API endpoints
- External services
- Response times
- Error rates

#### Usage:
```bash
npm run cron:health
```

#### Exit Codes:
- `0`: All systems healthy
- `1`: Critical failure detected

---

### 5. `scripts/generate-monitoring-report.ts`

Generates detailed monitoring and performance reports.

#### Metrics:
- System uptime
- Business processing stats
- API performance
- Error summary
- Resource usage
- Cost tracking

#### Output:
- Terminal-formatted report
- JSON data file
- Text report file
- Saved to `reports/` directory

#### Usage:
```bash
npm run cron:monitoring
```

---

## Notification System

### Location
`lib/notifications/notify.ts`

### Channels

#### 1. Email
**Services Supported:**
- SendGrid (recommended)
- Resend
- SMTP (generic)

**Configuration:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_api_key
EMAIL_FROM=noreply@tlv-business-pulse.com
EMAIL_TO=admin@tlv-business-pulse.com
```

**Use Cases:**
- Daily summaries
- Weekly reports
- Monthly financial reports
- Error notifications

---

#### 2. SMS (Twilio)
**Purpose**: Critical alerts only (high/critical priority)

**Configuration:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
TWILIO_TO=+0987654321
```

**Use Cases:**
- Critical system failures
- Persistent health check failures
- Security alerts

---

#### 3. Slack
**Purpose**: Optional team notifications

**Configuration:**
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_CHANNEL=#alerts
```

**Use Cases:**
- Deployment notifications
- Health check failures
- System status updates

---

### Priority Levels

| Priority | Email | SMS | Slack | Use Case |
|----------|-------|-----|-------|----------|
| Low | ✅ | ❌ | ❌ | Successful operations |
| Normal | ✅ | ❌ | ✅ | Daily summaries |
| High | ✅ | ✅ | ✅ | Failures, errors |
| Critical | ✅ | ✅ | ✅ | System down, security |

---

### Convenience Functions

```typescript
// New business processed
await notifyNewBusinessProcessed(businessName, success, details);

// Daily summary
await notifyDailySummary({
  businessesProcessed: 10,
  websitesGenerated: 10,
  errors: 0,
  successRate: 1.0
});

// Critical error
await notifyCriticalError(system, error, context);

// Health check failed
await notifyHealthCheckFailed(failedServices, details);

// Weekly report
await notifyWeeklyReport(report);

// Monthly financial report
await notifyMonthlyFinancialReport(report);
```

---

## Configuration

### Required Secrets

Configure these in GitHub Settings → Secrets and Variables → Actions:

#### Core Services
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_DB_PASSWORD=xxx

OPENAI_API_KEY=sk-your_openai_key_here

STRIPE_SECRET_KEY=your_stripe_secret_key_here

NEXT_PUBLIC_SITE_URL=https://tlv-business-pulse.vercel.app
```

#### Deployment
```
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
```

#### Notifications
```
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=SG.xxx
EMAIL_FROM=noreply@tlv-business-pulse.com
EMAIL_TO=admin@tlv-business-pulse.com
ALERT_EMAIL=alerts@tlv-business-pulse.com

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASSWORD=xxx

# Optional
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_FROM=+1234567890
TWILIO_TO=+0987654321

# Optional
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
SLACK_CHANNEL=#alerts
```

---

## Monitoring

### Real-Time Monitoring

1. **GitHub Actions Dashboard**
   - Go to Actions tab
   - View running/completed workflows
   - Check logs and artifacts

2. **Health Check Status**
   - Runs every 15 minutes
   - Email alerts on failures
   - Slack notifications (if configured)

3. **Monitoring Reports**
   - Daily reports in `reports/` directory
   - Accessible via GitHub
   - Historical data available

---

### Metrics Tracked

#### System Metrics
- Uptime percentage
- Response times (p50, p95, p99)
- Error rate
- Request volume

#### Business Metrics
- Total businesses
- New registrations (daily/weekly/monthly)
- Active vs closed businesses
- Processing success rate

#### Cost Metrics
- Monthly operational costs
- Cost per business
- Service-by-service breakdown
- Revenue (if applicable)

---

### Reports Available

1. **Daily Monitoring Report**
   - Location: `reports/monitoring-report-YYYY-MM-DD.txt`
   - Contains: System health, metrics, errors
   - Generated: Daily with operations

2. **Weekly Optimization Report**
   - Location: Workflow artifacts
   - Contains: Performance improvements, recommendations
   - Generated: Every Monday

3. **Monthly Financial Report**
   - Location: `reports/financial/YYYY-MM-report.md`
   - Contains: Revenue, costs, transparency statement
   - Generated: 1st of each month

4. **Backup Manifests**
   - Location: `backups/YYYY-MM-DD/manifest.json`
   - Contains: Backup details, checksums
   - Generated: Daily at midnight

---

## Troubleshooting

### Common Issues

#### 1. Health Check Failures

**Symptoms**: Receiving health check failure emails

**Diagnosis**:
```bash
# Check logs
gh run view --log

# Manual health check
npm run cron:health
```

**Solutions**:
- Database: Verify Supabase connection
- API: Check if Vercel deployment succeeded
- External: Check Tel Aviv API status

---

#### 2. Business Detection Not Processing

**Symptoms**: No new businesses being added

**Diagnosis**:
```bash
# Check detection logs
npm run cron:detect

# Check Tel Aviv API
curl "https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/964/query?where=1=1&returnCountOnly=true&f=json"
```

**Solutions**:
- Verify Tel Aviv API is responding
- Check database connectivity
- Review error logs in GitHub Actions
- Ensure OpenAI API key is valid

---

#### 3. Deployment Failures

**Symptoms**: Deployment workflow fails

**Diagnosis**:
```bash
# Check build locally
npm run build

# Check tests
npm run test:ci
```

**Solutions**:
- Fix failing tests
- Resolve build errors
- Check environment variables
- Verify Vercel configuration

---

#### 4. High Error Rate

**Symptoms**: > 10% of operations failing

**Actions**:
1. Check monitoring report for patterns
2. Review error logs in GitHub Actions
3. Verify all external services operational
4. Check rate limits on APIs
5. Review database query performance

---

#### 5. Notification Not Received

**Diagnosis**:
```bash
# Check email configuration
echo $EMAIL_SERVICE
echo $EMAIL_API_KEY

# Test notification manually
node -e "require('./lib/notifications/notify').sendNotification({subject:'Test',message:'Test',priority:'normal'},'email')"
```

**Solutions**:
- Verify email service credentials
- Check spam folder
- Confirm email addresses correct
- Review service API limits

---

### Debug Mode

To enable verbose logging:

```bash
# In workflow file, add:
env:
  DEBUG: true
  LOG_LEVEL: debug

# Or in script:
LOG_LEVEL=debug npm run cron:detect
```

---

### Manual Intervention

If automation fails and manual intervention is needed:

1. **Stop Scheduled Workflows**
   - Go to Actions → Workflow → ⋮ → Disable workflow

2. **Run Operations Manually**
   ```bash
   npm run cron:fetch
   npm run cron:detect
   npm run cron:generate
   npm run cron:health
   ```

3. **Fix Issues**
   - Review logs
   - Update code/configuration
   - Test locally

4. **Re-enable Workflows**
   - Actions → Workflow → ⋮ → Enable workflow

---

## Development Guide

### Adding New Workflows

1. **Create Workflow File**
   ```yaml
   # .github/workflows/my-workflow.yml
   name: My Workflow
   on:
     schedule:
       - cron: '0 0 * * *'
     workflow_dispatch:

   jobs:
     my-job:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         # ... steps
   ```

2. **Add Corresponding Script** (if needed)
   ```typescript
   // scripts/my-script.ts
   async function main() {
     // Implementation
   }

   if (require.main === module) {
     main();
   }
   ```

3. **Update package.json**
   ```json
   "scripts": {
     "my-script": "tsx scripts/my-script.ts"
   }
   ```

4. **Document in this file**
   - Add workflow description
   - Explain when it runs
   - Document any new scripts

---

### Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act

# Run workflow
act -j job-name

# Run with secrets
act -j job-name -s SUPABASE_URL=xxx
```

---

### Best Practices

1. **Always Include**:
   - Timeout limits
   - Error handling
   - Logging
   - Notifications on failure

2. **Use Secrets**:
   - Never hardcode credentials
   - Use GitHub Secrets
   - Rotate secrets regularly

3. **Monitor**:
   - Review workflow runs weekly
   - Check artifact sizes
   - Monitor execution times
   - Track failure rates

4. **Document**:
   - Update this file
   - Add inline comments
   - Document breaking changes
   - Maintain changelog

---

## Support

### Getting Help

1. **Check Documentation**
   - This file
   - README.md
   - OPERATIONS.md
   - MONITORING.md

2. **Review Logs**
   - GitHub Actions logs
   - Workflow artifacts
   - Error reports

3. **Test Locally**
   - Run scripts locally
   - Check environment variables
   - Verify dependencies

4. **Open Issue**
   - GitHub Issues
   - Include logs
   - Describe expected vs actual behavior
   - List steps to reproduce

---

## Changelog

### 2025-01-19
- ✅ Created comprehensive automation system
- ✅ Implemented all 7 workflows
- ✅ Created notification system
- ✅ Added business detection script
- ✅ Created monitoring report generator
- ✅ Documented entire system

---

## Future Enhancements

### Planned
- [ ] Machine learning for anomaly detection
- [ ] Advanced cost optimization
- [ ] Multi-region failover
- [ ] Real-time dashboard
- [ ] Slack bot for interactive management

### Under Consideration
- [ ] Kubernetes deployment option
- [ ] Multi-language support
- [ ] Advanced analytics platform
- [ ] Mobile app notifications
- [ ] GraphQL API

---

## Conclusion

This automation system ensures TLV Business Pulse operates autonomously, reliably, and transparently. All operations are logged, monitored, and reported. The system is designed to be resilient, self-healing, and require zero human intervention for normal operations.

For questions or issues, please refer to the troubleshooting section or open a GitHub issue.

---

**Last Updated**: January 19, 2025
**Version**: 1.0
**Maintained By**: Autonomous Business Development Foundation
