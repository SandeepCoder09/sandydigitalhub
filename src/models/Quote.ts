import mongoose, { Document, Model, Schema } from 'mongoose';

export type QuoteStatus = 'DRAFT' | 'SAVED' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'DECLINED';

export interface IQuoteItem {
  id: string;
  category: string;
  name: string;
  price: number;
  description?: string;
}

export interface IQuote extends Document {
  quoteNumber: string; // e.g. SDS-2026-00124
  customerId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectType: string; // e.g. 'Business Website', 'Fullstack Web App', 'Mobile App', 'UI/UX Design'
  scope: string; // e.g. 'Standard', 'Advanced', 'Enterprise'
  timelineWeeks: number;
  selectedItems: IQuoteItem[];
  basePrice: number;
  addOnsPrice: number;
  estimatedSubtotal: number;
  taxRate: number; // e.g. 18 (%)
  taxAmount: number;
  estimatedTotal: number;
  currency: string; // 'INR'
  notes?: string;
  status: QuoteStatus;
  leadAssignedTo?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    quoteNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    companyName: { type: String },
    projectType: { type: String, required: true },
    scope: { type: String, default: 'Standard' },
    timelineWeeks: { type: Number, default: 2 },
    selectedItems: [
      {
        id: { type: String, required: true },
        category: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
      },
    ],
    basePrice: { type: Number, required: true },
    addOnsPrice: { type: Number, default: 0 },
    estimatedSubtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    estimatedTotal: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    notes: { type: String },
    status: {
      type: String,
      enum: ['DRAFT', 'SAVED', 'SENT', 'ACCEPTED', 'EXPIRED', 'DECLINED'],
      default: 'SAVED',
    },
    leadAssignedTo: { type: String },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
    },
  },
  { timestamps: true }
);

quoteSchema.index({ quoteNumber: 1 });
quoteSchema.index({ email: 1 });
quoteSchema.index({ status: 1, createdAt: -1 });

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>('Quote', quoteSchema);
