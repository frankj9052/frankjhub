import { ActionDetail, ActionRef, ActionSummary } from '../response';

export const actionRefData: ActionRef = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'createUser',
  displayName: 'Create User',
};

export const actionSummaryData: ActionSummary = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'createUser',
  displayName: 'Create User',
  createdAt: '2025-10-30T12:00:00Z',
  updatedAt: '2025-10-30T12:30:00Z',
  deletedAt: null,
  isSystem: true,
  sortOrder: 1,
  isActive: true,
};

export const actionDetailData: ActionDetail = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'createUser',
  displayName: 'Create User',
  aliases: ['addUser', 'newUser'],
  createdAt: '2025-10-30T12:00:00Z',
  createdBy: 'admin',
  updatedAt: '2025-10-30T12:30:00Z',
  updatedBy: 'admin',
  deletedAt: null,
  deletedBy: null,
  isSystem: true,
  sortOrder: 1,
  isActive: true,
  description: 'Allows creating a new user in the system',
};
