import { UserPayload } from '@frankjhub/shared-schema';
import { Status } from '@frankjhub/shared-ui-hero-ssr';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSessionAsync } from './thunk';

export interface CurrentUserSliceState {
  session: UserPayload | undefined;
  sessionRequested: boolean;
  status: Status;
  errorMessage: string | undefined;
  message: string | undefined;
}

const initialState: CurrentUserSliceState = {
  session: undefined,
  sessionRequested: false,
  status: 'idle',
  errorMessage: undefined,
  message: undefined,
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<UserPayload | undefined>) => {
      state.session = action.payload;
      state.sessionRequested = true;
    },
    setSessionRequested: (state, action: PayloadAction<boolean>) => {
      state.sessionRequested = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSessionAsync.pending, state => {
        state.status = 'loading';
        state.sessionRequested = true;
      })
      .addCase(getSessionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.session = undefined;
        state.message = undefined;
        state.errorMessage = action.payload;
      })
      .addCase(getSessionAsync.fulfilled, (state, action) => {
        state.session = action.payload?.data;
        state.status = 'idle';
        state.errorMessage = undefined;
        state.message = action.payload?.message;
      });
  },
});
