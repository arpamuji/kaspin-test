const STORAGE_KEYS = {
  QRIS: 'kaspin_qris',
  PIN: 'kaspin_pin',
  SETUP_AT: 'kaspin_setup_at',
} as const;

export interface KaspinStorage {
  kaspin_qris: string;
  kaspin_pin: string;
  kaspin_setup_at: number;
}

export const storage = {
  get: <K extends keyof KaspinStorage>(key: K): KaspinStorage[K] | null => {
    const value = localStorage.getItem(STORAGE_KEYS[key]);
    if (value === null) return null;
    try {
      return JSON.parse(value) as KaspinStorage[K];
    } catch {
      return value as KaspinStorage[K];
    }
  },

  set: <K extends keyof KaspinStorage>(
    key: K,
    value: KaspinStorage[K]
  ): void => {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  },

  remove: (key: keyof KaspinStorage): void => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },

  has: (key: keyof KaspinStorage): boolean => {
    return localStorage.getItem(STORAGE_KEYS[key]) !== null;
  },
};

export const qrisStorage = {
  get: () => storage.get('QRIS'),
  set: (value: string) => storage.set('QRIS', value),
  remove: () => storage.remove('QRIS'),
};

export const pinStorage = {
  get: () => storage.get('PIN'),
  set: (value: string) => storage.set('PIN', value),
  remove: () => storage.remove('PIN'),
};

export const setupAtStorage = {
  get: () => storage.get('SETUP_AT'),
  set: (value: number) => storage.set('SETUP_AT', value),
  remove: () => storage.remove('SETUP_AT'),
};
