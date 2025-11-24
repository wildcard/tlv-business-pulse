import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { generateSEO } from '@/components/ui/SEOHead';

export const metadata = generateSEO({
  title: 'Pricing Plans',
  description: 'Choose the perfect plan for your business. Free forever plan available with premium upgrades.',
  keywords: ['pricing', 'business website pricing', 'Tel Aviv', 'website plans'],
});

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '₪0',
    period: 'Forever',
    description: 'Perfect for getting started',
    recommended: false,
    features: [
      'Professional website',
      'Subdomain (yourname.tlvpulse.com)',
      'Basic analytics',
      'Contact forms',
      'Mobile responsive',
      'SEO optimized',
      'Automatic updates',
      'SSL certificate',
    ],
    limitations: [
      'TLV Pulse branding',
      'Basic support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/businesses',
  },
  {
    name: 'Premium',
    price: '₪19',
    period: '/month',
    description: 'Most popular for businesses',
    recommended: true,
    features: [
      'Everything in Free',
      'Custom domain',
      'Advanced analytics',
      'Online booking system',
      'Priority support',
      'Remove branding',
      'Custom colors & fonts',
      'Social media integration',
      'Email notifications',
      'Photo gallery (20 images)',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    ctaLink: '/dashboard',
  },
  {
    name: 'Pro',
    price: '₪49',
    period: '/month',
    description: 'For growing businesses',
    recommended: false,
    features: [
      'Everything in Premium',
      'Multi-location support',
      'Staff management',
      'CRM integration',
      'Email marketing (1000 subscribers)',
      'API access',
      'Advanced booking features',
      'Custom integrations',
      'Dedicated account manager',
      'Unlimited photo gallery',
      'Custom features',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    ctaLink: '/dashboard',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees! Your website is already generated and ready. Just claim it and customize to your needs.',
  },
  {
    question: 'What happens if I cancel?',
    answer: 'You can cancel anytime. Your site will revert to the Free plan, and all premium features will be disabled. Your content is never deleted.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you're not satisfied with your premium plan, contact us for a full refund.',
  },
  {
    question: 'Can I get a custom plan for my needs?',
    answer: 'Absolutely! Contact our sales team for enterprise solutions, white-label options, or custom feature development.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-day money-back guarantee
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.name} className="relative">
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge variant="secondary" size="lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    padding="lg"
                    className={`h-full flex flex-col ${
                      tier.recommended ? 'ring-2 ring-secondary-500 shadow-xl' : ''
                    }`}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                      <p className="text-gray-600 mb-4">{tier.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                        <span className="text-gray-600 ml-2">{tier.period}</span>
                      </div>
                    </div>

                    <div className="flex-1 mb-6">
                      <ul className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {tier.limitations.map((limitation, index) => (
                          <li key={`limit-${index}`} className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={tier.ctaLink}>
                      <Button
                        variant={tier.recommended ? 'primary' : 'outline'}
                        size="lg"
                        fullWidth
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Premium</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: 'Professional Website', free: true, premium: true, pro: true },
                      { feature: 'Custom Domain', free: false, premium: true, pro: true },
                      { feature: 'Advanced Analytics', free: false, premium: true, pro: true },
                      { feature: 'Online Booking', free: false, premium: true, pro: true },
                      { feature: 'Remove Branding', free: false, premium: true, pro: true },
                      { feature: 'Multi-location', free: false, premium: false, pro: true },
                      { feature: 'CRM Integration', free: false, premium: false, pro: true },
                      { feature: 'API Access', free: false, premium: false, pro: true },
                      { feature: 'Email Marketing', free: false, premium: false, pro: true },
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {row.free ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.premium ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.pro ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <Card key={index} padding="lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Tel Aviv businesses with professional websites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/businesses">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Find Your Business
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
