import './docs/openapi';
import { Router } from 'express';
import {
  createRoleController,
  getRoleListController,
  getRoleByIdController,
  updateRoleController,
  softDeleteRoleController,
  restoreRoleController,
  hardDeleteRoleController,
  getRoleOptionListController,
} from './role.controller';

import {
  idParamsSchema,
  roleCreateRequestSchema,
  roleListRequestSchema,
  roleUpdateRequestSchema,
} from '@frankjhub/shared-schema';

import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

router.post(
  '/role',
  requirePermission(buildPermissionName('role', ['create'])),
  validateRequest({ body: roleCreateRequestSchema }),
  createRoleController
);

router.get(
  '/role/list',
  requirePermission(buildPermissionName('role', ['read'])),
  validateRequest({ query: roleListRequestSchema }),
  getRoleListController
);

router.get(
  '/role/options',
  requirePermission(buildPermissionName('role', ['read'])),
  getRoleOptionListController
);

router.get(
  '/role/:id',
  requirePermission(buildPermissionName('role', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getRoleByIdController
);

router.patch(
  '/role/update',
  requirePermission(buildPermissionName('role', ['update'])),
  validateRequest({ body: roleUpdateRequestSchema }),
  updateRoleController
);

router.patch(
  '/role/soft-delete',
  requirePermission(buildPermissionName('role', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeleteRoleController
);

router.patch(
  '/role/restore',
  requirePermission(buildPermissionName('role', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreRoleController
);

router.delete(
  '/role/hard-delete',
  requirePermission(buildPermissionName('role', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteRoleController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
