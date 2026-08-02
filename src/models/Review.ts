import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  phone?: string;
  serviceCategory: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedOrder?: boolean;
  isApproved: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  phone: { type: String },
  serviceCategory: { type: String, required: true, default: 'Jan Seva / General' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verifiedOrder: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }, // auto-approve by default
  createdAt: { type: Date, default: Date.now },
});

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
