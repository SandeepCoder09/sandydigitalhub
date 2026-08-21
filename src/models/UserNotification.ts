import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserNotificationType =
  | 'ORDER_PLACED'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_COMPLETED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PARTNER_APPROVED'
  | 'PARTNER_SUSPENDED'
  | 'PARTNER_SERVICE_ENABLED'
  | 'NEW_SERVICE_ADDED'
  | 'NEW_FEATURE'
  | 'MAINTENANCE'
  | 'SECURITY_NOTICE'
  | 'PLAN_UPDATE'
  | 'ACTION_REQUIRED'
  | 'GENERAL';

export interface IUserNotification extends Document {
  userId: string;
  type: UserNotificationType;
  title: string;
  body: string;
  relatedId?: string | null; // orderId, partnerId, serviceId, etc.
  relatedType?: 'ORDER' | 'PARTNER' | 'SERVICE' | 'ANNOUNCEMENT' | null;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSchema = new Schema<IUserNotification>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        'ORDER_PLACED', 'ORDER_STATUS_CHANGED', 'ORDER_COMPLETED', 'ORDER_CANCELLED',
        'PAYMENT_RECEIVED', 'PARTNER_APPROVED', 'PARTNER_SUSPENDED',
        'PARTNER_SERVICE_ENABLED', 'NEW_SERVICE_ADDED', 'NEW_FEATURE',
        'MAINTENANCE', 'SECURITY_NOTICE', 'PLAN_UPDATE', 'ACTION_REQUIRED', 'GENERAL',
      ],
      default: 'GENERAL',
    },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 1000 },
    relatedId: { type: String, default: null },
    relatedType: {
      type: String,
      enum: ['ORDER', 'PARTNER', 'SERVICE', 'ANNOUNCEMENT', null],
      default: null,
    },
    link: { type: String, default: null },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Index for efficient per-user unread queries
UserNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const UserNotification: Model<IUserNotification> =
  mongoose.models.UserNotification ||
  mongoose.model<IUserNotification>('UserNotification', UserNotificationSchema);
