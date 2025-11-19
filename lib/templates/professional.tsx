import React from 'react';
import { GeneratedWebsite } from '../ai/generate';

interface ProfessionalTemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  services?: Array<{
    name: string;
    description: string;
    price?: string;
  }>;
  team?: Array<{
    name: string;
    title: string;
    credentials: string[];
    bio?: string;
  }>;
  caseStudies?: Array<{
    title: string;
    challenge: string;
    solution: string;
    results: string;
  }>;
}

export function ProfessionalTemplate({
  business,
  generated,
  services = [],
  team = [],
  caseStudies = [],
}: ProfessionalTemplateProps) {
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
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: typography.heading, color: colorPalette.primary }}
            >
              {business.name}
            </h1>
            <div className="hidden md:flex gap-6">
              <a href="#services" className="text-gray-600 hover:text-gray-900 font-medium">
                Services
              </a>
              <a href="#team" className="text-gray-600 hover:text-gray-900 font-medium">
                Team
              </a>
              <a href="#expertise" className="text-gray-600 hover:text-gray-900 font-medium">
                Expertise
              </a>
              <a
                href="#contact"
                className="px-6 py-2 rounded-md text-white font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: typography.heading, color: colorPalette.primary }}
              >
                {generated.heroTitle}
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                {generated.heroSubtitle}
              </p>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="#contact"
                  className="px-8 py-4 rounded-md text-white font-semibold hover:opacity-90 transition shadow-lg"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  Schedule Consultation
                </a>
                <a
                  href="#services"
                  className="px-8 py-4 rounded-md border-2 font-semibold hover:bg-gray-50 transition"
                  style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
                >
                  Our Services
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <div
                className="rounded-2xl p-8 shadow-xl border-t-4"
                style={{
                  backgroundColor: 'white',
                  borderTopColor: colorPalette.primary,
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
                      style={{ backgroundColor: colorPalette.primary }}
                    >
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Trusted Expertise</h3>
                      <p className="text-gray-600">Years of proven experience in the industry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
                      style={{ backgroundColor: colorPalette.primary }}
                    >
                      ⚖️
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Professional Standards</h3>
                      <p className="text-gray-600">Committed to excellence and integrity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
                      style={{ backgroundColor: colorPalette.primary }}
                    >
                      🎯
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Results-Driven</h3>
                      <p className="text-gray-600">Focused on achieving your goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                15+
              </div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                500+
              </div>
              <div className="text-gray-600">Clients Served</div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                98%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                24/7
              </div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            About Our Firm
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

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive professional services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition border-l-4"
                  style={{ borderLeftColor: colorPalette.accent }}
                >
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: colorPalette.primary }}
                  >
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  {service.price && (
                    <p className="text-sm font-semibold" style={{ color: colorPalette.accent }}>
                      {service.price}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">
                  Contact us to learn about our comprehensive service offerings
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section id="team" className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Our Team
              </h2>
              <p className="text-xl text-gray-600">
                Meet the professionals dedicated to your success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <div
                    className="h-48 flex items-center justify-center text-6xl text-white"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    👤
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: colorPalette.primary }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-gray-600 font-semibold mb-4">{member.title}</p>
                    {member.bio && (
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                    <div className="space-y-1">
                      {member.credentials.map((credential, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span style={{ color: colorPalette.accent }}>✓</span>
                          <span className="text-gray-600">{credential}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      {caseStudies.length > 0 && (
        <section id="expertise" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real results for real clients
              </p>
            </div>

            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 md:p-12"
                >
                  <h3
                    className="text-2xl font-bold mb-6"
                    style={{ color: colorPalette.primary }}
                  >
                    {study.title}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
                      <p className="text-gray-600">{study.results}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 text-white"
        style={{ backgroundColor: colorPalette.primary }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: typography.heading }}
            >
              Get in Touch
            </h2>
            <p className="text-xl opacity-95">
              Schedule a consultation to discuss how we can help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6" style={{ color: colorPalette.primary }}>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    📍
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Office Address</div>
                    <div className="text-gray-600">{business.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    📞
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <div className="text-gray-600">{business.phone || '03-XXX-XXXX'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    ✉️
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <div className="text-gray-600">{business.email || 'info@firm.com'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6" style={{ color: colorPalette.primary }}>
                Office Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Saturday</span>
                  <span className="text-gray-600">By Appointment</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Sunday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href={`tel:${business.phone}`}
                  className="block w-full text-center px-6 py-4 rounded-lg text-white font-semibold hover:opacity-90 transition"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: typography.heading }}
              >
                {business.name}
              </h3>
              <p className="text-gray-400">{generated.seoDescription}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#team" className="hover:text-white">Our Team</a></li>
                <li><a href="#expertise" className="hover:text-white">Expertise</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
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
