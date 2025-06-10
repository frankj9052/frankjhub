import { currentUserSlice, testSlice } from './slices';

export const reducer = {
  test: testSlice.reducer,
  currentUser: currentUserSlice.reducer,
};
