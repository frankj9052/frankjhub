import './docs/openapi';
import { Router } from 'express';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import {
  idParamsSchema,
  userOrganizationRoleCreateRequestSchema,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import {
  createUserOrganizationRoleController,
  getUserOrganizationRoleByUserIdController,
  updateUserOrganizationRoleController,
} from './userOrganizationRole.controller';

const router = Router();

router.post(
  '/user-organization-role/create',
  requirePermission(buildPermissionName('userOrganizationRole', ['create'])),
  validateRequest({ body: userOrganizationRoleCreateRequestSchema }),
  createUserOrganizationRoleController
);

router.patch(
  '/user-organization-role/update',
  requirePermission(buildPermissionName('userOrganizationRole', ['update'])),
  validateRequest({ body: userOrganizationRoleUpdateRequestSchema }),
  updateUserOrganizationRoleController
);

router.get(
  '/user-organization-role/:id',
  requirePermission(buildPermissionName('userOrganizationRole', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getUserOrganizationRoleByUserIdController
);

export function register(parent: Router) {
  parent.use('/', router);
}
