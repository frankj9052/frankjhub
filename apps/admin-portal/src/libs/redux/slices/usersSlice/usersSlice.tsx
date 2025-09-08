import {
  OrderEnum,
  UserOrderByField,
  LabeledEnumItem,
  USER_ORDER_BY_FIELDS,
  userDataExample,
  USER_FILTER,
  UserListResponse,
  UserListRequest,
  UserSingleResponse,
  UserOptionList,
} from '@frankjhub/shared-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserAllProfileByIdAsync,
  getUserOptionListAsync,
  getUsersAllProfileAsync,
} from './thunk';
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

const sortableFields = new Set(Object.values(USER_ORDER_BY_FIELDS));
const columns = generateColumnsFromData(userDataExample, {
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
const filters = getLabeledEnumList(USER_FILTER);
const initialStatusFilter = filters.map(item => item.uid);

export interface UsersSliceState {
  usersAllProfile: UserListResponse | undefined;
  usersAllProfilePagination: UserListRequest;
  status: 'idle' | 'loading' | 'failed';
  columns: {
    name: string;
    uid: string;
    sortable?: boolean;
  }[];
  visibleColumns: Key[] | 'all';
  statusOptions: LabeledEnumItem[];
  targetUser?: UserSingleResponse;
  userOptionList?: UserOptionList;
  selectedKey?: string;
}

const initialState: UsersSliceState = {
  usersAllProfile: undefined,
  usersAllProfilePagination: {
    limit: 10,
    offset: 0,
    order: OrderEnum.DESC,
    orderBy: USER_ORDER_BY_FIELDS.USER_NAME,
    search: '',
    filters: initialStatusFilter,
  },
  status: 'loading',
  columns,
  visibleColumns: INITIAL_VISIBLE_COLUMNS,
  statusOptions: filters,
  targetUser: undefined,
  userOptionList: [],
  selectedKey: '',
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
      state.usersAllProfilePagination.orderBy = USER_ORDER_BY_FIELDS.USER_NAME;
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
    cleanTargetUser: state => {
      state.targetUser = undefined;
    },
    setSelectedKey: (state, action: PayloadAction<string>) => {
      state.selectedKey = action.payload;
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
      })
      .addCase(getUserAllProfileByIdAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserAllProfileByIdAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getUserAllProfileByIdAsync.fulfilled, (state, action) => {
        state.targetUser = action.payload;
        state.status = 'idle';
      })
      .addCase(getUserOptionListAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserOptionListAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getUserOptionListAsync.fulfilled, (state, action) => {
        state.userOptionList = action.payload.data;
        state.status = 'idle';
      });
  },
});
