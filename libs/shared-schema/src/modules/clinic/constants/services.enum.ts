export const CLINIC_SERVICES = {
  // 眼科
  EYE_CARE: 'eye_care',

  // 牙科
  DENTAL: 'dental',

  // 皮肤科
  DERMATOLOGY: 'dermatology',

  // 儿科
  PEDIATRICS: 'pediatrics',

  // 内科
  INTERNAL_MEDICINE: 'internal_medicine',

  // 外科
  SURGERY: 'surgery',

  // 妇产科
  OBSTETRICS_GYNECOLOGY: 'obstetrics_gynecology',

  // 骨科
  ORTHOPEDICS: 'orthopedics',

  // 心脏科
  CARDIOLOGY: 'cardiology',

  // 精神科 / 心理健康
  PSYCHIATRY: 'psychiatry',
  MENTAL_HEALTH: 'mental_health',

  // 家庭医生 / 全科
  FAMILY_MEDICINE: 'family_medicine',
  GENERAL_PRACTICE: 'general_practice',

  // 急诊
  EMERGENCY: 'emergency',

  // 康复理疗
  PHYSIOTHERAPY: 'physiotherapy',
  REHABILITATION: 'rehabilitation',

  // 实验室 & 影像
  LABORATORY: 'laboratory',
  RADIOLOGY: 'radiology',

  // 药房
  PHARMACY: 'pharmacy',

  // 其他常见诊所服务
  IMMUNOLOGY: 'immunology',
  ALLERGY: 'allergy',
  NEUROLOGY: 'neurology',
  UROLOGY: 'urology',
  ENT: 'ent', // 耳鼻喉科
} as const;

export type ClinicService = (typeof CLINIC_SERVICES)[keyof typeof CLINIC_SERVICES];
