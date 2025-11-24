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
 * Generates a complete website for a business using AI with enhanced prompts
 */
export async function generateWebsite(
  business: BusinessData,
  enrichedData?: any
): Promise<GeneratedWebsite> {
  const prompt = `You are a professional web designer and copywriter specializing in Tel Aviv businesses. Generate a complete, conversion-optimized website for this business:

Business Name: ${business.name}
Category: ${business.category}
Location: ${business.address}${business.city ? `, ${business.city}` : ''}
${business.description ? `Description: ${business.description}` : ''}
${business.employees ? `Team Size: ${business.employees} employees` : ''}
${business.registration_date ? `Established: ${business.registration_date}` : ''}
${enrichedData?.reviews ? `Average Rating: ${enrichedData.reviews.average}/5 (${enrichedData.reviews.count} reviews)` : ''}

Generate the following in JSON format:
1. heroTitle: Compelling, action-oriented headline that includes a benefit (max 60 chars)
2. heroSubtitle: Engaging subtitle that answers "what's in it for me" (max 120 chars)
3. aboutContent: 3 compelling paragraphs (200-300 words total):
   - Paragraph 1: The story/mission - why they exist
   - Paragraph 2: What makes them unique in Tel Aviv market
   - Paragraph 3: Benefits customers get + call-to-action
4. services: Array of 4-8 services/products, each with:
   - name: Service/product name
   - description: Benefit-focused description (30-50 words)
   - price: Realistic Tel Aviv pricing in ₪ (or price range)
   - duration: Time estimate if applicable
5. seoTitle: SEO-optimized title with location and category (max 60 chars)
6. seoDescription: Compelling meta description with call-to-action (max 160 chars)
7. keywords: Array of 8-10 high-intent SEO keywords (include Hebrew and English)
8. colorPalette: {primary, secondary, accent} hex colors that:
   - Match industry psychology (trust for finance, appetite for food, etc.)
   - Are WCAG accessible
   - Reflect modern Tel Aviv design trends
9. typography: {heading, body} Google Font names that match brand personality
10. logoPrompt: Detailed DALL-E 3 prompt for a professional logo (150+ words) including:
    - Industry symbols and metaphors
    - Color preferences
    - Style (minimalist, playful, corporate, artisan, etc.)
    - Cultural context (Israeli/Middle Eastern elements if relevant)
11. templateType: One of: restaurant, retail, professional_services, beauty, tech, fitness, education, entertainment, health, finance

IMPORTANT:
- Write in a warm, professional tone
- Include Hebrew phrases naturally where appropriate
- Mention the Tel Aviv/Israel context authentically
- Focus on BENEFITS over features
- Make every word count - no fluff
- Ensure pricing is realistic for the Tel Aviv market (research typical ranges)
- Add urgency and social proof where authentic`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert web designer and copywriter specializing in high-converting small business websites in Tel Aviv. You understand local market dynamics, Hebrew language, and Israeli consumer psychology. Always respond with valid JSON only.',
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
 * Generates enhanced business intelligence and strategic recommendations
 */
export async function generateBusinessIntelligence(
  business: BusinessData,
  competitorData?: any[],
  marketContext?: {
    neighborhoodData?: any;
    industryTrends?: any;
    seasonality?: any;
  }
): Promise<BusinessIntelligence> {
  const prompt = `You are a strategic business consultant analyzing this Tel Aviv business. Provide data-driven insights:

Business Name: ${business.name}
Category: ${business.category}
Location: ${business.address}${business.city ? `, ${business.city}` : ''}
${business.employees ? `Team Size: ${business.employees} employees` : ''}
${business.registration_date ? `Established: ${business.registration_date}` : ''}

Market Context:
${competitorData && competitorData.length > 0 ? `- ${competitorData.length} direct competitors identified in the area` : ''}
${marketContext?.neighborhoodData ? `- Neighborhood: ${marketContext.neighborhoodData.name}, Demographics: ${marketContext.neighborhoodData.demographics}` : ''}
${marketContext?.industryTrends ? `- Industry trend: ${marketContext.industryTrends.trend}` : ''}

Provide a comprehensive JSON response with:
1. competitorCount: Realistic estimate of direct competitors in the area
2. marketPosition: Detailed 2-3 sentence analysis of their market position:
   - Are they a pioneer, challenger, or follower?
   - What's their differentiation potential?
   - How crowded is their niche?
3. opportunities: Array of 4-6 specific, actionable market opportunities:
   - Each opportunity should be specific to their location/category
   - Focus on gaps in the local market
   - Consider seasonal and cultural opportunities (Jewish holidays, summer tourism, etc.)
4. recommendations: Array of 5-7 prioritized recommendations with:
   - title: Clear action item
   - description: Specific implementation details (100+ words)
   - impact: "high", "medium", or "low" (with reasoning)
   - effort: "high", "medium", or "low" (with time estimates)
   - expectedROI: Estimated return on investment
5. targetAudience: Array of 4-6 detailed customer personas:
   - Demographics (age, income, location)
   - Psychographics (values, lifestyle, pain points)
   - Where to reach them
6. uniqueSellingPoints: Array of 4-6 compelling USPs that:
   - Are defensible and hard to copy
   - Resonate with Tel Aviv customers
   - Are based on location, expertise, or approach

Make insights specific, actionable, and grounded in Tel Aviv market realities.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior business strategy consultant with 15 years of experience in the Israeli market, specializing in Tel Aviv small businesses. You combine data analysis with local market knowledge. Always respond with valid JSON only.',
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
        intelligence.marketPosition || 'New market entrant with differentiation potential',
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
  category: string,
  location?: string
): Promise<
  Array<{
    name: string;
    description: string;
    duration?: string;
    price?: string;
    features?: string[];
  }>
> {
  const prompt = `Generate realistic services for this Tel Aviv business:

Name: ${businessName}
Category: ${category}
${location ? `Location: ${location}` : ''}

Generate 6-10 services in JSON format. Each service should have:
- name: Service name that sells the benefit
- description: Compelling, benefit-focused description (40-60 words)
- duration: Realistic time estimate (e.g., "45 minutes", "2 hours", "1-2 days")
- price: Tel Aviv market-appropriate pricing in ₪ (research typical rates)
  * For low-ticket items: exact price (e.g., "₪89")
  * For mid-ticket: range (e.g., "₪500-800")
  * For high-ticket: "Contact for quote" or starting price
- features: Array of 3-5 key features/deliverables included

Requirements:
- Services should progress from entry-level to premium
- Include package deals or bundles where appropriate
- Prices must be realistic for Tel Aviv (not too low, not inflated)
- Use professional service names (avoid generic terms)
- Include upsell opportunities`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a business consultant specializing in service offerings and pricing strategy for Tel Aviv businesses. You understand local market rates and consumer expectations. Always respond with valid JSON only. Return an object with a "services" array.',
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

/**
 * Generates product catalog for retail businesses
 */
export async function generateProductCatalog(
  businessName: string,
  category: string,
  specialty?: string
): Promise<
  Array<{
    name: string;
    description: string;
    price: string;
    category: string;
    inStock: boolean;
    image_prompt?: string;
  }>
> {
  const prompt = `Generate a realistic product catalog for this Tel Aviv retail business:

Name: ${businessName}
Category: ${category}
${specialty ? `Specialty: ${specialty}` : ''}

Generate 12-20 products in JSON format. Each product should have:
- name: Product name (be specific, not generic)
- description: Compelling product description (25-40 words) that sells the benefits
- price: Realistic Tel Aviv pricing in ₪
- category: Product category/department
- inStock: Boolean (most should be true, a few false for realism)
- image_prompt: Brief DALL-E prompt to generate product image (optional but recommended)

Product mix should include:
- Range of price points (budget, mid-range, premium)
- Mix of categories if applicable
- Bestsellers and unique items
- Seasonal or trending products

Pricing should reflect Tel Aviv retail market rates.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a retail merchandising expert who understands Tel Aviv consumer behavior and pricing. Always respond with valid JSON only. Return an object with a "products" array.',
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
      completion.choices[0].message.content || '{"products": []}'
    );

    return response.products || [];
  } catch (error) {
    console.error('Error generating product catalog:', error);
    return [];
  }
}

