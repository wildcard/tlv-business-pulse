/**
 * Content Quality Validation System
 *
 * Validates generated content to ensure it meets quality standards
 * before being deployed to production websites.
 */

import type { GeneratedWebsite } from '../ai/generate';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation: string;
}

/**
 * Comprehensive content validation
 */
export function validateGeneratedContent(
  content: GeneratedWebsite,
  businessName: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];

  let score = 100;

  // 1. Validate hero title
  const titleValidation = validateHeroTitle(content.heroTitle, businessName);
  errors.push(...titleValidation.errors);
  warnings.push(...titleValidation.warnings);
  score -= titleValidation.penaltyPoints;

  // 2. Validate hero subtitle
  const subtitleValidation = validateHeroSubtitle(content.heroSubtitle);
  errors.push(...subtitleValidation.errors);
  warnings.push(...subtitleValidation.warnings);
  score -= subtitleValidation.penaltyPoints;

  // 3. Validate about content
  const aboutValidation = validateAboutContent(content.aboutContent);
  errors.push(...aboutValidation.errors);
  warnings.push(...aboutValidation.warnings);
  score -= aboutValidation.penaltyPoints;

  // 4. Validate services
  const servicesValidation = validateServices(content.services);
  errors.push(...servicesValidation.errors);
  warnings.push(...servicesValidation.warnings);
  score -= servicesValidation.penaltyPoints;

  // 5. Validate SEO metadata
  const seoValidation = validateSEOMetadata(
    content.seoTitle,
    content.seoDescription,
    content.keywords
  );
  errors.push(...seoValidation.errors);
  warnings.push(...seoValidation.warnings);
  score -= seoValidation.penaltyPoints;

  // 6. Validate design elements
  const designValidation = validateDesignElements(
    content.colorPalette,
    content.typography
  );
  errors.push(...designValidation.errors);
  warnings.push(...designValidation.warnings);
  score -= designValidation.penaltyPoints;

  // 7. Content quality checks
  const qualityValidation = validateContentQuality(content, businessName);
  errors.push(...qualityValidation.errors);
  warnings.push(...qualityValidation.warnings);
  score -= qualityValidation.penaltyPoints;

  // Generate suggestions
  if (warnings.length > 0) {
    suggestions.push(`Found ${warnings.length} warnings that could improve content quality.`);
  }
  if (score >= 90) {
    suggestions.push('Excellent content quality! Ready for deployment.');
  } else if (score >= 75) {
    suggestions.push('Good quality with minor improvements recommended.');
  } else if (score >= 60) {
    suggestions.push('Acceptable quality but consider regenerating for better results.');
  } else {
    suggestions.push('Content needs significant improvement. Consider regenerating.');
  }

  return {
    isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0,
    score: Math.max(0, score),
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate hero title
 */
function validateHeroTitle(
  title: string,
  businessName: string
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  // Check length
  if (!title || title.length === 0) {
    errors.push({
      field: 'heroTitle',
      message: 'Hero title is empty',
      severity: 'critical',
    });
    penaltyPoints += 30;
  } else if (title.length > 80) {
    warnings.push({
      field: 'heroTitle',
      message: 'Hero title is too long (>80 chars). Ideal: 40-60 characters.',
      recommendation: 'Shorten to improve readability and mobile display.',
    });
    penaltyPoints += 5;
  } else if (title.length < 20) {
    warnings.push({
      field: 'heroTitle',
      message: 'Hero title is very short (<20 chars). Consider adding more context.',
      recommendation: 'Aim for 40-60 characters for optimal impact.',
    });
    penaltyPoints += 3;
  }

  // Check if it's just the business name (lazy generation)
  if (title.toLowerCase() === businessName.toLowerCase()) {
    warnings.push({
      field: 'heroTitle',
      message: 'Hero title is just the business name without added value.',
      recommendation: 'Add a compelling benefit or unique value proposition.',
    });
    penaltyPoints += 10;
  }

  // Check for generic phrases
  const genericPhrases = ['welcome to', 'home of', 'official website'];
  if (genericPhrases.some(phrase => title.toLowerCase().includes(phrase))) {
    warnings.push({
      field: 'heroTitle',
      message: 'Hero title uses generic phrases.',
      recommendation: 'Use more compelling, benefit-focused language.',
    });
    penaltyPoints += 5;
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate hero subtitle
 */
function validateHeroSubtitle(subtitle: string): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  if (!subtitle || subtitle.length === 0) {
    errors.push({
      field: 'heroSubtitle',
      message: 'Hero subtitle is empty',
      severity: 'high',
    });
    penaltyPoints += 20;
  } else if (subtitle.length > 150) {
    warnings.push({
      field: 'heroSubtitle',
      message: 'Hero subtitle is too long (>150 chars). Ideal: 80-120 characters.',
      recommendation: 'Condense for better readability.',
    });
    penaltyPoints += 5;
  } else if (subtitle.length < 30) {
    warnings.push({
      field: 'heroSubtitle',
      message: 'Hero subtitle is very short. Add more context.',
      recommendation: 'Aim for 80-120 characters.',
    });
    penaltyPoints += 3;
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate about content
 */
function validateAboutContent(content: string): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  if (!content || content.length === 0) {
    errors.push({
      field: 'aboutContent',
      message: 'About content is empty',
      severity: 'critical',
    });
    penaltyPoints += 30;
    return { errors, warnings, penaltyPoints };
  }

  const wordCount = content.split(/\s+/).length;

  if (wordCount < 100) {
    warnings.push({
      field: 'aboutContent',
      message: `About content is too short (${wordCount} words). Recommended: 150-300 words.`,
      recommendation: 'Add more details about the business story, values, and benefits.',
    });
    penaltyPoints += 10;
  } else if (wordCount > 500) {
    warnings.push({
      field: 'aboutContent',
      message: `About content is too long (${wordCount} words). Users may not read it all.`,
      recommendation: 'Condense to 150-300 words focusing on key points.',
    });
    penaltyPoints += 5;
  }

  // Check for paragraph structure
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length < 2) {
    warnings.push({
      field: 'aboutContent',
      message: 'About content should have multiple paragraphs for better readability.',
      recommendation: 'Break into 2-3 focused paragraphs.',
    });
    penaltyPoints += 5;
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate services
 */
function validateServices(services: any[]): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  if (!services || services.length === 0) {
    errors.push({
      field: 'services',
      message: 'No services defined',
      severity: 'critical',
    });
    penaltyPoints += 30;
    return { errors, warnings, penaltyPoints };
  }

  if (services.length < 3) {
    warnings.push({
      field: 'services',
      message: `Only ${services.length} service(s). Recommended: 4-8 services.`,
      recommendation: 'Add more services to provide comprehensive offerings.',
    });
    penaltyPoints += 10;
  } else if (services.length > 12) {
    warnings.push({
      field: 'services',
      message: `Too many services (${services.length}). May overwhelm visitors.`,
      recommendation: 'Focus on 4-8 key services or group similar ones.',
    });
    penaltyPoints += 5;
  }

  // Validate each service
  services.forEach((service, index) => {
    if (!service.name || service.name.length === 0) {
      errors.push({
        field: `services[${index}].name`,
        message: 'Service name is empty',
        severity: 'high',
      });
      penaltyPoints += 5;
    }

    if (!service.description || service.description.length < 20) {
      warnings.push({
        field: `services[${index}].description`,
        message: 'Service description is too short or missing.',
        recommendation: 'Add 30-50 words describing benefits and details.',
      });
      penaltyPoints += 3;
    }

    // Check for pricing
    if (!service.price) {
      warnings.push({
        field: `services[${index}].price`,
        message: 'Service has no pricing information.',
        recommendation: 'Add price, price range, or "Contact for quote".',
      });
      penaltyPoints += 2;
    }
  });

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate SEO metadata
 */
function validateSEOMetadata(
  title: string,
  description: string,
  keywords: string[]
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  // Validate SEO title
  if (!title || title.length === 0) {
    errors.push({
      field: 'seoTitle',
      message: 'SEO title is empty',
      severity: 'critical',
    });
    penaltyPoints += 20;
  } else if (title.length > 60) {
    warnings.push({
      field: 'seoTitle',
      message: `SEO title is too long (${title.length} chars). Google truncates at ~60.`,
      recommendation: 'Shorten to 50-60 characters.',
    });
    penaltyPoints += 10;
  } else if (title.length < 30) {
    warnings.push({
      field: 'seoTitle',
      message: 'SEO title is short. Could be more descriptive.',
      recommendation: 'Aim for 50-60 characters with keywords.',
    });
    penaltyPoints += 5;
  }

  // Validate meta description
  if (!description || description.length === 0) {
    errors.push({
      field: 'seoDescription',
      message: 'SEO description is empty',
      severity: 'high',
    });
    penaltyPoints += 15;
  } else if (description.length > 160) {
    warnings.push({
      field: 'seoDescription',
      message: `SEO description is too long (${description.length} chars). Google truncates at ~160.`,
      recommendation: 'Shorten to 150-160 characters.',
    });
    penaltyPoints += 10;
  } else if (description.length < 100) {
    warnings.push({
      field: 'seoDescription',
      message: 'SEO description is short. Could provide more context.',
      recommendation: 'Aim for 150-160 characters.',
    });
    penaltyPoints += 5;
  }

  // Validate keywords
  if (!keywords || keywords.length === 0) {
    warnings.push({
      field: 'keywords',
      message: 'No SEO keywords defined.',
      recommendation: 'Add 5-10 relevant keywords.',
    });
    penaltyPoints += 10;
  } else if (keywords.length < 5) {
    warnings.push({
      field: 'keywords',
      message: `Only ${keywords.length} keywords. Recommended: 5-10.`,
      recommendation: 'Add more relevant keywords for better SEO.',
    });
    penaltyPoints += 5;
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate design elements
 */
function validateDesignElements(
  colorPalette: any,
  typography: any
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  // Validate color palette
  if (!colorPalette) {
    errors.push({
      field: 'colorPalette',
      message: 'Color palette is missing',
      severity: 'high',
    });
    penaltyPoints += 15;
  } else {
    if (!isValidHexColor(colorPalette.primary)) {
      errors.push({
        field: 'colorPalette.primary',
        message: 'Primary color is not a valid hex color',
        severity: 'medium',
      });
      penaltyPoints += 10;
    }
    if (!isValidHexColor(colorPalette.secondary)) {
      errors.push({
        field: 'colorPalette.secondary',
        message: 'Secondary color is not a valid hex color',
        severity: 'medium',
      });
      penaltyPoints += 10;
    }
    if (!isValidHexColor(colorPalette.accent)) {
      errors.push({
        field: 'colorPalette.accent',
        message: 'Accent color is not a valid hex color',
        severity: 'medium',
      });
      penaltyPoints += 10;
    }
  }

  // Validate typography
  if (!typography) {
    errors.push({
      field: 'typography',
      message: 'Typography is missing',
      severity: 'medium',
    });
    penaltyPoints += 10;
  } else {
    if (!typography.heading || typography.heading.length === 0) {
      errors.push({
        field: 'typography.heading',
        message: 'Heading font is missing',
        severity: 'medium',
      });
      penaltyPoints += 5;
    }
    if (!typography.body || typography.body.length === 0) {
      errors.push({
        field: 'typography.body',
        message: 'Body font is missing',
        severity: 'medium',
      });
      penaltyPoints += 5;
    }
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Validate overall content quality
 */
function validateContentQuality(
  content: GeneratedWebsite,
  businessName: string
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  penaltyPoints: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penaltyPoints = 0;

  // Check for offensive language
  const offensiveWords = ['damn', 'hell', 'crap', 'suck']; // Add more as needed
  const allText = `${content.heroTitle} ${content.heroSubtitle} ${content.aboutContent}`;

  offensiveWords.forEach(word => {
    if (allText.toLowerCase().includes(word)) {
      errors.push({
        field: 'content',
        message: `Potentially inappropriate language detected: "${word}"`,
        severity: 'high',
      });
      penaltyPoints += 20;
    }
  });

  // Check for business name presence
  const namePresent = allText.toLowerCase().includes(businessName.toLowerCase());
  if (!namePresent) {
    warnings.push({
      field: 'content',
      message: 'Business name not prominently featured in content.',
      recommendation: 'Ensure business name appears in hero or about section.',
    });
    penaltyPoints += 5;
  }

  // Check template type is specified
  if (!content.templateType) {
    warnings.push({
      field: 'templateType',
      message: 'Template type not specified.',
      recommendation: 'Specify appropriate template for industry.',
    });
    penaltyPoints += 5;
  }

  return { errors, warnings, penaltyPoints };
}

/**
 * Helper: Validate hex color
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate pricing is realistic for Tel Aviv market
 */
export function validatePricing(
  price: string,
  category: string
): {
  isRealistic: boolean;
  message: string;
} {
  // Extract numeric value from price string
  const numericMatch = price.match(/(\d+)/);
  if (!numericMatch) {
    return {
      isRealistic: true,
      message: 'Price is descriptive (not numeric)',
    };
  }

  const amount = parseInt(numericMatch[0], 10);

  // Basic sanity checks based on category
  if (category.toLowerCase().includes('restaurant') || category.toLowerCase().includes('cafe')) {
    if (amount < 20) {
      return {
        isRealistic: false,
        message: 'Price seems too low for Tel Aviv restaurant. Typical: ₪40-150.',
      };
    }
    if (amount > 500) {
      return {
        isRealistic: false,
        message: 'Price seems very high. Confirm for fine dining.',
      };
    }
  }

  if (category.toLowerCase().includes('beauty') || category.toLowerCase().includes('salon')) {
    if (amount < 50) {
      return {
        isRealistic: false,
        message: 'Price seems too low for beauty services. Typical: ₪80-350.',
      };
    }
    if (amount > 1000) {
      return {
        isRealistic: false,
        message: 'Price seems very high. Confirm for luxury treatments.',
      };
    }
  }

  return {
    isRealistic: true,
    message: 'Price appears reasonable',
  };
}

/**
 * Generate a validation report
 */
export function generateValidationReport(result: ValidationResult): string {
  let report = '=== CONTENT VALIDATION REPORT ===\n\n';

  report += `Overall Score: ${result.score}/100\n`;
  report += `Status: ${result.isValid ? '✓ VALID' : '✗ INVALID'}\n\n`;

  if (result.errors.length > 0) {
    report += `ERRORS (${result.errors.length}):\n`;
    result.errors.forEach((error, i) => {
      report += `${i + 1}. [${error.severity.toUpperCase()}] ${error.field}: ${error.message}\n`;
    });
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += `WARNINGS (${result.warnings.length}):\n`;
    result.warnings.forEach((warning, i) => {
      report += `${i + 1}. ${warning.field}: ${warning.message}\n`;
      report += `   → ${warning.recommendation}\n`;
    });
    report += '\n';
  }

  if (result.suggestions.length > 0) {
    report += `SUGGESTIONS:\n`;
    result.suggestions.forEach((suggestion, i) => {
      report += `${i + 1}. ${suggestion}\n`;
    });
  }

  return report;
}
