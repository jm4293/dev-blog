/**
 * Companies 서비스
 * 기업 블로그 관련 비즈니스 로직
 */

import { getSupabaseServerClient } from '@/shared/lib/supabase/server'
import { Company } from '@/shared/lib/supabase/types'

/**
 * 활성화된 기업 목록 조회
 */
export async function getActiveCompanies(): Promise<Company[]> {
  const supabase = getSupabaseServerClient()

  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return (companies as Company[]) || []
}

/**
 * 모든 기업 목록 조회
 */
export async function getAllCompanies(): Promise<Company[]> {
  const supabase = getSupabaseServerClient()

  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return (companies as Company[]) || []
}

/**
 * 특정 기업 조회
 */
export async function getCompany(companyId: string): Promise<Company | null> {
  const supabase = getSupabaseServerClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  if (error) throw error
  return company as Company | null
}

/**
 * 기업 추가
 */
export async function createCompany(
  company: Omit<Company, 'id' | 'created_at' | 'updated_at'>
): Promise<Company> {
  const supabase = getSupabaseServerClient()

  const { data: newCompany, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single()

  if (error) throw error
  return newCompany as Company
}

/**
 * 기업 수정
 */
export async function updateCompany(
  companyId: string,
  updates: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>
): Promise<Company> {
  const supabase = getSupabaseServerClient()

  const { data: updatedCompany, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', companyId)
    .select()
    .single()

  if (error) throw error
  return updatedCompany as Company
}

/**
 * 기업 삭제
 */
export async function deleteCompany(companyId: string): Promise<void> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId)

  if (error) throw error
}

/**
 * 기업 활성화/비활성화
 */
export async function toggleCompanyStatus(
  companyId: string,
  isActive: boolean
): Promise<Company> {
  return updateCompany(companyId, { is_active: isActive })
}
