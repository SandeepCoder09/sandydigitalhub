import mongoose, { Schema, model, models } from 'mongoose';

export interface IVisitorLog {
  path: string;
  ip: string;
  userAgent: string;
  deviceType: string; // 'Mobile' | 'Desktop' | 'Tablet'
  referrer: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const VisitorLogSchema = new Schema<IVisitorLog>(
  {
    path: { type: String, required: true },
    ip: { type: String, required: true, default: '127.0.0.1' },
    userAgent: { type: String, default: '' },
    deviceType: { type: String, default: 'Desktop' },
    referrer: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Index for fast analytics queries
VisitorLogSchema.index({ createdAt: -1 });
VisitorLogSchema.index({ path: 1 });

export const VisitorLog = models.VisitorLog || model<IVisitorLog>('VisitorLog', VisitorLogSchema);
