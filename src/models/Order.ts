import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  serviceId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  services: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'online' | 'pay_at_shop';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'AWAITING_CUSTOMER_VISIT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  services: [
    {
      serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['online', 'pay_at_shop'], required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  orderStatus: { type: String, enum: ['PENDING', 'AWAITING_CUSTOMER_VISIT', 'PROCESSING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
