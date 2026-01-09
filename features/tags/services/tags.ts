/**
 * Tags 서비스
 * 태그 관련 비즈니스 로직
 */

import { getSupabaseServerClient } from '@/shared/lib/supabase/server'
import { Tag } from '@/shared/lib/supabase/types'

/**
 * 모든 태그 조회
 */
export async function getAllTags(sort: 'name' | 'usage' = 'usage'): Promise<Tag[]> {
  const supabase = getSupabaseServerClient()

  let query = supabase.from('tags').select('*')

  if (sort === 'name') {
    query = query.order('name', { ascending: true })
  } else {
    query = query.order('usage_count', { ascending: false })
  }

  const { data: tags, error } = await query

  if (error) throw error
  return (tags as Tag[]) || []
}

/**
 * 카테고리별 태그 조회
 */
export async function getTagsByCategory(category: string): Promise<Tag[]> {
  const supabase = getSupabaseServerClient()

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .eq('category', category)
    .order('usage_count', { ascending: false })

  if (error) throw error
  return (tags as Tag[]) || []
}

/**
 * 특정 태그 조회
 */
export async function getTag(tagName: string): Promise<Tag | null> {
  const supabase = getSupabaseServerClient()

  const { data: tag, error } = await supabase
    .from('tags')
    .select('*')
    .eq('name', tagName)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found
    throw error
  }

  return tag as Tag | null
}

/**
 * 태그 생성
 */
export async function createTag(
  name: string,
  category?: string
): Promise<Tag> {
  const supabase = getSupabaseServerClient()

  const { data: tag, error } = await supabase
    .from('tags')
    .insert([{ name, category }])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // 중복 태그
      const existing = await getTag(name)
      if (existing) return existing
    }
    throw error
  }

  return tag as Tag
}

/**
 * 태그 사용 횟수 증가
 */
export async function incrementTagUsage(tagName: string): Promise<void> {
  const supabase = getSupabaseServerClient()

  const tag = await getTag(tagName)

  if (!tag) {
    // 태그가 없으면 생성
    await createTag(tagName)
  } else {
    // 태그가 있으면 사용 횟수 증가
    const { error } = await supabase
      .from('tags')
      .update({ usage_count: (tag.usage_count || 0) + 1 })
      .eq('id', tag.id)

    if (error) throw error
  }
}

/**
 * 여러 태그 생성/업데이트
 */
export async function upsertTags(
  tagNames: string[],
  category?: string
): Promise<Tag[]> {
  const tags: Tag[] = []

  for (const name of tagNames) {
    try {
      const tag = await createTag(name, category)
      tags.push(tag)
    } catch (err) {
      // 이미 존재하는 태그는 넘어감
      const existing = await getTag(name)
      if (existing) {
        tags.push(existing)
      }
    }
  }

  return tags
}
