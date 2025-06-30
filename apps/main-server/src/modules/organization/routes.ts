import './docs/openapi';
import { Router } from 'express';
import { requirePermission } from '../common/middlewares/requirePermission';
import { validateRequest } from '../common/middlewares/validateRequest';
import { buildPermissionName } from '../codecs/permissionCodec';

import {
  createOrganizationController,
  getAllOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  softDeleteOrganizationController,
  restoreOrganizationController,
  hardDeleteOrganizationController,
} from './organization.controller';

import {
  organizationCreateSchema,
  organizationUpdateSchema,
  organizationPaginationSchema,
  userIdParamsSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.post(
  '/organization',
  requirePermission(buildPermissionName('organization', ['create'])),
  validateRequest({ body: organizationCreateSchema }),
  createOrganizationController
);

router.get(
  '/organization/list',
  requirePermission(buildPermissionName('organization', ['read'])),
  validateRequest({ query: organizationPaginationSchema }),
  getAllOrganizationsController
);

router.get(
  '/organization/:id',
  requirePermission(buildPermissionName('organization', ['read'])),
  validateRequest({ params: userIdParamsSchema }),
  getOrganizationByIdController
);

router.patch(
  '/organization/update',
  requirePermission(buildPermissionName('organization', ['update'])),
  validateRequest({ body: organizationUpdateSchema }),
  updateOrganizationController
);

router.patch(
  '/organization/soft-delete',
  requirePermission(buildPermissionName('organization', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  softDeleteOrganizationController
);

router.patch(
  '/organization/restore',
  requirePermission(buildPermissionName('organization', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  restoreOrganizationController
);

router.delete(
  '/organization/hard-delete',
  requirePermission(buildPermissionName('organization', ['delete'])),
  validateRequest({ query: userIdParamsSchema }),
  hardDeleteOrganizationController
);

export function register(parent: Router) {
  parent.use('/', router);
}
