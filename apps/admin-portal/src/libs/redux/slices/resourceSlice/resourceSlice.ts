import {
  RESOURCE_FILTER,
  RESOURCE_ORDER_BY_FIELDS,
  resourceDataExample,
  ResourceListRequest,
  ResourceListResponse,
  ResourceOptionListResponse,
  ResourceOrderByField,
  ResourceSingleResponse,
  LabeledEnumItem,
  OrderEnum,
  TableColumn,
} from '@frankjhub/shared-schema';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { ZodIssue } from 'zod';
import { getResourceByIdAsync, getResourceListAsync, getResourceOptionsAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(RESOURCE_ORDER_BY_FIELDS));
const columns: TableColumn[] = generateColumnsFromData(resourceDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(RESOURCE_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface ResourceSliceState {
  all: ResourceListResponse | undefined;
  pagination: ResourceListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: ResourceSingleResponse;
  options?: ResourceOptionListResponse;
  error?: string | ZodIssue[];
}

const initialState: ResourceSliceState = {
  all: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: RESOURCE_ORDER_BY_FIELDS.NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
  target: undefined,
  options: undefined,
  error: undefined,
};

export const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.pagination.offset = action.payload;
    },
    setOrder: (state, action: PayloadAction<OrderEnum>) => {
      state.pagination.order = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<ResourceOrderByField>) => {
      state.pagination.orderBy = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.pagination.filters = action.payload;
    },
    cleanLimit: state => {
      state.pagination.limit = 10;
    },
    cleanOffset: state => {
      state.pagination.offset = 0;
    },
    cleanOrder: state => {
      state.pagination.order = OrderEnum.DESC;
    },
    cleanOrderBy: state => {
      state.pagination.orderBy = RESOURCE_ORDER_BY_FIELDS.NAME;
    },
    setVisibleColumn: (state, action: PayloadAction<Key[] | 'all'>) => {
      state.visibleColumns = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.pagination.search = action.payload;
    },
    cleanSearchValue: state => {
      state.pagination.search = '';
    },
    cleanStatusFilter: state => {
      state.pagination.filters = initialStatusFilter;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getResourceListAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getResourceListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getResourceListAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getResourceByIdAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getResourceByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getResourceByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getResourceOptionsAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getResourceOptionsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getResourceOptionsAsync.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
        state.error = undefined;
      });
  },
});

export default resourceSlice.reducer;
