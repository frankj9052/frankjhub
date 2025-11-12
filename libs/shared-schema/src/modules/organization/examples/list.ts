import { OrderEnum } from '../../../enums/order.enum';
import { OrganizationListRequest } from '../request';

export const organizationListRequestData: OrganizationListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.DESC,
  orderBy: 'createdAt',
  search: 'healthcare', // 模糊搜索组织名称或类型
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
