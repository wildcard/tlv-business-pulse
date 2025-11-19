/**
 * Logo Generation System
 *
 * Generates professional logo prompts and SVG placeholders
 * for businesses until DALL-E logos are created.
 */

import OpenAI from 'openai';
import { getIndustryConfig, getLogoStyleSuggestions } from './industry-prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LogoPrompt {
  dallePrompt: string;
  style: string;
  colorScheme: string;
  symbolism: string;
  culturalElements?: string;
  variations: string[];
}

export interface SVGPlaceholder {
  svg: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * Generates a detailed DALL-E prompt for creating a professional logo
 */
export async function generateLogoPrompt(
  businessName: string,
  category: string,
  colorPalette: { primary: string; secondary: string; accent: string },
  brandPersonality?: string
): Promise<LogoPrompt> {
  const industryConfig = getIndustryConfig(category);
  const styleOptions = getLogoStyleSuggestions(category);

  const prompt = `You are a professional brand designer. Create a detailed DALL-E 3 prompt for generating a logo for this business:

Business Name: ${businessName}
Industry: ${category}
Brand Colors: Primary ${colorPalette.primary}, Secondary ${colorPalette.secondary}, Accent ${colorPalette.accent}
${brandPersonality ? `Brand Personality: ${brandPersonality}` : ''}

Industry Context:
- Common logo styles: ${styleOptions.join(', ')}
- Industry tone: ${industryConfig.contentTone}

Generate a comprehensive logo design brief in JSON format with:
1. dallePrompt: A detailed 150-200 word DALL-E 3 prompt that includes:
   - Logo style and composition
   - Specific visual elements and symbols
   - Color palette usage
   - Typography style if text-based
   - Professional design qualities
   - Modern Tel Aviv aesthetic
   - Cultural considerations (Israeli/Middle Eastern context if relevant)
   - Format specifications (vector-style, clean, professional)

2. style: The primary logo style (e.g., "minimalist", "emblem", "wordmark", "abstract")

3. colorScheme: Description of how colors should be used

4. symbolism: Explanation of the symbolic elements and their meanings

5. culturalElements: Any Israeli/Tel Aviv cultural elements incorporated (if applicable)

6. variations: Array of 3 alternative DALL-E prompts for logo variations
   - Different styles
   - Different approaches
   - Backup options

Make the prompt specific, detailed, and likely to generate a professional result.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional brand designer and logo creator with expertise in creating effective DALL-E prompts. You understand visual design principles, typography, color theory, and cultural design elements. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const logoDesign = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return {
      dallePrompt: logoDesign.dallePrompt || `Professional logo for ${businessName}, ${category} business`,
      style: logoDesign.style || 'modern',
      colorScheme: logoDesign.colorScheme || 'Based on brand colors',
      symbolism: logoDesign.symbolism || 'Representative of the business type',
      culturalElements: logoDesign.culturalElements,
      variations: logoDesign.variations || [],
    };
  } catch (error) {
    console.error('Error generating logo prompt:', error);
    throw new Error('Failed to generate logo prompt');
  }
}

/**
 * Generates an actual logo using DALL-E 3
 * Note: This requires DALL-E API access and incurs costs
 */
export async function generateLogoImage(
  dallePrompt: string,
  size: '1024x1024' | '1024x1792' | '1792x1024' = '1024x1024'
): Promise<{ url: string; revisedPrompt?: string }> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size,
      quality: 'standard',
      style: 'natural',
    });

    return {
      url: response.data[0].url || '',
      revisedPrompt: response.data[0].revised_prompt,
    };
  } catch (error) {
    console.error('Error generating logo image:', error);
    throw new Error('Failed to generate logo image with DALL-E');
  }
}

/**
 * Generates a professional SVG placeholder logo
 * Used until the actual logo is created with DALL-E
 */
export function generateSVGPlaceholder(
  businessName: string,
  colorPalette: { primary: string; secondary: string; accent: string },
  style: 'initials' | 'icon' | 'wordmark' = 'initials'
): SVGPlaceholder {
  const initials = getBusinessInitials(businessName);

  if (style === 'initials') {
    return generateInitialsLogo(initials, colorPalette);
  } else if (style === 'wordmark') {
    return generateWordmarkLogo(businessName, colorPalette);
  } else {
    return generateIconLogo(initials, colorPalette);
  }
}

/**
 * Gets business initials (first 2-3 letters)
 */
function getBusinessInitials(businessName: string): string {
  const words = businessName.trim().split(/\s+/);

  if (words.length >= 2) {
    // Take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    // Take first 2 letters of single word
    return businessName.substring(0, 2).toUpperCase();
  }
}

/**
 * Generates an initials-based logo
 */
function generateInitialsLogo(
  initials: string,
  colorPalette: { primary: string; secondary: string; accent: string }
): SVGPlaceholder {
  const svg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorPalette.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorPalette.accent};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="100" cy="100" r="90" fill="url(#logoGradient)" />

  <!-- Initials text -->
  <text
    x="100"
    y="100"
    font-family="Arial, sans-serif"
    font-size="72"
    font-weight="bold"
    text-anchor="middle"
    dominant-baseline="central"
    fill="white"
  >
    ${initials}
  </text>
</svg>`;

  return {
    svg,
    backgroundColor: colorPalette.primary,
    textColor: '#FFFFFF',
  };
}

/**
 * Generates a wordmark-style logo
 */
function generateWordmarkLogo(
  businessName: string,
  colorPalette: { primary: string; secondary: string; accent: string }
): SVGPlaceholder {
  const nameLength = businessName.length;
  const fontSize = Math.max(24, Math.min(48, 600 / nameLength));

  const svg = `<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colorPalette.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorPalette.accent};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="120" fill="white" />

  <!-- Decorative element -->
  <rect x="20" y="50" width="4" height="20" fill="${colorPalette.accent}" />

  <!-- Business name -->
  <text
    x="35"
    y="70"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="url(#textGradient)"
  >
    ${businessName}
  </text>
</svg>`;

  return {
    svg,
    backgroundColor: '#FFFFFF',
    textColor: colorPalette.primary,
  };
}

/**
 * Generates an icon-based logo
 */
function generateIconLogo(
  initials: string,
  colorPalette: { primary: string; secondary: string; accent: string }
): SVGPlaceholder {
  const svg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorPalette.primary};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colorPalette.accent};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorPalette.secondary};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" fill="white" />

  <!-- Geometric shapes -->
  <polygon
    points="100,30 170,85 170,155 100,110 30,155 30,85"
    fill="url(#shapeGradient)"
    opacity="0.9"
  />

  <!-- Inner shape -->
  <circle cx="100" cy="100" r="35" fill="white" opacity="0.3" />

  <!-- Initials -->
  <text
    x="100"
    y="105"
    font-family="Arial, sans-serif"
    font-size="36"
    font-weight="bold"
    text-anchor="middle"
    dominant-baseline="central"
    fill="white"
  >
    ${initials}
  </text>
