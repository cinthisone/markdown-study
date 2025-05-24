import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'zip-md-data';

export interface StoredData {
  files: { name: string; content: string }[];
  lastUploaded: number;
  userId?: string; // For future multi-user support
}

export async function saveData(data: StoredData): Promise<void> {
  await set(STORAGE_KEY, data);
}

export async function getData(): Promise<StoredData | null> {
  const data = await get<StoredData>(STORAGE_KEY);
  return data || null;
}

export async function clearData(): Promise<void> {
  await del(STORAGE_KEY);
} 