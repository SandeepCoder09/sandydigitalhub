export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'PARTNER_ADMIN' | 'PARTNER_STAFF' | 'CUSTOMER';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 4,
  PARTNER_ADMIN: 3,
  PARTNER_STAFF: 2,
  CUSTOMER: 1,
};

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Super Admin',
  PARTNER_ADMIN: 'Partner Admin',
  PARTNER_STAFF: 'Partner Staff',
  CUSTOMER: 'Customer',
};

/**
 * Checks if a user is a protected Super Admin account.
 */
export function isProtectedSuperAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

/**
 * Checks if an admin can manage the target user.
 */
export function canAdminManageUser(
  requesterId: string,
  requesterRole: string,
  targetId: string,
  targetRole: string
): { allowed: boolean; reason?: string } {
  // 1. Cannot manage oneself through administrative role-alteration actions
  if (requesterId === targetId) {
    return {
      allowed: false,
      reason: 'You cannot modify or suspend your own administrative account.',
    };
  }

  // 2. Target is a protected Super Admin
  if (isProtectedSuperAdmin(targetRole)) {
    return {
      allowed: false,
      reason: 'Super Admin accounts are protected and cannot be modified through standard user management.',
    };
  }

  // 3. Requester must be Super Admin or Admin
  if (!isProtectedSuperAdmin(requesterRole)) {
    return {
      allowed: false,
      reason: 'Only Super Administrators can perform role changes and user status updates.',
    };
  }

  return { allowed: true };
}

/**
 * Returns allowed target roles for promotion or role-change based on current role.
 */
export function getAllowedTargetRoles(currentRole: string): Array<{ role: RoleType; label: string; description: string }> {
  switch (currentRole) {
    case 'CUSTOMER':
      return [
        {
          role: 'PARTNER_ADMIN',
          label: 'Partner Admin',
          description: 'Full administrative access to manage assigned Partner Center, staff, services & orders.',
        },
        {
          role: 'PARTNER_STAFF',
          label: 'Partner Staff',
          description: 'Operational access to process customer orders and assigned services.',
        },
      ];

    case 'PARTNER_STAFF':
      return [
        {
          role: 'PARTNER_ADMIN',
          label: 'Partner Admin',
          description: 'Promote to center management authority with full partner operational control.',
        },
        {
          role: 'CUSTOMER',
          label: 'Customer',
          description: 'Demote to regular user. Revokes all partner center operational permissions.',
        },
      ];

    case 'PARTNER_ADMIN':
      return [
        {
          role: 'PARTNER_STAFF',
          label: 'Partner Staff',
          description: 'Demote to staff level. Revokes partner center administrative ownership.',
        },
        {
          role: 'CUSTOMER',
          label: 'Customer',
          description: 'Demote to standard customer. Revokes all administrative access.',
        },
      ];

    default:
      return [];
  }
}

/**
 * Validates if a role transition is permissible.
 */
export function validateRoleTransition(
  currentRole: string,
  targetRole: string
): { valid: boolean; reason?: string } {
  // Prevent any promotion to SUPER_ADMIN or ADMIN from normal user management
  if (targetRole === 'SUPER_ADMIN' || targetRole === 'ADMIN') {
    return {
      valid: false,
      reason: 'Promotions to Super Admin are strictly restricted and cannot be performed via standard management.',
    };
  }

  if (currentRole === targetRole) {
    return {
      valid: false,
      reason: 'Target role is identical to the current user role.',
    };
  }

  const allowedRoles = getAllowedTargetRoles(currentRole).map((r) => r.role);
  if (!allowedRoles.includes(targetRole as RoleType)) {
    return {
      valid: false,
      reason: `Invalid role transition from ${currentRole} to ${targetRole}.`,
    };
  }

  return { valid: true };
}
