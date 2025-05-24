import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseFile {
  id?: string;
  name: string;
  content: string;
  uploaded_at?: string;
}

export async function saveFiles(files: { name: string; content: string }[]): Promise<void> {
  // Remove all previous files (optional, or you can just insert new ones)
  await supabase.from('files').delete().neq('id', '');
  // Insert new files
  await supabase.from('files').insert(files);
}

export async function loadFiles(): Promise<SupabaseFile[]> {
  const { data, error } = await supabase.from('files').select('*').order('uploaded_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function clearFiles(): Promise<void> {
  await supabase.from('files').delete().neq('id', '');
} 