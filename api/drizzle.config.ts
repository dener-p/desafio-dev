import type { Config } from 'drizzle-kit';

const url = process.env.TURSO_URL ?? 'file:local.db';
const tursoToken = process.env.TURSO_TOKEN ?? undefined;
export default {
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: tursoToken ? 'turso' : 'sqlite',
  dbCredentials: {
    url,
    authToken: tursoToken,
  },
} satisfies Config;
