import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSessionAsync, getUserProfileAsync } from './thunks';

export interface Session {
  id: string;
  userName: string;
  email: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  isActive: boolean;
  orgRoles: {
    orgId: string;
    orgName: string;
    orgStragegy: string;
    roleCode: string;
    roleName: string;
    permissionStrings: string[];
  }[];
}

export interface UserProfile {
  userName: string;
  email: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dateOfBirth: string;
  honorific: string;
  oauthProvider: string;
  avatarImage: string;
}

export interface CurrentUserSliceState {
  session: Session | null;
  userProfile: UserProfile | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CurrentUserSliceState = {
  session: null,
  userProfile: null,
  status: 'idle',
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSessionAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSessionAsync.rejected, state => {
        state.session = null;
        state.status = 'failed';
      })
      .addCase(getSessionAsync.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = 'idle';
      })
      .addCase(getUserProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserProfileAsync.rejected, state => {
        state.userProfile = null;
        state.status = 'failed';
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.status = 'idle';
      });
  },
});
