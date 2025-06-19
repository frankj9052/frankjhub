import './docs/openapi';
import { Router } from 'express';
import { currentUserController, loginController, logoutController } from './auth.controller';
import { loginSchema } from '@frankjhub/shared-schema';
import { requireAuth } from './middlewares/requireAuth';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// 统一登录入口 + 客户端用 currentUser 判断其权限 + 服务端通过中间件保护权限
router.post('/auth/login', validateRequest({ body: loginSchema }), loginController);
router.get('/auth/current-user', requireAuth, currentUserController);
router.get('/auth/logout', requireAuth, logoutController);

export function register(parent: Router) {
  parent.use('/', router);
}
