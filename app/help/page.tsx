'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: '🚀',
    articles: [
      { title: 'How to claim your business', slug: 'claim-business' },
      { title: 'First steps after claiming', slug: 'first-steps' },
      { title: 'Understanding your dashboard', slug: 'dashboard-guide' },
      { title: 'Adding your first photo', slug: 'adding-photos' },
    ],
  },
  {
    id: 'managing',
    name: 'Managing Your Website',
    icon: '⚙️',
    articles: [
      { title: 'Updating business information', slug: 'update-info' },
      { title: 'Customizing colors and fonts', slug: 'customization' },
      { title: 'Managing photos and gallery', slug: 'photo-management' },
      { title: 'Setting up online booking', slug: 'booking-setup' },
    ],
  },
  {
    id: 'verification',
    name: 'Verification & Data',
    icon: '✅',
    articles: [
      { title: 'How we verify businesses', slug: 'verification-process' },
      { title: 'Data sources we use', slug: 'data-sources' },
      { title: 'Updating incorrect information', slug: 'report-incorrect' },
      { title: 'Getting the verified badge', slug: 'verified-badge' },
    ],
  },
  {
    id: 'claiming',
    name: 'Claiming Your Business',
    icon: '🏢',
    articles: [
      { title: 'Verification methods', slug: 'verification-methods' },
      { title: 'Phone verification', slug: 'phone-verification' },
      { title: 'Email verification', slug: 'email-verification' },
      { title: 'Troubleshooting claim issues', slug: 'claim-troubleshooting' },
    ],
  },
  {
    id: 'pricing',
    name: 'Plans & Pricing',
    icon: '💳',
    articles: [
      { title: 'Understanding pricing tiers', slug: 'pricing-tiers' },
      { title: 'Upgrading your plan', slug: 'upgrade-plan' },
      { title: 'Cancellation and refunds', slug: 'cancellation' },
      { title: 'Custom domain setup', slug: 'custom-domain' },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Support',
    icon: '🔧',
    articles: [
      { title: 'Website not loading', slug: 'website-loading' },
      { title: 'Mobile display issues', slug: 'mobile-issues' },
      { title: 'SEO optimization tips', slug: 'seo-tips' },
      { title: 'Analytics and tracking', slug: 'analytics' },
    ],
  },
];

const POPULAR_ARTICLES = [
  { title: 'How to claim your business', category: 'Getting Started', slug: 'claim-business' },
  { title: 'Upgrading to Premium', category: 'Plans & Pricing', slug: 'upgrade-plan' },
  { title: 'How we verify businesses', category: 'Verification', slug: 'verification-process' },
  { title: 'Custom domain setup', category: 'Plans & Pricing', slug: 'custom-domain' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                How Can We Help?
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Search our knowledge base or browse categories below
              </p>
              <div className="max-w-2xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  className="bg-white"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPULAR_ARTICLES.map((article, index) => (
                  <Card key={index} hover padding="md" className="cursor-pointer">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                        <Badge variant="default" size="sm">{article.category}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HELP_CATEGORIES.map((category) => (
                  <Card key={category.id} padding="lg" hover className="cursor-pointer">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
                    <ul className="space-y-2">
                      {category.articles.map((article, index) => (
                        <li key={index}>
                          <a
                            href={`#${article.slug}`}
                            className="text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {article.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card padding="lg" className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Still Need Help?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Our support team is here to help you 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:support@tlvpulse.com" className="inline-block">
                    <Card padding="md" hover className="text-left cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                          <p className="text-sm text-gray-600">support@tlvpulse.com</p>
                          <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                        </div>
                      </div>
                    </Card>
                  </a>

                  <a href="tel:+972123456789" className="inline-block">
                    <Card padding="md" hover className="text-left cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                          <p className="text-sm text-gray-600">+972-12-345-6789</p>
                          <p className="text-xs text-gray-500 mt-1">Sun-Thu, 9am-6pm IST</p>
                        </div>
                      </div>
                    </Card>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