/**
 * Generates class schedule for fitness/wellness/education businesses
 */
export async function generateClassSchedule(
  businessName: string,
  type: 'fitness' | 'wellness' | 'education' | 'art',
  specialty?: string
): Promise<
  Array<{
    name: string;
    description: string;
    instructor?: string;
    duration: string;
    level: string;
    capacity: number;
    price: string;
    schedule: Array<{ day: string; time: string }>;
  }>
> {
  const prompt = `Generate a realistic weekly class schedule for this Tel Aviv ${type} business:

Name: ${businessName}
Type: ${type}
${specialty ? `Specialty: ${specialty}` : ''}

Generate 8-15 different classes in JSON format. Each class should have:
- name: Class name (be creative and descriptive)
- description: Engaging description (30-50 words) that explains what participants will experience
- instructor: Instructor name (generate realistic Israeli names)
- duration: Class length (e.g., "45 min", "60 min", "90 min")
- level: Skill level ("Beginner", "Intermediate", "Advanced", "All Levels")
- capacity: Maximum participants (realistic for class type)
- price: Per-class price in ₪ (or mention if included in membership)
- schedule: Array of weekly sessions with {day, time}
  * Use Hebrew day names transliterated: Sunday (Rishon), Monday (Sheni), Tuesday (Shlishi), Wednesday (Revi'i), Thursday (Chamishi), Friday (Shishi), Saturday (Shabbat)
  * Use 24-hour format for times

Create a balanced schedule:
- Mix of beginner, intermediate, and advanced classes
- Morning, afternoon, and evening options
- Variety of class types within the specialty
- Some classes multiple times per week, others once
- Consider Israeli work culture (many classes in evenings)`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a fitness/wellness programming director with extensive experience in Tel Aviv. You understand Israeli schedules, naming conventions, and pricing. Always respond with valid JSON only. Return an object with a "classes" array.',
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
      completion.choices[0].message.content || '{"classes": []}'
    );

    return response.classes || [];
  } catch (error) {
    console.error('Error generating class schedule:', error);
    return [];
  }
}

