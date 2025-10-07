// 注册所有 service-auth 路由
import './docs/openapi';
import { Router } from 'express';
import {
  createServiceController,
  getJwksController,
  getServiceByIdController,
  getServiceListController,
  getSnapshotController,
  hardDeleteServiceController,
  restoreServiceController,
  serviceLoginController,
  softDeleteServiceController,
  updateServiceController,
} from './serviceAuth.controller';
import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { SYSTEM_RESOURCES } from '../common/constants/system-resources';
import { SYSTEM_ACTIONS } from '../common/constants/system-actions';
import { validateRequest } from '../common/middlewares/validateRequest';
import {
  idParamsSchema,
  serviceCreateRequestSchema,
  serviceListRequestSchema,
  serviceUpdateRequestSchema,
} from '@frankjhub/shared-schema';

const router = Router();

router.post('/auth/service-login', serviceLoginController);
router.get('/.well-known/jwks.json', getJwksController); // ✅ 业界标准路径

// 新建测试
// 1) 管理端 CRUD（省略）
// 2) 发布快照（给网关用）
router.get('/registry/snapshot', getSnapshotController);

/** 管理端：创建服务 */
router.post(
  '/service',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.CREATE.name])
  ),
  validateRequest({ body: serviceCreateRequestSchema }),
  createServiceController
);

/** 管理端：服务列表（Query 方式） */
router.get(
  '/service/list',
  requirePermission(buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.READ.name])),
  validateRequest({ query: serviceListRequestSchema }),
  getServiceListController
);

/** 管理端：更新服务 */
router.patch(
  '/service/update',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.UPDATE.name])
  ),
  validateRequest({ body: serviceUpdateRequestSchema }),
  updateServiceController
);

/** 管理端：软删除 */
router.patch(
  '/service/soft-delete',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.SOFT_DELETE.name])
  ),
  validateRequest({ body: idParamsSchema }),
  softDeleteServiceController
);

/** 管理端：恢复 */
router.patch(
  '/service/restore',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.RESTORE.name])
  ),
  validateRequest({ body: idParamsSchema }),
  restoreServiceController
);

/** 管理端：硬删除（query 传 id） */
router.delete(
  '/service/hard-delete',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.HARD_DELETE.name])
  ),
  validateRequest({ query: idParamsSchema }),
  hardDeleteServiceController
);

router.get(
  '/service/:id',
  requirePermission(buildPermissionName(SYSTEM_RESOURCES.SERVICE.name, [SYSTEM_ACTIONS.READ.name])),
  getServiceByIdController
);

export function register(parent: Router) {
  parent.use('/', router);
}
