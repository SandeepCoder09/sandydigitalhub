import mongoose, { Document, Model, Schema } from 'mongoose';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FEATURED';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  requestId?: mongoose.Types.ObjectId; // Linked order/request ID
  requestNumber?: string; // e.g. SDH-20260821-F4A8
  partnerId?: mongoose.Types.ObjectId; // If fulfilled by a partner
  serviceId?: mongoose.Types.ObjectId;
  serviceCategory: string;
  division: 'SARA_HUB' | 'SANDY_STUDIO' | 'PARTNER_CENTER';
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  verifiedOrder: boolean;
  status: ReviewStatus;
  isApproved: boolean; // Backward compatibility
  featuredInHomepage: boolean;
  verifiedAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String },
    requestId: { type: Schema.Types.ObjectId, ref: 'Order' },
    requestNumber: { type: String },
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner' },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
    serviceCategory: { type: String, required: true, default: 'General Digital Service' },
    division: { type: String, enum: ['SARA_HUB', 'SANDY_STUDIO', 'PARTNER_CENTER'], default: 'SARA_HUB' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    verifiedOrder: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'FEATURED'],
      default: 'APPROVED', // verified submissions default to approved
    },
    isApproved: { type: Boolean, default: true },
    featuredInHomepage: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for fast lookup
reviewSchema.index({ status: 1, publishedAt: -1 });
reviewSchema.index({ division: 1, status: 1 });
reviewSchema.index({ serviceCategory: 1, status: 1, publishedAt: -1 });
reviewSchema.index({ customerId: 1, createdAt: -1 });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
