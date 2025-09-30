import { z, zInfer } from '../../../libs/z';
import { serviceSnapshotSchema } from '../entities';
import { createSuccessResponseSchema } from '../../../factories';

export const serviceSnapshotResponseDataSchema = z.object({
  version: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()), // 毫秒数
  services: serviceSnapshotSchema,
});

export const serviceSnapshotResponseSchema = createSuccessResponseSchema(
  serviceSnapshotResponseDataSchema
);

export type ServiceSnapshotResponseData = zInfer<typeof serviceSnapshotResponseDataSchema>;

export type ServiceSnapshotResponse = zInfer<typeof serviceSnapshotResponseSchema>;
