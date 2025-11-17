import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI content using GPT-4
 */
export async function generateContent(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  } = {}
): Promise<string> {
  const {
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 2000,
    responseFormat = 'text',
  } = options;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    max_tokens: maxTokens,
    ...(responseFormat === 'json' && {
      response_format: { type: 'json_object' },
    }),
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * Generate business insights
 */
export async function generateBusinessInsight(
  title: string,
  context: {
    newBusinesses: number;
    closedBusinesses: number;
    topCategories: Array<{ category: string; count: number }>;
    hotNeighborhoods: Array<{ area: string; count: number }>;
  }
): Promise<{
  content: string;
  summary: string;
  seoDescription: string;
  tags: string[];
}> {
  const prompt = `
You are a Tel Aviv business journalist writing for an online business directory.

Write a comprehensive, SEO-optimized article about: "${title}"

Context:
- ${context.newBusinesses} new businesses opened recently
- ${context.closedBusinesses} businesses closed
- Top categories: ${JSON.stringify(context.topCategories)}
- Hot neighborhoods: ${JSON.stringify(context.hotNeighborhoods)}

Requirements:
1. Write 500-700 words
2. Include specific business names and addresses where relevant
3. Add actionable insights for readers
4. Use local Tel Aviv context and Hebrew business names where appropriate
5. Include a call-to-action for the API service
6. Make it engaging and informative

Format the response as JSON with:
- content: The full article (with HTML formatting using <p>, <h2>, <ul>, etc.)
- summary: 2-sentence summary
- seoDescription: 150-character SEO meta description
- tags: Array of 5-7 relevant tags
  `;

  const response = await generateContent(prompt, {
    responseFormat: 'json',
    maxTokens: 2500,
  });

  return JSON.parse(response);
}

/**
 * Generate social media posts
 */
export async function generateSocialPosts(
  title: string,
  summary: string,
  slug: string
): Promise<{
  twitter: string;
  linkedin: string;
  facebook: string;
}> {
  const url = `https://tlv-business-pulse.vercel.app/insights/${slug}`;
  const prompt = `
Create social media posts for this business insight:
Title: ${title}
Summary: ${summary}

Generate:
1. Twitter post (280 characters max, include hashtags)
2. LinkedIn post (professional tone, 300 characters)
3. Facebook post (engaging, 400 characters)

Include the link: ${url}

Format as JSON with keys: twitter, linkedin, facebook
  `;

  const response = await generateContent(prompt, {
    model: 'gpt-3.5-turbo',
    responseFormat: 'json',
    maxTokens: 500,
    temperature: 0.8,
  });

  return JSON.parse(response);
}

/**
 * Analyze business trends
 */
export async function analyzeTrends(
  businesses: Array<{
    name: string;
    category: string;
    address: string;
    opened_date: string;
  }>
): Promise<{
  insights: string[];
  recommendations: string[];
}> {
  const prompt = `
Analyze the following Tel Aviv business data and provide insights:

${JSON.stringify(businesses, null, 2)}

Provide:
1. Key insights about business trends (3-5 points)
2. Recommendations for entrepreneurs or investors (3-5 points)

Format as JSON with keys: insights (array of strings), recommendations (array of strings)
  `;

  const response = await generateContent(prompt, {
    responseFormat: 'json',
    maxTokens: 1000,
  });

  return JSON.parse(response);
}

/**
 * Generate SEO-optimized meta description
 */
export async function generateMetaDescription(content: string): Promise<string> {
  const prompt = `
Generate a compelling SEO meta description (max 160 characters) for this content:

${content.substring(0, 500)}...

The description should be engaging and include keywords related to Tel Aviv businesses.
Return only the meta description text, no JSON or additional formatting.
  `;

  return await generateContent(prompt, {
    model: 'gpt-3.5-turbo',
    maxTokens: 100,
    temperature: 0.5,
  });
}

/**
 * Moderate content for safety
 */
export async function moderateContent(text: string): Promise<{
  flagged: boolean;
  categories: string[];
}> {
  const moderation = await openai.moderations.create({
    input: text,
  });

  const result = moderation.results[0];
  const flaggedCategories = Object.entries(result.categories)
    .filter(([_, flagged]) => flagged)
    .map(([category]) => category);

  return {
    flagged: result.flagged,
    categories: flaggedCategories,
  };
}
