import { z } from 'zod';
import { registry } from '../../../config/openapiRegistry';

export const loginSchema = registry.register(
  'LoginRequest',
  z.object({
    email: z.string().email().openapi({ example: 'test@example.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
  })
);
