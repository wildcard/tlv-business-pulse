'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BusinessCard } from '@/components/ui/BusinessCard';
import { Stats, StatsGrid } from '@/components/ui/Stats';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="default" className="mb-6 bg-white/20 text-white border-white/30">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                AI-Powered Business Websites
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your Business Online in Minutes
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Professional websites for Tel Aviv businesses, automatically generated from public data.
                Free forever. No coding required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/businesses">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
                    Browse Businesses
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Claim Your Business
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why TLV Business Pulse?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
                  <p className="text-gray-600">
                    Your professional website is ready immediately. No design, no development, no hassle.
                  </p>
                </Card>

                <Card className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Verified Data</h3>
                  <p className="text-gray-600">
                    Information verified against Tel Aviv Municipality and official sources.
                  </p>
                </Card>

                <Card className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Free Forever</h3>
                  <p className="text-gray-600">
                    Professional website with all essentials. Upgrade only if you need advanced features.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                From business registration to professional website in four simple steps
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    step: '1',
                    title: 'We Find You',
                    description: 'Our AI scans Tel Aviv business registry daily for new registrations',
                  },
                  {
                    step: '2',
                    title: 'Website Generated',
                    description: 'AI creates a beautiful, professional website tailored to your industry',
                  },
                  {
                    step: '3',
                    title: 'You Get Notified',
                    description: 'Receive an email with a link to claim and customize your site',
                  },
                  {
                    step: '4',
                    title: 'Claim & Customize',
                    description: 'Add photos, update info, and make it yours in minutes',
                  },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live Statistics */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Live Platform Stats</h2>
              <StatsGrid columns={4}>
                <Stats
                  title="Total Businesses"
                  value="12,450+"
                  change={{ value: 2.5, trend: 'up' }}
                  icon={
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                />
                <Stats
                  title="Websites Generated"
                  value="8,324"
                  change={{ value: 5.2, trend: 'up' }}
                  icon={
                    <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  }
                />
                <Stats
                  title="Active This Week"
                  value="2,156"
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                />
                <Stats
                  title="New This Month"
                  value="432"
                  change={{ value: 12.3, trend: 'up' }}
                  icon={
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                />
              </StatsGrid>
            </div>
          </div>
        </section>

        {/* Featured Businesses */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Businesses</h2>
                  <p className="text-gray-600">Recently joined the platform</p>
                </div>
                <Link href="/businesses">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BusinessCard
                  slug="sabich-king"
                  name="Sabich King"
                  category="Fast Food Restaurant"
                  address="23 Herzl Street, Florentin"
                  verified={true}
                  description="Authentic Israeli street food made fresh daily"
                  tags={['Vegetarian', 'Fast Food', 'Israeli']}
                />
                <BusinessCard
                  slug="tech-hub-tlv"
                  name="Tech Hub TLV"
                  category="Coworking Space"
                  address="45 Rothschild Blvd"
                  verified={true}
                  description="Premium coworking space in the heart of Tel Aviv"
                  tags={['Coworking', 'Tech', 'Startups']}
                />
                <BusinessCard
                  slug="style-salon"
                  name="Style Salon"
                  category="Hair Salon"
                  address="12 Dizengoff Street"
                  verified={false}
                  description="Modern hair salon with experienced stylists"
                  tags={['Beauty', 'Hair', 'Styling']}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Industry Coverage */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">We Cover All Industries</h2>
              <p className="text-center text-gray-600 mb-12">
                Professional websites for every type of business in Tel Aviv
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { icon: '🍽️', name: 'Restaurants' },
                  { icon: '☕', name: 'Cafes' },
                  { icon: '💇', name: 'Salons' },
                  { icon: '💻', name: 'Tech' },
                  { icon: '🛍️', name: 'Retail' },
                  { icon: '💪', name: 'Fitness' },
                  { icon: '🏥', name: 'Health' },
                  { icon: '📚', name: 'Education' },
                  { icon: '🎭', name: 'Entertainment' },
                  { icon: '🔧', name: 'Services' },
                  { icon: '🏨', name: 'Hospitality' },
                  { icon: '🎨', name: 'Creative' },
                ].map((industry) => (
                  <Card key={industry.name} className="text-center" padding="md">
                    <div className="text-4xl mb-2">{industry.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{industry.name}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Business Owners Say</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "I was amazed to find my new restaurant already had a professional website. I just claimed it, added photos, and we were live!",
                    author: "Sarah Cohen",
                    business: "Hummus Bar, Florentin",
                  },
                  {
                    quote: "The AI generated content was spot-on for my salon. Saved me thousands in web development costs.",
                    author: "David Levi",
                    business: "Style Studio, Dizengoff",
                  },
                  {
                    quote: "As a tech startup, having an instant online presence helped us launch faster. The free tier is perfect for bootstrapping.",
                    author: "Maya Goldstein",
                    business: "TechCo, Rothschild",
                  },
                ].map((testimonial, i) => (
                  <Card key={i} padding="lg">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.business}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <FAQItem
                  question="How is this free?"
                  answer="We generate revenue through premium upgrades, ads, and API access. The basic website is free forever to support Tel Aviv's business ecosystem."
                />
                <FAQItem
                  question="How do you get my business information?"
                  answer="We source data from Tel Aviv Municipality business registry and other official public sources. All information is verified before publishing."
                />
                <FAQItem
                  question="Can I customize my website?"
                  answer="Absolutely! Once you claim your business, you can add photos, update content, customize colors, and much more."
                />
                <FAQItem
                  question="What if I already have a website?"
                  answer="Perfect! You can use your generated site as a backup, redirect to your main site, or use our premium features alongside your existing web presence."
                />
                <FAQItem
                  question="Is my website mobile-friendly?"
                  answer="Yes! All websites are fully responsive and optimized for mobile, tablet, and desktop viewing."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Take Your Business Online?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of Tel Aviv businesses with professional websites
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/businesses">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Find Your Business
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{question}</h3>
        <svg
          className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <p className="mt-3 text-gray-600">{answer}</p>
      )}
    </Card>
  );
}
