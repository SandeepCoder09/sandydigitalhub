/**
 * Standard Centralized Pricing Catalog
 * Single source of truth for base packages, add-ons, and pricing rules.
 */

export interface PricingPackage {
  id: string;
  category: 'WEBSITE' | 'WEB_APP' | 'MOBILE_APP' | 'UIUX' | 'CUSTOM_SOFTWARE';
  name: string;
  tagline: string;
  basePrice: number;
  currency: string;
  timelineWeeks: number;
  features: string[];
  popular?: boolean;
  division: 'SANDY_STUDIO';
}

export interface PricingAddOn {
  id: string;
  category: 'FEATURE' | 'INTEGRATION' | 'MARKETING' | 'SUPPORT';
  name: string;
  price: number;
  description: string;
  popular?: boolean;
}

export const DEFAULT_STUDIO_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-business-website',
    category: 'WEBSITE',
    name: 'Modern Business Website',
    tagline: 'High-performance, responsive 5-page website with SEO & contact forms',
    basePrice: 7999,
    currency: 'INR',
    timelineWeeks: 1,
    popular: true,
    division: 'SANDY_STUDIO',
    features: [
      'Up to 5 Custom Pages',
      'Mobile-First Responsive Layout',
      'Ultra-Fast Loading & Modern CSS',
      'Contact & Lead Capture Forms',
      'Basic On-Page SEO Optimization',
      'Social Media & WhatsApp Integration',
      '1 Month Post-Launch Support',
    ],
  },
  {
    id: 'pkg-fullstack-webapp',
    category: 'WEB_APP',
    name: 'Fullstack Web Application',
    tagline: 'Custom web app with authentication, database, and admin dashboard',
    basePrice: 18999,
    currency: 'INR',
    timelineWeeks: 3,
    popular: true,
    division: 'SANDY_STUDIO',
    features: [
      'Next.js / Node.js Fullstack Architecture',
      'Secure User Authentication (OAuth / JWT)',
      'Database Modeling & CRUD APIs',
      'Dedicated Admin Management Dashboard',
      'Payment Gateway Integration (Razorpay/Stripe)',
      'Automated Email & Notification Alerts',
      '3 Months Technical Support',
    ],
  },
  {
    id: 'pkg-mobile-app',
    category: 'MOBILE_APP',
    name: 'Cross-Platform Mobile App',
    tagline: 'iOS and Android application built with Flutter or React Native',
    basePrice: 28999,
    currency: 'INR',
    timelineWeeks: 4,
    division: 'SANDY_STUDIO',
    features: [
      'Single Codebase for Android & iOS',
      'Native Device Hardware Interop (Camera, GPS)',
      'Push Notifications & Offline Caching',
      'Secure Backend API Connectivity',
      'App Store & Play Store Deployment Assistance',
      'Analytics & Crash Reporting Integration',
    ],
  },
  {
    id: 'pkg-uiux-design',
    category: 'UIUX',
    name: 'UI/UX Design & Prototyping',
    tagline: 'Figma interactive prototypes, design system, and user journey mapping',
    basePrice: 6499,
    currency: 'INR',
    timelineWeeks: 1,
    division: 'SANDY_STUDIO',
    features: [
      'Complete Figma Component Library',
      'Wireframing & User Journey Flows',
      'Interactive Clickable Prototypes',
      'Light & Dark Mode Tokens',
      'Developer-Ready Hand-off Specifications',
    ],
  },
];

export const DEFAULT_STUDIO_ADDONS: PricingAddOn[] = [
  {
    id: 'addon-seo-advanced',
    category: 'MARKETING',
    name: 'Advanced SEO & Schema Setup',
    price: 1500,
    description: 'Structured JSON-LD schema, sitemap generation, Google Search Console & Analytics 4 setup.',
    popular: true,
  },
  {
    id: 'addon-payment-gateway',
    category: 'INTEGRATION',
    name: 'Payment Gateway Integration',
    price: 2500,
    description: 'Automated payment collection with webhook verification, receipts, and order statuses.',
    popular: true,
  },
  {
    id: 'addon-live-chat',
    category: 'FEATURE',
    name: 'AI / Live Chat Widget',
    price: 1800,
    description: 'Custom chat widget integrated with real-time agent or AI conversational response system.',
  },
  {
    id: 'addon-multi-lang',
    category: 'FEATURE',
    name: 'Multi-Language Support (i18n)',
    price: 2000,
    description: 'Full bilingual/multilingual localization setup with dynamic language toggle.',
  },
  {
    id: 'addon-fast-track',
    category: 'SUPPORT',
    name: 'Priority Fast-Track Delivery',
    price: 3500,
    description: 'Expedited sprint delivery cutting project timeline by up to 40%.',
  },
];
