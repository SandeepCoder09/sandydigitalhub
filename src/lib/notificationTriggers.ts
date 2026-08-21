/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Notification Trigger Library
 * ─────────────────────────────────────────────────────────────────────────────
 * Call these functions from within API route handlers whenever an important
 * platform event occurs. They create durable UserNotification records and/or
 * published Announcements in the database.
 *
 * Usage example:
 *   import { notifyOrderStatusChange } from '@/lib/notificationTriggers';
 *   await notifyOrderStatusChange(order._id.toString(), order.userId, 'COMPLETED');
 */

import { connectDB } from '@/lib/db';
import { UserNotification } from '@/models/UserNotification';
import { Announcement } from '@/models/Announcement';
import { formatOrderId } from '@/lib/utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Pending Review',
    PROCESSING: 'In Progress',
    COMPLETED: 'Completed ✅',
    CANCELLED: 'Cancelled',
    AWAITING_CUSTOMER_VISIT: 'Ready — Awaiting Your Visit',
    REFUND_REQUESTED: 'Refund Requested',
    REFUNDED: 'Refunded',
  };
  return map[status] || status;
}

// ─── Order Events ─────────────────────────────────────────────────────────────

/**
 * Triggered when an order's status changes.
 */
export async function notifyOrderStatusChange(
  orderId: string,
  userId: string | null | undefined,
  newStatus: string,
  orderCreatedAt?: Date
): Promise<void> {
  if (!userId) return;
  try {
    await connectDB();
    const brandedId = formatOrderId(orderId, orderCreatedAt || new Date());
    const label = getOrderStatusLabel(newStatus);

    const isCompleted = newStatus === 'COMPLETED';
    const isCancelled = newStatus === 'CANCELLED';

    await UserNotification.create({
      userId,
      type: isCompleted
        ? 'ORDER_COMPLETED'
        : isCancelled
        ? 'ORDER_CANCELLED'
        : 'ORDER_STATUS_CHANGED',
      title: isCompleted
        ? `Your order ${brandedId} is complete!`
        : isCancelled
        ? `Order ${brandedId} was cancelled`
        : `Order ${brandedId} update`,
      body: `Status is now: ${label}. Visit your requests page for details.`,
      relatedId: orderId,
      relatedType: 'ORDER',
      link: '/requests',
    });
  } catch (err) {
    console.error('[notifyOrderStatusChange] Failed:', err);
  }
}

/**
 * Triggered when an order is first placed.
 */
export async function notifyOrderPlaced(
  orderId: string,
  userId: string,
  serviceNames: string[],
  total: number,
  orderCreatedAt?: Date
): Promise<void> {
  try {
    await connectDB();
    const brandedId = formatOrderId(orderId, orderCreatedAt || new Date());
    const serviceSummary =
      serviceNames.length === 1
        ? serviceNames[0]
        : `${serviceNames[0]} + ${serviceNames.length - 1} more`;

    await UserNotification.create({
      userId,
      type: 'ORDER_PLACED',
      title: `Order ${brandedId} confirmed!`,
      body: `Your booking for ${serviceSummary} (₹${total}) has been received. We'll update you soon.`,
      relatedId: orderId,
      relatedType: 'ORDER',
      link: '/requests',
    });
  } catch (err) {
    console.error('[notifyOrderPlaced] Failed:', err);
  }
}

// ─── Partner Events ───────────────────────────────────────────────────────────

/**
 * Triggered when a partner is approved.
 */
export async function notifyPartnerApproved(
  partnerName: string,
  partnerAdminUserId: string
): Promise<void> {
  try {
    await connectDB();
    await UserNotification.create({
      userId: partnerAdminUserId,
      type: 'PARTNER_APPROVED',
      title: `${partnerName} is now approved!`,
      body: `Your partner center "${partnerName}" has been approved by the SARA Super Admin. You can now access the Partner Portal.`,
      relatedType: 'PARTNER',
      link: '/partner',
    });
  } catch (err) {
    console.error('[notifyPartnerApproved] Failed:', err);
  }
}

/**
 * Triggered when a partner is suspended.
 */
export async function notifyPartnerSuspended(
  partnerName: string,
  partnerAdminUserId: string,
  reason?: string
): Promise<void> {
  try {
    await connectDB();
    await UserNotification.create({
      userId: partnerAdminUserId,
      type: 'PARTNER_SUSPENDED',
      title: `${partnerName} has been suspended`,
      body: reason
        ? `Your partner center has been suspended. Reason: ${reason}. Please contact SARA support.`
        : `Your partner center "${partnerName}" has been suspended. Please contact SARA support.`,
      relatedType: 'PARTNER',
      link: '/partner',
    });
  } catch (err) {
    console.error('[notifyPartnerSuspended] Failed:', err);
  }
}

// ─── Platform-Wide Announcements ─────────────────────────────────────────────

/**
 * Publish a platform-wide announcement immediately.
 * Used for maintenance, security, new features, etc.
 */
export async function publishPlatformAnnouncement({
  createdBy,
  title,
  body,
  type,
  audience = 'ALL',
  priority = 'NORMAL',
  pinned = false,
  expiresAt,
}: {
  createdBy: string;
  title: string;
  body: string;
  type: IAnnouncement_Type;
  audience?: 'ALL' | 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  pinned?: boolean;
  expiresAt?: Date;
}): Promise<void> {
  try {
    await connectDB();
    await Announcement.create({
      title,
      body,
      type,
      targetAudience: audience,
      priority,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      expiresAt: expiresAt || null,
      createdBy,
      pinned,
      readBy: [],
    });
  } catch (err) {
    console.error('[publishPlatformAnnouncement] Failed:', err);
  }
}

type IAnnouncement_Type =
  | 'NEW_SERVICE' | 'NEW_FEATURE' | 'PARTNER_APPROVED' | 'PARTNER_SUSPENDED'
  | 'REQUEST_STATUS_CHANGED' | 'ACTION_REQUIRED' | 'PLAN_UPDATE'
  | 'MAINTENANCE' | 'SECURITY_NOTICE' | 'PLATFORM_UPDATE' | 'GENERAL';
