import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery } from '@/lib/validation/sanitize';

// POST /api/auth/forgot-password — Request a password reset link
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`forgot-password:${ip}`, { limit: 5, windowSeconds: 600 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Too many password reset attempts. Please wait a few minutes.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const rawEmail = sanitizedBody?.email ? String(sanitizedBody.email).trim().toLowerCase() : '';

    if (!rawEmail || !rawEmail.includes('@')) {
      throw AppError.badRequest('Please provide a valid email address.');
    }

    await connectDB();

    const user = await User.findOne({ email: rawEmail });
    if (user && user.status !== 'SUSPENDED') {
      // Generate secure 32-byte random hex token
      const rawToken = crypto.randomBytes(32).toString('hex');
      // Store token as SHA-256 hash in DB
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
      await user.save();

      // In production, send reset email with `${origin}/reset-password?token=${rawToken}`
    }

    // Always return uniform message to prevent account enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions shortly.',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/forgot-password');
  }
}
