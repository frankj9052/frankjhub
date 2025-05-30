import { Router } from 'express';
import { connectionTest } from './test.controller';

const router = Router();

// ✅ 路由实现
router.get('/test', connectionTest);

export function register(parent: Router) {
  parent.use('/', router);
}
