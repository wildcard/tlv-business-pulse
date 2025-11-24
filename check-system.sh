#!/bin/bash

# TLV Business Pulse - System Check Script
# This script validates all components of the autonomous business

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_URL="${1:-https://tlv-business-pulse-mhjiqmz1y-kobi-kadoshs-projects.vercel.app}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     TLV Business Pulse - System Validation Check            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Checking deployment: ${DEPLOYMENT_URL}${NC}"
echo ""

# Counter for tracking results
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
check_passed() {
    echo -e "  ${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_failed() {
    echo -e "  ${RED}✗${NC} $1"
    ((FAILED++))
}

check_warning() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

check_info() {
    echo -e "  ${BLUE}ℹ${NC} $1"
}

# 1. Check website accessibility
echo -e "${BLUE}[1/10]${NC} Website Accessibility"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$DEPLOYMENT_URL" 2>/dev/null || echo "999")

if [ "$HTTP_CODE" == "200" ]; then
    check_passed "Homepage accessible (HTTP $HTTP_CODE)"
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        check_passed "Response time: ${RESPONSE_TIME}s (Good)"
    elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
        check_warning "Response time: ${RESPONSE_TIME}s (Acceptable)"
    else
        check_warning "Response time: ${RESPONSE_TIME}s (Slow)"
    fi
elif [ "$HTTP_CODE" == "403" ]; then
    check_warning "Protected deployment (HTTP 403) - Login to Vercel to access"
    check_info "This is NORMAL for preview deployments"
else
    check_failed "Homepage not accessible (HTTP $HTTP_CODE)"
fi
echo ""

# 2. Check API health endpoint
echo -e "${BLUE}[2/10]${NC} API Health Endpoint"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    check_passed "Health endpoint accessible"
    HEALTH_DATA=$(curl -s "$DEPLOYMENT_URL/api/health" 2>/dev/null)
    if echo "$HEALTH_DATA" | jq -e '.status' >/dev/null 2>&1; then
        STATUS=$(echo "$HEALTH_DATA" | jq -r '.status')
        check_passed "Health status: $STATUS"
    fi
elif [ "$HTTP_CODE" == "403" ]; then
    check_warning "Health endpoint protected (Login required)"
else
    check_failed "Health endpoint failed (HTTP $HTTP_CODE)"
fi
echo ""

# 3. Check businesses API
echo -e "${BLUE}[3/10]${NC} Businesses API Endpoint"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/businesses?limit=1" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    check_passed "Businesses API accessible"
    BUSINESSES_DATA=$(curl -s "$DEPLOYMENT_URL/api/businesses?limit=1" 2>/dev/null)
    if echo "$BUSINESSES_DATA" | jq -e '.success' >/dev/null 2>&1; then
        SUCCESS=$(echo "$BUSINESSES_DATA" | jq -r '.success')
        if [ "$SUCCESS" == "true" ]; then
            check_passed "Businesses API functioning correctly"
        else
            check_warning "Businesses API returned error"
        fi
    fi
elif [ "$HTTP_CODE" == "403" ]; then
    check_warning "Businesses API protected (Login required)"
else
    check_failed "Businesses API failed (HTTP $HTTP_CODE)"
fi
echo ""

# 4. Check insights API
echo -e "${BLUE}[4/10]${NC} Insights API Endpoint"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/insights" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    check_passed "Insights API accessible"
    INSIGHTS_DATA=$(curl -s "$DEPLOYMENT_URL/api/insights" 2>/dev/null)
    if echo "$INSIGHTS_DATA" | jq -e '.data' >/dev/null 2>&1; then
        INSIGHTS_COUNT=$(echo "$INSIGHTS_DATA" | jq -r '.data | length')
        if [ "$INSIGHTS_COUNT" -gt 0 ]; then
            check_passed "Found $INSIGHTS_COUNT published insights"
        else
            check_warning "No insights yet (will populate after first cron run)"
        fi
    fi
elif [ "$HTTP_CODE" == "403" ]; then
    check_warning "Insights API protected (Login required)"
else
    check_failed "Insights API failed (HTTP $HTTP_CODE)"
fi
echo ""

# 5. Check stats API
echo -e "${BLUE}[5/10]${NC} Stats API Endpoint"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/stats" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    check_passed "Stats API accessible"
elif [ "$HTTP_CODE" == "403" ]; then
    check_warning "Stats API protected (Login required)"
