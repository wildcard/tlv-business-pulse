/**
 * Industry-Specific Content Generation Prompts
 *
 * This file contains specialized prompts and configurations for generating
 * high-quality, industry-appropriate content for Tel Aviv businesses.
 */

export interface IndustryConfig {
  name: string;
  templateType: string;
  colorPalettes: Array<{
    name: string;
    primary: string;
    secondary: string;
    accent: string;
  }>;
  typographyOptions: Array<{
    heading: string;
    body: string;
    personality: string;
  }>;
  contentTone: string;
  keyQuestions: string[];
  commonServices: string[];
  pricingGuidelines: {
    low: string;
    medium: string;
    high: string;
  };
  seoKeywords: string[];
  hebrewTerms: string[];
  logoStyles: string[];
}

/**
 * Industry-specific configurations for content generation
 */
export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  restaurant: {
    name: 'Restaurant & Dining',
    templateType: 'restaurant',
    colorPalettes: [
      {
        name: 'Appetizing Red',
        primary: '#C41E3A',
        secondary: '#2C1810',
        accent: '#F4A460',
      },
      {
        name: 'Fresh Green',
        primary: '#2D5016',
        secondary: '#8B4513',
        accent: '#FFD700',
      },
      {
        name: 'Mediterranean Blue',
        primary: '#1E3A8A',
        secondary: '#FFF8DC',
        accent: '#FF6B35',
      },
      {
        name: 'Warm Terracotta',
        primary: '#CD5C5C',
        secondary: '#2F4F4F',
        accent: '#F0E68C',
      },
    ],
    typographyOptions: [
      {
        heading: 'Playfair Display',
        body: 'Source Sans Pro',
        personality: 'Elegant fine dining',
      },
      {
        heading: 'Lobster',
        body: 'Raleway',
        personality: 'Casual, friendly',
      },
      {
        heading: 'Montserrat',
        body: 'Open Sans',
        personality: 'Modern, clean',
      },
    ],
    contentTone: 'Warm, appetizing, and sensory. Use descriptive language that makes mouths water. Emphasize freshness, quality ingredients, and the dining experience.',
    keyQuestions: [
      'What type of cuisine do you specialize in?',
      'Do you offer indoor/outdoor seating?',
      'What are your signature dishes?',
      'Do you cater to dietary restrictions (vegan, kosher, etc.)?',
      'What is the dining atmosphere (casual, romantic, family-friendly)?',
      'Do you offer takeaway or delivery?',
      'What is your seating capacity?',
    ],
    commonServices: [
      'Dine-in service',
      'Takeaway orders',
      'Delivery service',
      'Catering for events',
      'Private dining room',
      'Happy hour specials',
      'Breakfast/Brunch menu',
      'Chef\'s tasting menu',
      'Wine pairing',
      'Outdoor terrace seating',
    ],
    pricingGuidelines: {
      low: '₪40-70 per person (casual, street food)',
      medium: '₪70-150 per person (mid-range dining)',
      high: '₪150-400+ per person (fine dining)',
    },
    seoKeywords: [
      'restaurant tel aviv',
      'where to eat in',
      'best restaurants',
      'food delivery',
      'kosher restaurant',
      'vegan restaurant',
      'romantic dinner',
      'business lunch',
      'מסעדה תל אביב',
      'אוכל טוב',
    ],
    hebrewTerms: [
      'בתיאבון (Bon Appétit)',
      'כשר (Kosher)',
      'טבעוני (Vegan)',
      'מנה ראשונה (Appetizer)',
      'מנה עיקרית (Main Course)',
      'קינוח (Dessert)',
    ],
    logoStyles: [
      'Classic emblem with fork and knife',
      'Modern minimalist with typography focus',
      'Hand-drawn illustration style',
      'Vintage badge design',
      'Plate and utensils iconography',
      'Chef hat or cooking element',
    ],
  },

  beauty: {
    name: 'Beauty & Wellness',
    templateType: 'beauty',
    colorPalettes: [
      {
        name: 'Soft Pink',
        primary: '#FF69B4',
        secondary: '#FFF5EE',
        accent: '#C71585',
      },
      {
        name: 'Spa Green',
        primary: '#3CB371',
        secondary: '#F0FFF0',
        accent: '#20B2AA',
      },
      {
        name: 'Elegant Purple',
        primary: '#9370DB',
        secondary: '#E6E6FA',
        accent: '#FF1493',
      },
      {
        name: 'Natural Earth',
        primary: '#8B7355',
        secondary: '#FFFACD',
        accent: '#DDA15E',
      },
    ],
    typographyOptions: [
      {
        heading: 'Cormorant Garamond',
        body: 'Lato',
        personality: 'Elegant and refined',
      },
      {
        heading: 'Bodoni Moda',
        body: 'Montserrat',
        personality: 'Sophisticated, luxury',
      },
      {
        heading: 'Poppins',
        body: 'Nunito',
        personality: 'Modern, approachable',
      },
    ],
    contentTone: 'Soothing, confident, and empowering. Focus on transformation, self-care, and expertise. Use words like "radiant," "rejuvenate," "pamper," and "glow."',
    keyQuestions: [
      'What beauty services do you offer (hair, nails, skincare, makeup)?',
      'What brands or products do you use?',
      'Do you have specialized treatments (keratin, lash extensions, etc.)?',
      'What is the salon atmosphere?',
      'Do you work by appointment only?',
      'Do you offer bridal packages?',
      'What are your stylist specialties?',
    ],
    commonServices: [
      'Haircuts & styling',
      'Hair coloring & highlights',
      'Manicure & pedicure',
      'Gel nails',
      'Facial treatments',
      'Eyelash extensions',
      'Makeup application',
      'Waxing services',
      'Bridal packages',
      'Hair treatments (keratin, protein)',
    ],
    pricingGuidelines: {
      low: '₪80-150 (basic services)',
      medium: '₪150-350 (standard treatments)',
      high: '₪350-800+ (premium treatments, packages)',
    },
    seoKeywords: [
      'beauty salon tel aviv',
      'hair salon',
      'nail salon',
      'facial treatment',
      'bridal makeup',
      'keratin treatment',
      'eyelash extensions',
      'ספר תל אביב',
      'מניקור פדיקור',
      'טיפולי פנים',
    ],
    hebrewTerms: [
      'ספר (Salon)',
      'תספורת (Haircut)',
      'צביעת שיער (Hair coloring)',
      'טיפול פנים (Facial)',
      'מניקור (Manicure)',
      'פדיקור (Pedicure)',
    ],
    logoStyles: [
      'Elegant script typography',
      'Minimalist beauty icon (lips, scissors, brush)',
      'Art deco inspired',
      'Floral or botanical elements',
      'Mirror or vanity imagery',
      'Abstract feminine form',
    ],
  },

  professional_services: {
    name: 'Professional Services',
    templateType: 'professional_services',
    colorPalettes: [
      {
        name: 'Corporate Blue',
        primary: '#1E40AF',
        secondary: '#F3F4F6',
        accent: '#10B981',
      },
      {
        name: 'Trust Navy',
        primary: '#1E3A8A',
        secondary: '#E5E7EB',
        accent: '#F59E0B',
      },
      {
        name: 'Modern Teal',
        primary: '#0D9488',
        secondary: '#F0FDFA',
        accent: '#EF4444',
      },
      {
        name: 'Executive Charcoal',
        primary: '#374151',
        secondary: '#F9FAFB',
        accent: '#3B82F6',
      },
    ],
    typographyOptions: [
      {
        heading: 'Inter',
        body: 'Inter',
        personality: 'Modern, professional',
      },
      {
        heading: 'Work Sans',
        body: 'Source Sans Pro',
        personality: 'Clean, corporate',
      },
      {
        heading: 'Merriweather',
        body: 'Lato',
        personality: 'Traditional, trustworthy',
      },
    ],
    contentTone: 'Professional, authoritative, and trustworthy. Emphasize expertise, results, and credentials. Use industry terminology appropriately.',
    keyQuestions: [
      'What professional services do you provide?',
      'What are your team members\' qualifications?',
      'What industries or clients do you specialize in?',
      'What is your approach or methodology?',
      'What results have you achieved for clients?',
      'Do you offer free consultations?',
      'What are your areas of expertise?',
    ],
    commonServices: [
      'Business consulting',
      'Legal services',
      'Accounting & bookkeeping',
      'Tax preparation',
      'Financial planning',
      'HR consulting',
      'Marketing strategy',
      'IT consulting',
      'Management consulting',
      'Business development',
    ],
    pricingGuidelines: {
      low: '₪300-600 per hour (junior consultants)',
      medium: '₪600-1,500 per hour (experienced professionals)',
      high: '₪1,500-5,000+ per hour or project-based (senior partners, specialized expertise)',
    },
    seoKeywords: [
      'business consultant tel aviv',
      'legal services',
      'accounting firm',
      'financial advisor',
      'management consulting',
      'tax consultant',
      'HR services',
      'יועץ עסקי',
      'שירותים משפטיים',
      'ייעוץ פיננסי',
    ],
    hebrewTerms: [
      'יועץ (Consultant)',
      'משרד עורכי דין (Law firm)',
      'רואה חשבון (Accountant)',
      'ייעוץ עסקי (Business consulting)',
      'ניהול (Management)',
      'אסטרטגיה (Strategy)',
    ],
    logoStyles: [
      'Minimalist lettermark',
      'Abstract geometric shape',
      'Professional emblem',
      'Monogram design',
      'Clean wordmark',
      'Icon representing expertise (scale, briefcase, graph)',
    ],
  },

  retail: {
    name: 'Retail & Shopping',
    templateType: 'retail',
    colorPalettes: [
      {
        name: 'Vibrant Orange',
        primary: '#F97316',
        secondary: '#FFF7ED',
        accent: '#DC2626',
      },
      {
        name: 'Shopping Purple',
        primary: '#7C3AED',
        secondary: '#FAF5FF',
        accent: '#EC4899',
      },
      {
        name: 'Fresh Turquoise',
        primary: '#14B8A6',
        secondary: '#F0FDFA',
        accent: '#F59E0B',
      },
      {
        name: 'Bold Red',
        primary: '#DC2626',
        secondary: '#FEF2F2',
        accent: '#FBBF24',
      },
    ],
    typographyOptions: [
      {
        heading: 'Oswald',
        body: 'Roboto',
        personality: 'Bold, attention-grabbing',
      },
      {
        heading: 'Bebas Neue',
        body: 'Open Sans',
        personality: 'Modern retail',
      },
      {
        heading: 'Raleway',
        body: 'Nunito',
        personality: 'Friendly, approachable',
      },
    ],
    contentTone: 'Exciting, trendy, and customer-focused. Use words like "discover," "exclusive," "collection," "curated," and "must-have." Create urgency and desire.',
    keyQuestions: [
      'What products do you sell?',
      'What makes your products unique?',
      'Do you have online shopping/delivery?',
      'What are your store hours?',
      'Do you offer returns/exchanges?',
      'Are there any current promotions or sales?',
      'Do you have a loyalty program?',
    ],
    commonServices: [
      'In-store shopping',
      'Online ordering',
      'Home delivery',
      'Personal shopping assistance',
      'Gift wrapping',
      'Returns & exchanges',
      'Loyalty rewards program',
      'New arrivals notification',
      'Style consultation',
      'Special orders',
    ],
    pricingGuidelines: {
      low: '₪20-100 (accessories, small items)',
      medium: '₪100-500 (clothing, home goods)',
      high: '₪500-5,000+ (luxury items, furniture)',
    },
    seoKeywords: [
      'shop tel aviv',
      'boutique',
      'clothing store',
      'home decor',
      'gift shop',
      'online shopping',
      'fashion tel aviv',
      'חנות תל אביב',
      'קניות אונליין',
      'בוטיק',
    ],
    hebrewTerms: [
      'חנות (Store)',
      'קניות (Shopping)',
      'מבצעים (Sale)',
      'הנחה (Discount)',
      'קולקציה חדשה (New collection)',
      'משלוח חינם (Free shipping)',
    ],
    logoStyles: [
      'Modern shopping bag icon',
      'Stylized store name',
      'Tag or price tag design',
      'Shopping-related icon',
      'Boutique-style script',
      'Minimalist product silhouette',
    ],
  },

  fitness: {
    name: 'Fitness & Sports',
    templateType: 'fitness',
    colorPalettes: [
      {
        name: 'Energy Orange',
        primary: '#F97316',
        secondary: '#1F2937',
        accent: '#10B981',
      },
      {
        name: 'Athletic Blue',
        primary: '#2563EB',
        secondary: '#F3F4F6',
        accent: '#EF4444',
      },
      {
        name: 'Power Red',
        primary: '#DC2626',
        secondary: '#111827',
        accent: '#FBBF24',
      },
      {
        name: 'Fresh Green',
        primary: '#10B981',
        secondary: '#F0FDF4',
        accent: '#8B5CF6',
      },
    ],
    typographyOptions: [
      {
        heading: 'Bebas Neue',
        body: 'Roboto',
        personality: 'Strong, athletic',
      },
      {
        heading: 'Montserrat',
        body: 'Open Sans',
        personality: 'Modern, energetic',
      },
      {
        heading: 'Oswald',
        body: 'Lato',
        personality: 'Bold, motivational',
      },
    ],
    contentTone: 'Motivational, energetic, and empowering. Use action words like "transform," "achieve," "push," "strengthen," and "unleash." Focus on results and community.',
    keyQuestions: [
      'What types of workouts do you offer?',
      'What equipment do you have?',
      'Do you offer personal training?',
      'What are membership options?',
      'What is the class schedule?',
      'Do you have shower/locker facilities?',
      'What fitness levels do you cater to?',
    ],
    commonServices: [
      'Group fitness classes',
      'Personal training',
      'Yoga classes',
      'Pilates',
      'CrossFit/HIIT',
      'Spin classes',
      'Weight training area',
      'Cardio equipment',
      'Nutrition counseling',
      'Online workout programs',
    ],
    pricingGuidelines: {
      low: '₪150-300 monthly membership',
      medium: '₪300-600 monthly (premium facilities)',
      high: '₪600-1,500+ (personal training, boutique studios)',
    },
    seoKeywords: [
      'gym tel aviv',
      'fitness studio',
      'personal trainer',
      'yoga classes',
      'crossfit',
      'pilates studio',
      'workout classes',
      'חדר כושר תל אביב',
      'מאמן כושר אישי',
      'יוגה',
    ],
    hebrewTerms: [
      'חדר כושר (Gym)',
      'מאמן אישי (Personal trainer)',
      'כושר (Fitness)',
      'אימון (Training)',
      'קבוצתי (Group class)',
      'יוגה (Yoga)',
    ],
    logoStyles: [
      'Bold athletic typography',
      'Muscular or human form silhouette',
      'Dumbbell or barbell icon',
      'Mountain or strength symbol',
      'Abstract motion design',
      'Geometric power shapes',
    ],
  },

  tech: {
    name: 'Technology & Startups',
    templateType: 'tech',
    colorPalettes: [
      {
        name: 'Startup Blue',
        primary: '#3B82F6',
        secondary: '#F9FAFB',
        accent: '#10B981',
      },
      {
        name: 'Innovation Purple',
        primary: '#8B5CF6',
        secondary: '#F5F3FF',
        accent: '#06B6D4',
      },
      {
        name: 'Tech Green',
        primary: '#10B981',
        secondary: '#ECFDF5',
        accent: '#6366F1',
      },
      {
        name: 'Digital Dark',
        primary: '#111827',
        secondary: '#F3F4F6',
        accent: '#3B82F6',
      },
    ],
    typographyOptions: [
      {
        heading: 'Space Grotesk',
        body: 'Inter',
        personality: 'Modern tech',
      },
      {
        heading: 'IBM Plex Sans',
        body: 'IBM Plex Sans',
        personality: 'Tech-forward',
      },
      {
        heading: 'DM Sans',
        body: 'DM Sans',
        personality: 'Clean, minimal',
      },
    ],
    contentTone: 'Innovative, forward-thinking, and solution-oriented. Use tech terminology appropriately. Focus on problems solved, efficiency gains, and scalability.',
    keyQuestions: [
      'What technology solutions do you provide?',
      'What industries do you serve?',
      'What technologies do you specialize in?',
      'What is your development process?',
      'Do you offer ongoing support?',
      'What is your team\'s expertise?',
      'What are your key differentiators?',
    ],
    commonServices: [
      'Software development',
      'Mobile app development',
      'Web development',
      'Cloud solutions',
      'AI/ML implementation',
      'DevOps services',
      'UI/UX design',
      'API development',
      'Technical consulting',
      'Maintenance & support',
    ],
    pricingGuidelines: {
      low: '₪200-500 per hour (junior developers)',
      medium: '₪500-1,000 per hour (experienced team)',
      high: '₪50,000-500,000+ project-based (enterprise solutions)',
    },
    seoKeywords: [
      'software development tel aviv',
      'tech startup',
      'app development',
      'web development',
      'cloud solutions',
      'ai development',
      'devops',
      'פיתוח תוכנה',
      'סטארטאפ',
      'אפליקציה',
    ],
    hebrewTerms: [
      'פיתוח (Development)',
      'תוכנה (Software)',
      'אפליקציה (Application)',
      'טכנולוגיה (Technology)',
      'חדשנות (Innovation)',
      'סטארטאפ (Startup)',
    ],
    logoStyles: [
      'Abstract geometric tech symbol',
      'Minimalist lettermark',
      'Circuit or network pattern',
      'Pixel or digital element',
      'Forward arrow or growth symbol',
      'Modern sans-serif wordmark',
    ],
  },
};

