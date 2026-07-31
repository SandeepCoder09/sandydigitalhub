import mongoose, { Schema, model, models } from 'mongoose';

export interface ISiteControl {
  isEmergencyLockdown: boolean;
  maintenanceMessage: string;
  allowFileUploads: boolean;
  blockedPages: string[]; // e.g. ['/checkout', '/tools', '/services']
  blockedIps: string[];
  blockedEmails: string[];
  updatedAt: Date;
}

const SiteControlSchema = new Schema<ISiteControl>(
  {
    isEmergencyLockdown: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'Sandy Digital Hub is currently undergoing scheduled maintenance. Please check back shortly.' },
    allowFileUploads: { type: Boolean, default: true },
    blockedPages: { type: [String], default: [] },
    blockedIps: { type: [String], default: [] },
    blockedEmails: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const SiteControl = models.SiteControl || model<ISiteControl>('SiteControl', SiteControlSchema);
