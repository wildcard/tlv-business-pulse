import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BusinessData {
  name: string;
  owner?: string;
  category: string;
  address: string;
  city?: string;
  registration_date: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  employees?: number;
  seating_capacity?: number;
}

export interface GeneratedWebsite {
  heroTitle: string;
  heroSubtitle: string;
  aboutContent: string;
  services: Array<{ name: string; description: string; price?: string }>;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  logoPrompt: string;
  templateType: string;
}

export interface BusinessIntelligence {
  competitorCount: number;
  marketPosition: string;
  opportunities: string[];
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
    effort: string;
  }>;
  targetAudience: string[];
  uniqueSellingPoints: string[];
}

/**
 * Generates a complete website for a business using AI
 */
export async function generateWebsite(
  business: BusinessData
): Promise<GeneratedWebsite> {
  const prompt = `You are a professional web designer and copywriter. Generate a complete website for this business:

Business Name: ${business.name}
Category: ${business.category}
Location: ${business.address}${business.city ? `, ${business.city}` : ''}
${business.description ? `Description: ${business.description}` : ''}

Generate the following in JSON format:
1. heroTitle: Compelling main headline (max 60 chars)
2. heroSubtitle: Engaging subtitle explaining what they do (max 120 chars)
3. aboutContent: 2-3 paragraph "About Us" section (150-250 words)
4. services: Array of 3-6 services/products with name, description, and estimated price
5. seoTitle: SEO-optimized page title (max 60 chars)
6. seoDescription: Meta description (max 160 chars)
7. keywords: Array of 5-8 relevant SEO keywords
8. colorPalette: {primary, secondary, accent} hex colors appropriate for the industry
9. typography: {heading, body} font family names
10. logoPrompt: Detailed DALL-E prompt to generate a logo
11. templateType: One of: restaurant, retail, professional_services, beauty, tech, fitness, education, entertainment

Make it professional, engaging, and industry-appropriate. Use the local language context (Israel/Tel Aviv) where relevant.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert web designer and copywriter specializing in small business websites. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const generated = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      heroTitle: generated.heroTitle || business.name,
      heroSubtitle:
        generated.heroSubtitle || `Welcome to ${business.name}`,
      aboutContent:
        generated.aboutContent ||
        `${business.name} is a ${business.category} located in ${business.address}.`,
      services: generated.services || [],
      seoTitle: generated.seoTitle || business.name,
      seoDescription:
        generated.seoDescription ||
        `${business.name} - ${business.category} in ${business.city}`,
      keywords: generated.keywords || [business.category, business.city],
      colorPalette: generated.colorPalette || {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
      },
      typography: generated.typography || {
        heading: 'Inter',
        body: 'Open Sans',
      },
      logoPrompt: generated.logoPrompt || `Logo for ${business.name}`,
      templateType: generated.templateType || 'professional_services',
    };
  } catch (error) {
    console.error('Error generating website:', error);
    throw new Error('Failed to generate website content');
  }
}

/**
 * Generates business intelligence and recommendations
 */
export async function generateBusinessIntelligence(
  business: BusinessData,
  competitorData?: any[]
): Promise<BusinessIntelligence> {
  const prompt = `Analyze this business and provide strategic insights:

Business Name: ${business.name}
Category: ${business.category}
Location: ${business.address}${business.city ? `, ${business.city}` : ''}
${business.employees ? `Employees: ${business.employees}` : ''}

${
  competitorData && competitorData.length > 0
    ? `Competitors in area: ${competitorData.length}`
    : ''
}

Provide a JSON response with:
1. competitorCount: Estimated number of competitors in the area
2. marketPosition: Brief description of their likely market position (new entrant, challenger, etc.)
3. opportunities: Array of 3-5 market opportunities they could pursue
4. recommendations: Array of 3-5 actionable recommendations with {title, description, impact (high/medium/low), effort (high/medium/low)}
5. targetAudience: Array of 3-5 customer segments they should target
6. uniqueSellingPoints: Array of 3-5 potential USPs

Base your analysis on the industry, location, and business type.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a business strategy consultant specializing in local businesses. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const intelligence = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      competitorCount: intelligence.competitorCount || 5,
      marketPosition:
        intelligence.marketPosition || 'New market entrant',
      opportunities: intelligence.opportunities || [],
      recommendations: intelligence.recommendations || [],
      targetAudience: intelligence.targetAudience || [],
      uniqueSellingPoints: intelligence.uniqueSellingPoints || [],
    };
  } catch (error) {
    console.error('Error generating business intelligence:', error);
    throw new Error('Failed to generate business intelligence');
  }
}

