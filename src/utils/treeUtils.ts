import type { FileEntry } from "../types";

export function flattenTree(tree: FileEntry[]): Record<string, FileEntry> {
  const result: Record<string, FileEntry> = {};
  
  function traverse(items: FileEntry[], path: string = '') {
    for (const item of items) {
      const currentPath = path ? `${path}/${item.name}` : item.name;
      result[currentPath] = item;
      if (item.children) {
        traverse(item.children, currentPath);
      }
    }
  }
  
  traverse(tree);
  return result;
} 