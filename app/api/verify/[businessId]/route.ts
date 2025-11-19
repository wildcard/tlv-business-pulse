import { NextRequest, NextResponse } from 'next/server';
import { verifyBusiness } from '@/lib/data/tel-aviv-api';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Business Verification API
 *
 * This endpoint allows ANYONE to verify a business is real and active.
 * It cross-references multiple official sources and returns a verification report.
 *
 * Usage:
 *   GET /api/verify/{businessId or license_number}
 *
 * Example:
 *   curl https://tlvpulse.com/api/verify/12345678
 *
 * Response includes:
 * - Verification status (verified/not_verified)
 * - Sources checked (municipality, companies registry, Google)
 * - Verification links (where you can check independently)
 * - Data quality score (0-100)
 * - Last verification timestamp
 *
 * This is completely transparent - anyone can use this to verify our data.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const { businessId } = params;

  try {
    // Verify the business using our transparent verification system
    const verification = await verifyBusiness(businessId);

    // Return comprehensive verification report
    const response = {
      business_id: businessId,
      verified: verification.verified,
      verification_date: verification.verification_date,
      data_quality_score: verification.data_quality_score,
      sources: verification.sources.map((source) => ({
        source_name: source.source,
        status: source.status,
        verification_url: source.verified_url,
        last_checked: source.last_checked,
        details: source.data ? {
          business_name: source.data.שם_עסק || source.data.business_name,
          address: source.data.כתובת || source.data.address,
          status: source.data.סטטוס || source.data.status,
          license_expiry: source.data.תאריך_פקיעה || source.data.expiry_date,
        } : undefined,
      })),
      verification_criteria: {
        minimum_score: 70,
        required_sources: ['tel_aviv_municipality'],
        optional_sources: ['israeli_companies_registry', 'google_places'],
      },
      how_to_verify_independently: {
        municipality: {
          url: `https://data.tel-aviv.gov.il/verify/${businessId}`,
          instructions: 'Visit Tel Aviv Open Data Portal and search for this license number',
        },
        companies_registry: {
          url: 'https://www.gov.il/he/service/company_extract',
          instructions: 'Search by company ID (ח.פ) on the Israeli government website',
        },
        google_maps: {
          instructions: 'Search business name on Google Maps to verify location',
        },
      },
      report_issue: {
        url: `/report-issue?business_id=${businessId}`,
        method: 'POST',
        note: 'If you find incorrect information, please report it so we can investigate',
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*', // Allow anyone to verify
      },
    });
  } catch (error) {
    console.error('Verification error:', error);

    return NextResponse.json(
      {
        business_id: businessId,
        verified: false,
        error: 'Verification failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        how_to_verify_manually: {
          tel_aviv_open_data: 'https://data.tel-aviv.gov.il',
          companies_registry: 'https://www.gov.il/he/service/company_extract',
        },
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 *
 * We allow anyone to call this API - maximum transparency
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Example Response:
 *
 * {
 *   "business_id": "12345678",
 *   "verified": true,
 *   "verification_date": "2024-11-17T14:30:00Z",
 *   "data_quality_score": 95,
 *   "sources": [
 *     {
 *       "source_name": "tel_aviv_municipality",
 *       "status": "verified_active",
 *       "verification_url": "https://data.tel-aviv.gov.il/verify/12345678",
 *       "last_checked": "2024-11-17T14:30:00Z",
 *       "details": {
 *         "business_name": "Shlomo Restaurant",
 *         "address": "Dizengoff 123, Tel Aviv",
 *         "status": "active",
 *         "license_expiry": "2025-01-14"
 *       }
 *     },
 *     {
 *       "source_name": "google_places",
 *       "status": "location_verified",
 *       "verification_url": "https://maps.google.com/?q=...",
 *       "last_checked": "2024-11-17T14:25:00Z"
 *     }
 *   ],
 *   "verification_criteria": {
 *     "minimum_score": 70,
 *     "required_sources": ["tel_aviv_municipality"],
 *     "optional_sources": ["israeli_companies_registry", "google_places"]
 *   },
 *   "how_to_verify_independently": {
 *     "municipality": {
 *       "url": "https://data.tel-aviv.gov.il/verify/12345678",
 *       "instructions": "Visit Tel Aviv Open Data Portal and search for this license number"
 *     },
 *     "companies_registry": {
 *       "url": "https://www.gov.il/he/service/company_extract",
 *       "instructions": "Search by company ID (ח.פ) on the Israeli government website"
 *     },
 *     "google_maps": {
 *       "instructions": "Search business name on Google Maps to verify location"
 *     }
 *   },
 *   "report_issue": {
 *     "url": "/report-issue?business_id=12345678",
 *     "method": "POST",
 *     "note": "If you find incorrect information, please report it so we can investigate"
 *   }
 * }
 */
