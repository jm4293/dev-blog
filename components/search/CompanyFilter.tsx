'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Company } from '@/supabase/types.supabase';

interface CompanyFilterProps {
  selectedCompanyNames: string[];
  onCompanyToggle: (companyName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyFilter({ selectedCompanyNames, onCompanyToggle, isOpen, onClose }: CompanyFilterProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">회사 선택</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close modal">
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Companies Grid */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
              </div>
            ) : companies.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-600 dark:text-gray-400">회사 정보가 없습니다.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => onCompanyToggle(company.name)}
                    className={`p-4 rounded-lg transition-all flex flex-col items-center gap-2 ${
                      selectedCompanyNames.includes(company.name)
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {/* Company Logo */}
                    {company.logo_url && (
                      <img src={company.logo_url} alt={company.name} className="w-10 h-10 object-contain" />
                    )}
                    {/* Company Name */}
                    <span
                      className={`text-sm font-semibold text-center ${
                        selectedCompanyNames.includes(company.name) ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                      {company.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
            <button
              onClick={() => {
                selectedCompanyNames.forEach((companyName) => onCompanyToggle(companyName));
              }}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              초기화
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
