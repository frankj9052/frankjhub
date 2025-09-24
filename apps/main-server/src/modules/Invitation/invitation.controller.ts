import { NextFunction, RequestHandler, Request, Response } from 'express';
import { InvitationService } from './invitation.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import {
  acceptInvitationRequestSchema,
  idParamsSchema,
  invitationListRequestSchema,
  issueInvitationRequestSchema,
} from '@frankjhub/shared-schema';

const invitationService = new InvitationService();

/**
 * 发起邀请：把某邮箱邀请进某个组织并授予目标角色
 * - 安全：inviterUserId 强制使用当前登录用户，避免伪造
 * - 返回：明文 token（仅此处返回，用于拼接邮件 magic link）、过期时间等
 */
export const issueInvitationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 需要当前用户身份
    const currentUserId = req.currentUser?.id;
    if (!currentUserId) throw new UnauthorizedError('User identity not found in request');

    // 解析 body
    const parsed = issueInvitationRequestSchema.parse(req.body);
    if (currentUserId !== parsed.inviterUserId)
      throw new UnauthorizedError('User identity not match in request');

    // 忽略/覆盖客户端传来的 inviterUserId，统一以当前用户为准
    const result = await invitationService.issueInvitation({
      ...parsed,
      inviterUserId: currentUserId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 接受邀请：登录后携带 token 接受并入组
 * - 强制受邀邮箱 = 当前登录邮箱（你的 service 已实现）
 * - 授权在 service 内完成（创建 UserOrganizationRole）
 */
export const acceptInvitationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.currentUser?.id;
    const currentUserEmail = req.currentUser?.email;
    if (!currentUserId || !currentUserEmail) {
      throw new UnauthorizedError('User identity not found in request');
    }

    const parsed = acceptInvitationRequestSchema.parse(req.body);
    if (currentUserId !== parsed.currentUserId || currentUserEmail !== parsed.currentUserEmail)
      throw new UnauthorizedError('User identity not match in request');

    const result = await invitationService.acceptInvitation({
      token: parsed.token,
      currentUserId,
      currentUserEmail,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 撤销邀请：仅 PENDING 状态可撤销
 */
export const revokeInvitationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 鉴权：需要登录（更严格可校验是否 org admin，这里保持与 role.controller.ts 同层次）
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    // 这里可支持 params 或 body，与你现有模式保持一致（role 使用 body.id）
    const parsed = idParamsSchema.parse(req.method === 'GET' ? req.params : req.body);

    const result = await invitationService.revokeInvitation(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 邀请列表：支持搜索、筛选、分页、排序
 */
export const getInvitationListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const raw = req.method === 'GET' ? req.query : req.body;
    const parsed = invitationListRequestSchema.parse(raw);

    const result = await invitationService.getInvitationList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 硬删除邀请：物理删除（仅用于数据纠错/合规清理）
 */
export const hardDeleteInvitationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const parsed = idParamsSchema.parse(req.query);

    const result = await invitationService.hardDeleteInvitation(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const sendInvitationEmailController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const parsed = idParamsSchema.parse(req.params);

    const result = await invitationService.sendInvitationEmail(parsed.id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
