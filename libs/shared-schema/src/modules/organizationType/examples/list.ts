import { OrderEnum } from '../../../enums/order.enum';
import { OrganizationTypeListRequest } from '../request';

export const organizationTypeListRequestData: OrganizationTypeListRequest = {
  limit: 10,
  offset: 0,
  order: OrderEnum.ASC,
  orderBy: 'name',
  search: 'finance', // 可选搜索字段
  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'inactive'],
      },
    ],
    all: [],
  },
};
