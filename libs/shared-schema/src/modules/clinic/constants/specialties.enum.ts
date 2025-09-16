import { z } from '../../../libs/z';

export const CLINIC_SPECIALTIES = {
  ALLERGY_IMMUNOLOGY: 'allergy_immunology',
  ANESTHESIOLOGY: 'anesthesiology',
  CARDIOLOGY: 'cardiology',
  DERMATOLOGY: 'dermatology',
  EMERGENCY_MEDICINE: 'emergency_medicine',
  ENDOCRINOLOGY: 'endocrinology',
  FAMILY_MEDICINE: 'family_medicine',
  GASTROENTEROLOGY: 'gastroenterology',
  GENERAL_SURGERY: 'general_surgery',
  GERIATRICS: 'geriatrics',
  HEMATOLOGY: 'hematology',
  INFECTIOUS_DISEASE: 'infectious_disease',
  INTERNAL_MEDICINE: 'internal_medicine',
  NEPHROLOGY: 'nephrology',
  NEUROLOGY: 'neurology',
  NEUROSURGERY: 'neurosurgery',
  OBSTETRICS_GYNECOLOGY: 'obstetrics_gynecology',
  OPHTHALMOLOGY: 'ophthalmology',
  ORTHOPEDICS: 'orthopedics',
  OTOLARYNGOLOGY: 'otolaryngology', // 耳鼻喉科
  PATHOLOGY: 'pathology',
  PEDIATRICS: 'pediatrics',
  PHYSICAL_MEDICINE_REHABILITATION: 'physical_medicine_rehabilitation',
  PLASTIC_SURGERY: 'plastic_surgery',
  PSYCHIATRY: 'psychiatry',
  PULMONOLOGY: 'pulmonology',
  RADIOLOGY: 'radiology',
  RHEUMATOLOGY: 'rheumatology',
  UROLOGY: 'urology',
  VASCULAR_SURGERY: 'vascular_surgery',
  DENTISTRY: 'dentistry',
  CHIROPRACTIC: 'chiropractic',
  PEDIATRIC_SURGERY: 'pediatric_surgery',
  CARDIOTHORACIC_SURGERY: 'cardiothoracic_surgery',
  NEONATOLOGY: 'neonatology',
  INFECTIOUS_DISEASE_PEDIATRICS: 'infectious_disease_pediatrics',
  NUCLEAR_MEDICINE: 'nuclear_medicine',
  OTORHINOLARYNGOLOGY: 'otorhinolaryngology', // 另一种耳鼻喉写法
  DERMATO_SURGERY: 'dermato_surgery',
  CLINICAL_GENETICS: 'clinical_genetics',
} as const;

export type ClinicSpecialty = (typeof CLINIC_SPECIALTIES)[keyof typeof CLINIC_SPECIALTIES];
export const clinicSpecialtySchema = z.nativeEnum(CLINIC_SPECIALTIES);
