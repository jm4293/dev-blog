import type { Company } from '@/supabase/types.supabase';
import { CompanyLogoImage } from '@/components/image';

interface PopularCompaniesProps {
  companies: Company[];
  selectedCompanyNames: string[];
  onCompanyToggle: (companyName: string) => void;
  isLoading: boolean;
}

export function PopularCompanies({
  companies,
  selectedCompanyNames,
  onCompanyToggle,
  isLoading,
}: PopularCompaniesProps) {
  if (companies.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 기업</p>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
        ) : (
          companies.map((company) => (
            <button
              key={company.id}
              onClick={() => onCompanyToggle(company.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                selectedCompanyNames.includes(company.name)
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={company.name}
            >
              <CompanyLogoImage
                logoUrl={company.logo_url}
                companyName={company.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs sm:text-sm">{company.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
