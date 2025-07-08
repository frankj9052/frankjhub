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
  getOrgTypeOptionsController,
} from './organizationType.controller';

import {
  idParamsSchema,
  organizationTypeCreateRequestSchema,
  organizationTypeListResponseSchema,
  organizationTypeUpdateRequestSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.post(
  '/organization-type',
  requirePermission(buildPermissionName('organizationType', ['create'])),
  validateRequest({ body: organizationTypeCreateRequestSchema }),
  createOrganizationTypeController
);

router.get(
  '/organization-type/list',
  requirePermission(buildPermissionName('organizationType', ['read'])),
  validateRequest({ query: organizationTypeListResponseSchema }),
  getAllOrganizationTypesController
);

router.get(
  '/organization-type/options',
  requirePermission(buildPermissionName('organizationType', ['read'])),
  getOrgTypeOptionsController
);

router.get(
  '/organization-type/:id',
  requirePermission(buildPermissionName('organizationType', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getOrganizationTypeByIdController
);

router.patch(
  '/organization-type/update',
  requirePermission(buildPermissionName('organizationType', ['update'])),
  validateRequest({ body: organizationTypeUpdateRequestSchema }),
  updateOrganizationTypeController
);

router.patch(
  '/organization-type/soft-delete',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeleteOrganizationTypeController
);

router.patch(
  '/organization-type/restore',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreOrganizationTypeController
);

router.delete(
  '/organization-type/hard-delete',
  requirePermission(buildPermissionName('organizationType', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteOrganizationTypeController
);

export function register(parent: Router) {
  parent.use('/', router);
}
