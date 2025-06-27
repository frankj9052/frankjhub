import './docs/openapi';
import { Router } from 'express';
import { requirePermission } from '../common/middlewares/requirePermission';
import { validateRequest } from '../common/middlewares/validateRequest';
import { buildPermissionName } from '../codecs/permissionCodec';

import {
  createOrganizationTypeController,
  getAllOrganizationTypesController,
  getOrganizationTypeByIdController,
  updateOrganizationTypeController,
  softDeleteOrganizationTypeController,
  restoreOrganizationTypeController,
  hardDeleteOrganizationTypeController,
} from './organizationType.controller';

import {
  organizationTypeCreateSchema,
  organizationTypeUpdateSchema,
  organizationTypePaginationSchema,
  userIdParamsSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.post(
  '/organization-type',
  requirePermission(buildPermissionName('organizationType', ['create'])),
  validateRequest({ body: organizationTypeCreateSchema }),
  createOrganizationTypeController
);

router.get(
  '/organization-type/list',
  requirePermission(buildPermissionName('organizationType', ['read'])),
  validateRequest({ query: organizationTypePaginationSchema }),
  getAllOrganizationTypesController
);

router.get(
  '/organization-type/:id',
  requirePermission(buildPermissionName('organizationType', ['read'])),
  validateRequest({ params: userIdParamsSchema }),
  getOrganizationTypeByIdController
);

router.patch(
  '/organization-type/update',
  requirePermission(buildPermissionName('organizationType', ['update'])),
  validateRequest({ body: organizationTypeUpdateSchema }),
  updateOrganizationTypeController
);

router.patch(
  '/organization-type/soft-delete',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  softDeleteOrganizationTypeController
);

router.patch(
  '/organization-type/restore',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  restoreOrganizationTypeController
);

router.delete(
  '/organization-type/hard-delete',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ query: userIdParamsSchema }),
  hardDeleteOrganizationTypeController
);

export function register(parent: Router) {
  parent.use('/', router);
}
