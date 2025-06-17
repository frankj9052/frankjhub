import './docs/openapi';
import { Router } from 'express';
import { currentUserController, loginController, logoutController } from './auth.controller';
import { loginSchema } from './dto/login.dto';
import { requireAuth } from './middlewares/requireAuth';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// 这个先弃用
router.post('/auth/login', validateRequest({ body: loginSchema }), loginController);

// platform admin login
router.post('/auth/platform/login');
router.get('/auth/current-user', requireAuth, currentUserController);
router.get('/auth/logout', requireAuth, logoutController);

export function register(parent: Router) {
  parent.use('/', router);
}
