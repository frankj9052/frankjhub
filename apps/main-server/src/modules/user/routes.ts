import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import {
  getCurrentUserController,
  getUserByIdController,
  getUserListController,
  hardDeleteUserController,
  restoreSoftDeletedUserController,
  softDeleteUserController,
  updateUserController,
} from './user.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import {
  idParamsSchema,
  userListRequestSchema,
  userUpdateRequestSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.get('/user/current-user', requireAuth, getCurrentUserController);
router.get(
  '/user/list',
  requirePermission(buildPermissionName('user', ['read'])),
  validateRequest({ query: userListRequestSchema }),
  getUserListController
);
router.get(
  '/user/:id',
  requirePermission(buildPermissionName('user', ['read'])),
  validateRequest({ params: idParamsSchema }),
  getUserByIdController
);

router.patch(
  '/user/soft-delete',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  softDeleteUserController
);

router.patch(
  '/user/restore',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ body: idParamsSchema }),
  restoreSoftDeletedUserController
);

router.delete(
  '/user/hard-delete',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ query: idParamsSchema }),
  hardDeleteUserController
);

router.patch(
  '/user/update',
  requirePermission(buildPermissionName('user', ['update'])),
  validateRequest({ body: userUpdateRequestSchema }),
  updateUserController
);

export function register(parent: Router) {
  parent.use('/', router);
}
