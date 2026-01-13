'use client';

import { useEffect, useState, useCallback } from 'react';
import { PostWithCompany } from '@/supabase/types.supabase';

interface UsePosts {
  page: number;
  search: string;
  tagsString: string;
  companiesString?: string;
  companyId?: string;
}

interface PostsData {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePosts({
  page = 1,
  search = '',
  tagsString = '',
  companiesString = '',
  companyId = '',
}: Partial<UsePosts> = {}): PostsData {
  const [data, setData] = useState<PostsData>({
    posts: [],
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    isLoading: true,
    error: null,
  });

  const fetchPosts = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (search) params.set('search', search);
      if (tagsString) params.set('tags', tagsString);
      if (companiesString) params.set('companies', companiesString);
      if (companyId) params.set('company', companyId);

      const response = await fetch(`/api/posts?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData({
        posts: result.posts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        posts: [],
      }));
    }
  }, [page, search, tagsString, companiesString, companyId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return data;
}
