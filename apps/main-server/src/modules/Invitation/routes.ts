import './docs/openapi';
import { Router } from 'express';
import {
  issueInvitationController,
  acceptInvitationController,
  revokeInvitationController,
  getInvitationListController,
  hardDeleteInvitationController,
  expirePendingInvitationsController,
} from './invitation.controller';

import {
  idParamsSchema,
  issueInvitationRequestSchema,
  acceptInvitationRequestSchema,
  invitationListRequestSchema,
} from '@frankjhub/shared-schema';

import { requirePermission } from '../common/middlewares/requirePermission';
import { buildPermissionName } from '../codecs/permissionCodec';
import { validateRequest } from '../common/middlewares/validateRequest';
import { SYSTEM_RESOURCES } from '../common/constants/system-resources';
import { SYSTEM_ACTIONS } from '../common/constants/system-actions';

const router = Router();

/**
 * 发起邀请
 */
router.post(
  '/invitation/issue',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.CREATE.name])
  ),
  validateRequest({ body: issueInvitationRequestSchema }),
  issueInvitationController
);

/**
 * 接受邀请
 */
router.post(
  '/invitation/accept',
  validateRequest({ body: acceptInvitationRequestSchema }),
  acceptInvitationController
);

/**
 * 撤销邀请
 */
router.patch(
  '/invitation/revoke',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.UPDATE.name])
  ),
  validateRequest({ body: idParamsSchema }),
  revokeInvitationController
);

/**
 * 邀请列表
 */
router.get(
  '/invitation/list',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.READ.name])
  ),
  validateRequest({ query: invitationListRequestSchema }),
  getInvitationListController
);

router.post(
  '/invitation/list/search',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.READ.name])
  ),
  validateRequest({ body: invitationListRequestSchema }),
  getInvitationListController
);

/**
 * 硬删除邀请
 */
router.delete(
  '/invitation/hard-delete',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.DELETE.name])
  ),
  validateRequest({ query: idParamsSchema }),
  hardDeleteInvitationController
);

/**
 * 过期处理（通常后台任务调用）
 */
router.post(
  '/invitation/expire-pending',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.UPDATE.name])
  ),
  expirePendingInvitationsController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
