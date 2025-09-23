import { DataSource } from 'typeorm';
import IORedis from 'ioredis';
import { ResendProvider } from './adapters/resend.provider';
import { env } from '../../config/env';

export function bootstrapEmailModule({ ds, redis }: { ds: DataSource; redis?: IORedis; env: any }) {
  const provider = new ResendProvider(env.RESEND_API_KEY);
}
