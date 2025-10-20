import { CorsService } from '@frankjhub/shared-cors';
import { env } from '../config/env';
const corsService = new CorsService(env);

export const corsOptions = corsService.getMiddleware();

export const corsPreflight = corsService.getPreflightMiddleware();
