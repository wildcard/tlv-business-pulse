import Link from 'next/link'

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600">
            Access real-time Tel Aviv business data programmatically
          </p>
        </div>

        {/* Quick Start */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Get Your API Key</h3>
              <p className="text-gray-600 mb-2">Subscribe to get instant API access:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><strong>Free Tier:</strong> 100 requests/hour</li>
                <li><strong>Premium ($19/month):</strong> 1,000 requests/hour</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Make Your First Request</h3>
              <CodeBlock 
                language="bash"
                code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://tlv-business-pulse.vercel.app/api/businesses`}
              />
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
          
          <Endpoint
            method="GET"
            path="/api/businesses"
            description="Get a list of Tel Aviv businesses with filtering and pagination"
            params={[
              { name: 'page', type: 'number', default: '1', description: 'Page number' },
              { name: 'limit', type: 'number', default: '20', description: 'Items per page (max 100)' },
              { name: 'category', type: 'string', required: false, description: 'Filter by business category' },
              { name: 'search', type: 'string', required: false, description: 'Search by name or address' },
              { name: 'status', type: 'string', required: false, description: 'Filter by status (active/closed)' },
            ]}
            example={`{
  "businesses": [
    {
      "id": "abc123",
      "name": "Café Example",
      "category": "Restaurant",
      "address": "Rothschild Blvd 1, Tel Aviv",
      "phone": "+972-3-1234567",
      "status": "active",
      "location": {
        "lat": 32.0853,
        "lng": 34.7818
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12450,
    "pages": 623
  }
}`}
          />

          <Endpoint
            method="GET"
            path="/api/stats"
            description="Get real-time statistics and metrics"
            params={[]}
            example={`{
  "totalBusinesses": 12450,
  "newToday": 15,
  "closedToday": 3,
  "articlesPublished": 342,
  "apiCalls": 8543,
  "revenue": 1250.00,
  "uptime": 99.9,
  "lastUpdate": "2025-11-17T05:30:00Z"
}`}
          />

          <Endpoint
            method="GET"
            path="/api/insights"
            description="Get AI-generated business insights and articles"
            params={[
              { name: 'page', type: 'number', default: '1', description: 'Page number' },
              { name: 'category', type: 'string', required: false, description: 'Filter by category (trends/guides/analysis)' },
            ]}
            example={`{
  "insights": [
    {
      "id": "xyz789",
      "title": "10 Hottest New Restaurants in Tel Aviv This Month",
      "slug": "10-hottest-new-restaurants-tel-aviv",
      "excerpt": "Discover the latest culinary gems...",
      "category": "trends",
      "publishedAt": "2025-11-17T09:00:00Z",
      "views": 1523
    }
  ]
}`}
          />
        </section>

        {/* Rate Limits */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Plan</th>
                <th className="text-left py-2">Requests/Hour</th>
                <th className="text-left py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Free</td>
                <td className="py-2">100</td>
                <td className="py-2">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Premium</td>
                <td className="py-2">1,000</td>
                <td className="py-2">$19/month</td>
              </tr>
              <tr>
                <td className="py-2">Enterprise</td>
                <td className="py-2">Custom</td>
                <td className="py-2">Contact us</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Authentication */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="text-gray-600 mb-4">
            Include your API key in the Authorization header:
          </p>
          <CodeBlock
            language="bash"
            code={`Authorization: Bearer YOUR_API_KEY`}
          />
        </section>

        {/* Subscribe CTA */}
        <section className="bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6">Get your API key and start building today</p>
          <Link
            href="/api/subscribe"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Subscribe Now
          </Link>
        </section>
      </div>
    </div>
  )
}

function Endpoint({ 
  method, 
  path, 
  description, 
  params, 
  example 
}: { 
  method: string
  path: string
  description: string
  params: Array<{ name: string; type: string; default?: string; required?: boolean; description: string }>
  example: string
}) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-mono text-sm font-semibold">
          {method}
        </span>
        <code className="text-lg font-mono">{path}</code>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {params.length > 0 && (
        <>
          <h4 className="font-semibold mb-2">Parameters:</h4>
          <div className="bg-gray-50 rounded p-4 mb-4">
            {params.map((param) => (
              <div key={param.name} className="mb-2 last:mb-0">
                <code className="font-mono text-sm">{param.name}</code>
                <span className="text-gray-500 text-sm ml-2">({param.type})</span>
                {param.default && (
                  <span className="text-gray-500 text-sm ml-2">default: {param.default}</span>
                )}
                {param.required && (
                  <span className="text-red-500 text-sm ml-2">required</span>
                )}
                <p className="text-gray-600 text-sm ml-4">{param.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
      
      <h4 className="font-semibold mb-2">Example Response:</h4>
      <CodeBlock language="json" code={example} />
    </div>
  )
}

function CodeBlock({ code }: { language?: string; code: string }) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}
