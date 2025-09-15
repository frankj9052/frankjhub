/**
 * 依赖：
 * - PostGIS（geography(Point,4326)）
 * - pgvector（vector(1536)）
 *
 * 注：TypeORM 对 pgvector 没有内置类型守护，注意这样写法
 */

import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { CLINIC_STATUS, ClinicStatus, EmailType, PhoneType } from '@frankjhub/shared-schema';

@Entity()
@Index('uq_clinic_slug', ['slug'], { unique: true })
@Index('ix_clinic_city', ['city'])
@Index('ix_clinic_postal_code', ['postalCode'])
@Index('ix_clinic_status', ['status'])
export class Clinic extends BaseEntity {
  // 作为主键，外键指向organization
  @PrimaryColumn('uuid', { name: 'org_id' })
  orgId!: string;

  // 展示名（对外）
  @Column('varchar', { name: 'display_name', length: 255 })
  displayName!: string;

  // 法定名称（对账/合同）
  @Column('varchar', { name: 'legal_name', length: 255, nullable: true })
  legalName?: string | null;

  // URL 友好路径（SEO）
  @Column('varchar', { name: 'slug', length: 160, nullable: true, unique: true })
  slug?: string | null;

  // 诊所状态
  @Column('enum', { enum: CLINIC_STATUS, default: CLINIC_STATUS.ACTIVE })
  status!: ClinicStatus;

  // ====== 联系方式 ======
  @Column('jsonb', { name: 'phones', nullable: true })
  phones?: Array<{
    type: PhoneType;
    number: string;
    ext?: string;
    contry_code?: string;
    is_public?: boolean;
  }> | null;

  @Column('jsonb', { name: 'emails', nullable: true })
  emails?: Array<{
    type: EmailType;
    email: string;
    is_public?: boolean;
  }> | null;

  @Column('text', { name: 'website_url', nullable: true })
  websiteUrl?: string | null;

  @Column('text', { name: 'booking_url', nullable: true })
  bookingUrl?: string | null;

  @Column('jsonb', { name: 'social_links', nullable: true })
  socialLinks?: Record<string, string> | null;

  // 地址
  @Column('varchar', { name: 'address_line1', length: 255 })
  addressLine1!: string;

  @Column('varchar', { name: 'address_line2', length: 255, nullable: true })
  addressLine2?: string | null;

  @Column('varchar', { name: 'unit', length: 50, nullable: true })
  unit?: string | null;

  @Column('varchar', { name: 'city', length: 120 })
  city!: string;

  // 存标准码
  @Column('varchar', { name: 'province', length: 50 })
  province!: string;

  @Column('varchar', { name: 'postal_code', length: 20 })
  postalCode!: string;

  // ISO-3166-1 alpha-2
  @Column('char', { name: 'country_code', length: 2, default: 'CA' })
  contryCode!: string;

  @Column('text', { name: 'formatted_address', nullable: true })
  formattedAddress?: string | null;

  //   地图平台的Place/Location ID(google: place_id)
  @Column('varchar', { name: 'place_id', length: 120, nullable: true })
  placeId?: string | null;

  //   时区
  @Column('varchar', { name: 'timezone', length: 60, nullable: true })
  timezone?: string | null;

  // ====== 地理（PostGIS）======
  @Column('numeric', { name: 'lat', precision: 9, scale: 6, nullable: true })
  lat?: string | null;

  @Column('numeric', { name: 'lng', precision: 9, scale: 6, nullable: true })
  lng?: string | null;

  // 需要PostGIS: geography(Point, 4326)
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    name: 'location',
    nullable: true,
  } as any)
  location?: unknown | null;

  // ====== 营业时间 & 服务能力 ======
  @Column('jsonb', { name: 'open_hours', nullable: true })
  openHours?: {
    weekly?: Record<string, Array<{ open: string; close: string }>>;
    exceptions?: Array<{
      date: string;
      closed?: boolean;
      open?: string;
      close?: string;
      note?: string;
    }>;
  } | null;

  //   提供的服务: family_medicine, eye_care
  @Column('text', { name: 'services', array: true, default: '{}' })
  services!: string[];

  // 可直付/报销的保险（OHIP, Sun Life...）
  @Column('text', { name: 'insurances', array: true, default: '{}' })
  insurances!: string[];

  // 服务语言
  @Column('text', { name: 'languages', array: true, default: '{}' })
  languages!: string[];

  // 设施: 停车、轮椅通道、洗手间等
  @Column('jsonb', { name: 'amenities', nullable: true })
  amenities?: Array<{ key: string; label: string; value?: boolean | string }> | null;

  // 无障碍布尔（便于筛选）
  @Column('boolean', { name: 'wheelchair_accessible', default: false })
  wheelchairAccessible!: boolean;

  // 以下是一些运营布尔（便于筛选）
  @Column('boolean', { name: 'accepts_new_patients', default: true })
  acceptsNewPatients!: boolean;

  @Column('boolean', { name: 'walk_in', default: false })
  walkIn!: boolean;

  @Column('boolean', { name: 'teleHealth', default: false })
  telehealth!: boolean;

  @Column('boolean', { name: 'emergency', default: false })
  emergency!: boolean;

  // 评价等候时间（分钟）
  @Column('smallint', { name: 'avg_wait_minutes', nullable: true })
  avgWaitMinutes?: number | null;

  // 专科方向
  @Column('text', { name: 'specialties', array: true, default: '{}' })
  specialties!: string[];

  // ====== 平分与口碑 ======
  @Column('numeric', {
    name: 'rating_avg',
    precision: 3,
    scale: 2,
    default: 0,
    comment: '0.00 ~ 5.00',
  })
  ratingAve!: string;

  @Column('integer', { name: 'review_count', default: 0 })
  reviewCount!: number;

  // ====== 媒体与内容 ======
  @Column('text', { name: 'logo_url', nullable: true })
  logoUrl?: string | null;

  @Column('text', { name: 'photo_urls', array: true, default: '{}' })
  photoUrls!: string[];

  @Column('varchar', { name: 'short_description', length: 280, nullable: true })
  shortDescription?: string | null;

  @Column('text', { name: 'description', nullable: true })
  description?: string | null;

  @Column('text', { name: 'tags', array: true, default: '{}' })
  tags!: string[];

  // ====== 合规/备案 ======
  @Column('varchar', { name: 'license_number', length: 120, nullable: true })
  licenseNumber?: string | null;

  @Column('text', { name: 'accreditations', array: true, default: '{}' })
  accreditations!: string[];

  @Column('smallint', { name: 'established_year', nullable: true })
  establishedYear?: number | null;

  @Column('varchar', { name: 'tax_number', length: 120, nullable: true })
  taxNumber?: string | null;

  // ====== 向量检索(pgvector) ======
  // 1536 维向量(pgvector扩展)
  @Column({ type: 'vector' as any, length: 1536, name: 'embedding', nullable: true })
  embedding?: number[] | null;

  // ====== 数据治理 ======
  // 数据来源：manual, google, partner_jurong
  @Column('varchar', { name: 'data_source', length: 60, default: 'manual' })
  dataSource!: string;

  // 外部源的更新时间（用于增量同步）
  @Column('timestamptz', { name: 'source_updated_at', nullable: true })
  sourceUpdatedAt?: Date | null;

  //   最近同步时间
  @Column('timestamptz', { name: 'last_synced_at', nullable: true })
  lastSyncedAt?: Date | null;

  // 数据版本（幂等/乐观锁）
  @Column('integer', { name: 'data_version', default: 1 })
  dataVersion!: number;
}
