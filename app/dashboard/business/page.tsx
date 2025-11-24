'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Stats, StatsGrid } from '@/components/ui/Stats';
import { Badge } from '@/components/ui/Badge';

type Tab = 'overview' | 'content' | 'settings' | 'analytics';

export default function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [businessName, setBusinessName] = useState('Sabich King');

  const tabs = [
    { id: 'overview' as Tab, name: 'Overview', icon: '📊' },
    { id: 'content' as Tab, name: 'Content', icon: '✏️' },
    { id: 'settings' as Tab, name: 'Settings', icon: '⚙️' },
    { id: 'analytics' as Tab, name: 'Analytics', icon: '📈' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{businessName}</h1>
                <p className="text-gray-600 mt-1">Manage your business website</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="verified" icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                }>
                  Verified
                </Badge>
                <a href="/business/sabich-king" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Website
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function OverviewTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Quick Stats */}
      <StatsGrid columns={4}>
        <Stats
          title="Website Visitors"
          value="1,234"
          change={{ value: 12.5, trend: 'up' }}
          icon={
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          description="Last 7 days"
        />
        <Stats
          title="Contact Forms"
          value="23"
          change={{ value: 8.3, trend: 'up' }}
          icon={
            <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          description="New submissions"
        />
        <Stats
          title="Phone Clicks"
          value="156"
          change={{ value: 5.2, trend: 'up' }}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          description="This week"
        />
        <Stats
          title="Directions"
          value="89"
          change={{ value: 15.7, trend: 'up' }}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          description="Map requests"
        />
      </StatsGrid>

      {/* Visitor Chart */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Visitor Trend (Last 7 Days)</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[45, 52, 48, 65, 58, 72, 68].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-600 rounded-t hover:bg-primary-700 transition-colors cursor-pointer"
                style={{ height: `${(value / 72) * 100}%` }}
                title={`${value} visitors`}
              />
              <div className="text-xs text-gray-500 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'contact', message: 'New contact form submission from Sarah', time: '2 minutes ago' },
            { type: 'visitor', message: '15 new visitors in the last hour', time: '1 hour ago' },
            { type: 'phone', message: '3 people clicked your phone number', time: '3 hours ago' },
            { type: 'directions', message: '5 direction requests', time: '5 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                {activity.type === 'contact' && (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {activity.type === 'visitor' && (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
                {activity.type === 'phone' && (
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                )}
                {activity.type === 'directions' && (
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* About Section */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About Your Business</h2>
        <Textarea
          label="Business Description"
          placeholder="Tell customers about your business..."
          rows={6}
          fullWidth
          defaultValue="Welcome to Sabich King, Florentin's newest fast food destination! Located in the heart of one of Tel Aviv's most vibrant neighborhoods, we're bringing authentic Israeli street food to the community."
        />
        <div className="mt-4 flex justify-end">
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      {/* Services/Menu */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
          <Button variant="outline" size="sm">Add Item</Button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Classic Sabich', price: '₪28', category: 'Main' },
            { name: 'Sabich Royal', price: '₪35', category: 'Main' },
            { name: 'Falafel Plate', price: '₪32', category: 'Main' },
          ].map((item, index) => (
            <Card key={index} padding="md" className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-gray-900">{item.price}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Photos */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Photo Gallery</h2>
          <Button variant="outline" size="sm">Upload Photos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative aspect-square bg-gray-200 rounded-lg group cursor-pointer">
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <Button variant="danger" size="sm">Remove</Button>
              </div>
            </div>
          ))}
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-600 transition-colors">
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div className="text-sm text-gray-600">Add Photo</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Up to 10 photos on Free plan, unlimited on Premium</p>
      </Card>

      {/* Business Hours */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h2>
        <div className="space-y-3">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-32 font-medium text-gray-700">{day}</div>
              <Input type="time" defaultValue="09:00" />
              <span className="text-gray-500">to</span>
              <Input type="time" defaultValue="22:00" />
              <button className="text-gray-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary">Save Hours</Button>
        </div>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Business Details */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Business Details</h2>
        <div className="space-y-4">
          <Input label="Business Name" defaultValue="Sabich King" fullWidth />
          <Input label="Phone Number" defaultValue="+972-12-345-6789" fullWidth />
          <Input label="Email" type="email" defaultValue="hello@sabichking.com" fullWidth />
          <Textarea label="Address" defaultValue="23 Herzl Street, Florentin, Tel Aviv" fullWidth />
          <Select
            label="Category"
            defaultValue="restaurant"
            options={[
              { value: 'restaurant', label: 'Restaurant' },
              { value: 'cafe', label: 'Cafe' },
              { value: 'salon', label: 'Salon' },
              { value: 'tech', label: 'Tech' },
            ]}
            fullWidth
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      {/* Account Security */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-4">
          <Input label="Current Password" type="password" fullWidth />
          <Input label="New Password" type="password" fullWidth />
          <Input label="Confirm New Password" type="password" fullWidth />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary">Update Password</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'New contact form submissions', checked: true },
            { label: 'Weekly analytics report', checked: true },
            { label: 'Monthly performance summary', checked: true },
            { label: 'Feature updates and announcements', checked: false },
            { label: 'Marketing tips and insights', checked: false },
          ].map((item, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-3 text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save Preferences</Button>
        </div>
      </Card>

      {/* Upgrade */}
      <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-secondary-50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600 mb-4">
          Unlock advanced features like custom domain, online booking, and priority support.
        </p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">₪19/month</div>
          <Button variant="primary">Upgrade Now</Button>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Traffic Sources */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Traffic Sources</h2>
        <div className="space-y-3">
          {[
            { source: 'Google Search', visits: 456, percentage: 45 },
            { source: 'Direct', visits: 324, percentage: 32 },
            { source: 'Social Media', visits: 156, percentage: 15 },
            { source: 'Referrals', visits: 82, percentage: 8 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-700">{item.source}</span>
                <span className="text-sm text-gray-600">{item.visits} visits ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Popular Pages */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Pages</h2>
        <div className="space-y-2">
          {[
            { page: 'Homepage', views: 892 },
            { page: 'Menu', views: 567 },
            { page: 'About', views: 234 },
            { page: 'Contact', views: 156 },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-700">{item.page}</span>
              <span className="font-semibold text-gray-900">{item.views} views</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Visitor Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Device Types</h2>
          <div className="space-y-3">
            {[
              { device: 'Mobile', percentage: 65 },
              { device: 'Desktop', percentage: 28 },
              { device: 'Tablet', percentage: 7 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">{item.device}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-secondary-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Locations</h2>
          <div className="space-y-2">
            {[
              { location: 'Tel Aviv', visits: 678 },
              { location: 'Jerusalem', visits: 234 },
              { location: 'Haifa', visits: 156 },
              { location: 'Other', visits: 142 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{item.location}</span>
                <span className="font-semibold text-gray-900">{item.visits}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Funnel</h2>
        <div className="space-y-4">
          {[
            { step: 'Page Views', count: 1234, percentage: 100 },
            { step: 'Engaged (30s+)', count: 892, percentage: 72 },
            { step: 'Clicked Contact Info', count: 234, percentage: 19 },
            { step: 'Form Submissions', count: 23, percentage: 2 },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{item.step}</span>
                <span className="text-gray-600">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-lg h-12 flex items-center">
                <div
                  className="bg-green-600 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
