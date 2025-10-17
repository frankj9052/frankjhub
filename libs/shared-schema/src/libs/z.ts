import { z as baseZ, infer as zInfer } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

export function createZ() {
  extendZodWithOpenApi(baseZ);
  return baseZ;
}

export const z = createZ();
export type { zInfer };
