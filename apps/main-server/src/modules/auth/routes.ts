import './docs/openapi';
import { Router } from 'express';
import { currentUserController, loginController, logoutController } from './auth.controller';
import { loginRequestSchema } from '@frankjhub/shared-schema';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

// 统一登录入口 + 客户端用 currentUser 判断其权限 + 服务端通过中间件保护权限
router.post('/auth/login', validateRequest({ body: loginRequestSchema }), loginController);
router.get('/auth/current-user', currentUserController);
router.post('/auth/logout', logoutController);

export function register(parent: Router) {
  parent.use('/', router);
}
