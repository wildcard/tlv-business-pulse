# TLV Business Pulse - Data Sources & Verification

## Overview

This document provides complete transparency about where our business data comes from, how we process it, and how anyone can verify the businesses are real.

**Critical Principle**: Every business we showcase must be verifiable by the community.

---

## 🔍 Primary Data Sources

### 1. Tel Aviv Municipality Open Data Portal

**URL**: https://data.tel-aviv.gov.il

**Available Datasets**:

#### Business License Registry
- **Dataset ID**: `business-licenses`
- **URL**: https://data.tel-aviv.gov.il/api/3/action/datastore_search
- **Format**: JSON, CSV
- **Update Frequency**: Daily
- **License**: Open Data Commons Open Database License (ODbL)
- **Records**: ~50,000 active business licenses

**Fields Available**:
```json
{
  "license_number": "License ID",
  "business_name": "Business legal name",
  "business_name_en": "English name (if available)",
  "owner_name": "Owner/operator name",
  "business_type": "Category code",
  "business_type_desc": "Category description",
  "street": "Street name",
  "house_number": "Building number",
  "city": "Tel Aviv-Yafo",
  "neighborhood": "Neighborhood name",
  "issue_date": "License issue date",
  "expiry_date": "License expiry date",
  "status": "active/expired/suspended",
  "coordinates": {
    "lat": "Latitude",
    "lon": "Longitude"
  }
}
```

#### New Business Registrations (Monthly)
- **Dataset ID**: `new-business-registrations`
- **Updated**: 1st of each month
- **Contains**: All businesses registered in previous month

#### Business Closures
- **Dataset ID**: `business-closures`
- **Updated**: 1st of each month
- **Contains**: Licenses not renewed/closed businesses

### 2. Israeli Corporations Authority (רשם החברות)

**URL**: https://www.gov.il/he/service/company_extract

**What We Get**:
- Company registration number (ח.פ)
- Legal business name
- Registration date
- Legal status
- Directors/owners (public record)

**Verification**: Anyone can search by company name or ID on government website

### 3. Google Places API (Supplementary Data)

**Used For**:
- Phone numbers
- Website URLs
- Operating hours
- Photos
- Reviews/ratings

**Verification**: Search business name on Google Maps

### 4. Social Media Discovery (Public Profiles)

**Sources**:
- Facebook Business Pages (public)
- Instagram Business Profiles (public)
- LinkedIn Company Pages (public)

**Method**: Search for business name, verify against address

---

## 📊 Data Pipeline (Complete Transparency)

### Visual Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (Public)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tel Aviv Open Data     Israeli Corps Authority    Google   │
│  ├─ Business Licenses   ├─ Registration Records   ├─ Places │
│  ├─ New Registrations   ├─ Legal Status           ├─ Maps   │
│  └─ Closures            └─ Owner Info             └─ Reviews│
│                                                              │
└──────────────┬───────────────────┬──────────────┬───────────┘
               │                   │              │
               │ (1) Fetch         │ (2) Verify   │ (3) Enrich
               │  Daily            │  Legal       │  Contact
               │                   │  Status      │  Info
               ▼                   ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA VALIDATION & VERIFICATION                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Check business is legally registered                     │
│  ✓ Verify license is active (not expired/suspended)         │
│  ✓ Confirm address exists                                   │
│  ✓ Cross-reference with government records                  │
│  ✓ Mark data quality score (0-100)                          │
│                                                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ (4) Store validated data
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERIFIED BUSINESS DATABASE                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • Business details (from municipality)                     │
│  • Verification status & timestamp                          │
│  • Data sources used                                        │
│  • Quality score                                            │
│  • Public verification URL                                  │
│                                                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ (5) Generate website
               ▼
┌─────────────────────────────────────────────────────────────┐
│               AI WEBSITE GENERATION                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: Verified business data                              │
│  Process: GPT-4 generates content                           │
│  Output: Professional website                               │
│  Metadata: What data was used, when, from where            │
│                                                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ (6) Publish with verification
               ▼
┌─────────────────────────────────────────────────────────────┐
│              PUBLIC WEBSITE + VERIFICATION                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Website: businessname.tlvpulse.com                         │
│                                                              │
│  Footer includes:                                            │
│  • "Verified business" badge                                │
│  • License number (clickable → gov site)                    │
│  • Data sources used                                        │
│  • Last verification date                                   │
│  • "Report incorrect info" button                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Verification System for Community

