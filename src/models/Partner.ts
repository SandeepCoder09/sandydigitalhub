import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPartnerAssignedService {
  serviceId: string;
  title: string;
  category: string;
  enabled: boolean;
  basePrice: number;
  customPrice?: number;
  customDescription?: string;
}

export interface IPartnerBranding {
  logoUrl?: string;
  faviconUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  accentColor: string;
  tagline?: string;
  description?: string;
  businessHours?: string;
}

export interface IPartnerCommission {
  model: 'PERCENTAGE' | 'FIXED' | 'CUSTOM';
  partnerShare: number; // e.g. 80 (%)
  platformShare: number; // e.g. 20 (%)
  fixedPlatformFee?: number; // e.g. ₹15 per request
}

export interface IPartnerWhiteLabel {
  attribution: 'STANDARD' | 'REDUCED' | 'NONE';
  customDomainEnabled: boolean;
  customDomain?: string;
}

export interface IPartnerOnboardingStep {
  step: string;
  title: string;
  completed: boolean;
}

export interface IPartner extends Document {
  partnerId: string; // Immutable, e.g. SARA-0001
  slug: string; // Unique URL slug, e.g. sharma-digital
  name: string; // Center business name
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  branding: IPartnerBranding;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  statusReason?: string;
  commission: IPartnerCommission;
  assignedServices: IPartnerAssignedService[];
  whiteLabel: IPartnerWhiteLabel;
  onboarding: IPartnerOnboardingStep[];
  totalOrdersCount: number;
  totalRevenue: number;
  partnerEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    partnerId: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '' },
    branding: {
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
      bannerUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#7C3AED' },
      accentColor: { type: String, default: '#6D28D9' },
      tagline: { type: String, default: 'Your Trusted Local Digital Service Center' },
      description: { type: String, default: 'We provide authorized online applications, government forms, document processing, and digital facilitation services.' },
      businessHours: { type: String, default: 'Mon – Sat: 9:00 AM – 8:00 PM' },
    },
    plan: {
      type: String,
      enum: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
      default: 'STARTER',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    statusReason: { type: String, default: '' },
    commission: {
      model: { type: String, enum: ['PERCENTAGE', 'FIXED', 'CUSTOM'], default: 'PERCENTAGE' },
      partnerShare: { type: Number, default: 80 },
      platformShare: { type: Number, default: 20 },
      fixedPlatformFee: { type: Number, default: 0 },
    },
    assignedServices: [
      {
        serviceId: { type: String, required: true },
        title: { type: String, required: true },
        category: { type: String, default: 'Digital Services' },
        enabled: { type: Boolean, default: true },
        basePrice: { type: Number, required: true },
        customPrice: { type: Number },
        customDescription: { type: String },
      },
    ],
    whiteLabel: {
      attribution: { type: String, enum: ['STANDARD', 'REDUCED', 'NONE'], default: 'STANDARD' },
      customDomainEnabled: { type: Boolean, default: false },
      customDomain: { type: String, default: '' },
    },
    onboarding: [
      {
        step: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    totalOrdersCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    partnerEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Partner: Model<IPartner> = mongoose.models.Partner || mongoose.model<IPartner>('Partner', partnerSchema);
