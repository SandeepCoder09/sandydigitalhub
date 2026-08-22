import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPricingItem {
  itemId: string; // e.g. 'pkg-starter-web'
  division: 'SARA_HUB' | 'SANDY_STUDIO';
  category: string; // e.g. 'WEBSITE', 'APP', 'DOCUMENT', 'RESUME', 'PAN'
  name: string;
  description: string;
  basePrice: number;
  currency: string; // 'INR'
  pricingType: 'FLAT' | 'STARTING_AT' | 'CUSTOM' | 'HOURLY' | 'ADD_ON';
  features: string[];
  popular?: boolean;
  isActive: boolean;
  discountPercentage?: number;
  effectiveFrom: Date;
}

export interface IPricingConfig extends Document {
  version: number;
  taxRatePercentage: number; // e.g. 18
  taxMode: 'INCLUSIVE' | 'EXCLUSIVE';
  partnerBasePlatformFee: number; // e.g. 15
  items: IPricingItem[];
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pricingItemSchema = new Schema<IPricingItem>({
  itemId: { type: String, required: true },
  division: { type: String, enum: ['SARA_HUB', 'SANDY_STUDIO'], required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  basePrice: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  pricingType: {
    type: String,
    enum: ['FLAT', 'STARTING_AT', 'CUSTOM', 'HOURLY', 'ADD_ON'],
    default: 'FLAT',
  },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  discountPercentage: { type: Number, default: 0 },
  effectiveFrom: { type: Date, default: Date.now },
});

const pricingConfigSchema = new Schema<IPricingConfig>(
  {
    version: { type: Number, default: 1, unique: true },
    taxRatePercentage: { type: Number, default: 0 },
    taxMode: { type: String, enum: ['INCLUSIVE', 'EXCLUSIVE'], default: 'INCLUSIVE' },
    partnerBasePlatformFee: { type: Number, default: 15 },
    items: [pricingItemSchema],
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const PricingConfig: Model<IPricingConfig> =
  mongoose.models.PricingConfig ||
  mongoose.model<IPricingConfig>('PricingConfig', pricingConfigSchema);
