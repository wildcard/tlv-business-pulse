import React from 'react';
import { GeneratedWebsite } from '../ai/generate';

interface BeautyTemplateProps {
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
    duration?: string;
    price: string;
  }>;
  staff?: Array<{
    name: string;
    role: string;
    specialties: string[];
  }>;
}

export function BeautyTemplate({
  business,
  generated,
  services = [],
  staff = [],
}: BeautyTemplateProps) {
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
      {/* Hero Section */}
      <header
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: typography.heading }}
          >
            {generated.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 font-light">
            {generated.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#booking"
              className="px-8 py-4 bg-white font-semibold rounded-full hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg"
              style={{ color: colorPalette.primary }}
            >
              Book Now
            </a>
            <a
              href="#services"
              className="px-8 py-4 border-2 border-white font-semibold rounded-full hover:bg-white transition transform hover:scale-105"
              style={{ '--hover-color': colorPalette.primary } as React.CSSProperties}
            >
              View Services
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </header>

      {/* Quick Info Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: colorPalette.primary }}
              >
                ⏰
              </div>
              <div>
                <div className="font-semibold text-gray-900">Open Today</div>
                <div className="text-gray-600">9:00 AM - 8:00 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: colorPalette.primary }}
              >
                📍
              </div>
              <div>
                <div className="font-semibold text-gray-900">Location</div>
                <div className="text-gray-600">{business.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: colorPalette.primary }}
              >
                📞
              </div>
              <div>
                <div className="font-semibold text-gray-900">Call Us</div>
                <div className="text-gray-600">{business.phone || '03-XXX-XXXX'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Welcome to {business.name}
            </h2>
            <div
              className="w-24 h-1 mx-auto mb-8 rounded-full"
              style={{ backgroundColor: colorPalette.accent }}
            ></div>
          </div>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed text-center">
            {generated.aboutContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
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
            <div
              className="w-24 h-1 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: colorPalette.accent }}
            ></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience luxury and rejuvenation with our premium treatments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: colorPalette.primary }}
                    >
                      {service.name}
                    </h3>
                    <span
                      className="text-lg font-bold"
                      style={{ color: colorPalette.accent }}
                    >
                      {service.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.duration && (
                    <p className="text-sm text-gray-500">
                      ⏱️ Duration: {service.duration}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">
                  Contact us to learn about our full range of services
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      {staff.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Meet Our Team
              </h2>
              <div
                className="w-24 h-1 mx-auto mb-6 rounded-full"
                style={{ backgroundColor: colorPalette.accent }}
              ></div>
              <p className="text-xl text-gray-600">
                Expert professionals dedicated to your beauty
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition"
                >
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    👤
                  </div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: colorPalette.primary }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{member.role}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-sm rounded-full"
                        style={{ color: colorPalette.secondary }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-6xl mb-6">✨</div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Premium Products
              </h3>
              <p className="text-gray-600">
                We use only the finest, professional-grade products
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-6">💆</div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Relaxing Atmosphere
              </h3>
              <p className="text-gray-600">
                Enjoy a peaceful, luxurious environment
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-6">⭐</div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Expert Staff
              </h3>
              <p className="text-gray-600">
                Certified professionals with years of experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section
        id="booking"
        className="py-20 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: typography.heading }}
          >
            Book Your Appointment
          </h2>
          <p className="text-xl mb-12 opacity-95">
            Ready to look and feel your best? Reserve your spot today!
          </p>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl text-gray-900">
            <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: colorPalette.primary }}>
                  Visit Us
                </h3>
                <p className="text-lg mb-2 flex items-center gap-2">
                  <span>📍</span> {business.address}
                </p>
                <p className="text-lg mb-2 flex items-center gap-2">
                  <span>📞</span> {business.phone || '03-XXX-XXXX'}
                </p>
                <p className="text-lg flex items-center gap-2">
                  <span>✉️</span> {business.email || 'info@salon.com'}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: colorPalette.primary }}>
                  Opening Hours
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex justify-between">
                    <span>Sunday - Thursday:</span>
                    <span className="font-semibold">9:00 AM - 8:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Friday:</span>
                    <span className="font-semibold">9:00 AM - 4:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">Closed</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href={`tel:${business.phone}`}
                className="px-8 py-4 font-bold rounded-full text-white hover:opacity-90 transition transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Call to Book
              </a>
              <a
                href={`https://wa.me/${business.phone?.replace(/\D/g, '')}`}
                className="px-8 py-4 font-bold rounded-full bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-105 shadow-lg"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: typography.heading }}>
              {business.name}
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              {generated.seoDescription}
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <div className="text-center text-sm text-gray-500">
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
