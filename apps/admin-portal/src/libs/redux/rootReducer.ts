import {
  actionSlice,
  currentUserSlice,
  invitationSlice,
  organizationSlice,
  organizationTypeSlice,
  permissionSlice,
  resourceSlice,
  roleSlice,
  testSlice,
  userOrganizationRoleSlice,
  usersSlice,
} from './slices';
import { serviceSlice } from './slices/serviceSlice';

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
  userOrganizationRole: userOrganizationRoleSlice.reducer,
  invitation: invitationSlice.reducer,
  service: serviceSlice.reducer,
};
