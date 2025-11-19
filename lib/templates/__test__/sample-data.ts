import { GeneratedWebsite, BusinessData } from '../../ai/generate';

/**
 * Sample business data for testing templates
 */
export const sampleBusinesses: Record<string, BusinessData> = {
  restaurant: {
    name: "Falafel King",
    category: "מסעדה",
    address: "123 Dizengoff St, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2024-01-15",
    phone: "03-555-1234",
    email: "info@falafelking.com",
    description: "Authentic Middle Eastern cuisine in the heart of Tel Aviv",
    employees: 15,
    seating_capacity: 60,
  },
  beauty: {
    name: "Luxe Beauty Studio",
    category: "מספרה",
    address: "45 Rothschild Blvd, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2024-02-01",
    phone: "03-555-2345",
    email: "hello@luxebeauty.com",
    description: "Premium beauty and hair salon",
    employees: 8,
  },
  professional: {
    name: "Cohen & Partners Law Firm",
    category: "עורך דין",
    address: "78 HaYarkon St, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2023-05-10",
    phone: "03-555-3456",
    email: "contact@cohenlaw.com",
    description: "Experienced legal professionals serving Tel Aviv",
    employees: 20,
  },
  retail: {
    name: "Urban Threads",
    category: "חנות בגדים",
    address: "56 Sheinkin St, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2024-03-15",
    phone: "03-555-4567",
    email: "shop@urbanthreads.com",
    description: "Contemporary fashion boutique",
    employees: 6,
  },
  fitness: {
    name: "PowerFit Gym",
    category: "חדר כושר",
    address: "90 Ibn Gabirol St, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2023-09-01",
    phone: "03-555-5678",
    email: "info@powerfit.com",
    description: "State-of-the-art fitness center",
    employees: 12,
  },
  tech: {
    name: "CloudScale Solutions",
    category: "תוכנה",
    address: "12 Yigal Alon St, Tel Aviv",
    city: "Tel Aviv",
    registration_date: "2023-01-01",
    phone: "03-555-6789",
    email: "hello@cloudscale.io",
    description: "Cloud infrastructure automation platform",
    employees: 25,
  },
};

/**
 * Sample generated website content for each template
 */
