export interface PostsSearchParams {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
}

export function parsePostsSearchParams(params: Record<string, string | undefined>): PostsSearchParams {
  return {
    page: Math.max(1, parseInt(params.page || '1', 10)),
    search: params.search || '',
    tags: params.tags ? params.tags.split(',').filter(Boolean) : [],
    blogs: params.blogs ? params.blogs.split(',').filter(Boolean) : [],
    sort: params.sort === 'oldest' ? 'oldest' : 'newest',
  };
}