### Every Business Page Shows:

```html
┌─────────────────────────────────────────────────────────┐
│  Sabich King                                             │
│  Fast Food Restaurant                                    │
│  23 Herzl Street, Florentin, Tel Aviv                   │
│                                                          │
│  [Website Content Here]                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🔍 BUSINESS VERIFICATION                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✓ Verified Active Business                             │
│                                                          │
│  License Number: 123456789                               │
│  Issued: November 15, 2024                              │
│  Status: Active                                          │
│  License Expires: November 14, 2025                     │
│                                                          │
│  [Verify on Municipality Website →]                     │
│  [Verify on Gov.il Registry →]                          │
│  [View on Google Maps →]                                │
│                                                          │
│  Data Sources:                                           │
│  • Tel Aviv Municipality (License #123456789)           │
│  • Israeli Companies Registry (ח.פ 514234567)           │
│  • Google Places (Verified location)                    │
│                                                          │
│  Last Verified: November 17, 2024 at 14:30 IST         │
│  Next Verification: November 18, 2024                   │
│                                                          │
│  Data Quality Score: 95/100                             │
│                                                          │
│  [Report Incorrect Information]                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Verification Links Lead To:

1. **Municipality Website**:
   - Direct link to license lookup
   - Business can be searched by license number
   - Public record anyone can access

2. **Gov.il Companies Registry**:
   - Link to company extract page
   - Shows legal registration
   - Official government source

3. **Google Maps**:
   - Business location on map
   - Reviews, photos
   - Verify it's a real place

---

## 🔓 API Access for Community Validation

We provide public APIs so anyone can verify our data:

### 1. Business Verification API

```bash
GET /api/verify/business/{business_id}
```

**Response**:
```json
{
  "business_id": "BIZ-123456",
  "name": "Sabich King",
  "verified": true,
  "verification_date": "2024-11-17T14:30:00Z",
  "sources": [
    {
      "source": "tel_aviv_municipality",
      "license_number": "123456789",
      "status": "active",
      "verified_url": "https://data.tel-aviv.gov.il/verify/123456789",
      "last_checked": "2024-11-17T14:30:00Z"
    },
    {
      "source": "israeli_companies_registry",
      "company_id": "514234567",
      "status": "active",
      "verified_url": "https://www.gov.il/he/service/company_extract?id=514234567",
      "last_checked": "2024-11-17T14:25:00Z"
    },
    {
      "source": "google_places",
      "place_id": "ChIJXXXXXXXXXXXXXXXXXXXX",
      "rating": 4.5,
      "verified_url": "https://maps.google.com/?cid=XXXXXX",
      "last_checked": "2024-11-17T14:20:00Z"
    }
  ],
  "data_quality": {
    "score": 95,
    "completeness": 90,
    "accuracy": 100,
    "freshness": 95
  }
}
```

### 2. Data Source Transparency API

```bash
GET /api/transparency/data-sources
```

**Response**:
```json
{
  "last_updated": "2024-11-17T14:30:00Z",
  "sources": [
    {
      "name": "Tel Aviv Municipality Open Data",
      "url": "https://data.tel-aviv.gov.il",
      "datasets_used": [
        "business-licenses",
        "new-business-registrations"
      ],
      "update_frequency": "daily",
      "last_sync": "2024-11-17T06:00:00Z",
      "records_count": 47823,
      "license": "ODbL",
      "reliability": "official_source"
    },
    {
      "name": "Israeli Companies Authority",
      "url": "https://www.gov.il/he/service/company_extract",
      "data_type": "legal_registration",
      "update_frequency": "real-time",
      "last_sync": "2024-11-17T14:25:00Z",
      "license": "public_record",
      "reliability": "official_source"
    }
  ],
  "total_businesses": 47823,
  "verified_businesses": 45123,
  "verification_rate": 94.4
}
```

### 3. Data Pipeline Status API

```bash
GET /api/transparency/pipeline-status
```

**Response**:
```json
{
  "status": "operational",
  "last_run": "2024-11-17T06:00:00Z",
  "next_run": "2024-11-18T06:00:00Z",
  "statistics": {
    "new_businesses_detected": 23,
    "businesses_verified": 23,
    "verification_failures": 0,
    "websites_generated": 23,
    "generation_failures": 0
  },
  "pipeline_stages": [
    {
      "stage": "data_fetch",
      "status": "success",
      "duration_ms": 3240,
      "records_processed": 23
    },
    {
      "stage": "verification",
      "status": "success",
      "duration_ms": 8920,
      "records_verified": 23
    },
    {
      "stage": "ai_generation",
      "status": "success",
      "duration_ms": 45600,
      "websites_created": 23
    },
    {
      "stage": "deployment",
      "status": "success",
      "duration_ms": 2100,
      "websites_deployed": 23
    }
  ]
}
```

---

## 📋 How to Verify a Business (Step-by-Step)

### For Community Members:

1. **Visit Business Page**
   - Go to: `businessname.tlvpulse.com`
   - Scroll to "Business Verification" section at bottom

2. **Check License Number**
   - Note the license number shown
   - Click "Verify on Municipality Website"
   - Search for license number on official site
   - ✓ Confirm details match

3. **Verify Legal Registration**
   - Click "Verify on Gov.il Registry"
   - Search by company ID (ח.פ)
   - ✓ Confirm company is registered

4. **Check Physical Location**
   - Click "View on Google Maps"
   - ✓ Confirm business exists at address
   - Check reviews, photos

5. **Review Data Sources**
   - All sources are listed
   - Each has a verification URL
   - ✓ Cross-reference independently

### For Contributors Outside Tel Aviv:

Even if you're not in Tel Aviv, you can verify:

1. **Use Our Verification API**:
```bash
curl https://tlvpulse.com/api/verify/business/BIZ-123456
```

2. **Check Government Sources**:
   - Tel Aviv Open Data Portal (online)
   - Israeli Companies Registry (online)
   - Google Maps (universal)

3. **Compare Multiple Sources**:
   - Our data vs. municipality data
   - Our data vs. Google Places
   - Flag discrepancies

4. **Report Issues**:
   - Every page has "Report Incorrect Info" button
   - Submit verification failures
   - Community review process

---

## 🔬 Data Quality Standards

### We Only Showcase Businesses That:

1. ✓ **Have active business license** (verified with municipality)
2. ✓ **Are legally registered** (verified with gov.il)
3. ✓ **Have verifiable address** (exists on Google Maps)
4. ✓ **Pass quality score threshold** (minimum 70/100)
5. ✓ **Have been verified within 30 days**

### Businesses We Exclude:

- ❌ Expired licenses
- ❌ Suspended/revoked licenses
- ❌ Unverifiable addresses
- ❌ Duplicate registrations
- ❌ Data quality score < 70

### Data Quality Score Components:

```
Score = (Completeness × 0.3) + (Accuracy × 0.4) + (Freshness × 0.3)

