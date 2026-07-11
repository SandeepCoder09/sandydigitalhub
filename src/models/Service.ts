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
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
});

export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
