// 注册所有 service-auth 路由
import { Router } from 'express';
import { serviceLoginController } from './serviceAuth.controller';

const router = Router();

router.post('/auth/service-login', serviceLoginController);

export function register(parent: Router) {
  parent.use('/', router);
}
