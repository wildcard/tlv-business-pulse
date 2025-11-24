'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const BLOG_POSTS = [
  {
    slug: 'welcome-to-tlv-business-pulse',
    title: 'Welcome to TLV Business Pulse',
    excerpt: 'Introducing the world\'s first AI-powered business website platform. Learn how we\'re helping Tel Aviv businesses get online.',
    category: 'Announcement',
    author: 'TLV Team',
    date: '2024-01-15',
    readTime: '5 min read',
    image: '/blog/welcome.jpg',
  },
  {
    slug: 'how-ai-generates-your-website',
    title: 'How AI Generates Your Website',
    excerpt: 'A behind-the-scenes look at our AI technology and how it creates professional websites tailored to your business.',
    category: 'Technology',
    author: 'Sarah Cohen',
    date: '2024-01-20',
    readTime: '8 min read',
    image: '/blog/ai-tech.jpg',
  },
  {
    slug: 'tel-aviv-business-trends-2024',
    title: 'Tel Aviv Business Trends 2024',
    excerpt: 'Analyzing the latest trends in Tel Aviv\'s business landscape, from tech startups to local cafes.',
    category: 'Insights',
    author: 'David Levi',
    date: '2024-02-01',
    readTime: '10 min read',
    image: '/blog/trends.jpg',
  },
  {
    slug: 'success-story-sabich-king',
    title: 'Success Story: Sabich King',
    excerpt: 'How a small Florentin restaurant went from no online presence to 1000+ monthly visitors in just 2 weeks.',
    category: 'Success Story',
    author: 'Maya Goldstein',
    date: '2024-02-05',
    readTime: '6 min read',
    image: '/blog/success.jpg',
  },
  {
    slug: 'seo-tips-local-business',
    title: 'SEO Tips for Local Businesses',
    excerpt: 'Simple strategies to help your business rank higher in local search results and attract more customers.',
    category: 'Tips',
    author: 'Rachel Ben-David',
    date: '2024-02-10',
    readTime: '7 min read',
    image: '/blog/seo.jpg',
  },
  {
    slug: 'new-feature-online-booking',
    title: 'New Feature: Online Booking',
    excerpt: 'Announcing our new online booking system for Premium users. Schedule appointments right from your website.',
    category: 'Feature',
    author: 'TLV Team',
    date: '2024-02-15',
    readTime: '4 min read',
    image: '/blog/booking.jpg',
  },
];

const CATEGORIES = ['All', 'Announcement', 'Technology', 'Insights', 'Success Story', 'Tips', 'Feature'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Blog & News
              </h1>
              <p className="text-xl text-white/90">
                Updates, insights, and success stories from the TLV Business Pulse team
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {selectedCategory === 'All' && !searchQuery && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
                  <Card hover padding="none" className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      <div className="h-64 md:h-auto bg-gradient-to-br from-primary-100 to-secondary-100" />
                      <div className="p-8">
                        <Badge variant="primary" className="mb-4">Featured</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          {BLOG_POSTS[0].title}
                        </h2>
                        <p className="text-gray-600 mb-6">
                          {BLOG_POSTS[0].excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{BLOG_POSTS[0].author}</span>
                          <span className="mx-2">•</span>
                          <span>{BLOG_POSTS[0].date}</span>
                          <span className="mx-2">•</span>
                          <span>{BLOG_POSTS[0].readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <Card hover padding="none" className="h-full overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100" />
                        <div className="p-6">
                          <Badge variant="primary" size="sm" className="mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card padding="lg" className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-600 mb-6">
                  Get the latest updates, insights, and tips delivered to your inbox weekly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    fullWidth
                    className="flex-1"
                  />
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  We'll never share your email. Unsubscribe anytime.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
