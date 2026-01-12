import { Company } from '@/types/database';

/**
 * 인기 회사 필터링 (is_featured = true)
 */
export const getFeaturedCompanies = (companies: Company[]): Company[] => {
  return companies.filter((company) => company.is_featured);
};

/**
 * 활성화된 회사만 필터링
 */
export const getActiveCompanies = (companies: Company[]): Company[] => {
  return companies.filter((company) => company.is_active);
};

/**
 * 회사를 이름으로 검색
 */
export const searchCompanies = (
  companies: Company[],
  searchQuery: string
): Company[] => {
  if (!searchQuery.trim()) {
    return companies;
  }

  const query = searchQuery.toLowerCase();
  return companies.filter(
    (company) =>
      company.name.toLowerCase().includes(query) ||
      (company.name_en && company.name_en.toLowerCase().includes(query))
  );
};

/**
 * 회사를 이름순으로 정렬
 */
export const sortCompaniesByName = (companies: Company[]): Company[] => {
  return [...companies].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
};

/**
 * 회사 ID 문자열을 Company 객체 배열로 변환
 * @param companyIds 쉼표로 구분된 회사 ID 문자열 (e.g., "toss,kakao")
 * @param companies 전체 회사 배열
 */
export const getCompaniesByIds = (
  companyIds: string[],
  companies: Company[]
): Company[] => {
  if (!companyIds.length) {
    return [];
  }

  const idSet = new Set(companyIds);
  return companies.filter((company) => idSet.has(company.id));
};
