import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import { getCurrentUserProfileController, getUsersAllProfileController } from './user.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import { userAllProfilePaginationSchema } from './dto/userAllProfilePagination.dto';

const router = Router();

router.get('/user/current-user-profile', requireAuth, getCurrentUserProfileController);
router.get(
  '/user/users-all-profile',
  requirePermission(buildPermissionName('user', ['read'])),
  validateRequest({ query: userAllProfilePaginationSchema }),
  getUsersAllProfileController
);

export function register(parent: Router) {
  parent.use('/', router);
}
