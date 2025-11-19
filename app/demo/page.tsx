import React from 'react';
import Link from 'next/link';

// Demo businesses showcase
const demoBusinesses = [
  {
    id: 'sabich-king',
    name: 'Sabich King',
    category: 'Fast Food Restaurant',
    address: '23 Herzl Street, Florentin, Tel Aviv',
    description: 'Authentic Israeli street food specializing in sabich',
    image: '/demo/sabich-king.jpg',
    color: '#FFB800',
    stats: {
      visitors: 247,
      leads: 23,
      conversions: 8,
    },
  },
  {
    id: 'bella-salon',
    name: 'Bella Beauty Salon',
    category: 'Beauty Salon',
    address: '42 Dizengoff Street, Tel Aviv',
    description: 'Premium hair, nails, and makeup services',
    image: '/demo/bella-salon.jpg',
    color: '#E91E63',
    stats: {
      visitors: 389,
      leads: 45,
      conversions: 18,
    },
  },
  {
    id: 'techstart-solutions',
    name: 'TechStart Solutions',
    category: 'Technology Consulting',
    address: '15 Rothschild Blvd, Tel Aviv',
    description: 'Software consulting for growing businesses',
    image: '/demo/techstart.jpg',
    color: '#2196F3',
    stats: {
      visitors: 156,
      leads: 12,
      conversions: 3,
    },
  },
  {
    id: 'yoga-haven',
    name: 'Yoga Haven',
    category: 'Fitness Studio',
    address: '8 HaYarkon Street, Tel Aviv',
    description: 'Modern yoga and wellness studio',
    image: '/demo/yoga-haven.jpg',
    color: '#4CAF50',
    stats: {
      visitors: 298,
      leads: 34,
      conversions: 15,
    },
  },
  {
    id: 'cafe-noir',
    name: 'Café Noir',
    category: 'Coffee Shop',
    address: '33 Sheinkin Street, Tel Aviv',
    description: 'Artisan coffee and fresh pastries',
    image: '/demo/cafe-noir.jpg',
    color: '#795548',
    stats: {
      visitors: 512,
      leads: 67,
      conversions: 28,
    },
  },
  {
    id: 'legal-expert',
    name: 'Legal Expert Law Firm',
    category: 'Legal Services',
    address: '50 Derech Menachem Begin, Tel Aviv',
    description: 'Corporate and business law specialists',
    image: '/demo/legal-expert.jpg',
    color: '#1A237E',
    stats: {
      visitors: 203,
      leads: 18,
      conversions: 6,
    },
  },
];

export default function DemoPage() {
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
              <Link
                href="/demo"
                className="text-gray-900 font-semibold border-b-2 border-blue-600"
              >
                Live Demos
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            See AI-Generated Websites in Action
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Real businesses. Real websites. Generated automatically in 60
            seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              ⚡ Instant Generation
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              🎨 Custom Branding
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              📱 Mobile Responsive
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              🚀 SEO Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                1,805
              </div>
              <div className="text-gray-600">Total Visitors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">199</div>
              <div className="text-gray-600">Total Leads</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">78</div>
              <div className="text-gray-600">Conversions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                11%
              </div>
              <div className="text-gray-600">Avg. Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Businesses Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Live Demo Websites
            </h2>
            <p className="text-xl text-gray-600">
              Click any business to see their AI-generated website
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/business/${business.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Business Image Placeholder */}
                <div
                  className="h-48 flex items-center justify-center text-white text-6xl"
                  style={{ backgroundColor: business.color }}
                >
                  {business.category === 'Fast Food Restaurant' && '🌯'}
                  {business.category === 'Beauty Salon' && '💇‍♀️'}
                  {business.category === 'Technology Consulting' && '💻'}
                  {business.category === 'Fitness Studio' && '🧘'}
                  {business.category === 'Coffee Shop' && '☕'}
                  {business.category === 'Legal Services' && '⚖️'}
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition">
                      {business.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      LIVE
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{business.category}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    📍 {business.address}
                  </p>
                  <p className="text-gray-700 mb-6">{business.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {business.stats.visitors}
                      </div>
                      <div className="text-xs text-gray-500">Visitors</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {business.stats.leads}
                      </div>
                      <div className="text-xs text-gray-500">Leads</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {business.stats.conversions}
                      </div>
                      <div className="text-xs text-gray-500">Sales</div>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="mt-6">
                    <span className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg group-hover:bg-blue-700 transition">
                      View Website →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Business Registers
              </h3>
              <p className="text-gray-600">
                New business registers with Tel Aviv Municipality
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generates Site</h3>
              <p className="text-gray-600">
                GPT-4 creates custom website, branding, and content in 60s
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Owner Notified</h3>
              <p className="text-gray-600">
                Email & SMS sent: "Your website is ready!"
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Claim & Customize
              </h3>
              <p className="text-gray-600">
                Owner claims site, adds photos, customizes in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Traditional vs. TLV Business Pulse
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Traditional Website
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">
                    Costs ₪2,000-10,000 to build
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">
                    Takes 4-8 weeks to launch
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">
                    Requires technical knowledge
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">
                    Need to hire designer/developer
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">
                    Generic templates, not industry-specific
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Solution */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">
                TLV Business Pulse
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-800 font-semibold">
                    100% FREE (basic tier forever)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-800 font-semibold">
                    Live in 60 seconds
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-800 font-semibold">
                    Zero technical knowledge needed
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-800 font-semibold">
                    AI does everything automatically
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-800 font-semibold">
                    Custom industry-specific templates
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to See Your Business Online?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Register your business with Tel Aviv and get your professional
            website automatically
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.tel-aviv.gov.il/Business"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Register New Business
            </a>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">TLV Business Pulse</h3>
          <p className="text-gray-400 mb-6">
            Automatically creating professional websites for every new Tel Aviv
            business
          </p>
          <div className="text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} TLV Business Pulse. Open source
              project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
