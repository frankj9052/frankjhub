'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';

import {
  OrderEnum,
  LabeledEnumItem,
  OrganizationTypeOrderByField,
  ORGANIZATION_TYPE_ORDER_BY_FIELDS,
  organizationTypeDataExample,
  ORGANIZATION_TYPE_FILTER,
  OrganizationTypeListResponse,
  OrganizationTypeListRequest,
  OrganizationTypeSingleResponse,
  OrganizationTypeOptionListResponse,
} from '@frankjhub/shared-schema';

import {
  getAllOrganizationTypesAsync,
  getOrganizationTypeByIdAsync,
  getOrganizationTypeOptionsAsync,
} from './thunk';

import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(ORGANIZATION_TYPE_ORDER_BY_FIELDS));
const columns = generateColumnsFromData(organizationTypeDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(ORGANIZATION_TYPE_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface OrganizationTypeSliceState {
  all: OrganizationTypeListResponse | undefined;
  pagination: OrganizationTypeListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: OrganizationTypeSingleResponse;
  options: OrganizationTypeOptionListResponse | undefined;
}

const initialState: OrganizationTypeSliceState = {
  all: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: ORGANIZATION_TYPE_ORDER_BY_FIELDS.NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
  target: undefined,
  options: undefined,
};

export const organizationTypeSlice = createSlice({
  name: 'organizationType',
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
    setOrderBy: (state, action: PayloadAction<OrganizationTypeOrderByField>) => {
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
      state.pagination.orderBy = ORGANIZATION_TYPE_ORDER_BY_FIELDS.NAME;
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
      .addCase(getAllOrganizationTypesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllOrganizationTypesAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getAllOrganizationTypesAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
      })
      .addCase(getOrganizationTypeByIdAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getOrganizationTypeByIdAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getOrganizationTypeByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
      })
      .addCase(getOrganizationTypeOptionsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getOrganizationTypeOptionsAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getOrganizationTypeOptionsAsync.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
      });
  },
});

export default organizationTypeSlice.reducer;
