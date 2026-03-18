import { betterAuth, BetterAuthError } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/database';
import { account, session, user, verification } from 'src/database/schema';
import { HttpException } from '@nestjs/common';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: user,
      account: account,
      session: session,
      verification: verification,
    },
  }),
  trustedOrigins: ['http://localhost:3000'], // better-auth adds CORS headers for these
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  onAPIError: {
    // ❌ Remove: throw: true  ← this is what breaks the flow in NestJS
    onError: (error, ctx) => {
      console.error('Auth error:', error); // will now actually fire

      // Optional: rethrow as a NestJS-friendly exception
      throw new HttpException(
        error.message ?? 'Authentication error',
        error.statusCode ?? 500,
      );
    },
  },
});
