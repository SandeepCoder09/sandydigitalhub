import mongoose, { Document, Model, Schema } from 'mongoose';

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IHelpArticle extends Document {
  slug: string;
  title: string;
  category: string; // e.g. 'Account & Login', 'Service Requests', 'Payments & Refunds', 'Partner Centers', 'Free Tools'
  division: 'ALL' | 'SARA_HUB' | 'SANDY_STUDIO';
  summary: string;
  content: string; // Markdown / HTML supported
  tags: string[];
  status: ArticleStatus;
  viewCount: number;
  helpfulYesCount: number;
  helpfulNoCount: number;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const helpArticleSchema = new Schema<IHelpArticle>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    division: { type: String, enum: ['ALL', 'SARA_HUB', 'SANDY_STUDIO'], default: 'ALL' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
    viewCount: { type: Number, default: 0 },
    helpfulYesCount: { type: Number, default: 0 },
    helpfulNoCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

helpArticleSchema.index({ status: 1, category: 1, order: 1 });
helpArticleSchema.index({ slug: 1 });
helpArticleSchema.index({ title: 'text', content: 'text', summary: 'text' });

export const HelpArticle: Model<IHelpArticle> =
  mongoose.models.HelpArticle ||
  mongoose.model<IHelpArticle>('HelpArticle', helpArticleSchema);
