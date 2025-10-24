/**
 * 将数组安全序列化为稳定字符串
 * - 空值或非数组返回空字符串
 * - 元素会调用 toString()，去掉空白字符串
 * - 保证稳定顺序（按元素排序）
 * @param arr 任意数组
 * @returns 稳定的字符串表示
 */
export function arrayToString<T = unknown>(arr: T[] | undefined): string {
  if (!Array.isArray(arr)) return '';

  return arr
    .map(item => (item != null ? String(item).trim() : ''))
    .filter(Boolean)
    .sort()
    .join(',');
}
