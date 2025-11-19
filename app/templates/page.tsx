import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllTemplateTypes,
  getTemplateMetadata,
  TEMPLATE_METADATA,
} from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Website Templates - TLV Business Pulse',
  description:
    'Browse our collection of professional website templates designed for Israeli businesses',
};

export default function TemplatesPage() {
  const templates = getAllTemplateTypes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Professional, industry-specific website templates designed for Israeli
            businesses. Each template is fully customizable and optimized for mobile.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition shadow-lg"
            >
              Get Started Free
            </a>
            <a
              href="#templates"
              className="px-8 py-4 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
            >
              Browse Templates
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-bold mb-2">AI-Customized</h3>
              <p className="text-gray-600 text-sm">
                Automatically adapted to your business
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold mb-2">Mobile-First</h3>
              <p className="text-gray-600 text-sm">
                Perfect on all devices
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">
                Optimized for speed and SEO
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🇮🇱</div>
              <h3 className="font-bold mb-2">Hebrew & English</h3>
              <p className="text-gray-600 text-sm">
                Full RTL support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section id="templates" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Industry-Specific Templates
            </h2>
            <p className="text-xl text-gray-600">
              Each template is crafted for specific business types with unique features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((templateType) => {
              const metadata = getTemplateMetadata(templateType);
              const icons: Record<string, string> = {
                restaurant: '🍽️',
                beauty: '💇',
                professional_services: '👔',
                retail: '🛍️',
                fitness: '💪',
                tech: '💻',
              };

              return (
                <Link
                  key={templateType}
                  href={`/templates/${templateType}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-48 flex items-center justify-center text-7xl">
                    {icons[templateType] || '🏢'}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">
                      {metadata.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{metadata.description}</p>

                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        Perfect For:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {metadata.industries.slice(0, 3).map((industry) => (
                          <span
                            key={industry}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        Key Features:
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {metadata.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition group-hover:bg-blue-700">
                      Preview Template →
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Get your professional website in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Your Template</h3>
              <p className="text-gray-600">
                Select the template that best fits your business type
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">AI Customization</h3>
              <p className="text-gray-600">
                Our AI generates custom content, colors, and layout for your business
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Publish & Grow</h3>
              <p className="text-gray-600">
                Your website goes live instantly, ready to attract customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Israeli businesses already online with TLV Business Pulse
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/"
              className="px-10 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition shadow-lg text-lg"
            >
              Start Free
            </a>
            <a
              href="/pricing"
              className="px-10 py-4 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition text-lg"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
