import mongoose, { Document, Model, Schema } from 'mongoose';

export type JobType =
  | 'ANNOUNCEMENT_DELIVERY'
  | 'NOTIFICATION_BATCH'
  | 'EMAIL_DELIVERY'
  | 'ANALYTICS_AGGREGATION'
  | 'AUDIT_CLEANUP';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface IJobQueue extends Document {
  type: JobType;
  idempotencyKey?: string;
  payload: Record<string, any>;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  error?: string | null;
  processedCount?: number;
  totalCount?: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobQueueSchema = new Schema<IJobQueue>(
  {
    type: {
      type: String,
      enum: [
        'ANNOUNCEMENT_DELIVERY',
        'NOTIFICATION_BATCH',
        'EMAIL_DELIVERY',
        'ANALYTICS_AGGREGATION',
        'AUDIT_CLEANUP',
      ],
      required: true,
      index: true,
    },
    idempotencyKey: { type: String, unique: true, sparse: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    error: { type: String, default: null },
    processedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index for queue polling
jobQueueSchema.index({ status: 1, createdAt: 1 });

export const JobQueue: Model<IJobQueue> =
  mongoose.models.JobQueue || mongoose.model<IJobQueue>('JobQueue', jobQueueSchema);