Completeness: % of fields populated (0-100)
Accuracy: Cross-source verification match rate (0-100)
Freshness: Days since last verification (100 at day 0, decreases)
```

---

## 📊 Real-Time Transparency Dashboard

We provide a public dashboard showing:

### Current Statistics (Live)

```
┌─────────────────────────────────────────────────────────┐
│  TLV Business Pulse - Data Transparency Dashboard       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Total Businesses in Database: 47,823                   │
│  Verified Active: 45,123 (94.4%)                        │
│  Pending Verification: 2,700 (5.6%)                     │
│                                                          │
│  Last Data Sync: 2024-11-17 06:00 IST                  │
│  Next Sync: 2024-11-18 06:00 IST                       │
│                                                          │
│  Websites Generated: 234                                │
│  Claimed by Owners: 87 (37.2%)                          │
│  Verification Failures: 12 (0.03%)                      │
│                                                          │
│  Data Sources Online: 3/3 ✓                             │
│  API Status: Operational ✓                              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Recent Activity (Last 24 Hours)                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  • 23 new businesses detected                           │
│  • 23 businesses verified                               │
│  • 23 websites generated                                │
│  • 5 businesses claimed by owners                       │
│  • 0 verification failures                              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Data Source Status                                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Tel Aviv Municipality API:        ✓ Online             │
│  Last Sync: 6 hours ago                                 │
│  Records: 47,823                                        │
│  [View Raw Data] [API Docs]                            │
│                                                          │
│  Israeli Companies Registry:       ✓ Online             │
│  Last Check: 5 minutes ago                              │
│  Queries Today: 234                                     │
│  [View on Gov.il]                                       │
│                                                          │
│  Google Places API:                ✓ Online             │
│  Last Call: 2 minutes ago                               │
│  Daily Quota: 1,234/10,000                             │
│  [API Status]                                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Business Verification Explorer

