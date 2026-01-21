'use client';

import { useState, useEffect } from 'react';
import type { Company } from '@/supabase/types.supabase';
import { FilterModal } from '../ui';
import { CompanyLogoImage } from '../image';

interface CompanyFilterProps {
  companies: Company[];
  selectedCompanyNames: string[];
  onCompanyToggle: (companyName: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function CompanyFilter({
  companies,
  selectedCompanyNames,
  onCompanyToggle,
  isOpen,
  onClose,
  isLoading = false,
}: CompanyFilterProps) {
  // 모달 내 임시 상태 (모달이 열릴 때 초기화)
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState<string[]>(selectedCompanyNames);

  // 모달이 열릴 때 현재 선택상태로 임시상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTempSelectedCompanies(selectedCompanyNames);
    }
  }, [isOpen, selectedCompanyNames]);

  const handleTempToggle = (companyName: string) => {
    setTempSelectedCompanies((prev) =>
      prev.includes(companyName) ? prev.filter((name) => name !== companyName) : [...prev, companyName],
    );
  };

  const handleReset = () => {
    setTempSelectedCompanies([]);
  };

  const handleComplete = () => {
    // 변경된 항목들만 toggle 호출
    selectedCompanyNames.forEach((name) => {
      if (!tempSelectedCompanies.includes(name)) {
        onCompanyToggle(name);
      }
    });
    tempSelectedCompanies.forEach((name) => {
      if (!selectedCompanyNames.includes(name)) {
        onCompanyToggle(name);
      }
    });
    onClose();
  };

  return (
    <FilterModal
      title="기업 선택"
      isOpen={isOpen}
      onClose={onClose}
      onReset={handleReset}
      onComplete={handleComplete}
      isLoading={isLoading}
      isEmpty={companies.length === 0}
      emptyMessage="기업 정보가 없습니다."
    >
      {/* Companies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => handleTempToggle(company.name)}
            className={`p-4 rounded-lg transition-all flex flex-col items-center gap-2 ${
              tempSelectedCompanies.includes(company.name)
                ? 'bg-blue-600 dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <CompanyLogoImage
              logoUrl={company.logo_url}
              companyName={company.name}
              width={32}
              height={32}
              className="object-contain"
            />
            {/* Company Name */}
            <span
              className={`text-sm font-semibold text-center ${
                tempSelectedCompanies.includes(company.name) ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              {company.name}
            </span>
          </button>
        ))}
      </div>
    </FilterModal>
  );
}
