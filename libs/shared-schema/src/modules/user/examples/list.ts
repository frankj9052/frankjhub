import { OrderEnum } from '../../../enums';
import { UserListRequest } from '../request/list.request.schema';

export const userListRequestData: UserListRequest = {
  limit: 10,
  offset: 0,
  order: OrderEnum.ASC, // assuming OrderEnum = "ASC" | "DESC"
  orderBy: 'createdAt',
  search: 'john',
  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'unverifiedEmail'],
      },
    ],
    all: [],
  },
};
