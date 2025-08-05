import {
  PERMISSION_FILTER,
  PERMISSION_ORDER_BY_FIELDS,
  permissionDataExample,
  PermissionListRequest,
  PermissionListResponse,
  PermissionOptionListResponse,
  PermissionOrderByField,
  PermissionSingleResponse,
  LabeledEnumItem,
  OrderEnum,
  TableColumn,
} from '@frankjhub/shared-schema';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { ZodIssue } from 'zod';
import { getPermissionByIdAsync, getPermissionListAsync, getPermissionOptionsAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(PERMISSION_ORDER_BY_FIELDS));
const columns: TableColumn[] = generateColumnsFromData(permissionDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'ACTIONS',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(PERMISSION_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface PermissionSliceState {
  all: PermissionListResponse | undefined;
  pagination: PermissionListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: PermissionSingleResponse;
  options?: PermissionOptionListResponse;
  error?: string | ZodIssue[];
}

const initialState: PermissionSliceState = {
  all: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: PERMISSION_ORDER_BY_FIELDS.NAME,
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

export const permissionSlice = createSlice({
  name: 'permission',
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
    setOrderBy: (state, action: PayloadAction<PermissionOrderByField>) => {
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
      state.pagination.orderBy = PERMISSION_ORDER_BY_FIELDS.NAME;
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
      .addCase(getPermissionListAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getPermissionListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getPermissionListAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getPermissionByIdAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getPermissionByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getPermissionByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getPermissionOptionsAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getPermissionOptionsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getPermissionOptionsAsync.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
        state.error = undefined;
      });
  },
});

export default permissionSlice.reducer;
