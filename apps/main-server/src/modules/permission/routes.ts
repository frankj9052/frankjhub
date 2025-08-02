import './docs/openapi';
import { Router } from 'express';
import {
  createPermissionController,
  getPermissionListController,
  getPermissionByIdController,
  updatePermissionController,
  softDeletePermissionController,
  restorePermissionController,
  hardDeletePermissionController,
  getPermissionOptionListController,
} from './permission.controller';

import {
  idParamsSchema,
  permissionCreateRequestSchema,
  permissionListRequestSchema,
  permissionUpdateRequestSchema,
} from '@frankjhub/shared-schema';

import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// Permission routes
router.post(
  '/permission',
  requirePermission(buildPermissionName('permission', ['create'])),
  validateRequest({ body: permissionCreateRequestSchema }),
  createPermissionController
);

router.get(
  '/permission/list',
  requirePermission(buildPermissionName('permission', ['read'])),
  validateRequest({ query: permissionListRequestSchema }),
  getPermissionListController
);

router.get(
  '/permission/options',
  requirePermission(buildPermissionName('permission', ['read'])),
  getPermissionOptionListController
);

router.get(
  '/permission/:id',
  requirePermission(buildPermissionName('permission', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getPermissionByIdController
);

router.patch(
  '/permission/update',
  requirePermission(buildPermissionName('permission', ['update'])),
  validateRequest({ body: permissionUpdateRequestSchema }),
  updatePermissionController
);

router.patch(
  '/permission/soft-delete',
  requirePermission(buildPermissionName('permission', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeletePermissionController
);

router.patch(
  '/permission/restore',
  requirePermission(buildPermissionName('permission', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restorePermissionController
);

router.delete(
  '/permission/hard-delete',
  requirePermission(buildPermissionName('permission', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeletePermissionController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
