import { currentUserSlice, testSlice, usersSlice } from './slices';

export const reducer = {
  test: testSlice.reducer,
  currentUser: currentUserSlice.reducer,
  users: usersSlice.reducer,
};
