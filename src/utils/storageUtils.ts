import { get, set } from 'idb-keyval';

const ZIP_DATA_KEY = 'zip-md-data';

interface ZipData {
  files: { name: string; content: string }[];
  lastUploaded: number;
}

export const saveZipData = async (files: { name: string; content: string }[]): Promise<void> => {
  const data: ZipData = {
    files,
    lastUploaded: Date.now()
  };
  await set(ZIP_DATA_KEY, data);
};

export const loadZipData = async (): Promise<ZipData | null> => {
  const data = await get<ZipData>(ZIP_DATA_KEY);
  return data || null;
};

export const clearZipData = async (): Promise<void> => {
  await set(ZIP_DATA_KEY, null);
}; 