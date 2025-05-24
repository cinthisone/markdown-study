import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'zip-md-data';
const API_URL = '/api/storage';

export interface StoredData {
  files: { name: string; content: string }[];
  lastUploaded: number;
}

function isLocalhost() {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
}

export async function saveData(data: StoredData): Promise<void> {
  if (isLocalhost()) {
    await set(STORAGE_KEY, data);
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export async function getData(): Promise<StoredData | null> {
  if (isLocalhost()) {
    const data = await get<StoredData>(STORAGE_KEY);
    return data || null;
  } else {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    return await res.json();
  }
}

export async function clearData(): Promise<void> {
  if (isLocalhost()) {
    await del(STORAGE_KEY);
  } else {
    await fetch(API_URL, { method: 'DELETE' });
  }
} 