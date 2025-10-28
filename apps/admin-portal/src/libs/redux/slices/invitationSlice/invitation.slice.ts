import {
  INVITATION_ORDER_BY_FIELDS,
  INVITATION_STATUS,
  invitationDataExample,
  InvitationListPageData,
  InvitationListRequest,
  InvitationOrderByFIelds,
  InvitationStatus,
  LabeledEnumItem,
  makeFiltersToolkit,
  OrderEnum,
  StructuredFilters,
  TableColumn,
} from '@frankjhub/shared-schema';
import { Status } from '@frankjhub/shared-ui-hero-ssr';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-table-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';
import { getInvitationListAsync } from './thunk';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'email',
  'organizationName',
  'orgTypeName',
  'targetRoleName',
  'inviterUserName',
  'acceptedUserName',
  'expiresAt',
  'actions',
];

const sortableFields = new Set(Object.values(INVITATION_ORDER_BY_FIELDS));
const columns = generateColumnsFromData(invitationDataExample, {
  sortableFields,
  extraColumns: [
    {
      name: 'ACTIONS',
      uid: 'actions',
      sortable: false,
    },
  ],
  exclude: ['organizationId'],
});
const statusFilters = getLabeledEnumList(INVITATION_STATUS);
const initialStatusFilter = {
  any: [
    {
      key: 'status',
      values: [INVITATION_STATUS.PENDING],
    },
  ],
};

const invitationFiltersToolkit = makeFiltersToolkit({
  status: INVITATION_STATUS,
});

// 小工具：只更新某个 key 的某个分组（any/all）
export function upsertClause(
  f: StructuredFilters,
  group: 'any' | 'all',
  key: 'status',
  values: string[]
) {
  const list = (f[group] ?? []).filter(c => c.key !== key);
  if (values.length > 0) list.push({ key, values });
  f[group] = list.length ? list : undefined;
}

export interface InvitationSliceState {
  all: InvitationListPageData | undefined;
  status: Status;
  message: string | undefined;
  errorMessage: string | undefined;
  pagination: InvitationListRequest;
  columns: TableColumn[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
}

const initialState: InvitationSliceState = {
  all: undefined,
  status: 'idle',
  message: undefined,
  errorMessage: undefined,
  pagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: INVITATION_ORDER_BY_FIELDS.CREATED_AT,
    search: '',
    filters: initialStatusFilter,
  },
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: statusFilters,
};

export const invitationSlice = createSlice({
  name: 'invitation',
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
    setStatusFilter: (state, action: PayloadAction<InvitationStatus[]>) => {
      const structured = invitationFiltersToolkit.ensureStructured(state.pagination.filters, {
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
    setOrderBy: (state, action: PayloadAction<InvitationOrderByFIelds>) => {
      state.pagination.orderBy = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getInvitationListAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getInvitationListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
        state.message = undefined;
      })
      .addCase(getInvitationListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.errorMessage = undefined;
        state.message = action.payload.message;
        state.all = action.payload.data;
      });
  },
});
