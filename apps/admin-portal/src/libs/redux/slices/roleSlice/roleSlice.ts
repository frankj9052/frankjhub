import {
  ROLE_STATUS_FILTER,
  ROLE_ORDER_BY_FIELDS,
  roleDataExample,
  RoleListRequest,
  RoleListResponse,
  RoleOptionListResponse,
  RoleSingleResponse,
  LabeledEnumItem,
  OrderEnum,
  TableColumn,
  RoleOrderByFields,
  ROLE_SOURCE_FILTER,
  RoleStatusFilter,
  makeFiltersToolkit,
  RoleSourceFilter,
} from '@frankjhub/shared-schema';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { ZodIssue } from 'zod';
import { getRoleByIdAsync, getRoleListAsync, getRoleOptionsAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: Key[] | 'all' = [
  'name',
  'code',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(ROLE_ORDER_BY_FIELDS));
const columns: TableColumn[] = generateColumnsFromData(roleDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'ACTIONS',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const statusFilters = getLabeledEnumList(ROLE_STATUS_FILTER);
const sourceFilters = getLabeledEnumList(ROLE_SOURCE_FILTER);
const initialStatusFilter = {
  any: [
    {
      key: 'status',
      values: statusFilters.map(item => item.uid),
    },
  ],
  all: [
    {
      key: 'source',
      values: sourceFilters.map(item => item.uid),
    },
  ],
};

const roleFiltersToolkit = makeFiltersToolkit({
  status: ROLE_STATUS_FILTER,
  source: ROLE_SOURCE_FILTER,
});

// 小工具：只更新某个 key 的某个分组（any/all）
function upsertClause(
  f: ReturnType<typeof roleFiltersToolkit.ensureStructured>,
  group: 'any' | 'all',
  key: 'status' | 'source',
  values: string[]
) {
  const list = (f[group] ?? []).filter(c => c.key !== key);
  if (values.length > 0) list.push({ key, values });
  f[group] = list.length ? list : undefined;
}

export interface RoleSliceState {
  all: RoleListResponse | undefined;
  pagination: RoleListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  sourceOptions: LabeledEnumItem[];
  target?: RoleSingleResponse;
  options?: RoleOptionListResponse;
  error?: string | ZodIssue[];
}

const initialState: RoleSliceState = {
  all: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: ROLE_ORDER_BY_FIELDS.NAME, // 如果你的 schema 使用 CODE 作为默认排序字段，可改为 ROLE_ORDER_BY_FIELDS.CODE
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: statusFilters,
  sourceOptions: sourceFilters,
  target: undefined,
  options: undefined,
  error: undefined,
};

export const roleSlice = createSlice({
  name: 'role',
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
    setOrderBy: (state, action: PayloadAction<RoleOrderByFields>) => {
      state.pagination.orderBy = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<RoleStatusFilter[]>) => {
      const structured = roleFiltersToolkit.ensureStructured(state.pagination.filters, {
        onUnknown: 'ignore',
      });
      upsertClause(structured, 'any', 'status', action.payload);
      state.pagination.filters = structured;
    },
    setSourceFilter: (state, action: PayloadAction<RoleSourceFilter[]>) => {
      const structured = roleFiltersToolkit.ensureStructured(state.pagination.filters, {
        onUnknown: 'ignore',
      });
      upsertClause(structured, 'all', 'source', action.payload);
      state.pagination.filters = structured;
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
      state.pagination.orderBy = ROLE_ORDER_BY_FIELDS.NAME;
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
      // list
      .addCase(getRoleListAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getRoleListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRoleListAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      // getById
      .addCase(getRoleByIdAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getRoleByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRoleByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      // options
      .addCase(getRoleOptionsAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getRoleOptionsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRoleOptionsAsync.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
        state.error = undefined;
      });
  },
});

export default roleSlice.reducer;
