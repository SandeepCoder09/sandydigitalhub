import { Partner } from '@/models/Partner';

export const FLAGSHIP_PARTNERS = [
  {
    partnerId: 'SDH-MAIN-01',
    branchCode: 'SDH-HQ',
    name: 'SARA Digital Hub (Main Branch - Fatehpur)',
    slug: 'sara-digital-hub-main',
    ownerName: 'Sandeep Kumar',
    ownerEmail: 'sandydigitalhub@gmail.com',
    ownerPhone: '+91 9118269278',
    whatsapp: '+91 9118269278',
    address: 'Near Head Post Office, Civil Lines',
    city: 'Fatehpur',
    state: 'Uttar Pradesh',
    pincode: '212601',
    country: 'India',
    plan: 'ENTERPRISE' as const,
    status: 'ACTIVE' as const,
    branding: {
      primaryColor: '#7C3AED',
      accentColor: '#4F46E5',
      tagline: 'Official SARA Digital Citizen Services Facilitation Center',
      description: 'Main flagship hub for Govt forms, certificates, pancard, passport, voter services & citizen facilitation.',
      businessHours: '8:30 AM - 8:00 PM',
    },
    commission: {
      model: 'PERCENTAGE' as const,
      partnerShare: 100,
      platformShare: 0,
    },
    whiteLabel: {
      attribution: 'STANDARD' as const,
      customDomainEnabled: false,
    },
  },
  {
    partnerId: 'SDS-TECH-01',
    branchCode: 'SDS-HQ',
    name: 'Sandy Digital Studio (Software & Tech Center)',
    slug: 'sandy-digital-studio-hq',
    ownerName: 'Sandeep Kumar',
    ownerEmail: 'contact@sandydigitalstudio.com',
    ownerPhone: '+91 9118269278',
    whatsapp: '+91 9118269278',
    address: 'Tech Innovation Park, Civil Lines',
    city: 'Fatehpur',
    state: 'Uttar Pradesh',
    pincode: '212601',
    country: 'India',
    plan: 'ENTERPRISE' as const,
    status: 'ACTIVE' as const,
    branding: {
      primaryColor: '#6366F1',
      accentColor: '#8B5CF6',
      tagline: 'Custom Web Applications, Software Engineering & Brand Design',
      description: 'Technology division building modern SaaS platforms, custom business websites, and digital workflows.',
      businessHours: '9:00 AM - 7:00 PM',
    },
    commission: {
      model: 'PERCENTAGE' as const,
      partnerShare: 100,
      platformShare: 0,
    },
    whiteLabel: {
      attribution: 'STANDARD' as const,
      customDomainEnabled: false,
    },
  },
];

/**
 * Ensures the 2 main flagship centers exist in MongoDB.
 */
export async function ensureFlagshipPartners() {
  try {
    for (const flagship of FLAGSHIP_PARTNERS) {
      const existing = await Partner.findOne({
        $or: [{ slug: flagship.slug }, { partnerId: flagship.partnerId }],
      });

      if (!existing) {
        await Partner.create(flagship);
      }
    }
  } catch (err) {
    console.error('Error ensuring flagship partners:', err);
  }
}
