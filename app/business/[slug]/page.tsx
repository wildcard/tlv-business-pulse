import React from 'react';
import { RestaurantTemplate } from '@/lib/templates/restaurant';
import { notFound } from 'next/navigation';

// Demo data for example businesses
const demoBusinessData: Record<string, any> = {
  'sabich-king': {
    business: {
      name: 'Sabich King',
      address: '23 Herzl Street, Florentin, Tel Aviv',
      phone: '03-525-1234',
      email: 'hello@sabichking.com',
      category: 'Fast Food Restaurant',
    },
    generated: {
      heroTitle: '🌯 Florentin\'s Freshest Sabich',
      heroSubtitle: 'Authentic Israeli Street Food Made Fresh Daily',
      aboutContent: `Welcome to Sabich King, Florentin's newest fast food destination!

Located in the heart of one of Tel Aviv's most vibrant neighborhoods, we're bringing authentic Israeli street food to the community. Our specialty is sabich - that perfect combination of fried eggplant, hard-boiled eggs, Israeli salad, and tahini in fresh pita bread.

What makes us special? Fresh ingredients daily, family recipes passed down through generations, and a commitment to vegetarian excellence. Whether you're a Florentin local or exploring the area, stop by for a taste of real Tel Aviv. Every sabich is made to order, ensuring you get the freshest, most delicious meal possible.

We believe in quality over speed, tradition over trends, and creating an experience that brings you back day after day. Come taste the difference!`,
      services: [],
      seoTitle: 'Sabich King - Authentic Israeli Street Food in Florentin, Tel Aviv',
      seoDescription: 'Fresh sabich, falafel & Israeli street food in Florentin. Vegetarian options, fast service, authentic recipes. Open daily 11am-11pm.',
      keywords: [
        'sabich tel aviv',
        'florentin restaurants',
        'israeli street food',
        'vegetarian fast food',
        'sabich king',
        'tel aviv food',
        'authentic sabich',
      ],
      colorPalette: {
        primary: '#FFB800',
        secondary: '#4A90E2',
        accent: '#2ECC71',
      },
      typography: {
        heading: 'Montserrat',
        body: 'Open Sans',
      },
      logoPrompt:
        'Modern logo for Sabich King, featuring a crown made of pita bread and vegetables, golden and green colors, clean design',
      templateType: 'restaurant',
    },
    menu: [
      {
        name: 'Classic Sabich',
        description:
          'Our signature dish! Perfectly fried eggplant, hard-boiled egg, fresh Israeli salad, tahini sauce, and amba in warm pita. A Tel Aviv classic done right.',
        price: '₪28',
        category: 'main',
      },
      {
        name: 'Sabich Royal',
        description:
          'The ultimate sabich experience. Double egg, hummus, extra amba, spicy sauce, and all the classic fixings. For the serious sabich lover.',
        price: '₪35',
        category: 'main',
      },
      {
        name: 'Falafel Plate',
        description:
          '6 crispy falafel balls served with fresh Israeli salad, tahini, hummus, pickles, and warm pita. Vegetarian perfection.',
        price: '₪32',
        category: 'main',
      },
      {
        name: 'Hummus Bowl',
        description:
          'Creamy authentic hummus topped with chickpeas, olive oil, and paprika. Served with fresh pita bread.',
        price: '₪26',
        category: 'appetizer',
      },
      {
        name: 'Israeli Salad Bowl',
        description:
          'Fresh tomatoes, cucumbers, onions, and peppers chopped daily. Tossed in olive oil and lemon. Add tahini or falafel!',
        price: '₪24',
        category: 'appetizer',
      },
      {
        name: 'French Fries',
        description:
          'Crispy golden fries seasoned to perfection. Perfect side dish or snack.',
        price: '₪15',
        category: 'appetizer',
      },
      {
        name: 'Baklava',
        description:
          'Sweet, flaky pastry layered with nuts and honey. The perfect ending to your meal.',
        price: '₪12',
        category: 'dessert',
      },
      {
        name: 'Fresh Lemonade',
        description:
          'Freshly squeezed lemonade with mint. Refreshing and perfect for Tel Aviv weather.',
        price: '₪12',
        category: 'beverage',
      },
      {
        name: 'Iced Tea',
        description: 'House-brewed iced tea with lemon. Served cold over ice.',
        price: '₪10',
        category: 'beverage',
      },
      {
        name: 'Turkish Coffee',
        description:
          'Strong, aromatic coffee prepared the traditional way. A perfect pick-me-up.',
        price: '₪8',
        category: 'beverage',
      },
    ],
  },
};

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const data = demoBusinessData[params.slug];

  if (!data) {
    return {
      title: 'Business Not Found',
    };
  }

  return {
    title: data.generated.seoTitle,
    description: data.generated.seoDescription,
    keywords: data.generated.keywords,
  };
}

export default function BusinessPage({ params }: PageProps) {
  const data = demoBusinessData[params.slug];

  if (!data) {
    notFound();
  }

  // Render appropriate template based on business type
  if (data.generated.templateType === 'restaurant') {
    return (
      <RestaurantTemplate
        business={data.business}
        generated={data.generated}
        menu={data.menu}
      />
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{data.business.name}</h1>
        <p className="text-gray-600">
          Website template for {data.business.category} coming soon!
        </p>
      </div>
    </div>
  );
}

// Generate static paths for demo businesses
export async function generateStaticParams() {
  return Object.keys(demoBusinessData).map((slug) => ({
    slug,
  }));
}
