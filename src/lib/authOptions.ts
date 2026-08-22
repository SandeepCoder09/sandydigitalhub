/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { checkLoginAttempts, recordFailedLogin, resetLoginAttempts } from '@/lib/rateLimit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email ? String(credentials.email).trim().toLowerCase() : '';
        const rawPassword = credentials?.password ? String(credentials.password) : '';

        if (!rawEmail || !rawPassword) {
          throw new Error('Please enter an email and password');
        }

        // 1. Rate Limit & Brute-Force Check
        const attemptCheck = checkLoginAttempts(rawEmail);
        if (!attemptCheck.allowed) {
          const minutes = Math.ceil((attemptCheck.lockedUntilSeconds || 300) / 60);
          throw new Error(`Too many failed login attempts. Please wait ${minutes} minute(s) before trying again.`);
        }

        await connectDB();

        // 2. Fetch User by Email
        const user = await User.findOne({ email: rawEmail });
        if (!user || !user.password) {
          recordFailedLogin(rawEmail);
          // Generic error message to prevent user enumeration
          throw new Error('Invalid email or password.');
        }

        // 3. Status Check
        if (user.status === 'SUSPENDED') {
          throw new Error('Your account has been suspended. Please contact support.');
        }

        // 4. Secure Password Comparison
        const isPasswordMatch = await bcrypt.compare(rawPassword, user.password);
        if (!isPasswordMatch) {
          const lockResult = recordFailedLogin(rawEmail);
          if (lockResult.locked) {
            const minutes = Math.ceil((lockResult.lockTimeSeconds || 300) / 60);
            throw new Error(`Too many failed attempts. Account locked for ${minutes} minute(s).`);
          }
          throw new Error('Invalid email or password.');
        }

        // 5. Successful login: reset failed counters
        resetLoginAttempts(rawEmail);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          partnerId: user.partnerId || null,
          permissions: user.permissions || [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.partnerId = (user as any).partnerId || null;
        token.permissions = (user as any).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).partnerId = token.partnerId as string | null;
        (session.user as any).permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'sandy_digital_hub_super_secret_jwt_key_2026_999888',
  pages: {
    signIn: '/login',
  },
};

export default authOptions;
