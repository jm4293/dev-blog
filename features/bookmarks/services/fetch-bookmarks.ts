import { createSupabaseServerClient } from '@/supabase/server.supabase';
import type { PostWithCompany, Bookmark } from '@/supabase/types.supabase';

export interface BookmarkWithPost extends Bookmark {
  post: PostWithCompany;
}

export interface BookmarksResponse {
  bookmarks: BookmarkWithPost[];
}

/**
 * 서버 측 북마크 조회
 */
export async function fetchBookmarks(): Promise<BookmarksResponse> {
  const supabase = await createSupabaseServerClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // 로그인하지 않은 사용자는 빈 배열 반환
  if (userError || !user) {
    return {
      bookmarks: [],
    };
  }

  // 사용자의 즐겨찾기 조회
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select(
      `
      id,
      user_id,
      post_id,
      created_at,
      post:posts(
        id,
        company_id,
        title,
        url,
        content,
        summary,
        author,
        tags,
        published_at,
        scraped_at,
        created_at,
        updated_at,
        company:companies(*)
      )
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch bookmarks');
  }

  return {
    bookmarks: (bookmarks as any) || [],
  };
}
