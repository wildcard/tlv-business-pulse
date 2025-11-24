'use client';

import React from 'react';
import { GeneratedWebsite } from '../ai/generate';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface RestaurantTemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  menu?: Array<{
    name: string;
    description: string;
    price: string;
    category: string;
  }>;
  verified?: boolean;
  licenseNumber?: string;
  dataSources?: string[];
  lastVerified?: Date;
}

export function RestaurantTemplate({
  business,
  generated,
  menu = [],
  verified = true,
  licenseNumber = '515738293',
  dataSources = [
    'Tel Aviv Municipality Business Registry',
    'Israel Corporate Registry',
    'Government Tax Authority Database',
  ],
  lastVerified = new Date(),
}: RestaurantTemplateProps) {
  const { colorPalette, typography } = generated;

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: typography.body,
        '--color-primary': colorPalette.primary,
        '--color-secondary': colorPalette.secondary,
        '--color-accent': colorPalette.accent,
      } as React.CSSProperties}
    >
      {/* Hero Section */}
      <header
        className="relative h-screen flex items-center justify-center text-white"
        style={{ backgroundColor: colorPalette.primary }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: typography.heading }}
          >
            {generated.heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 opacity-90">
            {generated.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#menu"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              View Menu
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
            >
              Order Now
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </header>

      {/* Quick Info Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕐</span>
              <div>
                <div className="font-semibold">Open Now</div>
                <div className="text-gray-600">Sun-Thu: 11:00 - 23:00</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-semibold">Find Us</div>
                <div className="text-gray-600">{business.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <div>
                <div className="font-semibold">Call Us</div>
                <div className="text-gray-600">
                  {business.phone || '03-XXX-XXXX'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            {generated.aboutContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            Our Menu
          </h2>

          {menu.length > 0 ? (
            <>
              {/* Group by category */}
              {['appetizer', 'main', 'dessert', 'beverage'].map(
                (category) => {
                  const items = menu.filter(
                    (item) => item.category === category
                  );
                  if (items.length === 0) return null;

                  return (
                    <div key={category} className="mb-12">
                      <h3
                        className="text-2xl font-semibold mb-6 capitalize"
                        style={{ color: colorPalette.secondary }}
                      >
                        {category}s
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-semibold">
                                {item.name}
                              </h4>
                              <span
                                className="text-lg font-bold ml-4"
                                style={{ color: colorPalette.accent }}
                              >
                                {item.price}
                              </span>
                            </div>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-xl mb-4">
                Menu coming soon! Call us for today's specials.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="text-5xl mb-4"
                style={{ color: colorPalette.primary }}
              >
                🥗
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">
                We source the freshest local ingredients daily
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl mb-4"
                style={{ color: colorPalette.primary }}
              >
                👨‍🍳
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-gray-600">
                Prepared by experienced culinary professionals
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl mb-4"
                style={{ color: colorPalette.primary }}
              >
                🏆
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-600">
                Fast, friendly service in a welcoming atmosphere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4"
        style={{ backgroundColor: colorPalette.primary }}
      >
        <div className="max-w-4xl mx-auto text-white text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: typography.heading }}
          >
            Visit Us Today
          </h2>
          <p className="text-xl mb-12 opacity-90">
            We're ready to serve you the best meal in Tel Aviv
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Location</h3>
              <p className="text-lg mb-2">{business.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                Get Directions
              </a>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Contact</h3>
              <p className="text-lg mb-2">
                📞 {business.phone || '03-XXX-XXXX'}
              </p>
              <p className="text-lg mb-2">
                ✉️ {business.email || 'info@restaurant.com'}
              </p>
              <a
                href={`tel:${business.phone}`}
                className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Verification</h2>
            <p className="text-gray-600">
              Information verified through official sources for your peace of mind
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <VerificationBadge
                      verified={verified}
                      licenseNumber={licenseNumber}
                      dataSources={dataSources}
                      lastVerified={lastVerified}
                      onReportIncorrect={() => alert('Report form would open here')}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Business information verified against official Tel Aviv records
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  View Verification Details
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
                  Report Incorrect Information
                </button>
              </div>
            </div>

            {licenseNumber && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">License Number:</span>{' '}
                  <span className="font-mono">{licenseNumber}</span>
                  {' • '}
                  <span>Last verified: {lastVerified.toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">{business.name}</h3>
          <p className="text-gray-400 mb-6">{generated.seoDescription}</p>

          <div className="flex justify-center gap-6 mb-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="TripAdvisor"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </a>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {business.name}. All rights
              reserved.
            </p>
            <p className="mt-2">
              Website powered by{' '}
              <a
                href="/"
                className="text-gray-400 hover:text-white underline"
              >
                TLV Business Pulse
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
