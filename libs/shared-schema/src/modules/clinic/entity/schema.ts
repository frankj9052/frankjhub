import {
  amenityItemSchema,
  baseEntitySchema,
  emailItemSchema,
  openHoursSchema,
  phoneItemSchema,
} from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import {
  clinicServiceSchema,
  clinicSpecialtySchema,
  clinicStatusSchema,
  healthInsuranceSchema,
} from '../constants';
import { dataSourceSchema, languageSchema } from '../../../enums';

export const clinicSchema = z.object({
  ...baseEntitySchema.shape,
  /** —— 主键（外键指向 organization）—— */
  orgId: z.string().uuid(),

  /** —— 基本信息 —— */
  displayName: z.string(),
  legalName: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  status: clinicStatusSchema,

  /** —— 联系方式 —— */
  phones: z.array(phoneItemSchema).nullable().optional(),
  emails: z.array(emailItemSchema).nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  bookingUrl: z.string().nullable().optional(),
  socialLinks: z.record(z.string()).nullable().optional(),

  /** —— 地址 —— */
  addressLine1: z.string(),
  addressLine2: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  countryCode: z.string().length(2),
  formattedAddress: z.string().nullable().optional(),
  placeId: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),

  /** —— 地理位置 —— */
  lat: z.string().nullable().optional(), // 实体里 numeric 映射 string
  lng: z.string().nullable().optional(),
  location: z.any().nullable().optional(), // geography(Point,4326)，视实现可换成 GeoJSON Schema

  /** —— 营业时间/能力 —— */
  openHours: openHoursSchema.nullable().optional(),
  services: z.array(clinicServiceSchema),
  insurances: z.array(healthInsuranceSchema),
  languages: z.array(languageSchema),
  amenities: z.array(amenityItemSchema).nullable().optional(),

  wheelchairAccessible: z.boolean(),
  acceptsNewPatients: z.boolean(),
  walkIn: z.boolean(),
  telehealth: z.boolean(),
  emergency: z.boolean(),

  avgWaitMinutes: z.number().nullable().optional(),
  specialties: z.array(clinicSpecialtySchema),

  /** —— 评分与口碑 —— */
  ratingAve: z.string(), // 实体 numeric(3,2) → string
  reviewCount: z.number(),

  /** —— 媒体与内容 —— */
  logoUrl: z.string().nullable().optional(),
  photoUrls: z.array(z.string()),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()),

  /** —— 合规/备案 —— */
  licenseNumber: z.string().nullable().optional(),
  accreditations: z.array(z.string()),
  establishedYear: z.number().nullable().optional(),
  taxNumber: z.string().nullable().optional(),

  /** —— 向量检索（pgvector）—— */
  embedding: z.array(z.number()).length(1536).nullable().optional(),

  /** —— 数据治理 —— */
  dataSource: dataSourceSchema,
  sourceUpdatedAt: z.string().nullable().optional(),
  lastSyncedAt: z.string().nullable().optional(),
  dataVersion: z.number(),
});

export const clinicRefSchema = clinicSchema.pick({
  orgId: true,
  displayName: true,
  slug: true,
  city: true,
  province: true,
  postalCode: true,
  ratingAve: true,
  reviewCount: true,
  services: true,
  languages: true,
  wheelchairAccessible: true,
  acceptsNewPatients: true,
  walkIn: true,
  telehealth: true,
  emergency: true,
  logoUrl: true,
});

export type ClinicDto = zInfer<typeof clinicSchema>;
export type ClinicRef = zInfer<typeof clinicRefSchema>;
