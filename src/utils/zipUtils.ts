import type { FileEntry } from '../types';

export async function extractZip(file: File): Promise<{ name: string; content: string }[]> {
  const JSZip = await import('jszip');
  const zip = new JSZip.default();
  const zipData = await zip.loadAsync(file);
  const files: { name: string; content: string }[] = [];

  for (const [path, entry] of Object.entries(zipData.files)) {
    if (!entry.dir) {
      const content = await entry.async('text');
      files.push({ name: path, content });
    }
  }

  return files;
}

// If you need a function to convert a flat file list to a tree, use this:
export function filesToTree(files: { name: string; content: string }[]): FileEntry[] {
  const tree: FileEntry[] = [];
  const map = new Map<string, FileEntry>();

  files.forEach(file => {
    const parts = file.name.split('/');
    let currentPath = '';
    let parent: FileEntry | undefined;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map.has(currentPath)) {
        const node: FileEntry = {
          name: part,
          content: isLast ? file.content : '',
          isDir: !isLast,
          children: !isLast ? [] : undefined
        };
        map.set(currentPath, node);

        if (parent) {
          parent.children?.push(node);
        } else {
          tree.push(node);
        }
      }
      parent = map.get(currentPath);
    });
  });

  return tree;
} 