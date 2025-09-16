import { z } from '../libs/z';

export const DATA_SOURCE = {
  MANUAL: 'manual', // 手动录入
  GOOGLE: 'google', // Google 数据
  YELP: 'yelp', // Yelp 数据
  HEALTH_CANADA: 'health_canada', // 加拿大卫生部数据
  PROVINCIAL_DATABASE: 'provincial_database', // 省级数据库，例如 OHIP 医疗提供者列表
  INSURANCE_PROVIDER: 'insurance_provider', // 来自保险公司
  PARTNER_CLINIC: 'partner_clinic', // 合作诊所提供的数据
} as const;

export type DataSource = (typeof DATA_SOURCE)[keyof typeof DATA_SOURCE];
export const dataSourceSchema = z.nativeEnum(DATA_SOURCE);
