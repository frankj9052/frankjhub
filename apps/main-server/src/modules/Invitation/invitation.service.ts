import {
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  INVITATION_STATUS,
  InvitationDto,
  InvitationListRequest,
  InvitationListResponse,
  InvitationSingleResponse,
  IssueInvitationRequest,
  IssueInvitationResponse,
  OrderEnum,
  RoleSource,
} from '@frankjhub/shared-schema';
import AppDataSource from '../../config/data-source';
import { Invitation } from './entities/Invitation';
import { base64url, normalizeDate } from '@frankjhub/shared-utils';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { addHours } from 'date-fns';
import { BadRequestError } from '../common/errors/BadRequestError';
import { UserOrganizationRoleService } from '../userOrganizationRole/userOrganizationRole.service';
import { UserService } from '../user/user.service';
import { NotFoundError } from '../common/errors/NotFoundError';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { applyFilters } from '../common/utils/applyFilters';
import { Role } from '../role/entities/Role';
import { Organization } from '../organization/entities/Organization';
import { ForbiddenError } from '../common/errors/ForbiddenError';

const userOrgRoleService = new UserOrganizationRoleService();
const userService = new UserService();

export class InvitationService {
  private invitationRepo = AppDataSource.getRepository(Invitation);
  private orgRepo = AppDataSource.getRepository(Organization);
  private roleRepo = AppDataSource.getRepository(Role);

  buildInvitation(inv: Invitation): InvitationDto {
    return {
      id: inv.id,
      organizationId: inv.organizationId,
      organizationName: inv.organization.name,
      orgTypeId: inv.organization.orgType.id,
      orgTypeName: inv.organization.orgType.name,
      targetRoleId: inv.targetRoleId,
      targetRoleCode: inv.targetRole.code,
      targetRoleName: inv.targetRole.name,
      targetRoleSource: inv.targetRole.roleSource ?? RoleSource.ERROR,
      email: inv.email,
      status: inv.status,
      inviterUserId: inv.inviterUserId,
      inviterUserName: inv.inviterUser.userName,
      acceptedUserId: inv.acceptedUserId,
      acceptedUserName: inv.acceptedUser?.userName ?? null,
      expiresAt: normalizeDate(inv.expiresAt) ?? 'error',
      tokenHash: 'Secret',
      meta: inv.meta,
      createdBy: inv.createdBy,
      createdAt: normalizeDate(inv.createdAt) ?? 'error',
      updatedBy: inv.updatedBy,
      updatedAt: normalizeDate(inv.updatedAt),
      deletedBy: inv.deletedBy,
      deletedAt: normalizeDate(inv.deletedAt),
    };
  }
  /** 生成明文token, 返回给调用放用于发邮件，与其哈希入库 */
  async issueInvitation(data: IssueInvitationRequest): Promise<IssueInvitationResponse> {
    const { organizationId, targetRoleId, email, inviterUserId, ttlHours, meta } = data;
    if (!inviterUserId)
      throw new ForbiddenError('Missing inviter user identity — cannot issue invitation');

    // 确保role属于org或者orgType类
    const org = await this.orgRepo.findOne({
      where: { id: organizationId, isActive: true },
      select: { id: true, orgType: true },
      relations: { orgType: true },
    });
    if (!org) throw new NotFoundError('Organization does not exist!');
    const role = await this.roleRepo.findOne({
      where: { id: targetRoleId, isActive: true },
      select: { organization: true, organizationType: true },
      relations: { organization: true, organizationType: true },
    });
    if (!role) throw new NotFoundError('Role does not exist!');
    if (role.organization?.id !== org.id && role.organizationType?.id !== org.orgType.id)
      throw new BadRequestError('Role cannot be issued in this organization');

    const normalizedEmail = email.trim().toLowerCase();

    // 32字节随机串 -> base64url 明文token
    const tokenPlain = base64url(randomBytes(32));

    // use argon2id hash token
    const tokenHash = await argon2.hash(tokenPlain, { type: argon2.argon2id });

    const inv = this.invitationRepo.create({
      organizationId,
      organization: { id: organizationId },
      targetRoleId,
      targetRole: { id: targetRoleId },
      email: normalizedEmail,
      status: INVITATION_STATUS.PENDING,
      inviterUserId,
      inviterUser: { id: inviterUserId },
      acceptedUserId: null,
      expiresAt: addHours(new Date(), ttlHours ?? 72),
      tokenHash,
      meta: meta ?? null,
    });

    const savedInv = await this.invitationRepo.save(inv);
    return {
      status: 'success',
      message: 'Invitation issued successfully',
      data: {
        invitationId: savedInv.id,
        token: tokenPlain,
        expiresAt: savedInv.expiresAt.toISOString(),
      },
    };
  }

