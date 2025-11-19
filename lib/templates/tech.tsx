import React from 'react';
import { GeneratedWebsite } from '../ai/generate';

interface TechTemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  features?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  pricing?: Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
  }>;
  team?: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
}

export function TechTemplate({
  business,
  generated,
  features = [],
  pricing = [],
  team = [],
}: TechTemplateProps) {
  const { colorPalette, typography } = generated;

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: typography.body,
        '--color-primary': colorPalette.primary,
        '--color-secondary': colorPalette.secondary,
        '--color-accent': colorPalette.accent,
      } as React.CSSProperties}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: colorPalette.primary }}
              >
                {business.name.charAt(0)}
              </div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: typography.heading, color: colorPalette.primary }}
              >
                {business.name}
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="#team" className="text-gray-600 hover:text-gray-900 font-medium">
                Team
              </a>
              <a
                href="#contact"
                className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-full mb-6 text-sm font-semibold"
                style={{
                  backgroundColor: `${colorPalette.accent}20`,
                  color: colorPalette.accent,
                }}
              >
                🚀 Now Available
              </div>
              <h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: typography.heading, color: colorPalette.primary }}
              >
                {generated.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                {generated.heroSubtitle}
              </p>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="#pricing"
                  className="px-8 py-4 rounded-lg text-white font-semibold hover:opacity-90 transition shadow-lg"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  Start Free Trial
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 rounded-lg border-2 font-semibold hover:bg-gray-50 transition"
                  style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
                >
                  Watch Demo
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Screenshot Placeholder */}
            <div className="hidden md:block">
              <div
                className="rounded-2xl p-8 shadow-2xl border"
                style={{
                  background: `linear-gradient(135deg, ${colorPalette.primary}10 0%, ${colorPalette.secondary}10 100%)`,
                  borderColor: colorPalette.primary + '20',
                }}
              >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded"></div>
                      <div className="h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 px-4 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-wide font-semibold">
            Trusted by innovative companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center text-2xl font-bold text-gray-400">
                Company {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            Built for Modern Teams
          </h2>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            {generated.aboutContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, ship, and scale your product
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition"
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl text-white mb-4"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: colorPalette.primary }}
                  >
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl text-white mb-4"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    ⚡
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colorPalette.primary }}>
                    Lightning Fast
                  </h3>
                  <p className="text-gray-600">
                    Optimized performance that scales with your needs
                  </p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl text-white mb-4"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    🔒
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colorPalette.primary }}>
                    Secure by Default
                  </h3>
                  <p className="text-gray-600">
                    Enterprise-grade security to protect your data
                  </p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl text-white mb-4"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    🔌
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colorPalette.primary }}>
                    Easy Integration
                  </h3>
                  <p className="text-gray-600">
                    Seamlessly integrate with your existing tools
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.length > 0 ? (
              pricing.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-8 transition ${
                    plan.highlighted
                      ? 'bg-gradient-to-b shadow-2xl scale-105'
                      : 'bg-white shadow-lg'
                  }`}
                  style={{
                    backgroundImage: plan.highlighted
                      ? `linear-gradient(to bottom, ${colorPalette.primary}, ${colorPalette.secondary})`
                      : 'none',
                    color: plan.highlighted ? 'white' : 'inherit',
                  }}
                >
                  {plan.highlighted && (
                    <div className="text-center mb-4">
                      <span
                        className="inline-block px-4 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: colorPalette.accent }}
                      >
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-lg opacity-75">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-xl flex-shrink-0">
                          {plan.highlighted ? '✓' : '✓'}
                        </span>
                        <span className={plan.highlighted ? '' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      plan.highlighted
                        ? 'bg-white hover:bg-gray-100'
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: plan.highlighted ? 'white' : colorPalette.primary,
                      color: plan.highlighted ? colorPalette.primary : 'white',
                    }}
                  >
                    Get Started
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">
                  Contact us for custom pricing tailored to your needs
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section id="team" className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Meet the Team
              </h2>
              <p className="text-xl text-gray-600">
                The people building the future
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <div
                    className="h-48 flex items-center justify-center text-6xl text-white"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    👤
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: colorPalette.primary }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-gray-600 mb-3 font-medium">{member.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: typography.heading }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            Join thousands of teams already using our platform
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <a
              href="#pricing"
              className="px-10 py-4 bg-white rounded-lg font-bold hover:bg-opacity-90 transition shadow-lg"
              style={{ color: colorPalette.primary }}
            >
              Start Free Trial
            </a>
            <a
              href={`mailto:${business.email || 'contact@company.com'}`}
              className="px-10 py-4 border-2 border-white rounded-lg font-bold hover:bg-white hover:bg-opacity-20 transition"
            >
              Contact Sales
            </a>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="opacity-75 mb-1">Email</p>
                <p className="font-semibold">{business.email || 'contact@company.com'}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Phone</p>
                <p className="font-semibold">{business.phone || '03-XXX-XXXX'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  {business.name.charAt(0)}
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: typography.heading }}
                >
                  {business.name}
                </h3>
              </div>
              <p className="text-gray-400 text-sm">{generated.seoDescription}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#team" className="hover:text-white">Team</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-3 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
            <p>&copy; {new Date().getFullYear()} {business.name}. All rights reserved.</p>
            <p className="mt-2">
              Website powered by{' '}
              <a href="/" className="text-gray-400 hover:text-white underline">
                TLV Business Pulse
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
