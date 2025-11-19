'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';

interface NavbarProps {
  variant?: 'default' | 'transparent';
}

export const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bgClass = variant === 'transparent' ? 'bg-transparent' : 'bg-white border-b border-gray-200';

  return (
    <nav className={`sticky top-0 z-40 ${bgClass} backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TLV</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Business Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/businesses" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Businesses
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Help
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="/businesses"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Businesses
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/help"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
