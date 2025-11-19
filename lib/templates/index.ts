import { RestaurantTemplate } from './restaurant';
import { BeautyTemplate } from './beauty';
import { ProfessionalTemplate } from './professional';
import { RetailTemplate } from './retail';
import { FitnessTemplate } from './fitness';
import { TechTemplate } from './tech';

/**
 * All available templates in the system
 */
export const TEMPLATES = {
  restaurant: RestaurantTemplate,
  beauty: BeautyTemplate,
  professional_services: ProfessionalTemplate,
  retail: RetailTemplate,
  fitness: FitnessTemplate,
  tech: TechTemplate,
} as const;

export type TemplateType = keyof typeof TEMPLATES;

/**
 * Template metadata for display and selection
 */
export const TEMPLATE_METADATA: Record<
  TemplateType,
  {
    name: string;
    description: string;
    industries: string[];
    features: string[];
    preview: string;
  }
> = {
  restaurant: {
    name: 'Restaurant',
    description: 'Perfect for restaurants, cafes, and food services',
    industries: ['Restaurant', 'Cafe', 'Bar', 'Bakery', 'Food Truck'],
    features: [
      'Menu showcase',
      'Operating hours',
      'Location & directions',
      'Reservations',
      'Gallery',
    ],
    preview: '/templates/restaurant',
  },
  beauty: {
    name: 'Beauty & Salon',
    description: 'Elegant template for beauty and wellness services',
    industries: [
      'Hair Salon',
      'Beauty Salon',
      'Spa',
      'Nail Salon',
      'Barbershop',
    ],
    features: [
      'Online booking',
      'Services & pricing',
      'Staff profiles',
      'Before/after gallery',
      'Testimonials',
    ],
    preview: '/templates/beauty',
  },
  professional_services: {
    name: 'Professional Services',
    description: 'Corporate template for B2B and professional services',
    industries: [
      'Law Firm',
      'Accounting',
      'Consulting',
      'Insurance',
      'Real Estate',
    ],
    features: [
      'Credibility section',
      'Team profiles',
      'Case studies',
      'Service offerings',
      'Consultation booking',
    ],
    preview: '/templates/professional',
  },
  retail: {
    name: 'Retail Store',
    description: 'Product-focused template for retail businesses',
    industries: [
      'Clothing Store',
      'Gift Shop',
      'Electronics',
      'Home Decor',
      'Bookstore',
    ],
    features: [
      'Product catalog',
      'Featured items',
      'Store hours',
      'Newsletter signup',
      'Social media integration',
    ],
    preview: '/templates/retail',
  },
  fitness: {
    name: 'Fitness & Wellness',
    description: 'Energetic template for fitness and wellness businesses',
    industries: [
      'Gym',
      'Yoga Studio',
      'Personal Trainer',
      'Pilates',
      'CrossFit',
    ],
    features: [
      'Class schedule',
      'Membership pricing',
      'Instructor profiles',
      'Free trial offer',
      'Transformation gallery',
    ],
    preview: '/templates/fitness',
  },
  tech: {
    name: 'Tech & Startup',
    description: 'Modern template for technology companies and startups',
    industries: [
      'SaaS',
      'Software Development',
      'IT Consulting',
      'Web Agency',
      'Startup',
    ],
    features: [
      'Product showcase',
      'Pricing tiers',
      'Team page',
      'API documentation',
      'Blog integration',
    ],
    preview: '/templates/tech',
  },
};

/**
 * Get a template component by type
 */
export function getTemplate(templateType: string) {
  const type = templateType as TemplateType;
  return TEMPLATES[type] || TEMPLATES.professional_services;
}

/**
 * Get template metadata
 */
export function getTemplateMetadata(templateType: string) {
  const type = templateType as TemplateType;
  return (
    TEMPLATE_METADATA[type] || TEMPLATE_METADATA.professional_services
  );
}

/**
 * Map Hebrew business categories to template types
 */
