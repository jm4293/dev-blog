import { PostWithCompany, Bookmark } from '@/supabase/types.supabase';

export interface BookmarkWithPost extends Bookmark {
  post: PostWithCompany;
}

export interface BookmarksResponse {
  bookmarks: BookmarkWithPost[];
}

export interface AddBookmarkResponse {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
