import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseFile {
  id?: string;
  name: string;
  content: string;
  uploaded_at?: string;
  user_id?: string;
}

export async function saveFiles(files: { name: string; content: string }[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  // Remove all previous files for this user
  await supabase.from('files').delete().eq('user_id', user.id);
  // Insert new files with user_id
  const filesWithUser = files.map(file => ({ ...file, user_id: user.id }));
  const { error } = await supabase.from('files').insert(filesWithUser);
  if (error) {
    console.error('Error inserting files:', error);
    alert('Error saving files: ' + error.message);
  }
}

export async function loadFiles(): Promise<SupabaseFile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function clearFiles(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  await supabase.from('files').delete().eq('user_id', user.id);
} 