export const sampleGenerated: Record<string, GeneratedWebsite> = {
  restaurant: {
    heroTitle: "Authentic Falafel & Mediterranean Delights",
    heroSubtitle: "Fresh, homemade flavors from the heart of the Middle East",
    aboutContent: `Since 2024, Falafel King has been serving the finest authentic Middle Eastern cuisine to Tel Aviv locals and visitors alike. Our secret lies in traditional recipes passed down through generations, combined with the freshest local ingredients.

Every dish is prepared with love and attention to detail. From our crispy falafel to our creamy hummus, each bite tells a story of culinary tradition and passion. We believe that great food brings people together, and our warm atmosphere reflects the spirit of Middle Eastern hospitality.

Visit us today and experience the authentic taste that has made us a favorite among Tel Aviv's food lovers.`,
    services: [
      {
        name: "Classic Falafel Plate",
        description: "Six crispy falafel balls with tahini, hummus, and fresh salad",
        price: "₪42",
      },
      {
        name: "Shawarma Plate",
        description: "Tender chicken or lamb shawarma with sides",
        price: "₪58",
      },
      {
        name: "Mezze Platter",
        description: "Selection of traditional dips and appetizers",
        price: "₪65",
      },
    ],
    seoTitle: "Falafel King - Authentic Middle Eastern Food in Tel Aviv",
    seoDescription: "Best falafel and shawarma in Tel Aviv. Fresh, authentic Middle Eastern cuisine on Dizengoff St.",
    keywords: ["falafel", "Tel Aviv", "Middle Eastern food", "shawarma", "hummus", "kosher"],
    colorPalette: {
      primary: "#d97706",
      secondary: "#059669",
      accent: "#dc2626",
    },
    typography: {
      heading: "Playfair Display",
      body: "Inter",
    },
    logoPrompt: "Modern Middle Eastern restaurant logo with falafel icon",
    templateType: "restaurant",
  },

  beauty: {
    heroTitle: "Where Beauty Meets Artistry",
    heroSubtitle: "Premium beauty treatments in the heart of Tel Aviv",
    aboutContent: `Luxe Beauty Studio is Tel Aviv's premier destination for beauty and wellness. Our team of expert stylists and beauticians are dedicated to helping you look and feel your absolute best.

We use only the finest professional products and the latest techniques to deliver exceptional results. Whether you're looking for a fresh new hairstyle, a relaxing spa treatment, or a complete makeover, our talented team is here to make your beauty dreams a reality.

Step into our elegant studio and experience the luxury you deserve. Your transformation starts here.`,
    services: [
      {
        name: "Haircut & Styling",
        description: "Professional cut and style by expert stylists",
        price: "₪180-280",
      },
      {
        name: "Hair Coloring",
        description: "Full color, highlights, or balayage",
        price: "₪350-650",
      },
      {
        name: "Manicure & Pedicure",
        description: "Complete nail care and polish",
        price: "₪120-180",
      },
    ],
    seoTitle: "Luxe Beauty Studio - Premium Hair & Beauty Salon Tel Aviv",
    seoDescription: "Expert hair styling, coloring, and beauty treatments on Rothschild Blvd. Book your appointment today.",
    keywords: ["hair salon", "Tel Aviv", "beauty treatments", "hair coloring", "manicure"],
    colorPalette: {
      primary: "#be185d",
      secondary: "#7c3aed",
      accent: "#f59e0b",
    },
    typography: {
      heading: "Cormorant Garamond",
      body: "Montserrat",
    },
    logoPrompt: "Elegant beauty salon logo with flowing hair design",
    templateType: "beauty",
  },

  professional: {
    heroTitle: "Expert Legal Counsel You Can Trust",
    heroSubtitle: "Protecting your interests with experience and integrity",
    aboutContent: `Cohen & Partners has been providing exceptional legal services to individuals and businesses throughout Tel Aviv for over a decade. Our team of experienced attorneys specializes in corporate law, real estate, and civil litigation.

We pride ourselves on delivering personalized attention and strategic solutions tailored to each client's unique needs. Our commitment to excellence and ethical practice has earned us the trust of hundreds of clients and a reputation as one of Tel Aviv's leading law firms.

Let us put our expertise to work for you. Schedule a consultation today to discuss how we can help protect your legal interests.`,
    services: [
      {
        name: "Corporate Law",
        description: "Business formation, contracts, and corporate governance",
        price: "From ₪1,500/hour",
      },
      {
        name: "Real Estate Law",
        description: "Property transactions, leases, and disputes",
        price: "From ₪1,500/hour",
      },
      {
        name: "Civil Litigation",
        description: "Court representation and dispute resolution",
        price: "Custom pricing",
      },
    ],
    seoTitle: "Cohen & Partners Law Firm - Expert Attorneys in Tel Aviv",
    seoDescription: "Experienced legal counsel for corporate, real estate, and civil matters. Trusted Tel Aviv law firm.",
    keywords: ["law firm", "Tel Aviv", "attorney", "corporate law", "real estate law"],
    colorPalette: {
      primary: "#1e40af",
      secondary: "#475569",
      accent: "#0891b2",
    },
    typography: {
      heading: "Merriweather",
      body: "Open Sans",
    },
    logoPrompt: "Professional law firm logo with scales of justice",
    templateType: "professional_services",
  },

  retail: {
    heroTitle: "Fashion Forward, Always",
    heroSubtitle: "Curated contemporary clothing for the modern you",
    aboutContent: `Urban Threads brings you the latest in contemporary fashion, carefully curated from emerging designers and established brands. Located in the trendy Sheinkin neighborhood, our boutique offers a unique shopping experience.

We believe that fashion is personal expression. That's why we handpick each item in our collection to ensure quality, style, and versatility. From everyday essentials to statement pieces, we have everything you need to build a wardrobe that reflects your unique style.

Visit our store and discover your next favorite outfit. Our friendly staff is always ready to help you find the perfect look.`,
    services: [
      {
        name: "Women's Apparel",
        description: "Dresses, tops, bottoms, and outerwear",
      },
      {
        name: "Men's Collection",
        description: "Contemporary menswear essentials",
      },
      {
        name: "Accessories",
        description: "Bags, jewelry, and fashion accessories",
      },
    ],
    seoTitle: "Urban Threads - Contemporary Fashion Boutique Tel Aviv",
    seoDescription: "Shop curated contemporary clothing and accessories on Sheinkin St. Latest fashion trends in Tel Aviv.",
    keywords: ["fashion", "Tel Aviv", "boutique", "clothing store", "contemporary fashion"],
    colorPalette: {
      primary: "#dc2626",
      secondary: "#0f172a",
      accent: "#f59e0b",
    },
    typography: {
      heading: "Bebas Neue",
      body: "Raleway",
    },
    logoPrompt: "Modern fashion boutique logo with geometric design",
    templateType: "retail",
  },

  fitness: {
    heroTitle: "TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE",
    heroSubtitle: "Join Tel Aviv's premier fitness community",
    aboutContent: `PowerFit Gym is more than just a place to work out—it's a community dedicated to helping you achieve your fitness goals. With state-of-the-art equipment, expert trainers, and a motivating atmosphere, we provide everything you need to succeed.

Whether you're a beginner taking your first steps toward fitness or an experienced athlete looking to push your limits, our diverse class offerings and personalized training programs are designed to meet you where you are and help you reach new heights.

Your transformation starts today. Join the PowerFit family and discover what you're truly capable of achieving.`,
    services: [
      {
        name: "Unlimited Gym Access",
        description: "Full access to all equipment and facilities",
      },
      {
        name: "Group Fitness Classes",
        description: "30+ classes per week including yoga, HIIT, and more",
      },
      {
        name: "Personal Training",
        description: "One-on-one sessions with certified trainers",
      },
    ],
    seoTitle: "PowerFit Gym - Premier Fitness Center in Tel Aviv",
    seoDescription: "State-of-the-art gym with expert trainers and group classes. Start your free trial today!",
    keywords: ["gym", "Tel Aviv", "fitness", "personal training", "group classes"],
    colorPalette: {
      primary: "#ea580c",
      secondary: "#1e293b",
      accent: "#f59e0b",
    },
    typography: {
      heading: "Oswald",
      body: "Roboto",
    },
    logoPrompt: "Bold fitness gym logo with dynamic energy design",
    templateType: "fitness",
  },

  tech: {
    heroTitle: "Cloud Infrastructure, Simplified",
    heroSubtitle: "Automate, scale, and optimize your cloud operations",
    aboutContent: `CloudScale Solutions empowers businesses to harness the full potential of cloud infrastructure through intelligent automation. Our platform eliminates complexity, reduces costs, and accelerates deployment—so you can focus on building great products.

Trusted by startups and enterprises alike, CloudScale provides the tools and insights you need to manage multi-cloud environments with confidence. From automated scaling to cost optimization, we've got you covered.

Join thousands of developers and DevOps teams who are already transforming their cloud operations with CloudScale. Start your free trial today and experience the difference.`,
    services: [
      {
        name: "Infrastructure Automation",
        description: "Automated provisioning and management across cloud providers",
      },
      {
        name: "Cost Optimization",
        description: "AI-powered recommendations to reduce cloud spending",
      },
      {
        name: "Security & Compliance",
        description: "Built-in security controls and compliance monitoring",
      },
    ],
    seoTitle: "CloudScale - Cloud Infrastructure Automation Platform",
    seoDescription: "Simplify cloud operations with intelligent automation. Trusted by thousands of DevOps teams.",
    keywords: ["cloud", "DevOps", "automation", "infrastructure", "SaaS", "Tel Aviv"],
    colorPalette: {
      primary: "#3b82f6",
      secondary: "#6366f1",
      accent: "#06b6d4",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    logoPrompt: "Modern tech company logo with cloud and automation elements",
    templateType: "tech",
  },
};

/**
 * Template-specific sample data
 */
export const sampleTemplateData = {
  restaurant: {
    menu: [
      {
        name: "Classic Falafel Pita",
        description: "Crispy falafel balls in fresh pita with tahini and salad",
        price: "₪32",
        category: "main",
      },
      {
        name: "Hummus Plate",
        description: "Creamy hummus with olive oil, served with warm pita",
        price: "₪28",
        category: "appetizer",
      },
      {
        name: "Shawarma Plate",
        description: "Tender chicken shawarma with rice and salad",
        price: "₪55",
        category: "main",
      },
      {
        name: "Baklava",
        description: "Sweet pastry with nuts and honey",
        price: "₪18",
        category: "dessert",
      },
      {
        name: "Fresh Mint Lemonade",
        description: "House-made lemonade with fresh mint",
        price: "₪15",
        category: "beverage",
      },
    ],
  },

  beauty: {
    services: [
      {
        name: "Signature Haircut",
        description: "Expert cut tailored to your face shape and style preferences",
        duration: "45 min",
        price: "₪220",
      },
      {
        name: "Balayage",
        description: "Hand-painted highlights for a natural, sun-kissed look",
        duration: "3 hours",
        price: "₪550",
      },
      {
        name: "Keratin Treatment",
        description: "Smoothing treatment for frizz-free, shiny hair",
        duration: "2.5 hours",
        price: "₪450",
      },
      {
        name: "Gel Manicure",
        description: "Long-lasting gel polish with nail shaping",
        duration: "60 min",
        price: "₪120",
      },
      {
        name: "Facial Treatment",
        description: "Deep cleansing and hydrating facial",
        duration: "60 min",
        price: "₪280",
      },
    ],
    staff: [
      {
        name: "Maya Cohen",
        role: "Senior Stylist",
        specialties: ["Balayage", "Color Correction", "Bridal"],
      },
      {
        name: "David Levi",
        role: "Master Stylist",
        specialties: ["Men's Cuts", "Styling", "Extensions"],
      },
      {
        name: "Sarah Ben-David",
        role: "Nail Technician",
        specialties: ["Gel", "Acrylic", "Nail Art"],
      },
    ],
  },

  professional: {
    services: [
      {
        name: "Business Formation",
        description: "Complete support for establishing new companies, from registration to governance structure",
        price: "From ₪5,000",
      },
      {
        name: "Contract Review",
        description: "Thorough review and negotiation of business agreements",
        price: "From ₪2,500",
      },
      {
        name: "Real Estate Transactions",
        description: "Full legal support for property purchases and sales",
        price: "From ₪8,000",
      },
      {
        name: "Employment Law",
        description: "Contracts, disputes, and compliance matters",
        price: "Hourly Rate",
      },
    ],
    team: [
      {
        name: "Adv. David Cohen",
        title: "Managing Partner",
        credentials: ["LL.M., Tel Aviv University", "20+ years experience", "Real Estate Specialist"],
        bio: "David specializes in corporate and real estate law with extensive experience in complex transactions.",
      },
      {
        name: "Adv. Rachel Goldstein",
        title: "Senior Partner",
        credentials: ["LL.B., Hebrew University", "15+ years experience", "Litigation Expert"],
        bio: "Rachel leads our litigation practice with a track record of successful outcomes in civil disputes.",
      },
      {
        name: "Adv. Yossi Levi",
        title: "Associate",
        credentials: ["LL.B., IDC Herzliya", "8+ years experience", "Corporate Law"],
        bio: "Yossi focuses on corporate governance and business formation for startups and SMEs.",
      },
    ],
    caseStudies: [
      {
        title: "Tech Startup Acquisition",
        challenge: "Client needed guidance on complex M&A transaction",
        solution: "Provided comprehensive due diligence and negotiation support",
        results: "Successful $15M acquisition completed in 4 months",
      },
    ],
  },

  retail: {
    products: [
      {
        name: "Linen Summer Dress",
        description: "Breezy linen dress perfect for Tel Aviv summers",
        price: "₪380",
        category: "Dresses",
        featured: true,
      },
      {
        name: "Classic White Tee",
        description: "Premium cotton essential t-shirt",
        price: "₪120",
        category: "Tops",
        featured: true,
      },
      {
        name: "High-Waist Jeans",
        description: "Comfortable stretch denim",
        price: "₪420",
        category: "Bottoms",
        featured: true,
      },
      {
        name: "Silk Blouse",
        description: "Elegant silk blouse for any occasion",
        price: "₪450",
        category: "Tops",
      },
      {
        name: "Leather Crossbody Bag",
        description: "Genuine leather mini bag",
        price: "₪350",
        category: "Accessories",
      },
    ],
    categories: ["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories"],
  },

  fitness: {
    classes: [
      {
        name: "HIIT Bootcamp",
        description: "High-intensity interval training for maximum calorie burn and strength building",
        instructor: "Coach Mike",
        duration: "45 min",
        level: "Intermediate",
      },
      {
        name: "Power Yoga",
        description: "Dynamic flow combining strength, flexibility, and mindfulness",
        instructor: "Yael S.",
        duration: "60 min",
        level: "All Levels",
      },
      {
        name: "Spin Class",
        description: "Energetic indoor cycling with heart-pumping music",
        instructor: "Dana K.",
        duration: "45 min",
        level: "All Levels",
      },
      {
        name: "CrossFit",
        description: "Functional fitness with varied workouts daily",
        instructor: "Coach Avi",
        duration: "60 min",
        level: "Advanced",
      },
    ],
    memberships: [
      {
        name: "Basic",
        price: "₪250",
        features: [
          "Gym access 24/7",
          "Locker room & showers",
          "Free fitness assessment",
        ],
      },
      {
        name: "Premium",
        price: "₪450",
        popular: true,
        features: [
          "Everything in Basic",
          "Unlimited group classes",
          "Guest passes (2/month)",
          "Nutrition consultation",
        ],
      },
      {
        name: "Elite",
        price: "₪750",
        features: [
          "Everything in Premium",
          "4 personal training sessions/month",
          "Massage therapy (2/month)",
          "Priority class booking",
        ],
      },
    ],
    instructors: [
      {
        name: "Mike Richardson",
        specialty: "HIIT & Strength Training",
        certifications: ["NASM-CPT", "CrossFit L2"],
      },
      {
        name: "Yael Shalom",
        specialty: "Yoga & Pilates",
        certifications: ["RYT-500", "Pilates Mat"],
      },
      {
        name: "Avi Ben-Ami",
        specialty: "CrossFit & Olympic Lifting",
        certifications: ["CrossFit L3", "USAW"],
      },
    ],
  },

  tech: {
    features: [
      {
        name: "Multi-Cloud Support",
        description: "Seamlessly manage AWS, Azure, and GCP from a single platform",
        icon: "☁️",
      },
      {
        name: "Auto-Scaling",
        description: "Intelligent scaling based on real-time metrics and predictions",
        icon: "📊",
      },
      {
        name: "Cost Analytics",
        description: "Deep insights into cloud spending with optimization recommendations",
        icon: "💰",
      },
      {
        name: "Security First",
        description: "Built-in security controls and compliance monitoring",
        icon: "🔒",
      },
      {
        name: "API-First",
        description: "Comprehensive REST API for custom integrations",
        icon: "🔌",
      },
      {
        name: "Real-Time Monitoring",
        description: "Live dashboards with alerts and incident management",
        icon: "📡",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$49",
        period: "month",
        features: [
          "Up to 10 servers",
          "Basic monitoring",
          "Email support",
          "API access",
        ],
      },
      {
        name: "Professional",
        price: "$199",
        period: "month",
        highlighted: true,
        features: [
          "Up to 100 servers",
          "Advanced monitoring",
          "Priority support",
          "Custom integrations",
          "Cost optimization",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "contact us",
        features: [
          "Unlimited servers",
          "Dedicated support",
          "SLA guarantee",
          "On-premise option",
          "Custom features",
        ],
      },
    ],
    team: [
      {
        name: "Alex Chen",
        role: "CEO & Co-founder",
        bio: "Former AWS engineer with 15+ years in cloud infrastructure",
      },
      {
        name: "Sarah Martinez",
        role: "CTO & Co-founder",
        bio: "Led DevOps at multiple unicorn startups",
      },
      {
        name: "David Park",
        role: "VP Engineering",
        bio: "Built scalable systems serving millions of users",
      },
    ],
  },
};
