export const SYSTEM_ORGANIZATION_TYPES = {
  PUBLIC: {
    name: 'public',
    description:
      'Represents a shared organization used for global or unscoped resources that are accessible across tenants.',
  },
  PLATFORM: {
    name: 'platform',
    description:
      'Represents the platform-level organization with full system-level permissions, typically used by internal platform administrators.',
  },
  CLINIC: {
    name: 'clinic',
    description:
      'Represents an individual clinic organization, typically used to manage clinic-specific users, data, and operations.',
  },
  SCHOOL: {
    name: 'school',
    description:
      'Represents an educational organization, such as a school or training center, responsible for managing students, staff, courses, and educational resources.',
  },
  RESTAURANT: {
    name: 'restaurant',
    description:
      'Represents a food and beverage service organization, used for managing menus, orders, staff, and customer engagement.',
  },
};

export type SystemOrganizationType =
  (typeof SYSTEM_ORGANIZATION_TYPES)[keyof typeof SYSTEM_ORGANIZATION_TYPES]['name'];
