# 🚀 Deploy TLV Business Pulse - Step by Step

Your autonomous business is ready to go live! Follow these exact steps.

## Prerequisites (Get These First)

You'll need accounts on these services (all have free tiers):

1. **Supabase** - Database → https://supabase.com/dashboard/sign-up
2. **OpenAI** - AI Content → https://platform.openai.com/signup
3. **Vercel** - Hosting → https://vercel.com/signup
4. **GitHub** - Already have it! ✓

Total Time: **15 minutes**
Cost: **$0** (using free tiers)

---

## Step 1: Set Up Supabase Database (5 minutes)

### 1.1 Create Project
```
→ Go to: https://supabase.com/dashboard
→ Click "New Project"
→ Name: tlv-business-pulse
→ Database Password: (create a strong password - save it!)
→ Region: Choose closest to you
→ Click "Create new project"
→ Wait ~2 minutes for provisioning
```

### 1.2 Get Your API Credentials
```
→ Go to Project Settings (gear icon)
→ Click "API" in sidebar
→ Copy these TWO values:
   ✓ Project URL (https://xxxxx.supabase.co)
   ✓ anon public key (starts with "eyJ...")
```

### 1.3 Run Database Schema
```
→ Click "SQL Editor" in sidebar (</> icon)
→ Click "New query"
→ Open: lib/db/schema.sql from repository
→ Copy ENTIRE contents
→ Paste into SQL Editor
→ Click "Run" (or press Cmd/Ctrl + Enter)
→ Should see: "Success. No rows returned"
```

**✅ Supabase Complete!** You now have:
- Database with 6 tables ready
- API URL and key saved

---

## Step 2: Get OpenAI API Key (2 minutes)

### 2.1 Create Account & Get Credits
```
→ Go to: https://platform.openai.com/signup
→ Sign up (new users get $5 free credit)
→ Verify email
```

### 2.2 Create API Key
```
→ Go to: https://platform.openai.com/api-keys
→ Click "+ Create new secret key"
→ Name: "TLV Business Pulse"
→ Click "Create secret key"
→ COPY THE KEY IMMEDIATELY (starts with "sk-...")
→ Save it somewhere safe (you won't see it again!)
```

**✅ OpenAI Complete!** You have API key saved.

---

## Step 3: Deploy to Vercel (5 minutes)

### 3.1 Import Repository
```
→ Go to: https://vercel.com/new
→ Click "Import Git Repository"
→ Find: wildcard/tlv-business-pulse
→ Click "Import"
```

### 3.2 Configure Environment Variables

Click "Environment Variables" and add these **6 variables**:

| Variable Name               | Value                                    | Where to Get It           |
|-----------------------------|------------------------------------------|---------------------------|
| `SUPABASE_URL`             | https://xxxxx.supabase.co                | Supabase → Settings → API |
| `SUPABASE_ANON_KEY`        | eyJhbGc...                               | Supabase → Settings → API |
| `OPENAI_API_KEY`           | sk-proj-...                              | OpenAI Platform           |
| `NEXT_PUBLIC_SITE_URL`     | (leave empty for now, update after)      | -                         |
| `STRIPE_SECRET_KEY`        | sk_test_placeholder (optional)           | -                         |
| `ENABLE_SOCIAL_POSTS`      | false                                    | -                         |

### 3.3 Deploy!
```
→ Click "Deploy"
→ Wait ~2 minutes for build
→ You'll see: "Your project has been deployed!"
→ Click "Visit" to see your live site
```

### 3.4 Update Site URL
```
→ Copy your Vercel URL (e.g., tlv-business-pulse.vercel.app)
→ Go to Vercel Project Settings
→ Click "Environment Variables"
→ Edit NEXT_PUBLIC_SITE_URL
→ Paste your full URL: https://your-project.vercel.app
→ Click "Save"
→ Click "Redeploy" on latest deployment
```

**✅ Vercel Complete!** Your site is LIVE at: https://your-project.vercel.app

---

## Step 4: Configure GitHub Actions (3 minutes)

### 4.1 Add Repository Secrets
```
→ Go to: https://github.com/wildcard/tlv-business-pulse/settings/secrets/actions
→ Click "New repository secret" for each of these:
```

Add these **4 secrets**:

| Secret Name             | Value                              |
|-------------------------|------------------------------------|
| `SUPABASE_URL`         | (same as Vercel)                   |
| `SUPABASE_ANON_KEY`    | (same as Vercel)                   |
| `OPENAI_API_KEY`       | (same as Vercel)                   |
| `NEXT_PUBLIC_SITE_URL` | https://your-project.vercel.app    |

### 4.2 Enable Workflows
```
→ Go to: https://github.com/wildcard/tlv-business-pulse/actions
→ You'll see: "Workflows aren't being run on this fork"
→ Click "I understand my workflows, go ahead and enable them"
```

**✅ GitHub Actions Complete!** Automation is ready.

---

## Step 5: Test First Autonomous Operation (2 minutes)

### 5.1 Manual Trigger
```
→ Go to: https://github.com/wildcard/tlv-business-pulse/actions
→ Click "Autonomous Business Operations"
→ Click "Run workflow" (right side)
→ Select operation: "fetch-data"
→ Click green "Run workflow" button
```

