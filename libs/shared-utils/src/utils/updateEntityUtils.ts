export function updateEntityFields<T extends object>(
  entity: T,
  updates: Partial<T>,
  allowedFields: (keyof T)[]
): void {
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      entity[field] = updates[field];
    }
  }
}
