import { z as baseZ, infer as zInfer } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(baseZ);

export const z = baseZ;
export type { zInfer };
