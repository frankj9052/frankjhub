import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import {
  getCurrentUserProfileController,
  getUserAllProfileByIdController,
  getUsersAllProfileController,
  hardDeleteUserController,
  restoreSoftDeletedUserController,
  softDeleteUserController,
  updateUserByAdminController,
} from './user.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import {
  userAdminUpdateSchema,
  userAllProfilePaginationSchema,
  userIdParamsSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.get('/user/current-user-profile', requireAuth, getCurrentUserProfileController);
router.get(
  '/user/users-all-profile',
  requirePermission(buildPermissionName('user', ['read'])),
  validateRequest({ query: userAllProfilePaginationSchema }),
  getUsersAllProfileController
);
router.get(
  '/user/:id',
  requirePermission(buildPermissionName('user', ['read'])),
  validateRequest({ params: userIdParamsSchema }),
  getUserAllProfileByIdController
);

router.patch(
  '/user/soft-delete',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  softDeleteUserController
);

router.patch(
  '/user/restore',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  restoreSoftDeletedUserController
);

router.delete(
  '/user/hard-delete',
  requirePermission(buildPermissionName('user', ['delete'])),
  validateRequest({ body: userIdParamsSchema }),
  hardDeleteUserController
);

router.patch(
  '/user/admin-update',
  requirePermission(buildPermissionName('user', ['update'])),
  validateRequest({ body: userAdminUpdateSchema }),
  updateUserByAdminController
);

export function register(parent: Router) {
  parent.use('/', router);
}
