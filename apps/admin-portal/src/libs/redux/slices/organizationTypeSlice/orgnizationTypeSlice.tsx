'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';

import {
  OrganizationTypePaginatedResponse,
  OrganizationTypePaginationParams,
  OrderEnum,
  OrganizationTypeSchema,
  LabeledEnumItem,
  OrganizationTypeOrderByFieldsEnum,
  organizationTypeAllDataExample,
  OrganizationTypeFilterEnum,
  OrganizationTypeOrderByField,
} from '@frankjhub/shared-schema';

import {
  createOrganizationTypeAsync,
  getAllOrganizationTypesAsync,
  getOrganizationTypeByIdAsync,
  hardDeleteOrganizationTypeAsync,
  restoreOrganizationTypeAsync,
  softDeleteOrganizationTypeAsync,
  updateOrganizationTypeAsync,
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

const sortableFields = new Set(Object.values(OrganizationTypeOrderByFieldsEnum));
const columns = generateColumnsFromData(organizationTypeAllDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(OrganizationTypeFilterEnum);
const initialStatusFilter = filters.map(item => item.uid);

export interface OrganizationTypeSliceState {
  all: OrganizationTypePaginatedResponse;
  pagination: OrganizationTypePaginationParams;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: OrganizationTypeSchema;
  message?: string | null;
}

const initialState: OrganizationTypeSliceState = {
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
    orderBy: OrganizationTypeOrderByFieldsEnum.NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
  target: undefined,
  message: null,
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
      state.pagination.orderBy = OrganizationTypeOrderByFieldsEnum.NAME;
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
      .addCase(createOrganizationTypeAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(createOrganizationTypeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      .addCase(createOrganizationTypeAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(updateOrganizationTypeAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(updateOrganizationTypeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      .addCase(updateOrganizationTypeAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(softDeleteOrganizationTypeAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(softDeleteOrganizationTypeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      .addCase(softDeleteOrganizationTypeAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(restoreOrganizationTypeAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(restoreOrganizationTypeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      .addCase(restoreOrganizationTypeAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(hardDeleteOrganizationTypeAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(hardDeleteOrganizationTypeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
      })
      .addCase(hardDeleteOrganizationTypeAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      });
  },
});

export const {
  setLimit,
  setOffset,
  setOrder,
  setOrderBy,
  setStatusFilter,
  cleanLimit,
  cleanOffset,
  cleanOrder,
  cleanOrderBy,
  setVisibleColumn,
  setSearchValue,
  cleanSearchValue,
  cleanStatusFilter,
  cleanTarget,
} = organizationTypeSlice.actions;

export default organizationTypeSlice.reducer;
