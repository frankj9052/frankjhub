import { UserDto } from '../entity';
import { Honorific } from '../../../enums/honorific.enum';
import { Gender } from '../../../enums/gender.enum';
import { UserUpdateRequest } from '../request';
import { UserListPageData } from '../response';

export const userDataExample: UserDto = {
  id: 'a4f5e62e-89fc-4f78-a6ab-58f3b9c9aabc',
  userName: 'frankjia',
  email: 'frank@example.com',
  firstName: 'Frank',
  lastName: 'Jia',
  middleName: null,
  gender: Gender.MALE,
  dateOfBirth: '1990-01-01T00:00:00.000Z',
  honorific: Honorific.MR,
  avatarImage: null,
  oauthProvider: 'google',
  oauthId: null,
  isActive: true,
  emailVerified: true,
  profileCompleted: true,
  refreshToken: null,
  sessionVersion: 'v1',
  createdAt: '2024-01-01T12:00:00.000Z',
  createdBy: null,
  updatedAt: '2024-06-01T12:00:00.000Z',
  updatedBy: null,
  deletedAt: null,
  deletedBy: null,
};

export const userUpdateRequestDataExample: UserUpdateRequest = {
  id: '8c315298-90f6-4af1-bb33-6b37e58973ae',
  userName: 'johndoe',
  email: 'johndoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  middleName: 'A.',
  gender: Gender.MALE, // 来自 Gender enum
  dateOfBirth: '1990-01-01',
  honorific: Honorific.MR, // 来自 Honorific enum
  avatarImage: 'https://example.com/avatar.jpg',
  isActive: true,
  emailVerified: true,
  profileCompleted: true,
};

export const userListPageDataExample: UserListPageData = {
  data: [userDataExample],
  total: 1,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'frank',
  filters: ['active', 'verifiedEmail'],
};
