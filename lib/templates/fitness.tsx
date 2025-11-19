import React from 'react';
import { GeneratedWebsite } from '../ai/generate';

interface FitnessTemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  classes?: Array<{
    name: string;
    description: string;
    instructor: string;
    duration: string;
    level: string;
  }>;
  memberships?: Array<{
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }>;
  instructors?: Array<{
    name: string;
    specialty: string;
    certifications: string[];
  }>;
}

export function FitnessTemplate({
  business,
  generated,
  classes = [],
  memberships = [],
  instructors = [],
}: FitnessTemplateProps) {
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
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundColor: colorPalette.primary }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0-5.523-4.477-10-10-10zm-40 40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0-5.523-4.477-10-10-10zm0-40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0-5.523-4.477-10-10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div
            className="inline-block px-6 py-2 bg-white bg-opacity-20 rounded-full mb-6 font-semibold backdrop-blur-sm"
            style={{ color: colorPalette.accent }}
          >
            TRANSFORM YOUR LIFE
          </div>
          <h1
            className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
            style={{ fontFamily: typography.heading }}
          >
            {generated.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 font-medium">
            {generated.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#trial"
              className="px-10 py-5 bg-white font-bold rounded-full hover:bg-opacity-90 transition transform hover:scale-105 shadow-2xl text-lg"
              style={{ color: colorPalette.primary }}
            >
              Start Free Trial
            </a>
            <a
              href="#classes"
              className="px-10 py-5 border-3 border-white font-bold rounded-full hover:bg-white hover:bg-opacity-20 transition text-lg"
            >
              View Classes
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div
        className="py-8 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.secondary} 0%, ${colorPalette.primary} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">500+</div>
              <div className="text-sm md:text-base opacity-90">Active Members</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">30+</div>
              <div className="text-sm md:text-base opacity-90">Weekly Classes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">15+</div>
              <div className="text-sm md:text-base opacity-90">Expert Trainers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">5★</div>
              <div className="text-sm md:text-base opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-black mb-8"
            style={{
              fontFamily: typography.heading,
              color: colorPalette.primary,
            }}
          >
            Your Fitness Journey Starts Here
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

      {/* Classes Schedule */}
      <section id="classes" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Our Classes
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect workout for your goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.length > 0 ? (
              classes.map((classItem, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group"
                >
                  <div
                    className="h-3"
                    style={{ backgroundColor: colorPalette.accent }}
                  ></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className="text-2xl font-black"
                        style={{ color: colorPalette.primary }}
                      >
                        {classItem.name}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: colorPalette.accent }}
                      >
                        {classItem.level}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {classItem.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>Instructor: <strong>{classItem.instructor}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏱️</span>
                        <span>Duration: <strong>{classItem.duration}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">
                  Contact us to learn about our class schedule!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                fontFamily: typography.heading,
                color: colorPalette.primary,
              }}
            >
              Membership Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {memberships.length > 0 ? (
              memberships.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden shadow-xl transition transform hover:scale-105 ${
                    plan.popular ? 'ring-4' : ''
                  }`}
                  style={{
                    ringColor: plan.popular ? colorPalette.accent : 'transparent',
                  }}
                >
                  {plan.popular && (
                    <div
                      className="py-2 text-center text-white font-bold text-sm"
                      style={{ backgroundColor: colorPalette.accent }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-8 bg-white">
                    <h3
                      className="text-2xl font-black mb-2"
                      style={{ color: colorPalette.primary }}
                    >
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span
                        className="text-5xl font-black"
                        style={{ color: colorPalette.accent }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span
                            className="text-xl flex-shrink-0"
                            style={{ color: colorPalette.accent }}
                          >
                            ✓
                          </span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full py-4 rounded-xl font-bold text-white hover:opacity-90 transition"
                      style={{
                        backgroundColor: plan.popular
                          ? colorPalette.accent
                          : colorPalette.primary,
                      }}
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-xl">
                  Contact us for membership options and pricing!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Instructors */}
      {instructors.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-black mb-4"
                style={{
                  fontFamily: typography.heading,
                  color: colorPalette.primary,
                }}
              >
                Meet Your Trainers
              </h2>
              <p className="text-xl text-gray-600">
                Expert guidance to help you reach your goals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {instructors.map((instructor, index) => (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div
                    className="w-40 h-40 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl text-white shadow-xl group-hover:shadow-2xl transition"
                    style={{ backgroundColor: colorPalette.primary }}
                  >
                    💪
                  </div>
                  <h3
                    className="text-2xl font-black mb-2"
                    style={{ color: colorPalette.primary }}
                  >
                    {instructor.name}
                  </h3>
                  <p className="text-gray-600 font-semibold mb-3">
                    {instructor.specialty}
                  </p>
                  <div className="space-y-1">
                    {instructor.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold mx-1 shadow-sm"
                        style={{ color: colorPalette.secondary }}
                      >
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                🏋️
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: colorPalette.primary }}
              >
                State-of-the-Art Equipment
              </h3>
              <p className="text-gray-600">
                Modern facilities with the latest fitness technology
              </p>
            </div>
            <div className="text-center p-6">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                👥
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: colorPalette.primary }}
              >
                Community Support
              </h3>
              <p className="text-gray-600">
                Join a motivating community of fitness enthusiasts
              </p>
            </div>
            <div className="text-center p-6">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                📊
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: colorPalette.primary }}
              >
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your results and celebrate your achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial CTA */}
      <section
        id="trial"
        className="py-20 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-black mb-6"
            style={{ fontFamily: typography.heading }}
          >
            Try Us Free for 7 Days
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            No commitment. No credit card required. Just results.
          </p>

          <div className="bg-white rounded-2xl p-8 md:p-12 text-gray-900 max-w-2xl mx-auto shadow-2xl">
            <h3
              className="text-2xl font-black mb-6"
              style={{ color: colorPalette.primary }}
            >
              Start Your Transformation Today
            </h3>
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="font-bold">Location</div>
                  <div className="text-gray-600">{business.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="font-bold">Phone</div>
                  <div className="text-gray-600">{business.phone || '03-XXX-XXXX'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="font-bold">Hours</div>
                  <div className="text-gray-600">Open 7 days a week, 6:00 AM - 10:00 PM</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href={`tel:${business.phone}`}
                className="px-8 py-4 rounded-full font-bold text-white hover:opacity-90 transition shadow-lg"
                style={{ backgroundColor: colorPalette.primary }}
              >
                Call to Sign Up
              </a>
              <a
                href={`https://wa.me/${business.phone?.replace(/\D/g, '')}`}
                className="px-8 py-4 rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition shadow-lg"
              >
                WhatsApp Us
              </a>
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
                className="text-3xl font-black mb-4"
                style={{ fontFamily: typography.heading }}
              >
                {business.name}
              </h3>
              <p className="text-gray-400 mb-4">{generated.seoDescription}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#classes" className="hover:text-white">Classes</a></li>
                <li><a href="#pricing" className="hover:text-white">Membership</a></li>
                <li><a href="#trial" className="hover:text-white">Free Trial</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Our Journey</h4>
              <div className="flex gap-4 mb-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                Share your progress with #FitWithUs
              </p>
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
