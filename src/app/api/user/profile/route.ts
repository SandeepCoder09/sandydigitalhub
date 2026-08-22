import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { profileUpdateSchema } from '@/lib/validation/schemas';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery, sanitizeText } from '@/lib/validation/sanitize';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw AppError.unauthorized('Authentication required to update profile.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const parsed = profileUpdateSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      throw parsed.error;
    }

    const updatePayload: { name?: string; mobile?: string } = {};
    if (parsed.data.name) updatePayload.name = sanitizeText(parsed.data.name, 100);
    const phoneVal = parsed.data.mobile || parsed.data.phone;
    if (phoneVal) updatePayload.mobile = sanitizeText(phoneVal, 20);

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw AppError.notFound('User account not found.');
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        partnerId: updatedUser.partnerId || null,
      },
    });
  } catch (error: any) {
    return handleApiError(error, 'PUT /api/user/profile');
  }
}
