/**
 * 태그 조회 서비스
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface Tag {
  id: string;
  name: string;
}

/**
 * 모든 태그를 한 번만 조회
 */
export async function getAllTagsFromDatabase(supabase: SupabaseClient): Promise<Tag[]> {
  const { data: allTags, error: tagsError } = await supabase
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });

  if (tagsError || !allTags || allTags.length === 0) {
    return [];
  }

  return allTags;
}
