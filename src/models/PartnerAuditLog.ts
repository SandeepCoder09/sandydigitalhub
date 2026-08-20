import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPartnerAuditLog extends Document {
  actorId?: string;
  actorName: string;
  actorRole: string;
  partnerId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const partnerAuditLogSchema = new Schema<IPartnerAuditLog>(
  {
    actorId: { type: String },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    partnerId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PartnerAuditLog: Model<IPartnerAuditLog> =
  mongoose.models.PartnerAuditLog || mongoose.model<IPartnerAuditLog>('PartnerAuditLog', partnerAuditLogSchema);