else
    check_warning "Stats API unavailable (HTTP $HTTP_CODE)"
fi
echo ""

# 6. Check environment variables (via build check)
echo -e "${BLUE}[6/10]${NC} Build Configuration"
if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    check_passed "Local build exists (ID: $BUILD_ID)"
else
    check_info "No local build found (run 'npm run build' to test locally)"
fi

if [ -f "package.json" ]; then
    check_passed "package.json found"
fi

if [ -f "next.config.js" ]; then
    check_passed "next.config.js found"
fi

if [ -f "vercel.json" ]; then
    check_passed "vercel.json found"
fi
echo ""

# 7. Check GitHub Actions workflows
echo -e "${BLUE}[7/10]${NC} GitHub Actions Workflows"
if [ -d ".github/workflows" ]; then
    check_passed ".github/workflows directory exists"
    WORKFLOW_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
    check_passed "Found $WORKFLOW_COUNT workflow files"

    # Check for specific workflows
    if [ -f ".github/workflows/autonomous-operations.yml" ]; then
        check_passed "Autonomous operations workflow configured"
    else
        check_warning "Autonomous operations workflow missing"
    fi

    if [ -f ".github/workflows/health-check.yml" ]; then
        check_passed "Health check workflow configured"
    else
        check_warning "Health check workflow missing"
    fi
else
    check_failed "No GitHub Actions workflows found"
fi
echo ""

# 8. Check scripts
echo -e "${BLUE}[8/10]${NC} Automation Scripts"
if [ -d "scripts" ]; then
    check_passed "Scripts directory exists"

    if [ -f "scripts/fetch-data.ts" ]; then
        check_passed "Data fetch script exists"
    else
        check_warning "Data fetch script missing"
    fi

    if [ -f "scripts/generate-content.ts" ]; then
        check_passed "Content generation script exists"
    else
        check_warning "Content generation script missing"
    fi

    if [ -f "scripts/health-check.ts" ]; then
        check_passed "Health check script exists"
    else
        check_warning "Health check script missing"
    fi
else
    check_failed "Scripts directory not found"
fi
echo ""

# 9. Check documentation
echo -e "${BLUE}[9/10]${NC} Documentation"
if [ -f "README.md" ]; then
    check_passed "README.md exists"
fi

if [ -f "OPERATIONS.md" ]; then
    check_passed "OPERATIONS.md exists (Operations guide)"
fi

if [ -f "MONITORING.md" ]; then
    check_passed "MONITORING.md exists (Monitoring guide)"
fi

if [ -f "VERCEL_DEPLOY.md" ]; then
    check_passed "VERCEL_DEPLOY.md exists (Deployment guide)"
fi

if [ -f "DEPLOYMENT_STATUS.md" ]; then
    check_passed "DEPLOYMENT_STATUS.md exists (Status report)"
fi
echo ""

# 10. Check dependencies
echo -e "${BLUE}[10/10]${NC} Dependencies Check"
if [ -f "package.json" ]; then
    # Check for critical dependencies
    if grep -q '"next"' package.json; then
        check_passed "Next.js dependency found"
    fi

    if grep -q '@supabase/supabase-js' package.json; then
        check_passed "Supabase client found"
    fi

    if grep -q '"openai"' package.json; then
        check_passed "OpenAI client found"
    fi

    if grep -q '"stripe"' package.json; then
        check_passed "Stripe client found"
    fi
fi
echo ""

# Summary
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      VALIDATION SUMMARY                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}✓ Passed:${NC}   $PASSED"
echo -e "  ${YELLOW}⚠ Warnings:${NC} $WARNINGS"
echo -e "  ${RED}✗ Failed:${NC}   $FAILED"
echo ""

# Overall status
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ ALL SYSTEMS GO! Ready for operations!  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}╔═══════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠ MOSTLY READY - Some warnings to review    ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review warnings above"
    echo "  2. Configure missing environment variables if needed"
    echo "  3. If deployment is protected (403), log into Vercel to access"
    echo "  4. Set up Supabase database if not done yet"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ ISSUES DETECTED - Action required      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Critical issues found:${NC}"
    echo "  1. Review failed checks above"
    echo "  2. Check DEPLOYMENT_STATUS.md for troubleshooting"
    echo "  3. Verify environment variables in Vercel dashboard"
    echo "  4. Check Vercel build logs for errors"
    echo ""
    exit 1
fi
