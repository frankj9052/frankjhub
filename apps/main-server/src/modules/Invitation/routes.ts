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
import { validateRequest } from '../common/middlewares/validateRequest';
import { SYSTEM_RESOURCES } from '../common/constants/system-resources';
import { SYSTEM_ACTIONS } from '../common/constants/system-actions';
import { buildResourceKey, buildSingleActionPermissionName } from '@frankjhub/shared-perm';

const router = Router();

const resource_key_collection = buildResourceKey({
  namespace: SYSTEM_RESOURCES.MAIN.namespace,
  entity: 'invitation',
  qualifier: '*',
});

const resource_key_item = buildResourceKey({
  namespace: SYSTEM_RESOURCES.MAIN.namespace,
  entity: 'invitation',
  qualifier: ':id',
});

/**
 * 发起邀请
 */
router.post(
  '/invitation/issue',
  requirePermission(
    buildSingleActionPermissionName(resource_key_collection, SYSTEM_ACTIONS.CREATE.name)
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
    buildSingleActionPermissionName(resource_key_collection, SYSTEM_ACTIONS.UPDATE.name)
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
    buildSingleActionPermissionName(resource_key_collection, SYSTEM_ACTIONS.READ.name)
  ),
  validateRequest({ query: invitationListRequestSchema }),
  getInvitationListController
);

// router.post(
//   '/invitation/list/search',
//   requirePermission(buildSingleActionPermissionName(resource_key_item, SYSTEM_ACTIONS.READ.name)),
//   validateRequest({ body: invitationListRequestSchema }),
//   getInvitationListController
// );

/**
 * 硬删除邀请
 */
router.delete(
  '/invitation/hard-delete',
  requirePermission(
    buildSingleActionPermissionName(resource_key_collection, SYSTEM_ACTIONS.HARD_DELETE.name)
  ),
  validateRequest({ query: idParamsSchema }),
  hardDeleteInvitationController
);

// 发邀请email
router.post(
  '/invitation/:id/resend',
  requirePermission(buildSingleActionPermissionName(resource_key_item, SYSTEM_ACTIONS.UPDATE.name)),
  validateRequest({ params: idParamsSchema }),
  sendInvitationEmailController
);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
