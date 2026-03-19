import { drizzle } from 'drizzle-orm/libsql';

const url = process.env.TURSO_URL ?? 'file:local.db';

export const db = drizzle({
  connection: { url: url, authToken: process.env.TURSO_TOKEN ?? undefined },
});
