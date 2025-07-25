'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';

import {
  OrderEnum,
  LabeledEnumItem,
  ORGANIZATION_ORDER_BY_FIELDS,
  organizationDataExample,
  ORGANIZATION_FILTER,
  OrganizationListResponse,
  OrganizationListRequest,
  OrganizationSingleResponse,
  OrganizationOrderByField,
} from '@frankjhub/shared-schema';

import { getAllOrganizationsAsync, getOrganizationByIdAsync } from './thunk';

import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'orgTypeName',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(ORGANIZATION_ORDER_BY_FIELDS));
const columns = generateColumnsFromData(organizationDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(ORGANIZATION_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface OrganizationSliceState {
  all: OrganizationListResponse | undefined;
  pagination: OrganizationListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: OrganizationSingleResponse;
}

const initialState: OrganizationSliceState = {
  all: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: ORGANIZATION_ORDER_BY_FIELDS.NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
  target: undefined,
};

export const organizationSlice = createSlice({
  name: 'organization',
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
    setOrderBy: (state, action: PayloadAction<OrganizationOrderByField>) => {
      state.pagination.orderBy = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.pagination.filters = action.payload;
    },
    setTarget: (state, action: PayloadAction<OrganizationSingleResponse>) => {
      state.target = action.payload;
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
      state.pagination.orderBy = ORGANIZATION_ORDER_BY_FIELDS.NAME;
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
    cleanTarget: state => {
      state.target = undefined;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllOrganizationsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllOrganizationsAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getAllOrganizationsAsync.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'idle';
      })

      .addCase(getOrganizationByIdAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getOrganizationByIdAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getOrganizationByIdAsync.fulfilled, (state, action) => {
        state.target = action.payload;
        state.status = 'idle';
      });
  },
});

export default organizationSlice.reducer;
