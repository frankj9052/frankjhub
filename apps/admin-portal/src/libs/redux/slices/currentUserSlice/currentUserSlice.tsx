import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSessionAsync, getUserProfileAsync } from './thunks';
import { GetCurrentUserResponse, UserSingleResponse } from '@frankjhub/shared-schema';

export interface CurrentUserSliceState {
  session: GetCurrentUserResponse | null;
  userProfile: UserSingleResponse | null;
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
    setSession: (state, action: PayloadAction<GetCurrentUserResponse | null>) => {
      state.session = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserSingleResponse | null>) => {
      state.userProfile = action.payload;
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
