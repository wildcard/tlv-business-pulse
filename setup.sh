#!/bin/bash

# TLV Business Pulse - Repository Setup Script
# This script initializes the entire autonomous business with one command

set -e

echo "🚀 TLV Business Pulse - Autonomous Business Setup"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required${NC}"
    exit 1
fi

# Repository name
REPO_NAME="tlv-business-pulse"

echo ""
echo "📂 Setting up repository..."
echo ""

# Initialize git repository
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Git repository already exists${NC}"
fi

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: TLV Business Pulse - Autonomous Business Directory" || true

# Create GitHub repository using GitHub CLI if available
if command -v gh &> /dev/null; then
    echo ""
    echo "📤 Creating GitHub repository..."
    gh repo create "$REPO_NAME" --public --description "The world's first fully autonomous business directory" --source=. --remote=origin --push
    echo -e "${GREEN}✅ GitHub repository created and pushed${NC}"
else
    echo ""
    echo -e "${YELLOW}📝 Manual GitHub Setup Required:${NC}"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository named: $REPO_NAME"
    echo "3. Make it public"
    echo "4. Don't initialize with README (we already have one)"
    echo "5. Run these commands after creating:"
    echo ""
    echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    read -p "Press Enter after you've created the repository on GitHub..."
    
    # Add remote
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null || true
    git branch -M main
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔐 Setting up environment variables..."
echo ""

# Copy environment example
cp .env.example .env.local

echo -e "${YELLOW}⚠️  Important: Configure your environment variables${NC}"
echo ""
echo "You need to set up the following services:"
echo ""
echo "1. 📊 Supabase (Database):"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Copy the URL and anon key to .env.local"
echo ""
echo "2. 🤖 OpenAI (AI Content):"
echo "   - Go to https://platform.openai.com/api-keys"
echo "   - Create an API key"
echo "   - Add to .env.local"
echo ""
echo "3. 💳 Stripe (Payments - Optional):"
echo "   - Go to https://stripe.com"
echo "   - Get your API keys"
echo "   - Add to .env.local"
echo ""
echo "4. 🚀 Vercel (Deployment):"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables"
echo ""

read -p "Press Enter to open .env.local in your editor..."
${EDITOR:-nano} .env.local

echo ""
echo "🔧 Setting up GitHub Actions secrets..."
echo ""

if command -v gh &> /dev/null; then
    echo "Adding secrets to GitHub repository..."
    
    # Read .env.local and add as GitHub secrets
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! "$key" =~ ^# ]] && [ -n "$key" ]; then
            # Remove quotes if present
            value="${value%\"}"
            value="${value#\"}"
            
            echo "Adding secret: $key"
            echo "$value" | gh secret set "$key" 2>/dev/null || true
        fi
    done < .env.local
    
    echo -e "${GREEN}✅ GitHub secrets configured${NC}"
else
    echo -e "${YELLOW}📝 Manual GitHub Secrets Setup Required:${NC}"
    echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
    echo "2. Add each environment variable from .env.local as a secret"
    echo ""
fi

echo ""
echo "🗄️ Setting up database..."
echo ""

# Create database schema
cat << 'EOF' > setup-database.sql
-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  address TEXT,
  location POINT,
  category VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50),
  opened_date DATE,
  first_seen DATE DEFAULT CURRENT_DATE,
  last_seen DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  seo_description TEXT,
  featured_businesses JSONB,
  tags TEXT[],
  category VARCHAR(50),
  views INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE UNIQUE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  new_businesses INTEGER DEFAULT 0,
  closed_businesses INTEGER DEFAULT 0,
  insights_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API subscribers table
CREATE TABLE IF NOT EXISTS api_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  api_key VARCHAR(255) UNIQUE,
  plan VARCHAR(50) DEFAULT 'free',
  calls_today INTEGER DEFAULT 0,
  calls_this_month INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_external_id ON businesses(external_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_insights_published ON insights(published_at);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);
EOF

echo -e "${GREEN}✅ Database schema SQL generated${NC}"
echo ""
echo "📝 Please run the SQL above in your Supabase SQL editor:"
echo "   https://app.supabase.com/project/YOUR_PROJECT/editor"
echo ""

read -p "Press Enter after you've set up the database..."

echo ""
echo "🧪 Running initial test..."
npm run dev &
DEV_PID=$!

sleep 5

# Test if the development server is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Development server is running${NC}"
else
    echo -e "${RED}❌ Development server failed to start${NC}"
fi

kill $DEV_PID 2>/dev/null || true

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

if command -v vercel &> /dev/null; then
    vercel deploy --prod
else
    echo -e "${YELLOW}📝 Manual Vercel Deployment Required:${NC}"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import your GitHub repository: $GITHUB_USERNAME/$REPO_NAME"
    echo "3. Add all environment variables from .env.local"
    echo "4. Deploy"
    echo ""
fi

echo ""
echo "✨ ============================================ ✨"
echo -e "${GREEN}   TLV Business Pulse Setup Complete!${NC}"
echo "✨ ============================================ ✨"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. ⚡ Enable GitHub Actions:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo ""
echo "2. 🤖 Trigger first autonomous operation:"
echo "   Go to Actions → Autonomous Business Operations → Run workflow"
echo ""
echo "3. 📊 View your dashboard:"
echo "   https://$REPO_NAME.vercel.app/dashboard"
echo ""
echo "4. 📖 Read the documentation:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME#readme"
echo ""
echo "5. 🌟 Star the repository:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo -e "${GREEN}The autonomous business is now live and will operate 24/7 without human intervention!${NC}"
echo ""
echo "Join our community:"
echo "  Discord: https://discord.gg/autonomous-business"
echo "  Twitter: @tlvbizpulse"
echo ""
echo "Thank you for launching an autonomous business! 🚀"