### 5.2 Monitor Execution
```
→ Click on the running workflow
→ Click "Daily Autonomous Operations"
→ Watch logs in real-time
→ Should complete in ~30 seconds
→ Look for: "✅ Fetched 12,000+ businesses"
```

### 5.3 Verify Data in Database
```
→ Go back to Supabase
→ Click "Table Editor"
→ Click "businesses" table
→ You should see thousands of Tel Aviv businesses!
```

**✅ First Operation Complete!** Your autonomous business is working!

---

## 🎉 YOU'RE LIVE!

Your autonomous business is now operating! Here's what to check:

### Test Your Live Site

1. **Home Page**
   ```
   → Visit: https://your-project.vercel.app
   → Should see: Beautiful landing page
   ```

2. **Dashboard**
   ```
   → Visit: https://your-project.vercel.app/dashboard
   → Should see: Real-time metrics
   → Total businesses: 12,000+
   → New today: (varies)
   ```

3. **API Documentation**
   ```
   → Visit: https://your-project.vercel.app/api-docs
   → Should see: API endpoints and examples
   ```

4. **Test API**
   ```bash
   curl https://your-project.vercel.app/api/businesses?limit=5
   ```
   → Should return JSON with Tel Aviv businesses

---

## What Happens Next (Automatically)

### Daily (3:00 AM UTC)
- 📊 Fetches latest business data
- 🤖 Generates 3 AI articles
- 📈 Updates dashboard metrics

### Every 15 Minutes
- 🩺 Health check all systems
- ⚠️ Alerts on failures

### Weekly
- 🔧 System optimization
- 📊 SEO improvements

### Monthly
- 💰 Financial report
- 📊 Transparency update

---

## Monitoring Your Business

### GitHub Actions Logs
```
https://github.com/wildcard/tlv-business-pulse/actions
```
→ See all automated operations
→ Check for errors
→ View execution history

### Vercel Deployment Logs
```
https://vercel.com/dashboard
```
→ Monitor site performance
→ Check build logs
→ View analytics

### Supabase Database
```
https://supabase.com/dashboard
```
→ Browse data tables
→ Run SQL queries
→ Monitor database health

---

## Troubleshooting

### Build Failed on Vercel?
```
→ Check Environment Variables are all set
→ Verify no typos in API keys
→ Check build logs for specific error
→ Re-deploy after fixing
```

### GitHub Action Failed?
```
→ Check Secrets are added correctly
→ Verify Supabase is accessible
→ Check OpenAI API key is valid
→ Review workflow logs for details
```

### No Data Showing?
```
→ Verify database schema was created
→ Check fetch-data workflow ran successfully
→ Look at Supabase table editor
→ Run manual workflow again
```

### API Errors?
```
→ Check NEXT_PUBLIC_SITE_URL is set
→ Verify Supabase credentials
→ Test database connection
→ Check API route logs in Vercel
```

---

## Optional Enhancements

### Add Stripe for Payments
```
→ Sign up: https://stripe.com
→ Get API keys: Dashboard → Developers → API keys
→ Add to Vercel & GitHub Secrets:
   • STRIPE_SECRET_KEY
   • STRIPE_PRICE_ID (create a product first)
```

### Enable Social Media Posts
```
→ Get Twitter API access
→ Get LinkedIn credentials  
→ Add to environment variables
→ Set ENABLE_SOCIAL_POSTS=true
```

### Custom Domain
```
→ Go to Vercel project settings
→ Click "Domains"
→ Add your domain
→ Update NEXT_PUBLIC_SITE_URL
```

---

## Cost Breakdown (Monthly)

### Free Tier (Recommended to Start)
- Supabase: Free (500MB database, 50K requests/month)
- OpenAI: $5-10 (GPT-4 for articles)
- Vercel: Free (100GB bandwidth, unlimited deployments)
- GitHub Actions: Free (2000 minutes/month)

**Total: $5-10/month**

### Scaling Up
- Supabase Pro: $25/month (8GB database, 500K requests)
- OpenAI: $20/month (more articles)
- Vercel Pro: $20/month (more bandwidth)

**Total: $65/month** (should have revenue to cover by then!)

---

## Success Metrics

### Week 1
- ✓ Site is live
- ✓ 12,000+ businesses in database
- ✓ 21+ articles published (3 per day)
- ✓ First organic visitors

### Month 1
- ✓ 90+ articles published
- ✓ 100+ pages indexed by Google
- ✓ 1,000+ unique visitors
- ✓ First API subscriber

### Month 3
- ✓ 270+ articles
- ✓ 5,000+ visitors/month
- ✓ $200-500 revenue
- ✓ 10+ API subscribers

### Month 6
- ✓ 540+ articles
- ✓ 20,000+ visitors/month
- ✓ $1,000+ revenue
- ✓ Fully self-sustaining

---

## Support & Community

- **Documentation**: Check README.md
- **Issues**: https://github.com/wildcard/tlv-business-pulse/issues
- **Discussions**: GitHub Discussions tab

---

## 🚀 Congratulations!

You've just launched a fully autonomous online business!

It will now:
- ✅ Operate 24/7 without you
- ✅ Generate content automatically
- ✅ Manage itself
- ✅ Generate revenue
- ✅ Report transparently

**The future of business is autonomous. You just built it!** 🎉

---

Need help? Check the logs first, then open a GitHub issue!
