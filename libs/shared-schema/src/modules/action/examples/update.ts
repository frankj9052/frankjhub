import { ActionUpdateRequest } from '../request';

export const actionUpdateRequestData: ActionUpdateRequest = {
  name: 'createUser',
  displayName: 'Create User',
  description: 'Allows creating a new user in the system',
  aliases: ['addUser', 'newUser'],
  sortOrder: 1,
  isActive: true,
};
