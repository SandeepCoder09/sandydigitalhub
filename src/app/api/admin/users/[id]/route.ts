import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Partner } from '@/models/Partner';
import { SecurityLog } from '@/models/SecurityLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { isProtectedSuperAdmin, validateRoleTransition, canAdminManageUser } from '@/lib/rbac';
import { headers } from 'next/headers';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(req, params);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(req, params);
}

async function handleUpdate(req: Request, paramsPromise: Promise<{ id: string }>) {
  try {
    const session = await getServerSession(authOptions);
    const requesterRole = (session?.user as any)?.role || '';
    const requesterId = (session?.user as any)?.id || '';
    const requesterEmail = session?.user?.email || 'admin@sandydigitalhub.com';

    if (!session || !isProtectedSuperAdmin(requesterRole)) {
      return NextResponse.json({ message: 'Unauthorized: Super Admin credentials required.' }, { status: 401 });
    }

    const { id } = await paramsPromise;
    const body = await req.json();
    const { role: newRole, status: newStatus, partnerId } = body || {};

    await connectDB();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ message: 'Target user not found.' }, { status: 404 });
    }

    const headerList = await headers();
    const forwardedFor = headerList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 1. Check management permissions & protected accounts
    const manageCheck = canAdminManageUser(requesterId, requesterRole, targetUser._id.toString(), targetUser.role);
    if (!manageCheck.allowed) {
      // Log blocked attempt on protected account
      if (isProtectedSuperAdmin(targetUser.role)) {
        await SecurityLog.create({
          eventType: 'PROTECTED_ACCOUNT_ACTION_BLOCKED',
          ip,
          userEmail: requesterEmail,
          path: `/api/admin/users/${id}`,
          details: `Blocked attempt by ${requesterEmail} to modify protected account ${targetUser.email} (${targetUser.role}).`,
          severity: 'HIGH',
        });
      }

      return NextResponse.json({ message: manageCheck.reason }, { status: 403 });
    }

    let roleChanged = false;
    let statusChanged = false;
    const previousRole = targetUser.role;
    const previousStatus = targetUser.status || 'ACTIVE';

    // 2. Process Role Change if requested
    if (newRole && newRole !== targetUser.role) {
      const roleValidation = validateRoleTransition(targetUser.role, newRole);
      if (!roleValidation.valid) {
        await SecurityLog.create({
          eventType: 'ROLE_CHANGE_DENIED',
          ip,
          userEmail: requesterEmail,
          path: `/api/admin/users/${id}`,
          details: `Denied invalid role transition attempt for ${targetUser.email} from ${targetUser.role} to ${newRole}. Reason: ${roleValidation.reason}`,
          severity: 'MEDIUM',
        });

        return NextResponse.json({ message: roleValidation.reason }, { status: 400 });
      }

      // If assigning to PARTNER_ADMIN or PARTNER_STAFF, validate partner center
      if (newRole === 'PARTNER_ADMIN' || newRole === 'PARTNER_STAFF') {
        if (partnerId) {
          const partnerExists = await Partner.findById(partnerId);
          if (!partnerExists) {
            return NextResponse.json({ message: 'Selected Partner Center does not exist.' }, { status: 400 });
          }
          targetUser.partnerId = partnerId;
        }
      } else if (newRole === 'CUSTOMER') {
        // Demoting to customer clears all partner center links & elevated permissions
        targetUser.partnerId = undefined;
        targetUser.permissions = [];
      }

      targetUser.role = newRole;
      roleChanged = true;
    }

    // 3. Process Status Change if requested
    if (newStatus && newStatus !== targetUser.status) {
      if (!['ACTIVE', 'SUSPENDED'].includes(newStatus)) {
        return NextResponse.json({ message: 'Invalid status value. Must be ACTIVE or SUSPENDED.' }, { status: 400 });
      }

      targetUser.status = newStatus;
      statusChanged = true;
    }

    await targetUser.save();

    // 4. Create Audit Logs for confirmed actions
    if (roleChanged) {
      await SecurityLog.create({
        eventType: 'USER_ROLE_CHANGED',
        ip,
        userEmail: requesterEmail,
        path: `/api/admin/users/${id}`,
        details: `Super Admin ${requesterEmail} changed role of user ${targetUser.name} (${targetUser.email}) from ${previousRole} to ${newRole}.`,
        severity: 'MEDIUM',
      });
    }

    if (statusChanged) {
      const eventType = newStatus === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_REACTIVATED';
      await SecurityLog.create({
        eventType,
        ip,
        userEmail: requesterEmail,
        path: `/api/admin/users/${id}`,
        details: `Super Admin ${requesterEmail} changed status of user ${targetUser.name} (${targetUser.email}) from ${previousStatus} to ${newStatus}.`,
        severity: newStatus === 'SUSPENDED' ? 'HIGH' : 'LOW',
      });
    }

    const safeUser = {
      _id: targetUser._id.toString(),
      name: targetUser.name,
      email: targetUser.email,
      mobile: targetUser.mobile,
      role: targetUser.role,
      status: targetUser.status,
      partnerId: targetUser.partnerId,
      permissions: targetUser.permissions || [],
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: roleChanged && statusChanged
        ? 'User role and status updated successfully.'
        : roleChanged
        ? `User role changed from ${previousRole} to ${newRole}.`
        : statusChanged
        ? `User status changed to ${newStatus}.`
        : 'User updated successfully.',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
