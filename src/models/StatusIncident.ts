import mongoose, { Document, Model, Schema } from 'mongoose';

export type ComponentStatus = 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE';
export type IncidentImpact = 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL';
export type IncidentStatus = 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';

export interface IStatusUpdate {
  status: IncidentStatus;
  message: string;
  timestamp: Date;
}

export interface IStatusIncident extends Document {
  title: string;
  impact: IncidentImpact;
  status: IncidentStatus;
  affectedComponents: string[]; // e.g. ['main_web', 'service_requests', 'payment_gateway']
  updates: IStatusUpdate[];
  resolvedAt?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusIncidentSchema = new Schema<IStatusIncident>(
  {
    title: { type: String, required: true },
    impact: {
      type: String,
      enum: ['NONE', 'MINOR', 'MAJOR', 'CRITICAL'],
      default: 'MINOR',
    },
    status: {
      type: String,
      enum: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED'],
      default: 'INVESTIGATING',
    },
    affectedComponents: [{ type: String }],
    updates: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

statusIncidentSchema.index({ status: 1, createdAt: -1 });

export const StatusIncident: Model<IStatusIncident> =
  mongoose.models.StatusIncident ||
  mongoose.model<IStatusIncident>('StatusIncident', statusIncidentSchema);
