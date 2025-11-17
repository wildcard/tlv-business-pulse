# Quick Deploy Guide

Your TLV Business Pulse repository is ready! Follow these steps to deploy:

## Option 1: Using GitHub CLI (Fastest - 2 minutes)

```bash
# Install GitHub CLI if needed
# macOS: brew install gh
# Ubuntu: sudo apt install gh

# Login to GitHub
gh auth login

# Create repository and push
gh repo create tlv-business-pulse --public --source=. --push

# Add GitHub secrets
gh secret set SUPABASE_URL
gh secret set SUPABASE_ANON_KEY
gh secret set OPENAI_API_KEY
# (paste values when prompted)

# Done! Repository is live at:
# https://github.com/YOUR_USERNAME/tlv-business-pulse
```

## Option 2: Manual Setup (5 minutes)

### 1. Create GitHub Repository

Go to https://github.com/new and create a new repository:
- Name: `tlv-business-pulse`
- Description: "The world's first fully autonomous business directory"
- Public repository
- Do NOT initialize with README (we already have one)

### 2. Push Your Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/tlv-business-pulse.git
git branch -M main
git push -u origin main
```

### 3. Add GitHub Secrets

Go to: `https://github.com/YOUR_USERNAME/tlv-business-pulse/settings/secrets/actions`

Add these secrets (from your `.env.example`):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY` (optional)
- `NEXT_PUBLIC_SITE_URL`

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Or use Vercel dashboard:
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Add environment variables
# 4. Deploy
```

### 5. Enable GitHub Actions

1. Go to `https://github.com/YOUR_USERNAME/tlv-business-pulse/actions`
2. Click "I understand my workflows, go ahead and enable them"
3. Manually run "Autonomous Business Operations" workflow once

## Next Steps

1. **Set up Supabase Database**
   ```bash
   # Run the schema in Supabase SQL Editor
   cat lib/db/schema.sql
   # Copy and paste into https://app.supabase.com/project/YOUR_PROJECT/editor
   ```

2. **Test Locally**
   ```bash
   npm install
   cp .env.example .env.local
   # Edit .env.local with your API keys
   npm run dev
   # Visit http://localhost:3000
   ```

3. **Run First Data Fetch**
   ```bash
   npm run cron:fetch
   ```

4. **Monitor Your Business**
   - Dashboard: `https://your-site.vercel.app/dashboard`
   - GitHub Actions: `https://github.com/YOUR_USERNAME/tlv-business-pulse/actions`
   - API Docs: `https://your-site.vercel.app/api-docs`

## File Overview

| File | Purpose |
|------|---------|
| `app/` | Next.js pages and API routes |
| `lib/` | Database, AI, and utility functions |
| `scripts/` | Automation scripts (fetch, generate, monitor) |
| `.github/workflows/` | GitHub Actions for autonomous operations |
| `setup.sh` | One-command full setup |
| `lib/db/schema.sql` | Database schema |

## Troubleshooting

**GitHub Actions not running?**
- Check that secrets are added correctly
- Enable workflows in Actions tab
- Manually trigger a workflow to test

**Database errors?**
- Verify Supabase URL and keys are correct
- Ensure schema.sql has been run in Supabase
- Check RLS policies are configured

**Deployment issues?**
- Verify all environment variables are set in Vercel
- Check build logs for errors
- Ensure Node.js version is 18+

## Support

- Issues: https://github.com/YOUR_USERNAME/tlv-business-pulse/issues
- Documentation: https://github.com/YOUR_USERNAME/tlv-business-pulse
- Email: support@tlv-business-pulse.com

---

**The autonomous business is ready to launch! 🚀**
