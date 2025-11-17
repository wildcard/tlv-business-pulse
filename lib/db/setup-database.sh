#!/bin/bash

# TLV Business Pulse - Database Setup Script
# This script initializes the Supabase database with the required schema

set -e

echo "🚀 TLV Business Pulse - Database Setup"
echo "======================================"

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set"
  echo ""
  echo "Please run:"
  echo "  export SUPABASE_URL='https://your-project.supabase.co'"
  echo "  export SUPABASE_ANON_KEY='your-anon-key'"
  exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check if psql is available (for direct connection)
if command -v psql &> /dev/null; then
  echo "📊 Applying database schema..."
  
  # Get database password
  read -sp "Enter your Supabase database password: " DB_PASSWORD
  echo ""
  
  # Extract project ref from URL
  PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\///' | cut -d'.' -f1)
  
  # Run schema
  PGPASSWORD=$DB_PASSWORD psql -h "db.${PROJECT_REF}.supabase.co" -U postgres -f lib/db/schema.sql
  
  echo "✅ Database schema applied successfully"
else
  echo "⚠️  psql not found. Please apply the schema manually:"
  echo ""
  echo "1. Go to: https://app.supabase.com"
  echo "2. Select your project"
  echo "3. Go to SQL Editor"
  echo "4. Copy and paste the contents of lib/db/schema.sql"
  echo "5. Click 'Run'"
  echo ""
  echo "Alternatively, install PostgreSQL client:"
  echo "  macOS: brew install postgresql"
  echo "  Ubuntu: sudo apt-get install postgresql-client"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Verify tables in Supabase dashboard"
echo "  2. Run first data fetch: npm run cron:fetch"
echo "  3. Deploy to Vercel: vercel deploy --prod"
