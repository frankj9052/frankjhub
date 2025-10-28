import { OrderEnum } from '../../../enums/order.enum';
import { ActionListRequest } from '../request';

export const actionListRequestData: ActionListRequest = {
  limit: 10,
  offset: 0,
  order: OrderEnum.ASC, // 或 OrderEnum.DESC
  orderBy: 'name', // 可以是 'name' | 'sortOrder' | 'createdAt' | 'updatedAt'
  search: 'user', // 可选，搜索关键字
  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'deleted'], // 可以选 ACTIVE/INACTIVE/DELETED
      },
      {
        key: 'system',
        values: ['system'], // 可以选 ALL/SYSTEM/NON_SYSTEM
      },
    ],
    all: [
      {
        key: 'status',
        values: ['active'], // all 条件，必须同时满足
      },
    ],
  },
};
