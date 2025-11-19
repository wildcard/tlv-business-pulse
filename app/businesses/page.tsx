'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BusinessCard } from '@/components/ui/BusinessCard';
import { Badge } from '@/components/ui/Badge';
import { generateSEO } from '@/components/ui/SEOHead';

// Mock data - in production this would come from API
const MOCK_BUSINESSES = [
  {
    slug: 'sabich-king',
    name: 'Sabich King',
    category: 'Restaurant',
    address: '23 Herzl Street, Florentin, Tel Aviv',
    neighborhood: 'Florentin',
    verified: true,
    description: 'Authentic Israeli street food made fresh daily',
    tags: ['Vegetarian', 'Fast Food', 'Israeli'],
    addedDate: '2024-01-15',
  },
  {
    slug: 'tech-hub-tlv',
    name: 'Tech Hub TLV',
    category: 'Tech',
    address: '45 Rothschild Blvd, Tel Aviv',
    neighborhood: 'Rothschild',
    verified: true,
    description: 'Premium coworking space in the heart of Tel Aviv',
    tags: ['Coworking', 'Tech', 'Startups'],
    addedDate: '2024-02-01',
  },
  {
    slug: 'style-salon',
    name: 'Style Salon',
    category: 'Salon',
    address: '12 Dizengoff Street, Tel Aviv',
    neighborhood: 'Dizengoff',
    verified: false,
    description: 'Modern hair salon with experienced stylists',
    tags: ['Beauty', 'Hair', 'Styling'],
    addedDate: '2024-01-20',
  },
  {
    slug: 'fitness-pro',
    name: 'Fitness Pro',
    category: 'Fitness',
    address: '78 Ibn Gabirol, Tel Aviv',
    neighborhood: 'Center',
    verified: true,
    description: 'State-of-the-art gym with personal training',
    tags: ['Gym', 'Personal Training', 'Health'],
    addedDate: '2024-01-25',
  },
  {
    slug: 'coffee-corner',
    name: 'Coffee Corner',
    category: 'Cafe',
    address: '15 Sheinkin Street, Tel Aviv',
    neighborhood: 'Sheinkin',
    verified: true,
    description: 'Specialty coffee and homemade pastries',
    tags: ['Coffee', 'Pastries', 'Breakfast'],
    addedDate: '2024-02-05',
  },
  {
    slug: 'book-haven',
    name: 'Book Haven',
    category: 'Retail',
    address: '33 Allenby Street, Tel Aviv',
    neighborhood: 'Center',
    verified: false,
    description: 'Independent bookstore with curated selection',
    tags: ['Books', 'Literature', 'Culture'],
    addedDate: '2024-01-30',
  },
];

const CATEGORIES = [
  'All Categories',
  'Restaurant',
  'Cafe',
  'Salon',
  'Tech',
  'Retail',
  'Fitness',
  'Health',
  'Education',
  'Entertainment',
  'Service',
];

const NEIGHBORHOODS = [
  'All Neighborhoods',
  'Florentin',
  'Dizengoff',
  'Rothschild',
  'Center',
  'Sheinkin',
  'Jaffa',
  'North',
  'South',
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'newest', label: 'Recently Added' },
  { value: 'popular', label: 'Most Popular' },
];

export const metadata = generateSEO({
  title: 'Browse Businesses',
  description: 'Discover Tel Aviv businesses with professional websites. Search by category, neighborhood, or keyword.',
  keywords: ['Tel Aviv businesses', 'business directory', 'local businesses', 'Tel Aviv'],
});

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All Neighborhoods');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort businesses
  const filteredBusinesses = MOCK_BUSINESSES.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || business.category === selectedCategory;
    const matchesNeighborhood = selectedNeighborhood === 'All Neighborhoods' || business.neighborhood === selectedNeighborhood;

    return matchesSearch && matchesCategory && matchesNeighborhood;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'newest') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    return 0; // popular would need additional data
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse Businesses
            </h1>
            <p className="text-xl text-gray-600">
              Discover {MOCK_BUSINESSES.length}+ Tel Aviv businesses with professional websites
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search businesses, categories, or neighborhoods..."
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

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                  fullWidth
                />
              </div>

              {/* Neighborhood Filter */}
              <div className="w-full lg:w-48">
                <Select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  options={NEIGHBORHOODS.map(hood => ({ value: hood, label: hood }))}
                  fullWidth
                />
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={SORT_OPTIONS}
                  fullWidth
                />
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== 'All Categories' || selectedNeighborhood !== 'All Neighborhoods') && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="primary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                    Search: {searchQuery}
                    <button className="ml-1">×</button>
                  </Badge>
                )}
                {selectedCategory !== 'All Categories' && (
                  <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedCategory('All Categories')}>
                    {selectedCategory}
                    <button className="ml-1">×</button>
                  </Badge>
                )}
                {selectedNeighborhood !== 'All Neighborhoods' && (
                  <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedNeighborhood('All Neighborhoods')}>
                    {selectedNeighborhood}
                    <button className="ml-1">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedNeighborhood('All Neighborhoods');
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> businesses
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Business Cards */}
            {filteredBusinesses.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.slug}
                    slug={business.slug}
                    name={business.name}
                    category={business.category}
                    address={business.address}
                    verified={business.verified}
                    description={business.description}
                    tags={business.tags}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedNeighborhood('All Neighborhoods');
                  }}
                  variant="primary"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination placeholder */}
            {filteredBusinesses.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="primary">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
