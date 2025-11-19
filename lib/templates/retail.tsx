import React from 'react';
import { GeneratedWebsite } from '../ai/generate';

interface RetailTemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  products?: Array<{
    name: string;
    description: string;
    price: string;
    category: string;
    featured?: boolean;
  }>;
  categories?: string[];
}

export function RetailTemplate({
  business,
  generated,
  products = [],
  categories = [],
}: RetailTemplateProps) {
  const { colorPalette, typography } = generated;
  const featuredProducts = products.filter((p) => p.featured);

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
      {/* Top Announcement Bar */}
      <div
        className="py-2 px-4 text-center text-white text-sm font-medium"
        style={{ backgroundColor: colorPalette.accent }}
      >
        🎉 Grand Opening Special - Visit us today! Free gift with every purchase
      </div>

      {/* Hero Section */}
      <header
        className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: typography.heading }}
          >
            {generated.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            {generated.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#products"
              className="px-8 py-4 bg-white font-bold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg"
              style={{ color: colorPalette.primary }}
            >
              Shop Now
            </a>
            <a
              href="#location"
              className="px-8 py-4 border-2 border-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-20 transition"
            >
              Visit Our Store
            </a>
          </div>
        </div>
      </header>

      {/* Quick Info Bar */}
      <div className="bg-gray-50 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <div>
                <div className="font-semibold">Store Hours</div>
                <div className="text-gray-600">Sun-Thu: 10:00 - 20:00</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-gray-600">{business.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <div>
                <div className="font-semibold">Parking</div>
                <div className="text-gray-600">Free parking available</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <div>
                <div className="font-semibold">Contact</div>
                <div className="text-gray-600">{business.phone || '03-XXX-XXXX'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Featured Products
              </h2>
              <div
                className="w-24 h-1 mx-auto rounded-full"
                style={{ backgroundColor: colorPalette.accent }}
              ></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div
                    className="h-64 flex items-center justify-center text-6xl text-white"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    🛍️
                  </div>
                  <div className="p-6">
                    <div className="text-sm font-semibold mb-2" style={{ color: colorPalette.accent }}>
                      {product.category}
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colorPalette.primary }}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold" style={{ color: colorPalette.accent }}>
                        {product.price}
                      </span>
                      <button
                        className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
                        style={{ backgroundColor: colorPalette.primary }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            About {business.name}
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

      {/* All Products */}
      <section id="products" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Our Products
            </h2>
            <p className="text-xl text-gray-600">Discover our complete collection</p>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <button
                className="px-6 py-2 rounded-full font-semibold text-white transition"
                style={{ backgroundColor: colorPalette.primary }}
              >
                All Products
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-6 py-2 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100"
                >
                  <div
                    className="h-48 flex items-center justify-center text-4xl text-white"
                    style={{ backgroundColor: colorPalette.secondary }}
                  >
                    🎁
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold mb-1" style={{ color: colorPalette.accent }}>
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: colorPalette.primary }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold" style={{ color: colorPalette.accent }}>
                        {product.price}
                      </span>
                      <button
                        className="px-4 py-1 rounded text-sm font-semibold text-white hover:opacity-90 transition"
                        style={{ backgroundColor: colorPalette.primary }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">Visit our store to see our full product range!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl mb-4">✅</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                Quality Products
              </h3>
              <p className="text-gray-600">
                Carefully curated selection of premium items
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">💳</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                Easy Payment
              </h3>
              <p className="text-gray-600">
                Cash, credit, and digital payments accepted
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">🎁</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                Gift Wrapping
              </h3>
              <p className="text-gray-600">
                Complimentary gift wrapping available
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">↩️</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colorPalette.primary }}
              >
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day return policy on all items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="py-16 px-4 text-white"
        style={{ backgroundColor: colorPalette.primary }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: typography.heading }}
          >
            Stay Updated
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter for exclusive deals and new arrivals
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition"
              style={{ backgroundColor: colorPalette.accent, color: 'white' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section id="location" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Visit Our Store
            </h2>
            <p className="text-xl text-gray-600">We'd love to see you in person!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: colorPalette.primary }}>
                Store Information
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-gray-600">{business.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-600">{business.phone || '03-XXX-XXXX'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">{business.email || 'info@store.com'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="font-semibold">Parking</div>
                    <div className="text-gray-600">Free parking in rear lot</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: colorPalette.primary }}>
                Opening Hours
              </h3>
              <div className="space-y-3 bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Sunday - Thursday</span>
                  <span className="text-gray-600">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Friday</span>
                  <span className="text-gray-600">9:00 AM - 3:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Saturday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: typography.heading }}
              >
                {business.name}
              </h3>
              <p className="text-gray-400 mb-4">{generated.seoDescription}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#products" className="hover:text-white">Shop</a></li>
                <li><a href="#location" className="hover:text-white">Store Location</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
