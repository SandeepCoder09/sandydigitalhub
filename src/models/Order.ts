import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  serviceId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  note: string;
  updatedBy: string;
}

export interface IOrderCommission {
  partnerEarnings: number;
  platformFee: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  partnerId?: string; // e.g. SARA-0001 (or null/empty for central platform)
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  services: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  commission?: IOrderCommission;
  paymentMethod: 'online' | 'pay_at_shop';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'AWAITING_CUSTOMER_VISIT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  assignedStaffId?: mongoose.Types.ObjectId;
  timeline?: IOrderTimeline[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  documentUrl?: string;
  documentName?: string;
  rating?: number;
  reviewText?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    partnerId: { type: String, default: null, index: true },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    commission: {
      partnerEarnings: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
    },
    paymentMethod: { type: String, enum: ['online', 'pay_at_shop'], required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'AWAITING_CUSTOMER_VISIT', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: 'User' },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        updatedBy: { type: String, default: 'System' },
      },
    ],
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    notes: { type: String },
    documentUrl: { type: String },
    documentName: { type: String },
    rating: { type: Number },
    reviewText: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