/**
 * Enriches business data with information from external sources
 */
export async function enrichBusinessData(
  business: BusinessData
): Promise<Partial<BusinessData>> {
  // In a real implementation, this would:
  // 1. Search Google Places API for the business
  // 2. Check social media APIs (Facebook, Instagram, LinkedIn)
  // 3. Search for existing website
  // 4. Aggregate reviews from multiple platforms
  // 5. Find photos and media

  // For now, return a placeholder structure
  return {
    phone: business.phone || '03-XXX-XXXX',
    email: business.email || `info@${business.name.toLowerCase().replace(/\s+/g, '')}.com`,
    website: business.website || undefined,
    description: business.description || undefined,
  };
}

/**
 * Generates a personalized welcome email for a new business
 */
export async function generateWelcomeEmail(
  business: BusinessData,
  websiteUrl: string
): Promise<{ subject: string; body: string }> {
  const prompt = `Generate a warm, professional welcome email for a new business owner.

Business: ${business.name}
Owner: ${business.owner || 'the business owner'}
Category: ${business.category}
Website URL: ${websiteUrl}

The email should:
1. Congratulate them on registering their business
2. Inform them their free website is ready
3. Highlight 2-3 key features of the website
4. Encourage them to claim and customize it
5. Be warm, professional, and encouraging
6. Be 150-200 words
7. Include a clear call-to-action button

Return JSON with {subject, body}. Body should be HTML formatted.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a marketing copywriter specializing in welcome emails. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const email = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      subject:
        email.subject ||
        `🎉 Congrats on opening ${business.name}! Your website is ready`,
      body:
        email.body ||
        `<p>Congratulations on your new business!</p><p>Visit your website at ${websiteUrl}</p>`,
    };
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate welcome email');
  }
}

/**
 * Generates menu items for a restaurant
 */
export async function generateMenuItems(
  businessName: string,
  cuisineType: string,
  specialty?: string
): Promise<
  Array<{
    name: string;
    description: string;
    price: string;
    category: string;
  }>
> {
  const prompt = `Generate a realistic menu for this restaurant:

Name: ${businessName}
Cuisine: ${cuisineType}
${specialty ? `Specialty: ${specialty}` : ''}

Generate 8-12 menu items in JSON format. Each item should have:
- name: Dish name
- description: Brief, appetizing description (20-40 words)
- price: Realistic price in ₪ (Israeli Shekels)
- category: appetizer, main, dessert, or beverage

Make the menu authentic to the cuisine type and appropriate for Tel Aviv pricing.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a restaurant consultant and menu designer. Always respond with valid JSON only. Return an object with a "menu" array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(
      completion.choices[0].message.content || '{"menu": []}'
    );

    return response.menu || [];
  } catch (error) {
    console.error('Error generating menu:', error);
    return [];
  }
}

/**
 * Generates service offerings for a service-based business
 */
export async function generateServices(
  businessName: string,
  category: string
): Promise<
  Array<{
    name: string;
    description: string;
    duration?: string;
    price?: string;
  }>
> {
  const prompt = `Generate realistic services for this business:

Name: ${businessName}
Category: ${category}

Generate 5-8 services in JSON format. Each service should have:
- name: Service name
- description: Clear description (30-50 words)
- duration: Estimated time (if applicable)
- price: Realistic price range in ₪ or "Contact for quote"

Make them realistic and appropriate for the business type.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a business consultant specializing in service offerings. Always respond with valid JSON only. Return an object with a "services" array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(
      completion.choices[0].message.content || '{"services": []}'
    );

    return response.services || [];
  } catch (error) {
    console.error('Error generating services:', error);
    return [];
  }
}
