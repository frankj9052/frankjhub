// 注册所有 service-auth 路由
import './docs/openapi';
import { Router } from 'express';
import {
  getJwksController,
  getSnapshotController,
  serviceLoginController,
} from './serviceAuth.controller';

const router = Router();

router.post('/auth/service-login', serviceLoginController);
router.get('/.well-known/jwks.json', getJwksController); // ✅ 业界标准路径

// 新建测试
// 1) 管理端 CRUD（省略）
// 2) 发布快照（给网关用）
router.get('/registry/snapshot', getSnapshotController);

export function register(parent: Router) {
  parent.use('/', router);
}
