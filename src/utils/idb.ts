import { set, get, del, keys } from "idb-keyval";
import type { FileEntry } from "../types";

const ZIP_KEY = "zip-md-files";

export async function saveFileTree(tree: FileEntry[]) {
  await set(ZIP_KEY, tree);
}

export async function loadFileTree(): Promise<FileEntry[] | undefined> {
  return await get(ZIP_KEY);
}

export async function clearFileTree() {
  await del(ZIP_KEY);
}

export async function hasFileTree(): Promise<boolean> {
  return (await keys()).includes(ZIP_KEY);
} 