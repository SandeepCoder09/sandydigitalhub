import mongoose, { Schema, model, models } from 'mongoose';

export interface ISecurityLog {
  eventType:
    | 'BLOCKED_IP_HIT'
    | 'FAILED_LOGIN'
    | 'SUSPICIOUS_REQUEST'
    | 'LOCKDOWN_TRIGGERED'
    | 'UNAUTHORIZED_ACCESS'
    | 'USER_ROLE_CHANGED'
    | 'USER_SUSPENDED'
    | 'USER_REACTIVATED'
    | 'ROLE_CHANGE_DENIED'
    | 'PROTECTED_ACCOUNT_ACTION_BLOCKED';
  ip: string;
  userEmail?: string;
  path: string;
  details: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: Date;
}

const SecurityLogSchema = new Schema<ISecurityLog>(
  {
    eventType: { type: String, required: true },
    ip: { type: String, required: true, default: '127.0.0.1' },
    userEmail: { type: String, default: '' },
    path: { type: String, required: true },
    details: { type: String, default: '' },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  },
  { timestamps: true }
);

SecurityLogSchema.index({ createdAt: -1 });

export const SecurityLog = models.SecurityLog || model<ISecurityLog>('SecurityLog', SecurityLogSchema);
