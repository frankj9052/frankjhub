import './docs/openapi';
import { Router } from 'express';
import {
  issueInvitationController,
  acceptInvitationController,
  revokeInvitationController,
  getInvitationListController,
  hardDeleteInvitationController,
  sendInvitationEmailController,
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

// 发邀请email
router.post(
  '/invitation/:id/resend',
  requirePermission(
    buildPermissionName(SYSTEM_RESOURCES.INVITATION.name, [SYSTEM_ACTIONS.UPDATE.name])
  ),
  validateRequest({ params: idParamsSchema }),
  sendInvitationEmailController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
