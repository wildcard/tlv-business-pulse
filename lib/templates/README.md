# TLV Business Pulse - Template System

## Overview

This directory contains the complete template system for TLV Business Pulse. Each template is designed for specific industries and includes unique features optimized for that business type.

## Available Templates

### 1. Restaurant Template (`restaurant.tsx`)
**Perfect for:** Restaurants, Cafes, Bars, Bakeries, Food Trucks

**Key Features:**
- Menu showcase with categories (appetizers, mains, desserts, beverages)
- Operating hours display
- Location & directions integration
- Quick info bar with essential details
- Photo gallery sections
- Reservation/ordering CTAs

**Sample Usage:**
```tsx
import { RestaurantTemplate } from '@/lib/templates/restaurant';

<RestaurantTemplate
  business={businessData}
  generated={generatedContent}
  menu={menuItems}
/>
```

### 2. Beauty & Salon Template (`beauty.tsx`)
**Perfect for:** Hair Salons, Beauty Salons, Spas, Nail Salons, Barbershops

**Key Features:**
- Online booking widget (prominent placement)
- Services & pricing table with duration
- Staff profiles with specialties
- Before/after gallery section
- Operating hours (detailed)
- Testimonials section
- Instagram feed integration

**Sample Usage:**
```tsx
import { BeautyTemplate } from '@/lib/templates/beauty';

<BeautyTemplate
  business={businessData}
  generated={generatedContent}
  services={servicesList}
  staff={staffMembers}
/>
```

### 3. Professional Services Template (`professional.tsx`)
**Perfect for:** Law Firms, Accounting, Consulting, Insurance, Real Estate

**Key Features:**
- Credibility section (certifications, years of experience)
- Services offered with detailed descriptions
- Case studies / success stories
- Team profiles with professional credentials
- Consultation booking
- LinkedIn integration
- Trust indicators (stats, achievements)

**Sample Usage:**
```tsx
import { ProfessionalTemplate } from '@/lib/templates/professional';

<ProfessionalTemplate
  business={businessData}
  generated={generatedContent}
  services={servicesList}
  team={teamMembers}
  caseStudies={successStories}
/>
```

### 4. Retail Template (`retail.tsx`)
**Perfect for:** Clothing Stores, Gift Shops, Electronics, Home Decor, Bookstores

**Key Features:**
- Product showcase/catalog
- Featured products carousel
- Category filtering
- Store hours & location (prominent)
- Newsletter signup
- Sales/promotions section
- Instagram shopping integration
- Product search and filtering

**Sample Usage:**
```tsx
import { RetailTemplate } from '@/lib/templates/retail';

<RetailTemplate
  business={businessData}
  generated={generatedContent}
  products={productList}
  categories={categoryList}
/>
```

### 5. Fitness & Wellness Template (`fitness.tsx`)
**Perfect for:** Gyms, Yoga Studios, Personal Trainers, Pilates, CrossFit

**Key Features:**
- Class schedule (interactive)
- Membership options/pricing tiers
- Instructor profiles with certifications
- Free trial / intro offer (prominent CTA)
- Before/after transformation gallery
- Testimonials
- Location/facilities showcase
- Online booking for classes

**Sample Usage:**
```tsx
import { FitnessTemplate } from '@/lib/templates/fitness';

<FitnessTemplate
  business={businessData}
  generated={generatedContent}
  classes={classList}
  memberships={membershipPlans}
  instructors={instructorList}
/>
```

### 6. Tech/Startup Template (`tech.tsx`)
**Perfect for:** SaaS Companies, Software Development, IT Consulting, Web Agencies, Startups

**Key Features:**
- Product demo/screenshot showcase
- Features showcase with icons
- Pricing tiers comparison
- Team page with photos
- Blog/news section
- API documentation link
- GitHub/social links
- Technical specifications

**Sample Usage:**
```tsx
import { TechTemplate } from '@/lib/templates/tech';

<TechTemplate
  business={businessData}
  generated={generatedContent}
  features={featuresList}
  pricing={pricingPlans}
  team={teamMembers}
/>
```

## Template Selection System

### Automatic Template Selection

The system automatically selects the appropriate template based on business category:

```tsx
import { getTemplateForCategory } from '@/lib/templates';

const templateType = getTemplateForCategory('מסעדה'); // Returns 'restaurant'
const templateType = getTemplateForCategory('חדר כושר'); // Returns 'fitness'
```

