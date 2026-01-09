'use client'

import { useEffect, useState } from 'react'
import { Company } from '@/shared/lib/supabase/types'

interface CompaniesData {
  companies: Company[]
  isLoading: boolean
  error: string | null
}

export function useCompanies(): CompaniesData {
  const [data, setData] = useState<CompaniesData>({
    companies: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      setData((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch('/api/companies')

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        setData({
          companies: result.companies,
          isLoading: false,
          error: null,
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setData({
          companies: [],
          isLoading: false,
          error: errorMsg,
        })
      }
    }

    fetchCompanies()
  }, [])

  return data
}
