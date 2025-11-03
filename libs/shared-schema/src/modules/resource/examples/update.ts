import { ResourceUpdateRequest } from '../request';

export const resourceUpdateRequestData: ResourceUpdateRequest = {
  fieldsMode: 'whitelist',
  fields: ['id', 'name', 'email'],
  isActive: true,
  metadata: {
    updatedBy: 'adminUser',
    updateReason: 'Enable resource and restrict visible fields',
    tags: ['core', 'user-module'],
  },
};
