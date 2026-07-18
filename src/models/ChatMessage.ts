import mongoose, { Schema, model, models } from 'mongoose';

const ChatMessageSchema = new Schema(
  {
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'], default: 'CUSTOMER' },
    message: { type: String, required: true },
    sessionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    needsAdmin: { type: Boolean, default: false },
    adminRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatMessage = models.ChatMessage || model('ChatMessage', ChatMessageSchema);
