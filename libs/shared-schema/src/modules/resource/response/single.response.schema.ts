import { createSuccessResponseSchema } from '../../../factories';
import { resourceSchema } from '../entity';
import { zInfer } from '../../../libs/z';

export const resourceSingleResponseSchema = createSuccessResponseSchema(resourceSchema);

export type ResourceSingleResponse = zInfer<typeof resourceSingleResponseSchema>;
