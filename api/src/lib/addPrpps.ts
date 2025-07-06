export function addProps<T extends object, U extends object>(
  base: T,
  additions: U
): Partial<T & U> {
  return { ...base, ...additions };
}
