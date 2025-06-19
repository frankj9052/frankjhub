import { z, zInfer } from '../../libs/z';

const orgRoleSchema = z.object({
  orgId: z.string().uuid(),
  orgName: z.string(),
  orgType: z.string(),
  roleCode: z.string(),
  roleName: z.string(),
  permissionStrings: z.array(z.string()),
});

const userPayloadSchema = z.object({
  id: z.string().uuid(),
  userName: z.string(),
  email: z.string().email().optional(),
  emailVerified: z.boolean().optional(),
  profileCompleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sessionVersion: z.string().uuid(),
  orgRoles: z.array(orgRoleSchema),
});

export const currentUserSchema = z.object({
  status: z.literal('success'),
  data: userPayloadSchema,
});

export type UserPayload = zInfer<typeof userPayloadSchema>;
