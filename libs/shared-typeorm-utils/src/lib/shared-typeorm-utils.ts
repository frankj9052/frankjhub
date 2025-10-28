import { ObjectLiteral } from 'typeorm';

/**
 * 将实体字段名（camelCase）转换为 SQL 列名（snake_case），并自动加上表别名前缀。
 * 适用于在 QueryBuilder 的原生 SQL 语句中书写列名。
 * 类型安全
 *
 * @example
 *   col<Action>('displayName')            // => "t.display_name"
 *   col<Action>('deletedAt', 'action')    // => "action.deleted_at"
 *
 * @param column - 实体字段名（camelCase）
 * @param alias  - 表别名（默认 't'）
 */
export function col<T extends ObjectLiteral>(column: keyof T & string, alias = 't'): string {
  const snake = column.replace(/([A-Z])/g, '_$1').toLowerCase();
  return `${alias}.${snake}`;
}
