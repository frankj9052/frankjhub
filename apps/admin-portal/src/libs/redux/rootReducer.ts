import {
  actionSlice,
  currentUserSlice,
  organizationSlice,
  organizationTypeSlice,
  permissionSlice,
  resourceSlice,
  roleSlice,
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
  permission: permissionSlice.reducer,
  role: roleSlice.reducer,
};
