import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery } from '@/lib/validation/sanitize';

// POST /api/auth/reset-password — Complete password reset using single-use token
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`reset-password:${ip}`, { limit: 5, windowSeconds: 600 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Too many reset attempts. Please wait a few minutes.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const rawToken = sanitizedBody?.token ? String(sanitizedBody.token).trim() : '';
    const newPassword = sanitizedBody?.password ? String(sanitizedBody.password) : '';

    if (!rawToken || !newPassword) {
      throw AppError.badRequest('Reset token and new password are required.');
    }

    if (newPassword.length < 8) {
      throw AppError.badRequest('Password must be at least 8 characters long.');
    }

    await connectDB();

    // Hash the incoming raw token with SHA-256 to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw AppError.badRequest('Invalid or expired password reset link. Please request a new one.');
    }

    // Hash new password using bcrypt (12 rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    // Consume token (single use)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/reset-password');
  }
}
