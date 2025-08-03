import { createSlice } from '@reduxjs/toolkit';

export interface SystemSliceState {
  isFirstLoad: boolean;
}

const initialState: SystemSliceState = {
  isFirstLoad: true,
};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    markLandingSeen: state => {
      state.isFirstLoad = false;
    },
  },
});
