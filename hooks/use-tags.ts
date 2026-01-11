'use client';

import { useEffect, useState } from 'react';
import { Tag } from '@/supabase/types';

interface TagsData {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}

export function useTags(category?: string): TagsData {
  const [data, setData] = useState<TagsData>({
    tags: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTags = async () => {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const params = new URLSearchParams();
        params.set('sort', 'usage');
        if (category) params.set('category', category);

        const response = await fetch(`/api/tags?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        setData({
          tags: result.tags,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setData({
          tags: [],
          isLoading: false,
          error: errorMsg,
        });
      }
    };

    fetchTags();
  }, [category]);

  return data;
}
