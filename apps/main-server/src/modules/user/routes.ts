import './docs/openapi';
import { Router } from 'express';
import { requireAuth } from '../auth/middlewares/requireAuth';
import { getCurrentUserProfileController } from './user.controller';

const router = Router();

router.get('/user/current-user-profile', requireAuth, getCurrentUserProfileController);

export function register(parent: Router) {
  parent.use('/', router);
}
