#!/bin/bash
# TLV Business Pulse - Quick Start Commands
# Copy and paste these commands to create your autonomous business

# 1. Create and navigate to project directory
mkdir tlv-business-pulse && cd tlv-business-pulse

# 2. Download the repository files
curl -L https://github.com/autonomous-business/tlv-business-pulse-template/archive/main.zip -o template.zip
unzip template.zip && mv tlv-business-pulse-template-main/* . && rm -rf tlv-business-pulse-template-main template.zip

# 3. Initialize git and create repository
git init
git add .
git commit -m "🎉 Initial commit: TLV Business Pulse - Autonomous Business"

# 4. Create GitHub repository (requires GitHub CLI)
gh repo create tlv-business-pulse --public --source=. --remote=origin --push

# 5. Install dependencies
npm install

# 6. Copy environment template
cp .env.example .env.local

# 7. Open environment file for configuration
echo "⚠️  Configure your environment variables in .env.local"
echo "Required: SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY"

# 8. Deploy to Vercel
vercel deploy --prod

echo "✅ Your autonomous business is now live!"
echo "🤖 Enable GitHub Actions to start autonomous operations"
echo "📊 View dashboard: https://tlv-business-pulse.vercel.app/dashboard"
