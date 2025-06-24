import {
  OrderEnum,
  userAllData,
  UserFilterEnum,
  UserOrderByField,
  UserOrderByFieldsEnum,
  UserPaginatedResponse,
  UserPaginationParams,
  LabeledEnumItem,
  UserStatusFilter,
} from '@frankjhub/shared-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsersAllProfileAsync } from './thunk';
import { generateColumnsFromData, getLabeledEnumList } from '@frankjhub/shared-utils';
import { Key } from 'react';

const INITIAL_VISIBLE_COLUMNS: string[] = [
  'userName',
  'oauthProvider',
  'emailVerified',
  'profileCompleted',
  'isActive',
  'createdAt',
  'deletedAt',
  'actions',
];

const sortableFields = new Set(Object.values(UserOrderByFieldsEnum));
const columns = generateColumnsFromData(userAllData, {
  sortableFields,
  extraColumns: [
    {
      name: 'Actions',
      uid: 'actions',
      sortable: false,
    },
  ],
  exclude: ['email', 'avatarImage', 'refreshToken', 'sessionVersion'],
});
const filters = getLabeledEnumList(UserFilterEnum);
const initialStatusFilter = filters.map(item => item.uid);

export interface UsersSliceState {
  usersAllProfile: UserPaginatedResponse;
  usersAllProfilePagination: UserPaginationParams;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
}

const initialState: UsersSliceState = {
  usersAllProfile: {
    data: [],
    total: 0,
    pageCount: 0,
    pageSize: 0,
    currentPage: 0,
  },
  usersAllProfilePagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: UserOrderByFieldsEnum.USER_NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.usersAllProfilePagination.limit = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.usersAllProfilePagination.offset = action.payload;
    },
    setOrder: (state, action: PayloadAction<OrderEnum>) => {
      state.usersAllProfilePagination.order = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<UserOrderByField>) => {
      state.usersAllProfilePagination.orderBy = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.usersAllProfilePagination.filters = action.payload;
    },
    cleanLimit: state => {
      state.usersAllProfilePagination.limit = 10;
    },
    cleanOffset: state => {
      state.usersAllProfilePagination.offset = 0;
    },
    cleanOrder: state => {
      state.usersAllProfilePagination.order = OrderEnum.DESC;
    },
    cleanOrderBy: state => {
      state.usersAllProfilePagination.orderBy = UserOrderByFieldsEnum.USER_NAME;
    },
    setVisibleColumn: (state, action: PayloadAction<Key[] | 'all'>) => {
      state.visibleColumns = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.usersAllProfilePagination.search = action.payload;
    },
    cleanSearchValue: state => {
      state.usersAllProfilePagination.search = '';
    },
    cleanStatusFilter: state => {
      state.usersAllProfilePagination.filters = initialStatusFilter;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUsersAllProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUsersAllProfileAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getUsersAllProfileAsync.fulfilled, (state, action) => {
        state.usersAllProfile = action.payload;
        state.status = 'idle';
      });
  },
});
