import './docs/openapi';
import { Router } from 'express';
import {
  createResourceController,
  getResourceListController,
  getResourceByIdController,
  updateResourceController,
  softDeleteResourceController,
  restoreResourceController,
  hardDeleteResourceController,
  getResourceOptionListController,
} from './resource.controller';

import {
  idParamsSchema,
  resourceCreateRequestSchema,
  resourceListRequestSchema,
  resourceUpdateRequestSchema,
} from '@frankjhub/shared-schema';

import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// Resource routes
router.post(
  '/resource',
  requirePermission(buildPermissionName('resource', ['create'])),
  validateRequest({ body: resourceCreateRequestSchema }),
  createResourceController
);

router.get(
  '/resource/list',
  requirePermission(buildPermissionName('resource', ['read'])),
  validateRequest({ query: resourceListRequestSchema }),
  getResourceListController
);

router.get(
  '/resource/options',
  requirePermission(buildPermissionName('resource', ['read'])),
  getResourceOptionListController
);

router.get(
  '/resource/:id',
  requirePermission(buildPermissionName('resource', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getResourceByIdController
);

router.patch(
  '/resource/update',
  requirePermission(buildPermissionName('resource', ['update'])),
  validateRequest({ body: resourceUpdateRequestSchema }),
  updateResourceController
);

router.patch(
  '/resource/soft-delete',
  requirePermission(buildPermissionName('resource', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeleteResourceController
);

router.patch(
  '/resource/restore',
  requirePermission(buildPermissionName('resource', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreResourceController
);

router.delete(
  '/resource/hard-delete',
  requirePermission(buildPermissionName('resource', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteResourceController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
