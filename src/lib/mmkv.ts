import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({ id: "starhandyman-storage" });

// TTL-based cache helper
export const cache = {
  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    storage.set(
      key,
      JSON.stringify({
        data,
        expiresAt: Date.now() + ttlMs,
      }),
    );
  },

  get<T>(key: string): T | null {
    const raw = storage.getString(key);
    if (!raw) return null;

    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      storage.delete(key);
      return null;
    }
    return data as T;
  },

  delete(key: string): void {
    storage.delete(key);
  },

  clear(): void {
    storage.clearAll();
  },
};
