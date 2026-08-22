import { z } from 'zod';

// ==========================================
// 1. REUSABLE PRIMITIVE SCHEMAS
// ==========================================

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
  .or(z.string().trim().min(7).max(15)); // International fallback

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address')
  .max(100, 'Email must not exceed 100 characters');

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
  sort: z.string().trim().max(50).optional(),
  status: z.string().trim().max(50).optional(),
  category: z.string().trim().max(50).optional(),
});

// ==========================================
// 2. AUTHENTICATION & USER SCHEMAS
// ==========================================

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  phone: phoneSchema.optional(),
  address: z.string().trim().max(200).optional(),
  city: z.string().trim().max(50).optional(),
  state: z.string().trim().max(50).optional(),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});

// ==========================================
// 3. SERVICE REQUEST / ORDER SCHEMAS
// ==========================================

export const orderStatusEnum = z.enum([
  'PENDING',
  'PROCESSING',
  'SUBMITTED',
  'AWAITING_DOCS',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
]);

export const createOrderSchema = z.object({
  serviceId: z.string().trim().min(1, 'Service ID is required'),
  formData: z.record(z.string(), z.any()).default({}),
  documents: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        url: z.string().trim().min(1),
        type: z.string().trim().optional(),
        size: z.number().optional(),
      })
    )
    .default([]),
  applicantName: z.string().trim().min(2, 'Applicant name is required').max(100),
  applicantEmail: emailSchema,
  applicantPhone: phoneSchema,
  partnerId: z.string().trim().optional(), // Injected or validated server-side
  paymentMethod: z.enum(['ONLINE', 'CASH', 'WALLET', 'PAY_AFTER_SERVICE']).default('ONLINE'),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
  statusNotes: z.string().trim().max(1000).optional(),
  rejectionReason: z.string().trim().max(500).optional(),
  trackingNumber: z.string().trim().max(100).optional(),
  outputDocuments: z
    .array(
      z.object({
        name: z.string().trim(),
        url: z.string().trim(),
        size: z.number().optional(),
      })
    )
    .optional(),
});

// ==========================================
// 4. SUPPORT TICKET SCHEMAS
// ==========================================

export const ticketCategoryEnum = z.enum([
  'SERVICE_REQUEST',
  'PAYMENT_REFUND',
  'STUDIO_DEVELOPMENT',
  'PARTNER_PORTAL',
  'ACCOUNT_SECURITY',
  'GENERAL',
]);

export const ticketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const ticketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED']);

export const createTicketSchema = z.object({
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(150),
  category: ticketCategoryEnum,
  priority: ticketPriorityEnum.default('MEDIUM'),
  relatedRequestNumber: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10, 'Initial message must be at least 10 characters').max(3000),
});

export const addTicketMessageSchema = z.object({
  ticketId: z.string().trim().min(1),
  message: z.string().trim().min(1, 'Message cannot be empty').max(3000),
  isInternalNote: z.boolean().default(false),
  attachments: z
    .array(
      z.object({
        name: z.string().trim(),
        url: z.string().trim(),
        size: z.number().optional(),
      })
    )
    .optional(),
});

export const updateTicketStatusSchema = z.object({
  ticketId: z.string().trim().min(1),
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  assignedTo: z.string().trim().optional(),
});

// ==========================================
// 5. REVIEWS & RATINGS SCHEMAS
// ==========================================

export const createReviewSchema = z.object({
  userName: z.string().trim().min(2, 'Name is required').max(60),
  userEmail: emailSchema,
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().trim().min(5, 'Comment must be at least 5 characters').max(1000, 'Comment too long'),
  serviceName: z.string().trim().max(100).optional(),
  requestNumber: z.string().trim().max(50).optional(),
  division: z.enum(['SARA_HUB', 'SANDY_STUDIO', 'PARTNER_CENTER']).default('SARA_HUB'),
});

// ==========================================
// 6. QUOTES & PROJECT ESTIMATES SCHEMAS
// ==========================================

export const createQuoteSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(60),
  email: emailSchema,
  phone: phoneSchema.optional(),
  packageId: z.string().trim().min(1, 'Project package is required'),
  packageName: z.string().trim().min(1),
  projectType: z.string().trim().min(1),
  selectedAddons: z.array(z.string().trim()).default([]),
  basePrice: z.number().nonnegative(),
  addonsPrice: z.number().nonnegative().default(0),
  estimatedTotal: z.number().nonnegative(),
  timelineWeeks: z.number().positive(),
  notes: z.string().trim().max(1000).optional(),
});

// ==========================================
// 7. PARTNER NETWORK SCHEMAS
// ==========================================

export const applyPartnerSchema = z.object({
  centerName: z.string().trim().min(3, 'Center name is required').max(100),
  ownerName: z.string().trim().min(2, 'Owner name is required').max(60),
  ownerEmail: emailSchema,
  ownerPhone: phoneSchema,
  whatsapp: phoneSchema,
  address: z.string().trim().min(5, 'Full address is required').max(200),
  city: z.string().trim().min(2, 'City is required').max(50),
  state: z.string().trim().min(2, 'State is required').max(50),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  customSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(3, 'Slug must be at least 3 characters')
    .max(40, 'Slug must not exceed 40 characters'),
  plan: z.enum(['STARTER', 'GROWTH', 'FRANCHISE']).default('STARTER'),
  notes: z.string().trim().max(500).optional(),
});

export const updatePartnerBrandingSchema = z.object({
  logoUrl: z.string().trim().url().optional().or(z.literal('')),
  bannerUrl: z.string().trim().url().optional().or(z.literal('')),
  primaryColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').default('#7C3AED'),
  accentColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').default('#4F46E5'),
  tagline: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).optional(),
  businessHours: z.string().trim().max(100).optional(),
});

// ==========================================
// 8. NOTIFICATIONS & ANNOUNCEMENTS SCHEMAS
// ==========================================

export const notificationTypeEnum = z.enum([
  'ANNOUNCEMENT',
  'PLATFORM_UPDATE',
  'SERVICE_UPDATE',
  'ORDER_STATUS',
  'SUPPORT_TICKET',
  'PARTNER_NOTICE',
  'SECURITY_NOTICE',
  'MAINTENANCE',
  'SYSTEM',
]);

export const notificationPriorityEnum = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']);

export const createNotificationSchema = z.object({
  title: z.string().trim().min(3, 'Title is required').max(150),
  body: z.string().trim().min(5, 'Message body is required').max(3000),
  type: notificationTypeEnum.default('ANNOUNCEMENT'),
  priority: notificationPriorityEnum.default('NORMAL'),
  targetAudience: z.enum(['ALL', 'CUSTOMERS', 'PARTNERS', 'STAFF', 'ADMINS']).default('ALL'),
  partnerId: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  link: z.string().trim().max(250).optional(),
  actionText: z.string().trim().max(50).optional(),
  isAnnouncement: z.boolean().default(false),
  pinned: z.boolean().default(false),
  scheduledFor: z.string().datetime().optional().or(z.null()),
  expiresAt: z.string().datetime().optional().or(z.null()),
});

// ==========================================
// 9. CONTACT ENQUIRY SCHEMA
// ==========================================

export const contactEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(60),
  email: emailSchema,
  phone: phoneSchema.optional(),
  department: z.string().trim().min(1, 'Department is required').max(50),
  relatedRequestNumber: z.string().trim().max(50).optional(),
  subject: z.string().trim().min(3, 'Subject is required').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
});
