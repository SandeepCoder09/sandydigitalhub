import mongoose, { Document, Model, Schema } from 'mongoose';

export type EnquiryStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'REPLIED' | 'RESOLVED' | 'SPAM';

export interface IContactEnquiry extends Document {
  enquiryNumber: string; // e.g. ENQ-2026-00342
  name: string;
  email: string;
  phone?: string;
  department: string; // e.g. 'SARA_SERVICES', 'STUDIO_TECH', 'PARTNER_NETWORK', 'EXISTING_REQUEST', 'BILLING', 'TECHNICAL_SUPPORT'
  relatedRequestNumber?: string;
  subject: string;
  message: string;
  ipAddress?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  assignedTo?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactEnquirySchema = new Schema<IContactEnquiry>(
  {
    enquiryNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    department: { type: String, required: true, default: 'GENERAL' },
    relatedRequestNumber: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ipAddress: { type: String },
    status: {
      type: String,
      enum: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'REPLIED', 'RESOLVED', 'SPAM'],
      default: 'NEW',
    },
    adminNotes: { type: String },
    assignedTo: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });
contactEnquirySchema.index({ department: 1 });
contactEnquirySchema.index({ email: 1 });

export const ContactEnquiry: Model<IContactEnquiry> =
  mongoose.models.ContactEnquiry ||
  mongoose.model<IContactEnquiry>('ContactEnquiry', contactEnquirySchema);
