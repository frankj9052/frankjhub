/**
 * 将对象安全序列化为字符串
 * @param obj 任意对象
 * @returns JSON 字符串，若为 null/undefined 或无法序列化则返回空字符串
 */
export function safeJsonStringify(obj: unknown): string {
  if (obj == null) return '';
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
}
