import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITrustMetric extends Document {
  metricKey: string; // e.g. 'completed_requests', 'verified_reviews', 'active_partners', 'avg_rating'
  label: string;
  source: 'CALCULATED_DB' | 'VERIFIED_MANUAL' | 'HIDDEN';
  displayValue: string;
  numericValue: number;
  suffix?: string; // e.g. '+', '/5.0', '%'
  isPublic: boolean;
  order: number;
  lastCalculatedAt: Date;
  updatedAt: Date;
}

const trustMetricSchema = new Schema<ITrustMetric>(
  {
    metricKey: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    source: {
      type: String,
      enum: ['CALCULATED_DB', 'VERIFIED_MANUAL', 'HIDDEN'],
      default: 'CALCULATED_DB',
    },
    displayValue: { type: String, required: true },
    numericValue: { type: Number, default: 0 },
    suffix: { type: String, default: '' },
    isPublic: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TrustMetric: Model<ITrustMetric> =
  mongoose.models.TrustMetric ||
  mongoose.model<ITrustMetric>('TrustMetric', trustMetricSchema);
