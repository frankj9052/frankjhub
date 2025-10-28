import { ActionCreateRequest } from '../request';

export const actionCreateRequestData: ActionCreateRequest = {
  id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  name: 'CREATE_USER',
  displayName: 'Create User',
  description: 'Allows the creation of a new user in the system',
  aliases: ['ADD_USER', 'NEW_USER'],
  sortOrder: 1,
  isActive: true,
};
