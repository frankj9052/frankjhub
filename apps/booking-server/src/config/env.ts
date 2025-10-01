import { z } from 'zod/v3';
import path from 'path';
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({ path: path.resolve(process.cwd(), 'apps/booking-server/') });

const baseSchema = z.object({
  PORT: z.string().default('4000'),
  HOST: z.string().default('localhost'),
});

// 如果没有 DATABASE_URL，就强制要求 host + user + db
const extendedSchema = baseSchema.extend({});

const parsed = extendedSchema.safeParse(process.env);

if (!parsed.success) {
  // ❗ 使用 console.error 替代 logger，避免循环引用
  console.error('❌ Invalid environment variables!');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
