/**
 * GET /api/companies
 * 기업 목록 조회 (활성화된 기업만)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/shared/lib/supabase/server'
import { Company } from '@/shared/lib/supabase/types'

interface CompaniesResponse {
  companies: Company[]
  total: number
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()

    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    const response: CompaniesResponse = {
      companies: (companies as Company[]) || [],
      total: companies?.length || 0,
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('Companies API error:', errorMsg)

    return NextResponse.json(
      { error: 'Failed to fetch companies', details: errorMsg },
      { status: 500 }
    )
  }
}
