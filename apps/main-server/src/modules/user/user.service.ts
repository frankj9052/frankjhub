import { Not } from 'typeorm';
import AppDataSource from '../../config/data-source';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { UserProfilePayload } from './dto/userProfile.dto';
import { User } from './entities/User';
import { UserAllProfilePayload } from './dto/userAllProfile.dto';
import { paginateWithOffset } from '../common/utils/paginateWithOffset';
import { UserPaginatedResponse, UserPaginationParams } from './dto/userAllProfilePagination.dto';

const logger = createLoggerWithContext('UserService');

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  async getCurrentUserInfo(id: string, email: string): Promise<UserProfilePayload> {
    const log = logger.child({ method: 'getCurrentUserDetail', email });
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      log.warn(`User id ${id} not exist`);
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return this.buildUserProfile(user);
  }
  buildUserProfile(user: User): UserProfilePayload {
    return {
      userName: user.userName,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      middleName: user.middleName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth.toISOString(),
      honorific: user.honorific,
      oauthProvider: user.oauthProvider,
      avatarImage: user.avatarImage,
    };
  }
  buildUserAllProfile(user: User): UserAllProfilePayload {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email ?? null,

      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName ?? null,

      gender: user.gender ?? null,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
      honorific: user.honorific ?? null,
      avatarImage: user.avatarImage ?? null,

      oauthProvider: user.oauthProvider ?? null,

      isActive: user.isActive,

      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async getUsersAllProfile(
    email: string,
    pagination: UserPaginationParams
  ): Promise<UserPaginatedResponse> {
    const paginatedUsers = await paginateWithOffset({
      repo: this.userRepo,
      where: { email: Not(email) },
      pagination,
    });
    const response = {
      ...paginatedUsers,
      data: paginatedUsers.data.map(user => this.buildUserAllProfile(user)),
    };
    return response;
  }
}
