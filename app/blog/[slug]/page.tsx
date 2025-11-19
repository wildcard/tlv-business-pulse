import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';

// Mock blog post data
const BLOG_POSTS: Record<string, any> = {
  'welcome-to-tlv-business-pulse': {
    title: 'Welcome to TLV Business Pulse',
    category: 'Announcement',
    author: 'TLV Team',
    date: '2024-01-15',
    readTime: '5 min read',
    content: `
# Welcome to TLV Business Pulse

We're excited to introduce TLV Business Pulse - the world's first fully AI-powered business website platform. Our mission is simple: every business in Tel Aviv deserves a professional online presence, regardless of their technical skills or budget.

## The Problem We're Solving

Today, thousands of Tel Aviv businesses have no website. Not because they don't want one, but because:
- Building a website is expensive (₪5,000-20,000)
- It requires technical knowledge
- It takes time they don't have
- Ongoing maintenance is complicated

## Our Solution

We've built a platform that:
1. Automatically finds your business in the Tel Aviv registry
2. Uses AI to generate a professional, industry-specific website
3. Notifies you when your site is ready
4. Lets you claim and customize it in minutes

All completely free.

## How It Works

Our AI system scans the Tel Aviv business registry daily. When we find a new business, we:
- Extract official business information
- Analyze your business category
- Generate tailored content using GPT-4
- Create a beautiful, responsive website
- Send you an email to claim it

The entire process is automatic. No forms to fill out. No waiting.

## What's Included

Every generated website includes:
- Professional design optimized for your industry
- Mobile-responsive layout
- Contact forms
- Maps and directions
- Basic analytics
- SSL certificate
- Fast hosting

## Get Started Today

If you're a Tel Aviv business owner:
1. Search for your business in our directory
2. Claim it with phone or email verification
3. Customize your content and photos
4. You're live!

## What's Next

We're just getting started. Coming soon:
- Online booking systems
- Payment integration
- Multi-language support
- Advanced analytics
- API for third-party integrations

Thank you for being part of this journey. Let's put every Tel Aviv business online.

---

Have questions? [Contact us](/help) or browse our [Help Center](/help).
    `,
  },
};

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.title,
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium mb-6 inline-block">
                ← Back to Blog
              </Link>
              <Badge variant="primary" className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-600">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {post.content}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share */}
        <section className="py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} hover padding="md">
                    <Badge variant="primary" size="sm" className="mb-2">Technology</Badge>
                    <h3 className="font-bold text-gray-900 mb-2">Related Article {i}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      A brief description of this related article...
                    </p>
                    <div className="text-sm text-gray-500">5 min read</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Your Business Online?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Tel Aviv businesses with professional websites
            </p>
            <Link href="/businesses">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Find Your Business
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({
    slug,
  }));
}
