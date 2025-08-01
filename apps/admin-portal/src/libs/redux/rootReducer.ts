import {
  actionSlice,
  currentUserSlice,
  organizationSlice,
  organizationTypeSlice,
  resourceSlice,
  testSlice,
  usersSlice,
} from './slices';

export const reducer = {
  test: testSlice.reducer,
  currentUser: currentUserSlice.reducer,
  users: usersSlice.reducer,
  organizationType: organizationTypeSlice.reducer,
  organization: organizationSlice.reducer,
  action: actionSlice.reducer,
  resource: resourceSlice.reducer,
};
