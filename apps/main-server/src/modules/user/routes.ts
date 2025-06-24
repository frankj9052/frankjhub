import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import {
  getCurrentUserProfileController,
  getUserAllProfileByIdController,
  getUsersAllProfileController,
} from './user.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import { userAllProfilePaginationSchema, userIdParamsSchema } from '@frankjhub/shared-schema';

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

export function register(parent: Router) {
  parent.use('/', router);
}
