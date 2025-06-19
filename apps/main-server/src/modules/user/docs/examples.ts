import {
  Gender,
  Honorific,
  UserAllProfilePayload,
  UserProfilePayload,
} from '@frankjhub/shared-schema';

export const userBasicData: UserProfilePayload = {
  userName: 'frankjia',
  email: 'test@example.com',
  lastName: 'Jia',
  firstName: 'Frank',
  middleName: 'M',
  gender: Gender.MALE,
  dateOfBirth: '1990-01-01T00:00:00.000Z',
  honorific: Honorific.MR,
  oauthProvider: 'google',
  avatarImage: 'https://example.com/avatar.jpg',
};

export const userAllData: UserAllProfilePayload = {
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
  updatedAt: '2024-06-01T12:00:00.000Z',
};