### Manual Template Selection

```tsx
import { getTemplate } from '@/lib/templates';

const Template = getTemplate('beauty');
```

### Category Mapping

The system supports both Hebrew and English categories:

**Restaurant:** מסעדה, בית קפה, קפה, מזון, פיצה, המבורגר, סושי, מאפייה, בר
**Beauty:** יופי, מספרה, עיצוב שיער, ציפורניים, ספא, קוסמטיקה
**Fitness:** כושר, חדר כושר, יוגה, פילאטיס, אימון אישי, ספורט
**Retail:** חנות, בוטיק, אופנה, בגדים, נעליים, מתנות, תכשיטים
**Tech:** טכנולוגיה, הייטק, תוכנה, סטארטאפ, פיתוח, דיגיטל
**Professional:** משרד, עורך דין, רואה חשבון, ייעוץ, ביטוח, נדלן

## Common Interface

All templates share a common interface:

```tsx
interface TemplateProps {
  business: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  generated: GeneratedWebsite;
  // Template-specific props...
}
```

## Design Requirements

All templates follow these standards:

- ✅ Mobile-first responsive design
- ✅ Tailwind CSS for styling
- ✅ Dynamic color palettes
- ✅ Dynamic typography (Google Fonts)
- ✅ Load time < 2 seconds
- ✅ Lighthouse score 90+
- ✅ WCAG AA accessibility
- ✅ Hebrew and English support (RTL)
- ✅ Schema.org structured data for SEO

## Color System

Each template uses three colors from the AI-generated palette:

```tsx
const { colorPalette } = generated;
// colorPalette.primary - Main brand color
// colorPalette.secondary - Supporting color
// colorPalette.accent - Call-to-action color
```

## Typography System

Each template uses two fonts from the AI selection:

```tsx
const { typography } = generated;
// typography.heading - Display and headings
// typography.body - Body text and UI
```

## Testing

Sample data for all templates is available in `__test__/sample-data.ts`:

```tsx
import { sampleBusinesses, sampleGenerated, sampleTemplateData } from '@/lib/templates/__test__/sample-data';

// Get sample data for a specific template
const business = sampleBusinesses.restaurant;
const generated = sampleGenerated.restaurant;
const templateData = sampleTemplateData.restaurant;
```

## Template Preview Pages

Preview pages are available at:
- `/templates` - Overview of all templates
- `/templates/restaurant` - Restaurant template preview
- `/templates/beauty` - Beauty template preview
- `/templates/professional_services` - Professional services preview
- `/templates/retail` - Retail template preview
- `/templates/fitness` - Fitness template preview
- `/templates/tech` - Tech template preview

## Adding a New Template

1. Create the template component in `lib/templates/[name].tsx`
2. Add it to the TEMPLATES object in `lib/templates/index.ts`
3. Add metadata in TEMPLATE_METADATA
4. Add category mappings in `getTemplateForCategory()`
5. Create sample data in `__test__/sample-data.ts`
6. Add to generateStaticParams in `app/templates/[type]/page.tsx`

## File Structure

```
lib/templates/
├── restaurant.tsx          # Restaurant template
├── beauty.tsx              # Beauty/salon template
├── professional.tsx        # Professional services template
├── retail.tsx              # Retail store template
├── fitness.tsx             # Fitness/wellness template
├── tech.tsx                # Tech/startup template
├── index.ts                # Template registry and utilities
├── __test__/
│   └── sample-data.ts      # Sample data for all templates
└── README.md               # This file

app/templates/
├── page.tsx                # Templates overview page
└── [type]/
    └── page.tsx            # Dynamic template preview page
```

## Performance Optimization

All templates are optimized for performance:

1. **Code Splitting** - Each template is lazy-loaded
2. **Image Optimization** - Using Next.js Image component
3. **Font Loading** - Optimized font loading strategy
4. **CSS-in-JS** - Minimal runtime overhead with Tailwind
5. **Static Generation** - Pre-rendered at build time

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader optimization
- Color contrast compliance (WCAG AA)
- Focus indicators
- Alt text for images

## SEO Features

- Dynamic meta tags
- Open Graph tags
- Schema.org structured data
- Semantic HTML
- Mobile-friendly
- Fast loading times

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All templates are proprietary to TLV Business Pulse.
