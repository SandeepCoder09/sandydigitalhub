import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'PARTNER_ADMIN' | 'PARTNER_STAFF' | 'CUSTOMER';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: UserRole;
  partnerId?: string; // Links user to specific partner if PARTNER_ADMIN or PARTNER_STAFF
  permissions?: string[]; // Granular permissions for PARTNER_STAFF
  status: 'ACTIVE' | 'SUSPENDED';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    mobile: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
    password: { type: String },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN', 'PARTNER_ADMIN', 'PARTNER_STAFF', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    partnerId: { type: String, default: null, index: true },
    permissions: [{ type: String }],
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (_doc, ret: any) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ resetPasswordToken: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
