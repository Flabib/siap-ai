// Local storage utilities for SIAP-AI

export interface Jabatan {
  id: string;
  nama_jabatan: string;
  created_at: string;
}

export interface SKJ {
  id: string;
  jabatan_id: string;
  tugas_jabatan: string;
  created_at: string;
}

export interface Pelatihan {
  id: string;
  judul_pelatihan: string;
  tema_pelatihan: string;
  created_at: string;
}

const STORAGE_KEYS = {
  JABATAN: 'siap-ai-jabatan',
  SKJ: 'siap-ai-skj',
  PELATIHAN: 'siap-ai-pelatihan',
  GEMINI_API_KEY: 'siap-ai-gemini-key',
};

// Generic storage functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Jabatan functions
export const getJabatan = (): Jabatan[] => getFromStorage<Jabatan>(STORAGE_KEYS.JABATAN);

export const saveJabatan = (jabatan: Omit<Jabatan, 'id' | 'created_at'>): Jabatan => {
  const data = getJabatan();
  const newItem: Jabatan = {
    ...jabatan,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  data.push(newItem);
  saveToStorage(STORAGE_KEYS.JABATAN, data);
  return newItem;
};

export const updateJabatan = (id: string, jabatan: Partial<Jabatan>): void => {
  const data = getJabatan();
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...jabatan };
    saveToStorage(STORAGE_KEYS.JABATAN, data);
  }
};

export const deleteJabatan = (id: string): void => {
  const data = getJabatan().filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.JABATAN, data);
};

// SKJ functions
export const getSKJ = (): SKJ[] => getFromStorage<SKJ>(STORAGE_KEYS.SKJ);

export const saveSKJ = (skj: Omit<SKJ, 'id' | 'created_at'>): SKJ => {
  const data = getSKJ();
  const newItem: SKJ = {
    ...skj,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  data.push(newItem);
  saveToStorage(STORAGE_KEYS.SKJ, data);
  return newItem;
};

export const updateSKJ = (id: string, skj: Partial<SKJ>): void => {
  const data = getSKJ();
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...skj };
    saveToStorage(STORAGE_KEYS.SKJ, data);
  }
};

export const deleteSKJ = (id: string): void => {
  const data = getSKJ().filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.SKJ, data);
};

// Pelatihan functions
export const getPelatihan = (): Pelatihan[] => getFromStorage<Pelatihan>(STORAGE_KEYS.PELATIHAN);

export const savePelatihan = (pelatihan: Omit<Pelatihan, 'id' | 'created_at'>): Pelatihan => {
  const data = getPelatihan();
  const newItem: Pelatihan = {
    ...pelatihan,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  data.push(newItem);
  saveToStorage(STORAGE_KEYS.PELATIHAN, data);
  return newItem;
};

export const updatePelatihan = (id: string, pelatihan: Partial<Pelatihan>): void => {
  const data = getPelatihan();
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...pelatihan };
    saveToStorage(STORAGE_KEYS.PELATIHAN, data);
  }
};

export const deletePelatihan = (id: string): void => {
  const data = getPelatihan().filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.PELATIHAN, data);
};

// API Key functions
export const getGeminiApiKey = (): string => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
};

export const saveGeminiApiKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
};
