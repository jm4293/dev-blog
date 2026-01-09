'use client'

import { useEffect, useState, useCallback } from 'react'
import { PostWithCompany } from '@/shared/lib/supabase/types'

interface BookmarksData {
  posts: PostWithCompany[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isLoading: boolean
  error: string | null
}

export function useBookmarks(userId: string | null = null, page: number = 1) {
  const [data, setData] = useState<BookmarksData>({
    posts: [],
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    isLoading: true,
    error: null,
  })

  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: 'User not logged in',
      }))
      return
    }

    setData((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const params = new URLSearchParams()
      params.set('userId', userId)
      params.set('page', page.toString())

      const response = await fetch(`/api/bookmarks?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      setData({
        posts: result.posts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        posts: [],
      }))
    }
  }, [userId, page])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const addBookmark = useCallback(
    async (postId: string) => {
      if (!userId) return

      try {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, postId }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        // 북마크 목록 새로고침
        fetchBookmarks()
      } catch (err) {
        console.error('Failed to add bookmark:', err)
      }
    },
    [userId, fetchBookmarks]
  )

  const removeBookmark = useCallback(
    async (postId: string) => {
      if (!userId) return

      try {
        const response = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, postId }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        // 북마크 목록 새로고침
        fetchBookmarks()
      } catch (err) {
        console.error('Failed to remove bookmark:', err)
      }
    },
    [userId, fetchBookmarks]
  )

  return { ...data, addBookmark, removeBookmark }
}