/**
 * Get industry configuration by category
 */
export function getIndustryConfig(category: string): IndustryConfig {
  // Normalize category string
  const normalizedCategory = category.toLowerCase().trim();

  // Direct match
  if (INDUSTRY_CONFIGS[normalizedCategory]) {
    return INDUSTRY_CONFIGS[normalizedCategory];
  }

  // Keyword matching
  if (normalizedCategory.includes('restaurant') || normalizedCategory.includes('food') || normalizedCategory.includes('cafe') || normalizedCategory.includes('מסעדה')) {
    return INDUSTRY_CONFIGS.restaurant;
  }

  if (normalizedCategory.includes('beauty') || normalizedCategory.includes('salon') || normalizedCategory.includes('spa') || normalizedCategory.includes('ספר') || normalizedCategory.includes('יופי')) {
    return INDUSTRY_CONFIGS.beauty;
  }

  if (normalizedCategory.includes('fitness') || normalizedCategory.includes('gym') || normalizedCategory.includes('yoga') || normalizedCategory.includes('כושר') || normalizedCategory.includes('חדר')) {
    return INDUSTRY_CONFIGS.fitness;
  }

  if (normalizedCategory.includes('retail') || normalizedCategory.includes('shop') || normalizedCategory.includes('store') || normalizedCategory.includes('boutique') || normalizedCategory.includes('חנות')) {
    return INDUSTRY_CONFIGS.retail;
  }

  if (normalizedCategory.includes('tech') || normalizedCategory.includes('software') || normalizedCategory.includes('startup') || normalizedCategory.includes('development') || normalizedCategory.includes('פיתוח')) {
    return INDUSTRY_CONFIGS.tech;
  }

  // Default to professional services for unknown categories
  return INDUSTRY_CONFIGS.professional_services;
}

