import './docs/openapi';
import { Router } from 'express';

import {
  createActionController,
  getAllActionsController,
  getActionByIdController,
  updateActionController,
  softDeleteActionController,
  restoreActionController,
  hardDeleteActionController,
  getActionOptionsController,
} from './action.controller';

import {
  actionCreateRequestSchema,
  actionListRequestSchema,
  actionUpdateRequestSchema,
  idParamsSchema,
} from '@frankjhub/shared-schema';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// Action routes
router.post(
  '/action',
  requirePermission(buildPermissionName('action', ['create'])),
  validateRequest({ body: actionCreateRequestSchema }),
  createActionController
);

router.get(
  '/action/list',
  requirePermission(buildPermissionName('action', ['read'])),
  validateRequest({ query: actionListRequestSchema }),
  getAllActionsController
);

router.get(
  '/action/options',
  requirePermission(buildPermissionName('action', ['read'])),
  getActionOptionsController
);

router.get(
  '/action/:id',
  requirePermission(buildPermissionName('action', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getActionByIdController
);

router.patch(
  '/action/update',
  requirePermission(buildPermissionName('action', ['update'])),
  validateRequest({ body: actionUpdateRequestSchema }),
  updateActionController
);

router.patch(
  '/action/soft-delete',
  requirePermission(buildPermissionName('action', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeleteActionController
);

router.patch(
  '/action/restore',
  requirePermission(buildPermissionName('action', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreActionController
);

router.delete(
  '/action/hard-delete',
  requirePermission(buildPermissionName('action', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteActionController
);

// Resource Routes

// Permission Routes

export function register(parent: Router) {
  parent.use('/', router);
}
