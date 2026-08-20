import { connectDB } from '@/lib/db';
import { Partner, IPartner } from '@/models/Partner';
import { Session } from 'next-auth';

/**
 * Resolve an active partner tenant from their unique slug (e.g. 'sharma-digital')
 */
export async function getPartnerBySlug(slug: string): Promise<IPartner | null> {
  if (!slug) return null;
  await connectDB();
  const partner = await Partner.findOne({ slug: slug.toLowerCase().trim() }).lean();
  return partner as IPartner | null;
}

/**
 * Resolve a partner tenant from their immutable partnerId (e.g. 'SARA-0001')
 */
export async function getPartnerById(partnerId: string): Promise<IPartner | null> {
  if (!partnerId) return null;
  await connectDB();
  const partner = await Partner.findOne({ partnerId }).lean();
  return partner as IPartner | null;
}

/**
 * Server-side authorization check enforcing tenant data isolation.
 *
 * Rules:
 * 1. SUPER_ADMIN or ADMIN (without partnerId) has global access.
 * 2. PARTNER_ADMIN and PARTNER_STAFF can only access resources matching their session.user.partnerId.
 * 3. Returns { authorized: true, partnerId } or { authorized: false, error }.
 */
export function verifyPartnerAccess(
  session: Session | null | any,
  requestedPartnerId?: string
): { authorized: boolean; partnerId?: string; isSuperAdmin: boolean; error?: string } {
  if (!session?.user) {
    return { authorized: false, isSuperAdmin: false, error: 'Unauthorized: Session missing' };
  }

  const role = session.user.role;
  const userPartnerId = session.user.partnerId;

  // Global Super Admin
  if (role === 'SUPER_ADMIN' || (role === 'ADMIN' && !userPartnerId)) {
    return {
      authorized: true,
      partnerId: requestedPartnerId || undefined,
      isSuperAdmin: true,
    };
  }

  // Partner Admin or Partner Staff
  if (role === 'PARTNER_ADMIN' || role === 'PARTNER_STAFF') {
    if (!userPartnerId) {
      return { authorized: false, isSuperAdmin: false, error: 'User is not assigned to any partner center' };
    }

    // If a specific partnerId was requested, it MUST match the user's partnerId
    if (requestedPartnerId && requestedPartnerId !== userPartnerId) {
      return {
        authorized: false,
        isSuperAdmin: false,
        error: 'Forbidden: Access denied to other partner center data',
      };
    }

    return {
      authorized: true,
      partnerId: userPartnerId,
      isSuperAdmin: false,
    };
  }

  return { authorized: false, isSuperAdmin: false, error: 'Forbidden: Insufficient privileges' };
}

/**
 * Calculates earnings split between partner and platform for a given order amount.
 */
export function calculateOrderCommission(
  orderAmount: number,
  partnerCommission: {
    model?: string;
    partnerShare?: number;
    platformShare?: number;
    fixedPlatformFee?: number;
  }
): { partnerEarnings: number; platformFee: number } {
  if (!partnerCommission) {
    // Default 80/20 split
    const partnerEarnings = Math.round(orderAmount * 0.8);
    const platformFee = orderAmount - partnerEarnings;
    return { partnerEarnings, platformFee };
  }

  if (partnerCommission.model === 'FIXED') {
    const fixedFee = partnerCommission.fixedPlatformFee || 0;
    const partnerEarnings = Math.max(0, orderAmount - fixedFee);
    return { partnerEarnings, platformFee: Math.min(orderAmount, fixedFee) };
  }

  // Percentage model
  const partnerPct = (partnerCommission.partnerShare ?? 80) / 100;
  const partnerEarnings = Math.round(orderAmount * partnerPct);
  const platformFee = orderAmount - partnerEarnings;
  return { partnerEarnings, platformFee };
}