</svg>`;

  return {
    svg,
    backgroundColor: '#FFFFFF',
    textColor: colorPalette.primary,
  };
}

/**
 * Converts SVG string to data URL for use in HTML/CSS
 */
export function svgToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generates multiple logo variations for A/B testing
 */
export async function generateLogoVariations(
  businessName: string,
  category: string,
  colorPalette: { primary: string; secondary: string; accent: string },
  count: number = 3
): Promise<LogoPrompt[]> {
  const variations: LogoPrompt[] = [];

  try {
    for (let i = 0; i < count; i++) {
      const variation = await generateLogoPrompt(
        businessName,
        category,
        colorPalette,
        // Vary the personality for each
        i === 0 ? 'modern and professional' :
        i === 1 ? 'friendly and approachable' :
        'bold and innovative'
      );
      variations.push(variation);
    }
  } catch (error) {
    console.error('Error generating logo variations:', error);
  }

  return variations;
}

/**
 * Complete logo generation workflow
 */
export async function generateCompleteLogo(
  businessName: string,
  category: string,
  colorPalette: { primary: string; secondary: string; accent: string },
  generateImage: boolean = false
): Promise<{
  prompt: LogoPrompt;
  placeholder: SVGPlaceholder;
  image?: { url: string; revisedPrompt?: string };
}> {
  // Generate the logo prompt
  const prompt = await generateLogoPrompt(businessName, category, colorPalette);

  // Generate SVG placeholder
  const placeholder = generateSVGPlaceholder(businessName, colorPalette, 'initials');

  // Optionally generate actual image with DALL-E
  let image;
  if (generateImage && process.env.OPENAI_API_KEY) {
    try {
      image = await generateLogoImage(prompt.dallePrompt);
    } catch (error) {
      console.error('Failed to generate logo image, using placeholder:', error);
    }
  }

  return {
    prompt,
    placeholder,
    image,
  };
}

/**
 * Logo quality scoring
 * Evaluates generated logo prompts for quality
 */
export function scoreLogoPrompt(prompt: LogoPrompt): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 100;

  // Check prompt length
  if (prompt.dallePrompt.length < 100) {
    score -= 20;
    feedback.push('Logo prompt is too short. Add more details for better results.');
  }

  // Check for color mentions
  if (!prompt.dallePrompt.toLowerCase().includes('color')) {
    score -= 10;
    feedback.push('Prompt should explicitly mention colors.');
  }

  // Check for style specification
  if (!prompt.style) {
    score -= 15;
    feedback.push('Logo style should be specified.');
  }

  // Check for symbolism
  if (!prompt.symbolism || prompt.symbolism.length < 20) {
    score -= 10;
    feedback.push('Add more detail about the symbolic meaning.');
  }

  // Check for variations
  if (!prompt.variations || prompt.variations.length < 2) {
    score -= 15;
    feedback.push('Should include at least 2-3 variations.');
  }

  if (score >= 90) {
    feedback.push('Excellent logo prompt! Ready for generation.');
  } else if (score >= 75) {
    feedback.push('Good logo prompt with minor improvements possible.');
  } else if (score >= 60) {
    feedback.push('Decent prompt but could use more detail.');
  } else {
    feedback.push('Prompt needs significant improvement.');
  }

  return { score, feedback };
}
