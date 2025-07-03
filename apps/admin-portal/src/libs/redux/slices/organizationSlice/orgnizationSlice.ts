'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';

import {
  OrganizationPaginatedResponse,
  OrganizationPaginationParams,
  OrderEnum,
  LabeledEnumItem,
  OrganizationOrderByFieldsEnum,
  organizationWithOrgTypeDataExample,
  OrganizationFilterEnum,
  OrganizationOrderByField,
} from '@frankjhub/shared-schema';

import {
  createOrganizationAsync,
  getAllOrganizationsAsync,
  getOrganizationByIdAsync,
  hardDeleteOrganizationAsync,
  restoreOrganizationAsync,
  softDeleteOrganizationAsync,
  updateOrganizationAsync,
} from './thunk';

import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'name',
  'orgType',
  'isActive',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(OrganizationOrderByFieldsEnum));
const columns = generateColumnsFromData(organizationWithOrgTypeDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
});

const filters = getLabeledEnumList(OrganizationFilterEnum);
const initialStatusFilter = filters.map(item => item.uid);

export interface OrganizationSliceState {
  all: OrganizationPaginatedResponse;
  pagination: OrganizationPaginationParams;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  target?: {
    id: string;
    name: string;
  };
  message?: string | null;
}

const initialState: OrganizationSliceState = {
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
    orderBy: OrganizationOrderByFieldsEnum.NAME,
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
    setTarget: (state, action: PayloadAction<{ name: string; id: string }>) => {
      state.target = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
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
      state.pagination.orderBy = OrganizationOrderByFieldsEnum.NAME;
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
    cleanMessage: state => {
      state.message = undefined;
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
      })

      .addCase(createOrganizationAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(createOrganizationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(createOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(updateOrganizationAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(updateOrganizationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(updateOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(softDeleteOrganizationAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(softDeleteOrganizationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(softDeleteOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(restoreOrganizationAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(restoreOrganizationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(restoreOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload;
      })

      .addCase(hardDeleteOrganizationAsync.pending, state => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(hardDeleteOrganizationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(hardDeleteOrganizationAsync.fulfilled, (state, action) => {
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
} = organizationSlice.actions;

export default organizationSlice.reducer;