export function getTemplateForCategory(category: string): TemplateType {
  const normalizedCategory = category.toLowerCase().trim();

  // Restaurant & Food
  if (
    normalizedCategory.includes('מסעדה') ||
    normalizedCategory.includes('בית קפה') ||
    normalizedCategory.includes('קפה') ||
    normalizedCategory.includes('מזון') ||
    normalizedCategory.includes('פיצה') ||
    normalizedCategory.includes('המבורגר') ||
    normalizedCategory.includes('סושי') ||
    normalizedCategory.includes('מאפייה') ||
    normalizedCategory.includes('בר') ||
    normalizedCategory.includes('פאב') ||
    normalizedCategory.includes('restaurant') ||
    normalizedCategory.includes('cafe') ||
    normalizedCategory.includes('food') ||
    normalizedCategory.includes('bakery') ||
    normalizedCategory.includes('bar')
  ) {
    return 'restaurant';
  }

  // Beauty & Salon
  if (
    normalizedCategory.includes('יופי') ||
    normalizedCategory.includes('מספרה') ||
    normalizedCategory.includes('עיצוב שיער') ||
    normalizedCategory.includes('ציפורניים') ||
    normalizedCategory.includes('ספא') ||
    normalizedCategory.includes('קוסמטיקה') ||
    normalizedCategory.includes('איפור') ||
    normalizedCategory.includes('beauty') ||
    normalizedCategory.includes('salon') ||
    normalizedCategory.includes('hair') ||
    normalizedCategory.includes('spa') ||
    normalizedCategory.includes('nails') ||
    normalizedCategory.includes('cosmetic')
  ) {
    return 'beauty';
  }

  // Fitness & Wellness
  if (
    normalizedCategory.includes('כושר') ||
    normalizedCategory.includes('חדר כושר') ||
    normalizedCategory.includes('יוגה') ||
    normalizedCategory.includes('פילאטיס') ||
    normalizedCategory.includes('אימון אישי') ||
    normalizedCategory.includes('ספורט') ||
    normalizedCategory.includes('gym') ||
    normalizedCategory.includes('fitness') ||
    normalizedCategory.includes('yoga') ||
    normalizedCategory.includes('pilates') ||
    normalizedCategory.includes('crossfit') ||
    normalizedCategory.includes('wellness')
  ) {
    return 'fitness';
  }

  // Retail & Shopping
  if (
    normalizedCategory.includes('חנות') ||
    normalizedCategory.includes('בוטיק') ||
    normalizedCategory.includes('אופנה') ||
    normalizedCategory.includes('בגדים') ||
    normalizedCategory.includes('נעליים') ||
    normalizedCategory.includes('מתנות') ||
    normalizedCategory.includes('תכשיטים') ||
    normalizedCategory.includes('אלקטרוניקה') ||
    normalizedCategory.includes('ספרים') ||
    normalizedCategory.includes('store') ||
    normalizedCategory.includes('shop') ||
    normalizedCategory.includes('retail') ||
    normalizedCategory.includes('boutique') ||
    normalizedCategory.includes('clothing') ||
    normalizedCategory.includes('fashion')
  ) {
    return 'retail';
  }

  // Tech & Startup
  if (
    normalizedCategory.includes('טכנולוגיה') ||
    normalizedCategory.includes('הייטק') ||
    normalizedCategory.includes('תוכנה') ||
    normalizedCategory.includes('סטארטאפ') ||
    normalizedCategory.includes('פיתוח') ||
    normalizedCategory.includes('דיגיטל') ||
    normalizedCategory.includes('אתרים') ||
    normalizedCategory.includes('technology') ||
    normalizedCategory.includes('tech') ||
    normalizedCategory.includes('software') ||
    normalizedCategory.includes('saas') ||
    normalizedCategory.includes('startup') ||
    normalizedCategory.includes('digital') ||
    normalizedCategory.includes('web development')
  ) {
    return 'tech';
  }

  // Professional Services (default for many business types)
  if (
    normalizedCategory.includes('משרד') ||
    normalizedCategory.includes('עורך דין') ||
    normalizedCategory.includes('רואה חשבון') ||
    normalizedCategory.includes('ייעוץ') ||
    normalizedCategory.includes('ביטוח') ||
    normalizedCategory.includes('נדלן') ||
    normalizedCategory.includes('ארכיטקט') ||
    normalizedCategory.includes('מהנדס') ||
    normalizedCategory.includes('law') ||
    normalizedCategory.includes('accounting') ||
    normalizedCategory.includes('consulting') ||
    normalizedCategory.includes('insurance') ||
    normalizedCategory.includes('real estate') ||
    normalizedCategory.includes('professional')
  ) {
    return 'professional_services';
  }

  // Default fallback
  return 'professional_services';
}

/**
 * Get all available template types
 */
export function getAllTemplateTypes(): TemplateType[] {
  return Object.keys(TEMPLATES) as TemplateType[];
}

/**
 * Check if a template type is valid
 */
export function isValidTemplateType(type: string): type is TemplateType {
  return type in TEMPLATES;
}

// Export individual templates for direct import
export {
  RestaurantTemplate,
  BeautyTemplate,
  ProfessionalTemplate,
  RetailTemplate,
  FitnessTemplate,
  TechTemplate,
};
