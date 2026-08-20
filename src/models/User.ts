import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'PARTNER_ADMIN' | 'PARTNER_STAFF' | 'CUSTOMER';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: UserRole;
  partnerId?: string; // Links user to specific partner if PARTNER_ADMIN or PARTNER_STAFF
  permissions?: string[]; // Granular permissions for PARTNER_STAFF
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN', 'PARTNER_ADMIN', 'PARTNER_STAFF', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    partnerId: { type: String, default: null, index: true },
    permissions: [{ type: String }],
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
