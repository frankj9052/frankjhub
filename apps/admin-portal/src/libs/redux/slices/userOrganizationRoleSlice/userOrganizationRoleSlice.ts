import {
  UserOrganizationRoleDto,
  UserOrganizationRoleUpdateRequest,
} from '@frankjhub/shared-schema';
import { createSlice } from '@reduxjs/toolkit';
import { getUserOrganizationRoleByUserIdAsync } from './thunk';
import { Status } from '@frankjhub/shared-ui-hero-ssr';

export interface UserOrganizationRoleSliceState {
  updateData?: UserOrganizationRoleUpdateRequest;
  userOrgRole?: UserOrganizationRoleDto;
  status: Status;
  message?: string;
}

const initialState: UserOrganizationRoleSliceState = {
  updateData: undefined,
  userOrgRole: undefined,
  status: 'idle',
  message: undefined,
};

export const userOrganizationRoleSlice = createSlice({
  name: 'user-organization-role',
  initialState,
  reducers: {
    cleanUserOrgRole: state => {
      state.userOrgRole = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserOrganizationRoleByUserIdAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserOrganizationRoleByUserIdAsync.rejected, (state, action) => {
        state.message = action.payload;
        state.status = 'failed';
      })
      .addCase(getUserOrganizationRoleByUserIdAsync.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.userOrgRole = action.payload.data;
        state.status = 'idle';
      });
  },
});