/**
 * Generate industry-specific content prompt enhancements
 */
export function enhancePromptWithIndustry(
  basePrompt: string,
  category: string
): string {
  const config = getIndustryConfig(category);

  const industryContext = `

INDUSTRY-SPECIFIC GUIDANCE (${config.name}):
- Content Tone: ${config.contentTone}
- Common Services in this industry: ${config.commonServices.slice(0, 5).join(', ')}
- Typical Price Range: ${config.pricingGuidelines.medium}
- Relevant Hebrew Terms: ${config.hebrewTerms.join(', ')}
- SEO Keywords to consider: ${config.seoKeywords.slice(0, 8).join(', ')}

Use this context to make the content more authentic and industry-appropriate.`;

  return basePrompt + industryContext;
}

/**
 * Get recommended color palette for industry
 */
export function getRecommendedColorPalette(category: string): {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
} {
  const config = getIndustryConfig(category);
  // Return the first (primary) palette for the industry
  const palette = config.colorPalettes[0];
  return {
    ...palette,
  };
}

/**
 * Get recommended typography for industry
 */
export function getRecommendedTypography(category: string): {
  heading: string;
  body: string;
  personality: string;
} {
  const config = getIndustryConfig(category);
  // Return the first typography option
  return config.typographyOptions[0];
}

/**
 * Get logo style suggestions for industry
 */
export function getLogoStyleSuggestions(category: string): string[] {
  const config = getIndustryConfig(category);
  return config.logoStyles;
}
