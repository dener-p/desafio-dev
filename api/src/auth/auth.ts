import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/database';
import { account, session, user, verification } from 'src/database/schema';

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
    disableCSRFCheck: true, // add this temporarily to confirm it's the cause
    database: {
      generateId: false,
    },
  },
});
