import {
  ACTION_FILTER,
  ACTION_ORDER_BY_FIELDS,
  actionDataExample,
  ActionListRequest,
  ActionListResponse,
  ActionOptionListResponse,
  ActionOrderByField,
  ActionSingleResponse,
  LabeledEnumItem,
  OrderEnum,
  TableColumn,
} from '@frankjhub/shared-schema';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { ZodIssue } from 'zod';
import { getActionByIdAsync, getActionListAsync, getActoinOptionsAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(ACTION_ORDER_BY_FIELDS));
const columns: TableColumn[] = generateColumnsFromData(actionDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(ACTION_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface ActionSliceState {
  all: ActionListResponse;
  pagination: ActionListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: ActionSingleResponse;
  options?: ActionOptionListResponse;
  error?: string | ZodIssue[];
}

const initialState: ActionSliceState = {
  all: {
    data: [],
    total: 0,
    pageCount: 0,
    pageSize: 0,
    currentPage: 0,
  },
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: ACTION_ORDER_BY_FIELDS.NAME,
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

export const actionSlice = createSlice({
  name: 'action',
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
    setOrderBy: (state, action: PayloadAction<ActionOrderByField>) => {
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
      state.pagination.orderBy = ACTION_ORDER_BY_FIELDS.NAME;
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
      .addCase(getActionListAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getActionListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getActionListAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getActionByIdAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getActionByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getActionByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
        state.error = undefined;
      })
      .addCase(getActoinOptionsAsync.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getActoinOptionsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getActoinOptionsAsync.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
        state.error = undefined;
      });
  },
});

export default actionSlice.reducer;
