import supabase from '@/lib/supabase/client';

export async function createPost(content: string) {
  const { data, error } = await supabase.from('posts').insert({ content });
  if (error) throw error;
  return data;
}
