import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';

@Entity()
@Index('ux_action_name_not_deleted', ['name'], { unique: true, where: `"deleted_at" IS NULL` })
@Index('idx_action_aliases_gin', { synchronize: false }) // 这里只做标记，实际用 migration 建
@Check(
  // 仅允许小写字母/数字/下划线/中划线，且非空
  'ck_action_name_format',
  `("name" ~ '^[a-z0-9_-]+$') AND ("name" <> '')`
)
export class Action extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * 规范化键：全局唯一，小写，`^[a-z0-9_-]+$`
   * 例：read / create / update / delete / list / export / import / approve
   */
  @Column({ type: 'varchar', length: 64 })
  name!: string;

  /** 展示名（可用于后台 UI），可中英文 */
  @Column({ type: 'varchar', length: 128, default: '' })
  displayName!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description?: string;

  /** 别名（历史/兼容用），如 ["READ","Read"]；业务层可按需反查 */
  @Column({ type: 'text', array: true, nullable: true })
  aliases!: string[] | null;

  /** 是否系统内置（建议业务层禁止删除/改名） */
  @Column({ type: 'boolean', default: false })
  isSystem!: boolean;

  /** 排序用（管理端展示） */
  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    if (typeof this.name === 'string') {
      this.name = this.name.trim().toLowerCase();
    }
    if (typeof this.displayName === 'string') {
      this.displayName = this.displayName.trim();
    }
    if (typeof this.description === 'string') {
      this.description = this.description.trim();
    }
    if (Array.isArray(this.aliases)) {
      // 统一别名规范：去空白、去空项、去重
      const seen = new Set<string>();
      this.aliases = this.aliases
        .map(a => (a ?? '').trim())
        .filter(a => a.length > 0)
        .filter(a => (seen.has(a) ? false : (seen.add(a), true)));
    }
  }
}
