import { createSlice } from '@reduxjs/toolkit';

export interface StepperState {
  activeStep: number;
  stepLength: number;
}

const initialState: StepperState = {
  activeStep: 0,
  stepLength: 3,
};

export const testSlice = createSlice({
  name: 'testSlice',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setStepLength: (state, action) => {
      state.stepLength = action.payload;
    },
  },
});
