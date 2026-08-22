import mongoose, { Document, Model, Schema } from 'mongoose';

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_ON_CUSTOMER'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'NORMAL' | 'HIGH' | 'URGENT';

export type TicketCategory =
  | 'SERVICE_REQUEST'
  | 'PAYMENT_REFUND'
  | 'PAYMENT_BILLING'
  | 'STUDIO_DEVELOPMENT'
  | 'STUDIO_PROJECT'
  | 'PARTNER_PORTAL'
  | 'PARTNER_SUPPORT'
  | 'ACCOUNT_SECURITY'
  | 'ACCOUNT_LOGIN'
  | 'FREE_TOOLS'
  | 'GENERAL'
  | 'OTHER';

export interface ITicketMessage {
  _id?: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: 'CUSTOMER' | 'PARTNER_STAFF' | 'PARTNER_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
  content?: string;
  message?: string;
  isInternalNote: boolean; // Only visible to ADMIN / SUPER_ADMIN and authorized partner staff
  attachments?: { name: string; url: string; size?: number }[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string; // e.g. SDH-TKT-2026-0089
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  partnerId?: mongoose.Types.ObjectId | string; // Multi-tenant isolation for partner-assigned tickets
  relatedRequestId?: mongoose.Types.ObjectId; // Linked order/request ID
  relatedRequestNumber?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  status: TicketStatus;
  assignedTo?: string; // Admin or staff name
  messages: ITicketMessage[];
  lastActivityAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ['CUSTOMER', 'PARTNER_STAFF', 'PARTNER_ADMIN', 'ADMIN', 'SUPER_ADMIN'],
      required: true,
    },
    content: { type: String },
    message: { type: String },
    isInternalNote: { type: Boolean, default: false },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    partnerId: { type: Schema.Types.Mixed },
    relatedRequestId: { type: Schema.Types.ObjectId, ref: 'Order' },
    relatedRequestNumber: { type: String },
    category: {
      type: String,
      required: true,
      default: 'GENERAL',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    assignedTo: { type: String },
    messages: [ticketMessageSchema],
    lastActivityAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ customerId: 1, lastActivityAt: -1 });
supportTicketSchema.index({ partnerId: 1, status: 1 });
supportTicketSchema.index({ status: 1, lastActivityAt: -1 });

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);

export default SupportTicket;
