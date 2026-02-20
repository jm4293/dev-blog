import { fetchPosts } from '../services/fetchPosts';
import { PostsContainer } from './PostsContainer';

interface PostsFetcherProps {
  isLoggedIn: boolean;
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
  loginStatus?: string;
  errorStatus?: string;
}

export async function PostsFetcher({
  isLoggedIn,
  page,
  search,
  tags,
  blogs,
  sort,
  loginStatus,
  errorStatus,
}: PostsFetcherProps) {
  const postsData = await fetchPosts({ page, search, tags, blogs, sort });

  return (
    <PostsContainer
      isLoggedIn={isLoggedIn}
      initialData={postsData}
      initialFilters={{ page, search, tags, blogs, sort }}
      loginStatus={loginStatus}
      errorStatus={errorStatus}
    />
  );
}
