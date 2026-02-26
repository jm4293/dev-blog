import { fetchPosts } from '../services';
import { PostsContainer } from '../ui';

interface PostsFetcherProps {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
  loginStatus?: string;
  errorStatus?: string;
}

export async function PostsFetcher({ page, search, tags, blogs, sort, loginStatus, errorStatus }: PostsFetcherProps) {
  const postsData = await fetchPosts({ page, search, tags, blogs, sort });

  return (
    <PostsContainer
      initialData={postsData}
      initialFilters={{ page, search, tags, blogs, sort }}
      loginStatus={loginStatus}
      errorStatus={errorStatus}
    />
  );
}
