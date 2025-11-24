import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { generateSEO } from '@/components/ui/SEOHead';
import Link from 'next/link';

export const metadata = generateSEO({
  title: 'About Us',
  description: 'Learn about TLV Business Pulse - AI-powered business websites for Tel Aviv. Our mission, team, and technology.',
  keywords: ['about', 'Tel Aviv', 'business websites', 'AI technology', 'mission'],
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Tel Aviv Businesses
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              We believe every business deserves a professional online presence.
              That's why we're making it free, automatic, and effortless.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card padding="lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To democratize the web by providing every Tel Aviv business with a professional,
                    AI-generated website at no cost. We're eliminating the barriers of technical
                    expertise, time, and money that prevent businesses from having an online presence.
                  </p>
                </Card>

                <Card padding="lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    A world where every business, from small corner shops to growing startups,
                    has equal opportunity to be discovered online. We're starting in Tel Aviv
                    and expanding to cities worldwide.
                  </p>
                </Card>
              </div>

              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How We Started</h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  In 2024, we noticed that thousands of Tel Aviv businesses had no online presence.
                  Not because they didn't want one, but because creating a website was too expensive,
                  complicated, or time-consuming. We asked ourselves: "What if AI could do this
                  automatically?" Today, we're making that vision a reality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Technology</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Built on cutting-edge AI and modern web technologies
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card padding="lg" className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Content Generation</h3>
                  <p className="text-gray-600">
                    GPT-4 powered content creation tailored to each business category and industry
                  </p>
                </Card>

                <Card padding="lg" className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Next.js & React</h3>
                  <p className="text-gray-600">
                    Modern, fast, and SEO-optimized websites built with industry-leading frameworks
                  </p>
                </Card>

                <Card padding="lg" className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Data Sources</h3>
                  <p className="text-gray-600">
                    Integration with Tel Aviv Municipality and official registries for accurate information
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card padding="lg" className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tel Aviv Municipality</h3>
                  <p className="text-gray-600">
                    Official data provider for business registry and verification
                  </p>
                </Card>

                <Card padding="lg" className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">OpenAI</h3>
                  <p className="text-gray-600">
                    Powering our AI content generation with GPT-4 technology
                  </p>
                </Card>

                <Card padding="lg" className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Vercel</h3>
                  <p className="text-gray-600">
                    Infrastructure and hosting platform for lightning-fast websites
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">12,450+</div>
                  <div className="text-gray-600">Businesses Served</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">8,324</div>
                  <div className="text-gray-600">Websites Generated</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-gray-600">AI Operation</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Accessibility First',
                    description: 'Everyone deserves a professional online presence, regardless of technical skills or budget.',
                  },
                  {
                    title: 'Data Transparency',
                    description: 'We're open about our data sources, verification processes, and how we use information.',
                  },
                  {
                    title: 'AI for Good',
                    description: 'Using artificial intelligence to solve real problems and create genuine value for businesses.',
                  },
                  {
                    title: 'Community Driven',
                    description: 'Building for the Tel Aviv business community and listening to their needs and feedback.',
                  },
                ].map((value, index) => (
                  <Card key={index} padding="lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Have questions? Want to partner with us? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/help">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <a href="mailto:hello@tlvpulse.com">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Email Us
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
