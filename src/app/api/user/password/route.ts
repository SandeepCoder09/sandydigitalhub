import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rateLimit';
import { passwordUpdateSchema } from '@/lib/validation/schemas';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery } from '@/lib/validation/sanitize';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw AppError.unauthorized('Authentication required to change password.');
    }

    const rateCheck = checkRateLimit(`pwd-change:${session.user.id}`, { limit: 5, windowSeconds: 300 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Too many password update attempts. Please wait 5 minutes.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const parsed = passwordUpdateSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      throw parsed.error;
    }

    const { currentPassword, newPassword } = parsed.data;

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user || !user.password) {
      throw AppError.notFound('User account not found.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw AppError.badRequest('Current password entered is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/user/password');
  }
}