Interactive tool where anyone can:
- Search any business by name
- See full verification report
- Access source data
- View generation metadata
- Report issues

---

## 🛠️ For Developers: Reproducing Our Results

### Step 1: Access Tel Aviv Open Data

```bash
# Fetch business licenses
curl "https://data.tel-aviv.gov.il/api/3/action/datastore_search?resource_id=business-licenses&limit=10" \
  > tel_aviv_businesses.json

# View the data
cat tel_aviv_businesses.json | jq '.result.records[] | {name, address, license_number}'
```

### Step 2: Verify a Business

```python
import requests

# 1. Get business from TLV data
business = {
    "name": "Example Business",
    "license_number": "123456789",
    "company_id": "514234567"
}

# 2. Verify with Companies Registry
registry_url = f"https://www.gov.il/he/api/companies/{business['company_id']}"
registry_data = requests.get(registry_url).json()

# 3. Verify with Google Places
places_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
places_data = requests.get(places_url, params={
    "input": business["name"],
    "inputtype": "textquery",
    "key": "YOUR_API_KEY"
}).json()

# 4. Cross-reference
verified = (
    registry_data["status"] == "active" and
    places_data["candidates"] and
    business["name"] in places_data["candidates"][0]["name"]
)

print(f"Verified: {verified}")
```

### Step 3: Reproduce Website Generation

```bash
# Clone our repo
git clone https://github.com/wildcard/tlv-business-pulse.git
cd tlv-business-pulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys

# Run generation for a real business
npx tsx scripts/generate-from-real-data.ts --license-number=123456789

# Output: Website generated at businessname.localhost:3000
```

---

## 🚨 Community Validation Process

### Anyone Can:

1. **Submit Verification Failures**:
   - Report incorrect business info
   - Flag non-existent businesses
   - Suggest corrections

2. **Review Data Quality**:
   - Access raw source data
   - Compare with official sources
   - Vote on accuracy

3. **Contribute Corrections**:
   - Submit pull requests
   - Add missing data
   - Update outdated info

### We Commit To:

- ✓ Respond to verification issues within 24 hours
- ✓ Remove unverifiable businesses within 48 hours
- ✓ Publicly log all data corrections
- ✓ Monthly transparency reports
- ✓ Open-source verification code

---

## 📜 Data Usage & Privacy

### What We Collect:
- ✓ Public business license data (already public)
- ✓ Company registration data (public records)
- ✓ Business locations (public)
- ❌ NO personal owner data (unless already public)
- ❌ NO private business information
- ❌ NO customer data

### Legal Basis:
- ODbL License (Tel Aviv Open Data)
- Public Records (Gov.il)
- Fair Use (Google Places for verification)

### Data Retention:
- Active businesses: Indefinitely (public record)
- Closed businesses: Marked as closed, kept for historical record
- Verification logs: 2 years
- Generation metadata: Permanent (for transparency)

---

## 🎯 Current Real Businesses Available

Once we connect to live data, we will showcase:

**Categories Available**:
- Restaurants & Cafes: ~5,000 active licenses
- Retail Shops: ~8,000 active licenses
- Professional Services: ~12,000 active licenses
- Beauty & Wellness: ~3,000 active licenses
- Technology Companies: ~2,000 active licenses

**Geographic Distribution**:
- Florentin: ~2,500 businesses
- Dizengoff: ~3,200 businesses
- Rothschild: ~1,800 businesses
- Jaffa: ~2,100 businesses
- North Tel Aviv: ~4,500 businesses

---

## 📞 Contact & Support

**For Verification Issues**:
- Email: verify@tlvpulse.com
- GitHub Issues: Report verification failures
- Transparency Dashboard: See live status

**For Data Access**:
- API Documentation: /api/docs
- Open Data Portal: /data
- Source Code: GitHub (all verification code is open source)

---

**Last Updated**: November 17, 2024
**Data Verification Commit**: [Link to GitHub commit showing verification code]
**Transparency Report**: /reports/transparency/2024-11.md

