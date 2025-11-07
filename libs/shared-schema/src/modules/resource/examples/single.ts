import { ResourceDetail, ResourceRef, ResourceSummary } from '../response';

export const resourceRefData: ResourceRef = {
  id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
  resource_key: 'main.user.:id',
};

export const resourceSummaryData: ResourceSummary = {
  id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
  namespace: 'main',
  entity: 'user',
  qualifier: ':id',
  fieldsMode: 'whitelist',
  fields: ['id', 'name', 'email'],
  isActive: true,
  resource_key: 'main.user.:id',
  createdAt: '2025-10-30T10:00:00.000Z',
  deletedAt: null,
};

export const resourceDetailData: ResourceDetail = {
  id: 'f93e9d4b-8473-4e0b-a2f9-456e8a547d81',
  namespace: 'main-server',
  entity: 'appointment',
  qualifier: ':id',
  resource_key: 'main-server.appointment:id',
  fieldsMode: 'whitelist',
  fields: ['id', 'patientId', 'doctorId', 'startTime', 'endTime', 'status'],
  metadata: {
    description: 'Appointment resource with booking details',
    versionControlled: true,
    apiPath: '/api/appointments/:id',
  },
  isActive: true,
  version: 3,
  createdAt: '2025-11-06T14:10:32.450Z',
  updatedAt: '2025-11-06T14:20:15.112Z',
  deletedAt: null,
  createdBy: 'system-admin',
  updatedBy: 'frankjia',
  deletedBy: null,
  service: {
    id: 'a2f4f395-64b7-4f92-9239-8d57d2dbf8c4',
    serviceId: 'booking',
    name: 'Booking Service',
    baseUrl: 'https://booking.noqclinic.dev',
    isActive: true,
    createdAt: '2025-10-15T12:00:00.000Z',
    updatedAt: '2025-11-01T09:45:23.000Z',
    lastRotatedAt: '2025-10-31T00:00:00.000Z',
    ownerTeam: 'scheduling',
    deletedAt: null,
  },
};
