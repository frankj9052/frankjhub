import AppDataSource from '../../config/data-source';
import { NotFoundError } from '../common/errors/NotFoundError';
import { createLoggerWithContext } from '../common/libs/logger';
import { UserProfilePayload } from './dto/userProfile.dto';
import { User } from './entities/User';

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
}