/**
 * Generates team member profiles for professional services
 */
export async function generateTeamProfiles(
  businessName: string,
  category: string,
  teamSize: number = 4
): Promise<
  Array<{
    name: string;
    role: string;
    bio: string;
    specialties: string[];
    experience: string;
    education?: string;
    languages?: string[];
    image_prompt?: string;
  }>
> {
  const prompt = `Generate realistic team member profiles for this Tel Aviv professional services business:

Name: ${businessName}
Category: ${category}
Team Size: ${teamSize}

Generate ${teamSize} team member profiles in JSON format. Each profile should have:
- name: Realistic Israeli name (mix of Hebrew and international names common in Tel Aviv)
- role: Professional title/position
- bio: Engaging 2-3 sentence bio (50-80 words) that:
  * Highlights their expertise and approach
  * Shows personality without being unprofessional
  * Mentions why they're passionate about their work
- specialties: Array of 3-5 specific areas of expertise
- experience: Years of experience (e.g., "8+ years", "Over 10 years")
- education: Relevant degrees or certifications (be specific to Israeli institutions where appropriate)
- languages: Array of languages spoken (e.g., ["Hebrew", "English", "Russian", "French"])
- image_prompt: Professional headshot description for DALL-E (e.g., "Professional headshot of a 35-year-old woman with warm smile in business casual attire")

Team structure should include:
- Founder/Owner with most experience
- Senior team members
- Mid-level professionals
- Mix of genders and backgrounds reflecting Tel Aviv diversity`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an HR professional specializing in Israeli tech and professional services companies. You understand Tel Aviv\'s diverse workforce and professional culture. Always respond with valid JSON only. Return an object with a "team" array.',
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
      completion.choices[0].message.content || '{"team": []}'
    );

    return response.team || [];
  } catch (error) {
    console.error('Error generating team profiles:', error);
    return [];
  }
}

/**
 * Generates testimonial templates (to be replaced with real reviews over time)
 */
export async function generateTestimonials(
  businessName: string,
  category: string,
  count: number = 6
): Promise<
  Array<{
    author: string;
    role?: string;
    content: string;
    rating: number;
    date: string;
    verified: boolean;
  }>
