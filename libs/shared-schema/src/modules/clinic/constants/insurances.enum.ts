import { z } from '../../../libs/z';

export const HEALTH_INSURANCES = {
  // 政府医保
  OHIP: 'ohip',

  // 私人保险公司
  SUN_LIFE: 'sun_life',
  MANULIFE: 'manulife',
  GREEN_SHIELD: 'green_shield',
  GREAT_WEST_LIFE: 'great_west_life',
  CANADA_LIFE: 'canada_life',
  BLUE_CROSS: 'blue_cross',
  INDUSTRIAL_ALLIANCE: 'industrial_alliance',
  DESJARDINS: 'desjardins',
  RBC_INSURANCE: 'rbc_insurance',
  TD_INSURANCE: 'td_insurance',
  COWAN: 'cowan',
} as const;

export type HealthInsurance = (typeof HEALTH_INSURANCES)[keyof typeof HEALTH_INSURANCES];
export const healthInsuranceSchema = z.nativeEnum(HEALTH_INSURANCES);
