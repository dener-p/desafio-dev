import { z } from 'zod';
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  COOKIE_NAME: z.string().default('auth_token'),
  TURSO_URL: z.string().default('file:local.db'),
  TURSO_TOKEN: z.string().optional(),
  CORS: z.string().default('http://localhost:3000'),
});

export const validateEnv = () => {
  const validate = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    COOKIE_NAME: process.env.COOKIE_NAME,
    TURSO_URL: process.env.TURSO_URL,
    TURSO_TOKEN: process.env.TURSO_TOKEN,
    CORS: process.env.CORS,
  });

  if (!validate.success) {
    console.error('❌ Invalid environment variables:');
    console.dir(validate.error, 200);
    throw new Error('❌ Invalid environment variables');
  }
  Object.assign(process.env, validate.data);
};

type env = z.infer<typeof envSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends env {}
  }
}
