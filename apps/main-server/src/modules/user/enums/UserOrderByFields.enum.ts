export const UserOrderByFieldsEnum = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  USER_NAME: 'userName',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  GENDER: 'gender',
  EMAIL: 'email',
  DATE_OF_BIRTH: 'dateOfBirth',
} as const;

// 👇 类型提取（用于 typing）
export type UserOrderByFieldsEnum = typeof UserOrderByFieldsEnum;
