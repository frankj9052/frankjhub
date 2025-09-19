import { createFiltersSchema } from '../../../factories';
import { INVITATION_STATUS } from './status.enum';

export const invitationFiltersSchema = createFiltersSchema({
  status: INVITATION_STATUS,
});
