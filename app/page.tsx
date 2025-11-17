import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            100% Autonomous • Zero Human Intervention
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            TLV Business Pulse
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            The world's first fully autonomous business directory.
            Real-time insights powered by AI, operating 24/7 with zero human management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              View Dashboard
            </Link>
            <Link 
              href="/api-docs"
              className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              API Documentation
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
          <StatsCard title="Active Businesses" value="12,450+" />
          <StatsCard title="Daily Updates" value="3 Articles" />
          <StatsCard title="API Calls" value="10K+/mo" />
          <StatsCard title="Uptime" value="99.9%" />
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Autonomous Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🤖"
              title="AI-Powered Insights"
              description="GPT-4 generates 3 articles daily analyzing Tel Aviv business trends"
            />
            <FeatureCard 
              icon="📊"
              title="Real-Time Data"
              description="Automatic updates from Tel Aviv business registry every 6 AM"
            />
            <FeatureCard 
              icon="💰"
              title="Self-Sustaining"
              description="Revenue from ads, API subscriptions, and partnerships"
            />
            <FeatureCard 
              icon="🔧"
              title="Self-Healing"
              description="Automatic error detection and recovery systems"
            />
            <FeatureCard 
              icon="📈"
              title="Auto-Optimizing"
              description="A/B tests content and continuously improves performance"
            />
            <FeatureCard 
              icon="🌍"
              title="Scalable Template"
              description="Fork for any city with public business data"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">100% Open Source</h2>
          <p className="text-xl mb-8 opacity-90">
            All code is public. All revenue goes to Autonomous Business Development Foundation.
          </p>
          <a 
            href="https://github.com/yourusername/tlv-business-pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </main>
  )
}

function StatsCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="text-3xl font-bold text-primary-600 mb-2">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
