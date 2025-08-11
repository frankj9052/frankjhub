// 把 as const 对象 / TS enum 转为 zod enum
import { z } from '../libs/z';

export function toZodEnum<T extends Record<string, string>>(obj: T) {
  const values = Object.values(obj);
  if (values.length === 0) throw new Error('toZodEnum: enum has no values');
  return z.enum(values as [string, ...string[]]);
}
