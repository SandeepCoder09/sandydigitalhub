import mongoose, { Document, Model, Schema } from 'mongoose';

export type AnnouncementType =
  | 'NEW_SERVICE'
  | 'NEW_FEATURE'
  | 'PARTNER_APPROVED'
  | 'PARTNER_SUSPENDED'
  | 'REQUEST_STATUS_CHANGED'
  | 'ACTION_REQUIRED'
  | 'PLAN_UPDATE'
  | 'MAINTENANCE'
  | 'SECURITY_NOTICE'
  | 'PLATFORM_UPDATE'
  | 'GENERAL';

export type AnnouncementAudience = 'ALL' | 'CUSTOMER' | 'PARTNER' | 'ADMIN';
export type AnnouncementPriority = 'NORMAL' | 'HIGH' | 'URGENT';
export type AnnouncementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  type: AnnouncementType;
  targetAudience: AnnouncementAudience;
  targetPartnerId?: string | null; // null = all partners; set = specific partner only
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  expiresAt?: Date | null;
  createdBy: string; // userId of the admin who created it
  readBy: string[]; // array of userIds who have read/dismissed it
  pinned: boolean; // if true, show as banner until dismissed
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    type: {
      type: String,
      enum: [
        'NEW_SERVICE', 'NEW_FEATURE', 'PARTNER_APPROVED', 'PARTNER_SUSPENDED',
        'REQUEST_STATUS_CHANGED', 'ACTION_REQUIRED', 'PLAN_UPDATE',
        'MAINTENANCE', 'SECURITY_NOTICE', 'PLATFORM_UPDATE', 'GENERAL',
      ],
      default: 'GENERAL',
    },
    targetAudience: {
      type: String,
      enum: ['ALL', 'CUSTOMER', 'PARTNER', 'ADMIN'],
      default: 'ALL',
    },
    targetPartnerId: { type: String, default: null, index: true },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    scheduledAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    createdBy: { type: String, required: true },
    readBy: [{ type: String }],
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast audience queries
AnnouncementSchema.index({ status: 1, targetAudience: 1 });
AnnouncementSchema.index({ status: 1, publishedAt: -1 });

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
