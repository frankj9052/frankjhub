import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { Service } from '../../service-auth/entities/Service';
import { FIELDS_MODE, FieldsMode, Qualifier } from '@frankjhub/shared-schema';
import { buildResourceKey } from '@frankjhub/shared-perm';

@Check(/* 约束命名 */ 'ck_resource_namespace_nonempty', /* SQL */ `"namespace" <> ''`)
@Check('ck_resource_entity_nonempty', `"entity" <> ''`)
@Check(
  // 若 fieldsMode = 'all'，则 fields 必须为空数组；若 'whitelist'，fields 必须非空
  'ck_resource_fields_consistency',
  `(CASE 
     WHEN "fields_mode" = 'all' THEN coalesce(cardinality("fields"),0) = 0
     WHEN "fields_mode" = 'whitelist' THEN cardinality("fields") > 0
     ELSE false
   END)`
)
@Check(
  // qualifier 只允许 NULL / '*' / ':id'
  'ck_resource_qualifier_whitelist',
  `"qualifier" IS NULL OR "qualifier" IN ('*', ':id')`
)
// 软删除下的“部分唯一索引”：同 namespace/entity/qualifier 在未删除状态下唯一
@Index('ux_resource_ns_entity_qualifier_not_deleted', ['namespace', 'entity', 'qualifier'], {
  unique: true,
  where: `"deleted_at" IS NULL`,
})
// 查询常用维度索引
@Index('ix_resource_namespace', ['namespace'])
@Index('ix_resource_entity', ['entity'])
@Entity()
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * 归属服务（namespace = serviceId）
   * 业务上直接把 serviceId 做唯一键引用，避免必须依赖其 PK 字段
   */
  @ManyToOne(() => Service, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'namespace', referencedColumnName: 'serviceId' })
  service!: Service;

  /**
   * namespace 实际存储列（与 serviceId 同名）
   * - 用列来支撑复合索引与生成列表达式
   */
  @Column({ type: 'varchar', length: 100 })
  namespace!: string;

  /** 表/聚合根标识（camel） */
  @Column({ type: 'varchar', length: 100 })
  entity!: string;

  /**
   * qualifier：集合/实例通配
   * - NULL：未指定
   * - '*'  ：集合（ALL instances）
   * - ':id'：实例（按主键占位符）
   * 若未来要支持具体实例 ID，可扩展一个 instanceId 列并做互斥约束
   */
  @Column({ type: 'varchar', length: 64, nullable: true })
  qualifier!: Qualifier;

  /** 字段选择模式：all | whitelist */
  @Column({ type: 'enum', enum: FIELDS_MODE, default: FIELDS_MODE.ALL })
  fieldsMode!: FieldsMode;

  /**
   * 字段白名单（WHITELIST 模式使用；ALL 模式必须为空）
   * - 使用 text[]，便于在 SQL 层做包含/交集检查
   * - 统一camel命名
   */
  @Column({ type: 'text', array: true, default: () => `'{}'` })
  fields!: string[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * 扩展元数据：可用于资源的字段映射、展示名、说明等
   */
  @Column({ type: 'jsonb', default: () => `'{}'` })
  metadata!: Record<string, any>;

  /**
   * 规范化的资源 Key（生成列，便于唯一检索/审计打印）
   * 形式：namespace.entity[.qualifier]
   * 注意：TypeORM 对 asExpression 的支持依赖 PG，migrations 会下发对应表达式
   */
  @Index('ux_resource_key_not_deleted', { unique: true, where: `"deleted_at" IS NULL` })
  @Column({
    type: 'varchar',
    length: 300,
    generatedType: 'STORED',
    asExpression: `
      CASE 
        WHEN "qualifier" IS NULL OR "qualifier" = '' 
          THEN "namespace" || '.' || "entity"
        ELSE "namespace" || '.' || "entity" || '.' || "qualifier"
      END
    `,
  })
  resource_key!: string;

  /** 乐观锁 */
  @VersionColumn()
  version!: number;

  /** 工具：是否匹配给定字段名（在 fieldsMode 上下文中判断） */
  allowsField(field: string): boolean {
    if (this.fieldsMode === FIELDS_MODE.ALL) return true;
    const f = (field || '').trim();
    return !!f && this.fields.includes(f);
  }

  /** 工具：返回 canonical key */
  key(): string {
    return buildResourceKey({
      namespace: this.namespace,
      entity: this.entity,
      qualifier: this.qualifier ?? undefined,
    });
  }

  /** 工厂：根据入参安全构造 */
  static createSafe(input: {
    service: Service;
    entity: string;
    qualifier?: Qualifier;
    fieldsMode?: FieldsMode;
    fields?: string[];
    isActive?: boolean;
    metadata?: Record<string, any>;
  }): Resource {
    const r = new Resource();
    r.service = input.service;
    r.namespace = input.service.serviceId;
    r.entity = input.entity;
    r.qualifier = input.qualifier ?? null;
    r.fieldsMode = input.fieldsMode ?? FIELDS_MODE.ALL;
    r.fields = input.fieldsMode === FIELDS_MODE.WHITELIST ? input.fields ?? [] : [];
    r.isActive = input.isActive ?? true;
    r.metadata = input.metadata ?? {};
    return r;
  }
}
