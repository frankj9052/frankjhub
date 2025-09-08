import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { z, zInfer } from '../../../libs/z';
import { userSchema } from '../entity';

export const userOptionSchema = userSchema.pick({
  id: true,
  userName: true,
  email: true,
  avatarImage: true,
});

export const userOptionListSchema = z.array(userOptionSchema);

export const userOptionListResponseSchema = createSuccessResponseSchema(userOptionListSchema);

export type UserOption = zInfer<typeof userOptionSchema>;
export type UserOptionList = zInfer<typeof userOptionListSchema>;
export type UserOptionListResponse = zInfer<typeof userOptionListResponseSchema>;
