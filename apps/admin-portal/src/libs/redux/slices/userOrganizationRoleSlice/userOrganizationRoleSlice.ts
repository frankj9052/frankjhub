import {
  OrganizationRoleRef,
  RoleOption,
  UserOrganizationRoleDto,
  UserOrganizationRoleUpdateRequest,
} from '@frankjhub/shared-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserOrganizationRoleByUserIdAsync } from './thunk';
import { Status } from '@frankjhub/shared-ui-hero-ssr';

export interface UserOrganizationRoleSliceState {
  updateData?: UserOrganizationRoleUpdateRequest;
  userOrgRole?: UserOrganizationRoleDto;
  status: Status;
  message?: string;
  createOrgInput: string;
  selectedOrg: string;
  createRoleInput: string;
}

const initialState: UserOrganizationRoleSliceState = {
  updateData: undefined,
  userOrgRole: undefined,
  status: 'idle',
  message: undefined,
  createOrgInput: '',
  selectedOrg: '',
  createRoleInput: '',
};

export const userOrganizationRoleSlice = createSlice({
  name: 'user-organization-role',
  initialState,
  reducers: {
    cleanUserOrgRole: state => {
      state.userOrgRole = undefined;
    },
    addNewOrgToUser: (state, action: PayloadAction<OrganizationRoleRef>) => {
      if (state.userOrgRole) {
        state.userOrgRole?.organizations.push(action.payload);
      }
    },
    removeOrgFromUser: (state, action: PayloadAction<string>) => {
      if (state.userOrgRole) {
        state.userOrgRole.organizations = state.userOrgRole?.organizations.filter(
          org => org.id !== action.payload
        );
      }
    },
    setCreateOrgInput: (state, action: PayloadAction<string>) => {
      state.createOrgInput = action.payload;
    },
    cleanCreateOrgInput: state => {
      state.createOrgInput = '';
    },
    setSelectedOrg: (state, action: PayloadAction<string>) => {
      state.selectedOrg = action.payload;
    },
    setCreateRoleInput: (state, action: PayloadAction<string>) => {
      state.createRoleInput = action.payload;
    },
    cleanCreateRoleInput: state => {
      state.createRoleInput = '';
    },
    addNewRoleToUser: (state, action: PayloadAction<RoleOption>) => {
      const orgId = state.selectedOrg;
      if (!orgId || !state.userOrgRole?.organizations) return;

      const org = state.userOrgRole.organizations.find(o => o.id === orgId);
      if (!org) return;

      if (!org.roles) org.roles = [];

      const exists = org.roles.some(r => r.id === action.payload.id);
      if (!exists) {
        org.roles.push(action.payload);
      }
    },
    removeRoleFromUser: (state, action: PayloadAction<string>) => {
      const orgId = state.selectedOrg;
      const roleId = action.payload;
      if (!orgId || !state.userOrgRole?.organizations) return;

      const org = state.userOrgRole.organizations.find(o => o.id === orgId);
      if (!org || !org.roles || org.roles.length === 0) return;

      const i = org.roles.findIndex(r => r.id === roleId);
      if (i !== -1) org.roles.splice(i, 1);
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
