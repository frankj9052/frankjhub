import { ResourceCreateRequest } from '../request/create.request.schema';

export const resourceCreateRequestData: ResourceCreateRequest = {
  namespace: 'booking',
  entity: 'appointment',
  fieldsMode: 'all',
  fields: [],
  isActive: true,
  metadata: { displayName: 'Appointment (ALL fields)' },
};
