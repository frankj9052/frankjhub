import {
  LabeledEnumItem,
  makeFiltersToolkit,
  OrderEnum,
  SERVICE_FILTER,
  SERVICE_ORDER_BY_FIELD,
  ServiceDto,
  ServiceListPageData,
  ServiceListRequest,
  ServiceOrderByField,
  serviceSingleExample,
  ServiceStatus,
  TableColumn,
} from '@frankjhub/shared-schema';
import { Status } from '@frankjhub/shared-ui-hero-ssr';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { getServiceByIdAsync, getServiceListAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'serviceId',
  'name',
  'baseUrl',
  'description',
  'isActive',
  'actions',
];

const sortableFields = new Set(Object.values(SERVICE_ORDER_BY_FIELD));
const columns = generateColumnsFromData(serviceSingleExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'ACTIONS',
      uid: 'actions',
      sortable: false,
    },
  ],
  exclude: ['serviceSecret', 'routes', 'secretVersion'],
});
const statusFilters = getLabeledEnumList(SERVICE_FILTER);
const initialStatusFilter = {
  any: [
    {
      key: 'status',
      values: [SERVICE_FILTER.ACTIVE, SERVICE_FILTER.DELETED, SERVICE_FILTER.INACTIVE],
    },
  ],
};

const serviceFiltersToolkit = makeFiltersToolkit({
  status: SERVICE_FILTER,
});

// 小工具：只更新某个 key 的某个分组（any/all）
export function upsertClause(
  f: ReturnType<typeof serviceFiltersToolkit.ensureStructured>,
  group: 'any' | 'all',
  key: 'status',
  values: string[]
) {
  const list = (f[group] ?? []).filter(c => c.key !== key);
  if (values.length > 0) list.push({ key, values });
  f[group] = list.length ? list : undefined;
}

export interface ServiceSliceState {
  all: ServiceListPageData | undefined;
  status: Status;
  message: string | undefined;
  errorMessage: string | undefined;
  pagination: ServiceListRequest;
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target: ServiceDto | undefined;
}

const initialState: ServiceSliceState = {
  all: undefined,
  status: 'idle',
  message: undefined,
  errorMessage: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: SERVICE_ORDER_BY_FIELD.SERVICE_ID,
    search: '',
    filters: initialStatusFilter,
  },
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: statusFilters,
  target: undefined,
};

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.pagination.search = action.payload;
    },
    cleanSearchValue: state => {
      state.pagination.search = '';
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.pagination.offset = action.payload;
    },
    cleanOffset: state => {
      state.pagination.offset = 0;
    },
    setStatusFilter: (state, action: PayloadAction<ServiceStatus[]>) => {
      const structured = serviceFiltersToolkit.ensureStructured(state.pagination.filters, {
        onUnknown: 'ignore',
      });
      upsertClause(structured, 'any', 'status', action.payload);
      state.pagination.filters = structured;
    },
    cleanStatusFilter: state => {
      state.pagination.filters = initialStatusFilter;
    },
    setVisibleColumn: (state, action: PayloadAction<Key[] | 'all'>) => {
      state.visibleColumns = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    cleanLimit: state => {
      state.pagination.limit = 10;
    },
    setOrder: (state, action: PayloadAction<OrderEnum>) => {
      state.pagination.order = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<ServiceOrderByField>) => {
      state.pagination.orderBy = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getServiceListAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getServiceListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
        state.message = undefined;
      })
      .addCase(getServiceListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.errorMessage = undefined;
        state.message = action.payload.message;
        state.all = action.payload.data;
      })
      .addCase(getServiceByIdAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getServiceByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
        state.message = undefined;
      })
      .addCase(getServiceByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.errorMessage = undefined;
        state.message = action.payload.message;
        state.target = action.payload.data;
      });
  },
});
