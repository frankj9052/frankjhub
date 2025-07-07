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
  getOrganizationOptionListController,
} from './organization.controller';

import {
  organizationCreateSchema,
  organizationUpdateSchema,
  organizationPaginationSchema,
  idParamsSchema,
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
  '/organization/options',
  requirePermission(buildPermissionName('organization', ['read'])),
  getOrganizationOptionListController
);

router.get(
  '/organization/:id',
  requirePermission(buildPermissionName('organization', ['read'])),
  validateRequest({ params: idParamsSchema }),
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
  validateRequest({ body: idParamsSchema }),
  softDeleteOrganizationController
);

router.patch(
  '/organization/restore',
  requirePermission(buildPermissionName('organization', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreOrganizationController
);

router.delete(
  '/organization/hard-delete',
  requirePermission(buildPermissionName('organization', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteOrganizationController
);

export function register(parent: Router) {
  parent.use('/', router);
}
