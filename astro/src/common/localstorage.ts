import { z } from 'zod';

// ストレージ情報x
export const storageSchemas = {
  token: z.string().min(10),
} as const;

type StorageKey = keyof typeof storageSchemas;

export function setItem<K extends StorageKey>(
  key: K,
  value: z.infer<(typeof storageSchemas)[K]>,
) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<K extends StorageKey>(
  key: K,
): z.infer<(typeof storageSchemas)[K]> | undefined {
  const raw = localStorage.getItem(key);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    const schema = storageSchemas[key];
    const result = schema.safeParse(parsed);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function removeItem(key: StorageKey) {
  localStorage.removeItem(key);
}
