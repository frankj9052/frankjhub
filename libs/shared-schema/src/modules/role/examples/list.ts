import { OrderEnum } from '../../../enums';
import { RoleListRequest } from '../request';

export const roleListRequestData: RoleListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.ASC,
  orderBy: 'name',
  search: 'admin',

  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'inactive'],
      },
    ],
    all: [
      {
        key: 'source',
        values: ['source_organization_type'],
      },
    ],
  },
};