  /** 接受邀请 （必须在登陆状态下调用） */
  async acceptInvitation(data: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    const { token, currentUserId, currentUserEmail } = data;

    // 找到inv
    const candidates = await this.invitationRepo.find({
      where: { status: INVITATION_STATUS.PENDING },
      order: { createdAt: OrderEnum.DESC },
      take: 20,
    });

    // 逐个verify
    const now = new Date();
    let matched: Invitation | undefined;

    for (const inv of candidates) {
      if (inv.expiresAt <= now) continue;
      const ok = await argon2.verify(inv.tokenHash, token);
      if (ok) {
        matched = inv;
        break;
      }
    }

    if (!matched) {
      throw new BadRequestError('Invalid or expired invitation token');
    }

    // 受邀邮箱 = 登陆邮箱
    if (matched.email !== currentUserEmail.trim().toLowerCase()) {
      throw new BadRequestError('This invitation is not for your email address');
    }

    // 状态流转
    matched.status = INVITATION_STATUS.ACCEPTED;
    matched.acceptedUserId = currentUserId;
    const savedInv = await this.invitationRepo.save(matched);

    if (!savedInv.inviterUserId) {
      throw new NotFoundError('Missing inviter in invitation');
    }
    const inviterUser = await userService.getUserById(savedInv.inviterUserId);
    const inviterName = inviterUser.data.userName;

    // 授予角色
    await userOrgRoleService.createUserOrganizationRole(
      {
        organizationId: savedInv.organizationId,
        userId: savedInv.acceptedUserId ?? 'null',
        roleId: savedInv.targetRoleId,
      },
      inviterName
    );

    return {
      status: 'success',
      message: 'New role accepted!',
      data: {
        organizationId: savedInv.organizationId,
        targetRoleId: savedInv.targetRoleId,
        invitationId: savedInv.id,
      },
    };
  }

  /** 撤销邀请 */
  async revokeInvitation(invitationId: string): Promise<InvitationSingleResponse> {
    const inv = await this.invitationRepo.findOneBy({ id: invitationId });
    if (!inv) {
      throw new NotFoundError('Invitation not found!');
    }
    if (inv.status === INVITATION_STATUS.PENDING) {
      inv.status = INVITATION_STATUS.REVOKED;
      await this.invitationRepo.save(inv);
    }

    const reload = await this.invitationRepo.findOneOrFail({
      where: {
        id: invitationId,
      },
      relations: {
        organization: {
          orgType: true,
        },
        targetRole: true,
        inviterUser: true,
        acceptedUser: true,
      },
    });
    return {
      status: 'success',
      message: 'Invitation has been revoked!',
      data: this.buildInvitation(reload),
    };
  }

  /** 定时任务：过期清理/标记 */
  async expirePendingInvitations() {
    await this.invitationRepo
      .createQueryBuilder()
      .update(Invitation)
      .set({ status: INVITATION_STATUS.EXPIRED })
      .where(`status = :pending AND "expires_at" <= now()`, { pending: INVITATION_STATUS.PENDING })
      .execute();
  }

  /** 邀请列表 */
  async getInvitationList(data: InvitationListRequest): Promise<InvitationListResponse> {
    const paginatedInvitations = await paginateWithOffset({
      repo: this.invitationRepo,
      pagination: data,
      modifyQueryBuilder: qb => {
        const { search, filters } = data;
        // 搜索条件
        if (search) {
          qb.andWhere(`t.email ILIKE :search`, { search: `%${search.trim()}%` });
        }
        // 状态过滤
        applyFilters(qb, filters, {
          byKey: {
            status: {
              [INVITATION_STATUS.ACCEPTED]: `(t."deleted_at" IS NULL AND t."status" = '${INVITATION_STATUS.ACCEPTED}')`,
              [INVITATION_STATUS.EXPIRED]: `(t."deleted_at" IS NULL AND t."status" = '${INVITATION_STATUS.EXPIRED}')`,
              [INVITATION_STATUS.PENDING]: `(t."deleted_at" IS NULL AND t."status" = '${INVITATION_STATUS.PENDING}')`,
              [INVITATION_STATUS.REVOKED]: `(t."deleted_at" IS NULL AND t."status" = '${INVITATION_STATUS.REVOKED}')`,
            },
          },
        });

        return qb
          .leftJoinAndSelect(
            't.organization',
            'organization',
            `"organization"."deleted_at" IS NULL`
          )
          .leftJoinAndSelect('organization.orgType', 'orgType', `"orgType"."deleted_at" IS NULL`)
          .leftJoinAndSelect('t.targetRole', 'role', `"role"."deleted_at" IS NULL`)
          .leftJoinAndSelect('t.inviterUser', 'inviterUser', `"inviterUser"."deleted_at" IS NULL`)
          .leftJoinAndSelect(
            't.acceptedUser',
            'acceptedUser',
            `"acceptedUser"."deleted_at" IS NULL`
          )
          .withDeleted()
          .distinct(true);
      },
    });

    return {
      status: 'success',
      message: 'Get invitation list successful',
      data: {
        ...paginatedInvitations,
        data: paginatedInvitations.data.map(inv => this.buildInvitation(inv)),
      },
    };
  }

  /** 硬删除 */
  async hardDeleteInvitation(id: string): Promise<InvitationSingleResponse> {
    const inv = await this.invitationRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        organization: {
          orgType: true,
        },
        targetRole: true,
        inviterUser: true,
        acceptedUser: true,
      },
    });
    if (!inv) throw new NotFoundError('Invitation not found');
    await this.invitationRepo.delete({ id });
    return {
      status: 'success',
      message: 'Invitation permanetly deleted',
      data: this.buildInvitation(inv),
    };
  }

  async sendInvitationEmail(id: string) {
    console.log('hello');
  }
}
