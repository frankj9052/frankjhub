import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import { getCurrentUserProfileController, getUsersAll } from './user.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';

const router = Router();

router.get('/user/current-user-profile', requireAuth, getCurrentUserProfileController);
router.get(
  '/user/users-all',
  requirePermission(buildPermissionName('user', ['read'])),
  getUsersAll
);

export function register(parent: Router) {
  parent.use('/', router);
}