> {
  const prompt = `Generate realistic customer testimonials for this Tel Aviv business:

Name: ${businessName}
Category: ${category}
Count: ${count}

Generate ${count} diverse testimonials in JSON format. Each should have:
- author: Realistic name (mix of Hebrew and international names, can use first name + last initial for privacy)
- role: Optional descriptor (e.g., "Local Resident", "Business Owner", "Tel Aviv Visitor")
- content: Authentic testimonial (40-80 words) that:
  * Feels genuine, not overly promotional
  * Mentions specific aspects of the service/product
  * Includes a minor detail that adds credibility
  * Uses natural language (not marketing speak)
  * May include Hebrew phrases naturally if appropriate
- rating: Star rating (4 or 5 stars - realistic but positive)
- date: Recent date (within last 3 months)
- verified: true (indicates verified customer)

Variety in testimonials:
- Different aspects praised (service, quality, value, convenience, atmosphere)
- Mix of detailed and brief reviews
- Different customer types and use cases
- Natural language with minor imperfections (makes them feel real)

IMPORTANT: Mark these as template testimonials that will be replaced with real reviews.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a customer experience specialist who understands authentic customer feedback. Generate realistic testimonials that feel genuine, not fake or overly polished. Always respond with valid JSON only. Return an object with a "testimonials" array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(
      completion.choices[0].message.content || '{"testimonials": []}'
    );

    return response.testimonials || [];
  } catch (error) {
    console.error('Error generating testimonials:', error);
    return [];
  }
}

/**
 * Generates comprehensive SEO metadata
 */
export async function generateSEOMetadata(
  business: BusinessData,
  pageType: 'home' | 'about' | 'services' | 'contact' = 'home'
): Promise<{
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  structuredData: any;
}> {
  const prompt = `Generate comprehensive SEO metadata for this Tel Aviv business's ${pageType} page:

Business: ${business.name}
Category: ${business.category}
Location: ${business.address}${business.city ? `, ${business.city}` : ''}
${business.description ? `Description: ${business.description}` : ''}

Generate SEO-optimized metadata in JSON format:
1. title: Perfect SEO title (50-60 chars) that includes:
   - Business name
   - Key benefit or category
   - Location (Tel Aviv)
2. description: Compelling meta description (150-160 chars) that:
   - Summarizes what they offer
   - Includes a call-to-action
   - Uses power words
   - Includes location
3. keywords: Array of 15-20 keywords including:
   - Primary keywords (high search volume)
   - Long-tail keywords (specific phrases)
   - Local keywords (neighborhood + service)
   - Hebrew keywords (transliterated)
   - Question keywords (what, how, where)
4. ogTitle: Social media title (can be slightly different, more casual)
5. ogDescription: Social media description (slightly different from meta)
6. structuredData: JSON-LD schema.org markup for LocalBusiness including:
   - @type (Restaurant, LocalBusiness, etc.)
   - name, address, telephone
   - openingHours
   - priceRange
   - Any other relevant fields

Focus on local SEO and Tel Aviv market.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO specialist with expertise in local search optimization for Tel Aviv businesses. You understand both Hebrew and English search patterns. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const seo = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      title: seo.title || `${business.name} | ${business.category} in Tel Aviv`,
      description: seo.description || `${business.name} - ${business.category} located in ${business.address}`,
      keywords: seo.keywords || [],
      ogTitle: seo.ogTitle || seo.title,
      ogDescription: seo.ogDescription || seo.description,
      ogImage: seo.ogImage,
      structuredData: seo.structuredData || {},
    };
  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    throw new Error('Failed to generate SEO metadata');
  }
}

/**
 * Generates social media announcement posts for new business
 */
export async function generateSocialMediaPosts(
  business: BusinessData,
  websiteUrl: string
): Promise<{
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin?: string;
}> {
  const prompt = `Generate social media announcement posts for this new Tel Aviv business:

Business: ${business.name}
Category: ${business.category}
Location: ${business.address}
Website: ${websiteUrl}

Generate platform-specific posts in JSON format:
1. twitter: Twitter/X post (max 280 chars) that:
   - Announces the business
   - Includes relevant hashtags (#TelAviv #LocalBusiness + industry hashtags)
   - Has a hook that stops scrolling
   - Includes the URL
2. facebook: Facebook post (300-400 chars) that:
   - Tells a brief story
   - Uses emojis strategically
   - Encourages engagement ("Have you visited?" etc.)
   - Includes the URL
3. instagram: Instagram caption (500-800 chars) that:
   - Is visually descriptive
   - Uses line breaks for readability
   - Has 15-20 relevant hashtags at the end
   - Emojis that enhance the message
   - Story-driven
4. linkedin: LinkedIn post (optional, for B2B businesses) that:
   - Professional tone
   - Highlights business value proposition
   - Industry insights
   - Congratulates the founder/team

All posts should:
- Celebrate the launch/new business
- Be authentic and warm, not corporate
- Reference Tel Aviv/local context
- Create curiosity to click
- Use appropriate Hebrew terms where natural`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a social media manager specializing in local business marketing in Tel Aviv. You understand platform-specific best practices and Israeli social media culture. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    });

    const posts = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      twitter: posts.twitter || `New business alert: ${business.name} just opened in Tel Aviv! Check them out: ${websiteUrl}`,
      facebook: posts.facebook || `Excited to share that ${business.name} is now open in Tel Aviv! ${websiteUrl}`,
      instagram: posts.instagram || `New in Tel Aviv: ${business.name}! Visit: ${websiteUrl}`,
      linkedin: posts.linkedin,
    };
  } catch (error) {
    console.error('Error generating social media posts:', error);
    throw new Error('Failed to generate social media posts');
  }
}
