import type { Company } from '@/supabase/types.supabase';
import { BlogLogoImage } from '@/components/image';
import { cn } from '@/utils';

interface PopularBlogsProps {
  companies: Company[];
  selectedCompanyNames: string[];
  onCompanyToggle: (companyName: string) => void;
  isLoading: boolean;
}

export function PopularBlogs({ companies, selectedCompanyNames, onCompanyToggle, isLoading }: PopularBlogsProps) {
  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">인기 블로그</p>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
        ) : (
          companies.map((company) => (
            <button
              key={company.id}
              onClick={() => onCompanyToggle(company.name)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all',
                selectedCompanyNames.includes(company.name)
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
              )}
              title={company.name}
            >
              <BlogLogoImage
                logoUrl={company.logo_url}
                companyName={company.name}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              <span className="text-xs sm:text-sm">{company.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
