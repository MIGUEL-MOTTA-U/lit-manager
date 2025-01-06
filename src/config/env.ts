import dotenv from 'dotenv';
import { z } from 'zod';

// load env variables
dotenv.config();

// Schema validation form env variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().default('*'),
});

// return function of env variables
export function validateEnv() {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', error.errors);
      process.exit(1);
    }
  }
}

// Typed config
export const config = {
  env: process.env.NODE_ENV as 'development' | 'test' | 'production',
  server: {
    port: Number.parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  },
  db: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
} as const;
