import { ActionCreateRequest } from '../request';

export const actionCreateRequestData: ActionCreateRequest = {
  name: 'CREATE_USER',
  displayName: 'Create User',
  description: 'Allows the creation of a new user in the system',
  aliases: ['ADD_USER', 'NEW_USER'],
  sortOrder: 1,
  isActive: true,
};
