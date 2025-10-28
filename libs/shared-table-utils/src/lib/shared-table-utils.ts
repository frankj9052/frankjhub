import { LabeledEnumItem } from '@frankjhub/shared-schema';
/**
 * 根据给定的数据对象生成 UI 表格列配置数组
 *
 * @param data - 用户数据对象（如 userAllData），用于提取字段名生成列配置
 * @param options - 可选配置项
 *   - customMappings: 自定义列名映射（如 { userName: 'NAME' }）
 *   - extraColumns: 额外添加的列（如操作列、派生字段 AGE、STATUS 等）
 *   - exclude: 要从数据中排除的字段（如 refreshToken 等敏感字段）
 *   - sortableFields: 标记为可排序的字段集合（通常来源于某个 enum）
 *
 * @returns columns - 列配置数组，用于前端表格展示
 */
export function generateColumnsFromData(
  data: Record<string, unknown>,
  {
    customMappings = {},
    extraColumns = [],
    exclude = [],
    sortableFields = new Set<string>(),
  }: {
    customMappings?: Record<string, string>; // 用于设置字段名 → 显示名映射
    extraColumns?: { name: string; uid: string; sortable?: boolean }[]; // 非数据字段手动追加
    exclude?: string[]; // 忽略掉不想展示的字段
    sortableFields?: Set<string>; // 定义哪些字段可以排序
  } = {}
) {
  return [
    // 遍历 data 中的 key，排除 exclude 中的字段
    ...Object.keys(data)
      .filter(key => !exclude.includes(key))
      .map(key => ({
        uid: key, // 字段名
        // 显示名：优先使用 customMappings 映射，否则将 camelCase 转换为大写空格分隔
        name: customMappings[key] ?? key.replace(/([A-Z])/g, ' $1').toUpperCase(),
        // 是否可排序：由 sortableFields 决定
        sortable: sortableFields.has(key),
      })),
    // 追加额外的列（如 AGE、ROLE、ACTIONS）
    ...extraColumns,
  ];
}

/**
 * 将一个 as const 枚举对象转为 { name, uid } 数组
 * @param enumObj 枚举对象
 * @returns 可用于展示的数组
 */
export function getLabeledEnumList<T extends Record<string, string>>(
  enumObj: T
): LabeledEnumItem[] {
  return Object.entries(enumObj).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // 格式化名称（可自定义）
    uid: value,
  }));
}

export const formatValue = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

type GeneralTableColumn = {
  name: string;
  uid: string;
  sortable?: boolean;
  align?: 'center' | 'start' | 'end' | undefined;
};

/**
 * 根据字段名数组生成表格列配置
 *
 * @param keys - 对象的字段名数组
 * @param options - 可选配置项
 *   - customMappings: 自定义列名映射
 *   - extraColumns: 额外添加的列
 *   - sortableFields: 可排序字段集合
 *   - alignMappings: 字段对齐方式映射
 *   - exclude: 排除的字段名数组
 *
 * @returns GeneralTableColumn[]
 */
export function generateColumnsFromKeys(
  keys: string[],
  {
    customMappings = {},
    extraColumns = [],
    sortableFields = new Set<string>(),
    alignMappings = {},
    exclude = [],
  }: {
    customMappings?: Record<string, string>;
    extraColumns?: GeneralTableColumn[];
    sortableFields?: Set<string>;
    alignMappings?: Record<string, 'start' | 'center' | 'end'>;
    exclude?: string[];
  } = {}
): GeneralTableColumn[] {
  return [
    ...keys
      .filter(key => !exclude.includes(key)) // 过滤掉需要排除的字段
      .map(key => ({
        uid: key,
        name: customMappings[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
        sortable: sortableFields.has(key),
        align: alignMappings[key] ?? 'start',
      })),
    ...extraColumns,
  ];
}
