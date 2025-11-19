# Quick Start: Database Setup (5 Minutes)

Fast-track guide to get your database running.

## Step 1: Create Supabase Project (2 min)

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name it `tlv-business-pulse`
4. Generate a strong password (save it!)
5. Choose region closest to you
6. Click "Create project" and wait 2-3 minutes

## Step 2: Run Database Schema (1 min)

1. In Supabase, click **SQL Editor** in sidebar
2. Click **New Query**
3. Copy the entire contents of `docs/DATABASE_SCHEMA.sql`
4. Paste into the editor
5. Click **Run** (or Ctrl+Enter)
6. Wait for success message

✅ You should see: "TLV Business Pulse database schema created successfully!"

## Step 3: Get Your API Keys (30 sec)

1. Click **Settings** (gear icon) in Supabase sidebar
2. Go to **API** section
3. Copy these three values:

```bash
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Configure Environment (30 sec)

1. In your project, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and paste your keys:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_KEY=eyJhbGciOiJI...
OPENAI_API_KEY=sk-proj-xxx  # Get from platform.openai.com
```

## Step 5: Test Database (1 min)

```bash
# Install dependencies if needed
npm install

# Run test script
npx tsx scripts/test-database.ts
```

Expected output:
```
✅ ALL TESTS PASSED!
📊 Test Summary:
   ✓ Business created: abc123...
   ✓ Website generated: def456...
   ✓ Verification logged: ghi789...
   ...
🎉 Database is fully operational!
```

## Step 6: Start Development

```bash
npm run dev
```

Visit http://localhost:3000/api/health

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "up",
      "responseTime": 45
    }
  }
}
```

---

## ✅ Done!

Your database is ready. Next steps:

1. **View data**: Go to Supabase Table Editor to see tables
2. **Generate websites**: Start building the AI pipeline
3. **Connect real data**: Fetch from Tel Aviv Municipality API

---

## Troubleshooting

**Problem**: "Missing Supabase environment variables"
- **Fix**: Check `.env.local` has all three Supabase variables

**Problem**: "Failed to fetch businesses: relation does not exist"
- **Fix**: Re-run `docs/DATABASE_SCHEMA.sql` in Supabase SQL Editor

**Problem**: Test script fails with import errors
- **Fix**: Run `npm install` to install dependencies

**Problem**: "SUPABASE_SERVICE_KEY not found"
- **Fix**: Add the service_role key to `.env.local` (Step 4)

---

## What Got Created

### Database Tables (7)
- ✅ `businesses` - Core business data
- ✅ `generated_websites` - AI content
- ✅ `subscriptions` - Premium tiers
- ✅ `analytics_events` - Tracking
- ✅ `verification_logs` - Audit trail
- ✅ `insights` - SEO articles
- ✅ `api_keys` - External access

### Indexes (30+)
- Performance optimized for all queries
- Full-text search enabled
- Geographic queries ready

### Security (RLS)
- Row Level Security on all tables
- Public read for active businesses
- Admin access for backend operations

---

## Need Help?

- **Full guide**: See `docs/ENVIRONMENT_SETUP.md`
- **Implementation details**: See `docs/DATABASE_IMPLEMENTATION_SUMMARY.md`
- **SQL schema**: See `docs/DATABASE_SCHEMA.sql`
- **Type definitions**: See `lib/types/database.ts`
- **Helper functions**: See `lib/db/supabase.ts`

---

**Total setup time**: 5 minutes
**You're ready to build!** 🚀
