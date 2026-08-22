import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { registerSchema } from '@/lib/validation/schemas';
import { handleApiError, AppError } from '@/lib/errors';
import { sanitizeMongoQuery } from '@/lib/validation/sanitize';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`register:${ip}`, { limit: 10, windowSeconds: 3600 });
    if (!rateCheck.success) {
      throw AppError.rateLimited('Registration rate limit exceeded. Please try again later.');
    }

    const body = await req.json();
    const sanitizedBody = sanitizeMongoQuery(body);
    const parsed = registerSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      throw parsed.error;
    }

    const { name, email, mobile, phone, password } = parsed.data;
    const mobileNumber = (mobile || phone || '').trim();

    if (!mobileNumber) {
      throw AppError.badRequest('Mobile phone number is required.');
    }

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { mobile: mobileNumber }],
    });

    if (existingUser) {
      throw AppError.conflict('An account with this email address or mobile number already exists.');
    }

    // Hash password with bcrypt (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobileNumber,
      password: hashedPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/register');
  }
}
