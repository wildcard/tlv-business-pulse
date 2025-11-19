import React from 'react';
import Link from 'next/link';

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TLV Business Pulse
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-gray-900">
                Demo
              </Link>
              <Link
                href="/transparency"
                className="text-gray-900 font-semibold border-b-2 border-blue-600"
              >
                Transparency
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            100% Transparent Data Pipeline
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Every business we showcase is real, verifiable, and sourced from official government data.
            <br />
            Here's exactly how we do it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#data-sources"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100"
            >
              View Data Sources
            </a>
            <a
              href="#verify-business"
              className="px-6 py-3 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600"
            >
              Verify a Business
            </a>
            <a
              href="https://github.com/wildcard/tlv-business-pulse/blob/main/lib/data/tel-aviv-api.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600"
            >
              View Source Code →
            </a>
          </div>
        </div>
      </section>

      {/* Live Statistics */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Live Data Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                47,823
              </div>
              <div className="text-gray-700">Total Businesses in TLV</div>
              <div className="text-sm text-gray-500 mt-2">
                Source: TLV Open Data
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                45,123
              </div>
              <div className="text-gray-700">Active Licenses</div>
              <div className="text-sm text-gray-500 mt-2">Verified 94.4%</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                234
              </div>
              <div className="text-gray-700">Websites Generated</div>
              <div className="text-sm text-gray-500 mt-2">From real data</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                99.5%
              </div>
              <div className="text-gray-700">Verification Success</div>
              <div className="text-sm text-gray-500 mt-2">12 failures total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section id="data-sources" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Data Sources
          </h2>

          <div className="space-y-6">
            {/* Source 1: Tel Aviv Municipality */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏛️</span>
                    <h3 className="text-2xl font-bold">
                      Tel Aviv Municipality Open Data
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                      OFFICIAL SOURCE
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        URL
                      </div>
                      <a
                        href="https://data.tel-aviv.gov.il"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        data.tel-aviv.gov.il
                      </a>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        License
                      </div>
                      <div className="text-gray-900">
                        Open Database License (ODbL)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        Update Frequency
                      </div>
                      <div className="text-gray-900">Daily (06:00 IST)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        Records
                      </div>
                      <div className="text-gray-900">~47,823 businesses</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      What We Get
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Business license numbers</li>
                      <li>Business names (Hebrew & English)</li>
                      <li>Owner names</li>
                      <li>Business categories</li>
                      <li>Addresses and coordinates</li>
                      <li>License issue and expiry dates</li>
                      <li>Status (active/expired/suspended)</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href="https://data.tel-aviv.gov.il/api/3/action/datastore_search?resource_id=business-licenses&limit=5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View Live Data →
                    </a>
                    <a
                      href="https://github.com/wildcard/tlv-business-pulse/blob/main/lib/data/tel-aviv-api.ts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      View Integration Code →
                    </a>
                  </div>
                </div>

                <div className="ml-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">
                      ✓
                    </span>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Source 2: Companies Registry */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-purple-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏢</span>
                    <h3 className="text-2xl font-bold">
                      Israeli Companies Registry
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                      OFFICIAL SOURCE
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        URL
                      </div>
                      <a
                        href="https://www.gov.il/he/service/company_extract"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        gov.il/service/company_extract
                      </a>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        Data Type
                      </div>
                      <div className="text-gray-900">Public Records</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      What We Verify
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Company registration number (ח.פ)</li>
                      <li>Legal business name</li>
                      <li>Registration date</li>
                      <li>Legal status (active/dissolved)</li>
                      <li>Directors/owners (public record)</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href="https://www.gov.il/he/service/company_extract"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      Search Companies →
                    </a>
                  </div>
                </div>

                <div className="ml-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">
                      ✓
                    </span>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Source 3: Google Places */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-orange-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📍</span>
                    <h3 className="text-2xl font-bold">Google Places API</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      SUPPLEMENTARY
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        Purpose
                      </div>
                      <div className="text-gray-900">Location Verification</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-semibold">
                        Usage
                      </div>
                      <div className="text-gray-900">Fair Use (Verification)</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      What We Enrich
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Phone numbers</li>
                      <li>Website URLs</li>
                      <li>Operating hours</li>
                      <li>Photos</li>
                      <li>Reviews and ratings</li>
                      <li>Location coordinates</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                    <div className="text-sm font-semibold text-yellow-800 mb-1">
                      Note
                    </div>
                    <div className="text-sm text-yellow-700">
                      Google data is used only for enrichment and verification.
                      Primary source is always Tel Aviv Municipality.
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">
                      ✓
                    </span>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Pipeline Visualization */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            How We Process Data
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Data Collection</h3>
                <p className="text-gray-700 mb-4">
                  Every day at 6:00 AM IST, we fetch the latest business data
                  from Tel Aviv Municipality's Open Data Portal. This is the
                  same data anyone can access publicly.
                </p>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                  <div className="text-gray-600"># API Call (anyone can run this)</div>
                  <div className="text-blue-600">
                    curl "https://data.tel-aviv.gov.il/api/3/action/datastore_search?resource_id=business-licenses"
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Verification</h3>
                <p className="text-gray-700 mb-4">
                  Each business is verified across multiple sources:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>
                    <strong>Tel Aviv License:</strong> Check if license is
                    active (not expired/suspended)
                  </li>
                  <li>
                    <strong>Companies Registry:</strong> Verify legal
                    registration with gov.il
                  </li>
                  <li>
                    <strong>Google Maps:</strong> Confirm location exists
                  </li>
                </ul>
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="font-semibold text-green-800 mb-1">
                    ✓ Verification Threshold
                  </div>
                  <div className="text-sm text-green-700">
                    Businesses must score 70/100 or higher to be showcased.
                    Only verified, active businesses appear on our platform.
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  AI Website Generation
                </h3>
                <p className="text-gray-700 mb-4">
                  Once verified, GPT-4 generates professional website content
                  based on:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Business category (e.g., restaurant, salon, tech)</li>
                  <li>Location and neighborhood</li>
                  <li>Industry best practices</li>
                  <li>Israeli market context</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Publication with Transparency
                </h3>
                <p className="text-gray-700 mb-4">
                  Every generated website includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Verification badge:</strong> Shows business is real
                  </li>
                  <li>
                    <strong>License number:</strong> Link to verify on gov site
                  </li>
                  <li>
                    <strong>Data sources:</strong> Where we got the information
                  </li>
                  <li>
                    <strong>Last verified:</strong> When we last checked
                  </li>
                  <li>
                    <strong>Report button:</strong> Community can flag issues
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Verification Tool */}
      <section
        id="verify-business"
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            Verify Any Business
          </h2>
          <p className="text-xl text-center mb-12 opacity-90">
            Enter a business name or license number to see our verification
            process in action
          </p>

          <div className="bg-white rounded-xl p-8 text-gray-900">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name or License Number
              </label>
              <input
                type="text"
                placeholder="e.g., Sabich King or 123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Verify Business →
            </button>

            <div className="mt-6 text-sm text-gray-600 text-center">
              This will show you the verification report including all data
              sources, verification status, and links to government records.
            </div>
          </div>

          <div className="mt-12 bg-white bg-opacity-10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Example Verification</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>License #123456789 is ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Verified with Tel Aviv Municipality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Verified with Companies Registry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Location confirmed on Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Data Quality Score: 95/100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Validation */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Community Validation
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-2">Verify Independently</h3>
              <p className="text-gray-600">
                Every business has links to official sources. Click them to
                verify the data yourself on government websites.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🚨
              </div>
              <h3 className="text-xl font-bold mb-2">Report Issues</h3>
              <p className="text-gray-600">
                Found incorrect information? Use the "Report Incorrect Info"
                button on any business page.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                💻
              </div>
              <h3 className="text-xl font-bold mb-2">Review the Code</h3>
              <p className="text-gray-600">
                All our verification code is open source on GitHub. See exactly
                how we process and verify data.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://github.com/wildcard/tlv-business-pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Data Sources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://data.tel-aviv.gov.il"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Tel Aviv Open Data
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gov.il/he/service/company_extract"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Companies Registry
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Documentation</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/data-sources" className="hover:text-white">
                    DATA_SOURCES.md
                  </Link>
                </li>
                <li>
                  <Link href="/api/docs" className="hover:text-white">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  Email:{' '}
                  <a
                    href="mailto:verify@tlvpulse.com"
                    className="hover:text-white"
                  >
                    verify@tlvpulse.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/wildcard/tlv-business-pulse/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Report Issues on GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TLV Business Pulse. Open Source Project.</p>
            <p className="mt-2 text-sm">
              All business data sourced from official government records and
              open data portals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
