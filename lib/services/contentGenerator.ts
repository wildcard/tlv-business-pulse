// lib/services/contentGenerator.ts
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface BusinessInsight {
  title: string;
  slug: string;
  content: string;
  summary: string;
  seoDescription: string;
  featuredBusinesses: any[];
  tags: string[];
  category: string;
}

export class ContentGenerator {
  private readonly insightTemplates = [
    {
      category: 'trends',
      prompts: [
        'Analyze new restaurant openings in {neighborhood} this week',
        'Tech startup surge: {count} new companies in {area}',
        'Retail revolution: How {category} businesses are transforming {street}',
      ],
    },
    {
      category: 'guides',
      prompts: [
        'Complete guide to {category} businesses in Tel Aviv',
        'Top {count} new {category} spots to check out this month',
        'Hidden gems: Discovering {neighborhood}\'s newest businesses',
      ],
    },
    {
      category: 'analysis',
      prompts: [
        'Market analysis: Why {category} businesses are booming in Tel Aviv',
        'The {neighborhood} transformation: {count} new businesses changing the landscape',
        'Investment opportunities in Tel Aviv\'s {category} sector',
      ],
    },
  ];

  async generateInsights(data: {
    newBusinesses: any[];
    closedBusinesses: any[];
    stats: any;
  }): Promise<BusinessInsight[]> {
    console.log('🤖 Generating AI insights...');
    
    const insights: BusinessInsight[] = [];
    
    // Generate 3 different types of content
    for (const template of this.insightTemplates) {
      try {
        const insight = await this.createInsight(template, data);
        insights.push(insight);
      } catch (error) {
        console.error(`Error generating ${template.category} insight:`, error);
      }
    }

    return insights;
  }

  private async createInsight(
    template: any,
    data: any
  ): Promise<BusinessInsight> {
    // Analyze data to find interesting patterns
    const patterns = this.analyzePatterns(data);
    
    // Select a random prompt template
    const promptTemplate = template.prompts[Math.floor(Math.random() * template.prompts.length)];
    
    // Fill in the template with actual data
    const title = this.fillTemplate(promptTemplate, patterns);
    
    // Generate comprehensive content
    const contentPrompt = `
      You are a Tel Aviv business journalist writing for an online business directory.
      
      Write a comprehensive, SEO-optimized article about: "${title}"
      
      Context:
      - ${data.newBusinesses.length} new businesses opened recently
      - ${data.closedBusinesses.length} businesses closed
      - Top categories: ${JSON.stringify(patterns.topCategories)}
      - Hot neighborhoods: ${JSON.stringify(patterns.hotNeighborhoods)}
      
      Requirements:
      1. Write 500-700 words
      2. Include specific business names and addresses
      3. Add actionable insights for readers
      4. Use local Tel Aviv context and Hebrew business names where relevant
      5. Include a call-to-action for the API service
      6. Make it engaging and informative
      
      Format the response as JSON with:
      - content: The full article (with HTML formatting)
      - summary: 2-sentence summary
      - seoDescription: 150-character SEO meta description
      - tags: Array of 5-7 relevant tags
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: contentPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Generate slug from title
    const slug = this.generateSlug(title);
    
    // Select featured businesses
    const featuredBusinesses = this.selectFeaturedBusinesses(
      data.newBusinesses,
      template.category
    );

    return {
      title,
      slug,
      content: result.content || '',
      summary: result.summary || '',
      seoDescription: result.seoDescription || title.substring(0, 150),
      featuredBusinesses,
      tags: result.tags || [],
      category: template.category,
    };
  }

  private analyzePatterns(data: any): any {
    // Analyze business data for interesting patterns
    const categoryCount: Record<string, number> = {};
    const neighborhoodCount: Record<string, number> = {};
    
    data.newBusinesses.forEach((business: any) => {
      if (business.category) {
        categoryCount[business.category] = (categoryCount[business.category] || 0) + 1;
      }
      if (business.address) {
        const neighborhood = this.extractNeighborhood(business.address);
        neighborhoodCount[neighborhood] = (neighborhoodCount[neighborhood] || 0) + 1;
      }
    });

    return {
      topCategories: Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, count]) => ({ category: cat, count })),
      hotNeighborhoods: Object.entries(neighborhoodCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([area, count]) => ({ area, count })),
      totalNew: data.newBusinesses.length,
      totalClosed: data.closedBusinesses.length,
    };
  }

  private fillTemplate(template: string, patterns: any): string {
    return template
      .replace('{neighborhood}', patterns.hotNeighborhoods[0]?.area || 'Rothschild')
      .replace('{area}', patterns.hotNeighborhoods[0]?.area || 'City Center')
      .replace('{category}', patterns.topCategories[0]?.category || 'Tech')
      .replace('{street}', 'Dizengoff Street')
      .replace('{count}', String(patterns.totalNew || 10));
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  }

  private extractNeighborhood(address: string): string {
    // Simple neighborhood extraction from address
    const neighborhoods = [
      'Rothschild', 'Dizengoff', 'Florentin', 'Neve Tzedek',
      'Jaffa', 'Sarona', 'Port', 'Ramat Aviv', 'City Center',
    ];
    
    for (const neighborhood of neighborhoods) {
      if (address.includes(neighborhood)) {
        return neighborhood;
      }
    }
    
    return 'Tel Aviv';
  }

  private selectFeaturedBusinesses(businesses: any[], category: string): any[] {
    // Select up to 5 relevant businesses to feature
    return businesses
      .filter(b => !category || b.category === category)
      .slice(0, 5)
      .map(b => ({
        name: b.name,
        address: b.address,
        category: b.category,
        phone: b.phone,
      }));
  }

  async saveInsights(insights: BusinessInsight[]): Promise<void> {
    console.log('💾 Saving insights to database...');
    
    for (const insight of insights) {
      const { error } = await supabase
        .from('insights')
        .insert({
          title: insight.title,
          slug: insight.slug,
          content: insight.content,
          summary: insight.summary,
          seo_description: insight.seoDescription,
          featured_businesses: insight.featuredBusinesses,
          tags: insight.tags,
          category: insight.category,
          published_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving insight:', error);
      } else {
        console.log(`✅ Saved: ${insight.title}`);
      }
    }
  }

  async generateSocialMediaPosts(insight: BusinessInsight): Promise<{
    twitter: string;
    linkedin: string;
    facebook: string;
  }> {
    const prompt = `
      Create social media posts for this business insight:
      Title: ${insight.title}
      Summary: ${insight.summary}
      
      Generate:
      1. Twitter post (280 characters max, include hashtags)
      2. LinkedIn post (professional tone, 300 characters)
      3. Facebook post (engaging, with emojis, 400 characters)
      
      Include the link: https://tlv-business-pulse.vercel.app/insights/${insight.slug}
      
      Format as JSON with keys: twitter, linkedin, facebook
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const contentGenerator = new ContentGenerator();
