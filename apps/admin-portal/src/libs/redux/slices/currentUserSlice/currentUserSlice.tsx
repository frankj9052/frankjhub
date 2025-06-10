import { createSlice } from '@reduxjs/toolkit';
import { getSessionAsync } from './thunks';

interface Session {
  status: string;
  data: {
    id: string;
    userName: string;
    email: string;
    emailVerified: boolean;
    profileCompleted: boolean;
    isActive: boolean;
    orgRoles: {
      orgId: string;
      orgName: string;
      roleCode: string;
      roleName: string;
      permissionStrings: string[];
    }[];
  };
}

export interface CurrentUserSliceState {
  session: Session | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CurrentUserSliceState = {
  session: null,
  status: 'idle',
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSessionAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSessionAsync.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getSessionAsync.fulfilled, (state, action) => {
        console.log('payload check ===> ', action.payload);
      });
  },
});
