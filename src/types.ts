export interface FileEntry {
  name: string;
  content?: string;
  isDir: boolean;
  children?: FileEntry[];
} 