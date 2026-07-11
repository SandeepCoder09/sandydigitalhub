import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITransaction extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  paymentId: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
