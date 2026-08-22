import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}

const serviceSchema = new Schema<IService>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound indexes for high-frequency catalog filtering and sorting
serviceSchema.index({ status: 1, category: 1, createdAt: -1 });
serviceSchema.index({ status: 1, createdAt: -1 });
serviceSchema.index({ title: 'text', description: 'text' });

export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
