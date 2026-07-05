'use client';

import { useMemo, useState } from 'react';
import { useToast } from '@/hooks';
import { Search } from 'lucide-react';
import { useInterestCompanyOptions, useInterestTagOptions, useNotificationPreferences } from '../hooks';
import type { Preferences } from '../types';

interface NotificationInterestsProps {
  preferences: Preferences;
}

interface InterestChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

// 접힌 상태에서 보여줄 회사 칩 개수
const COMPANY_PREVIEW_COUNT = 24;

function InterestChip({ label, isSelected, onToggle }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
        isSelected
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * 관심 태그/회사 설정 — 선택하면 해당 항목의 새 글만 Push 알림을 받는다.
 * 아무것도 선택하지 않으면 모든 새 글 알림을 받는다.
 * 회사는 140개+라 선택 항목 상단 고정 + 검색 + 더보기로 접어서 보여준다.
 */
export function NotificationInterests({ preferences }: NotificationInterestsProps) {
  const { updateInterests } = useNotificationPreferences();
  const { data: tagsData } = useInterestTagOptions();
  const { data: companiesData } = useInterestCompanyOptions();
  const { showToast } = useToast();

  const [companyQuery, setCompanyQuery] = useState('');
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  const selectedTags = preferences.subscribed_tags;
  const selectedCompanyIds = preferences.subscribed_company_ids;
  const isAllSelected = selectedTags.length === 0 && selectedCompanyIds.length === 0;

  const companies = companiesData?.companies || [];

  const selectedCompanies = useMemo(
    () => companies.filter((company) => selectedCompanyIds.includes(company.id)),
    [companies, selectedCompanyIds],
  );

  // 검색어 필터 (미선택 회사만 — 선택된 회사는 상단에 항상 표시)
  const filteredCompanies = useMemo(() => {
    const unselected = companies.filter((company) => !selectedCompanyIds.includes(company.id));
    const query = companyQuery.trim().toLowerCase();
    if (!query) {
      return unselected;
    }
    return unselected.filter(
      (company) => company.name.toLowerCase().includes(query) || (company.name_en || '').toLowerCase().includes(query),
    );
  }, [companies, selectedCompanyIds, companyQuery]);

  // 검색 중이면 결과 전체, 아니면 접힘/펼침 상태에 따라 노출
  const isSearching = companyQuery.trim().length > 0;
  const visibleCompanies =
    isSearching || showAllCompanies ? filteredCompanies : filteredCompanies.slice(0, COMPANY_PREVIEW_COUNT);
  const hiddenCount = filteredCompanies.length - visibleCompanies.length;

  const mutateInterests = (input: { subscribed_tags?: string[]; subscribed_company_ids?: string[] }) => {
    updateInterests.mutate(input, {
      onError: () => showToast({ message: '관심사 설정 변경에 실패했습니다.', type: 'error' }),
    });
  };

  const toggleTag = (name: string) => {
    const next = selectedTags.includes(name) ? selectedTags.filter((t) => t !== name) : [...selectedTags, name];
    mutateInterests({ subscribed_tags: next });
  };

  const toggleCompany = (id: string) => {
    const next = selectedCompanyIds.includes(id)
      ? selectedCompanyIds.filter((c) => c !== id)
      : [...selectedCompanyIds, id];
    mutateInterests({ subscribed_company_ids: next });
  };

  const resetAll = () => {
    mutateInterests({ subscribed_tags: [], subscribed_company_ids: [] });
  };

  return (
    <div className="border-t border-border pt-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">관심사 설정</p>
        {!isAllSelected && (
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            전체 알림으로 초기화
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {isAllSelected
          ? '현재 모든 새 글 알림을 받고 있어요. 태그나 회사를 선택하면 해당 글만 알림을 받습니다.'
          : '선택한 태그/회사의 새 글이 있을 때만 알림을 받습니다.'}
      </p>

      {tagsData && tagsData.tags.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs text-muted-foreground">
            태그
            {selectedTags.length > 0 && <span className="ml-1 text-foreground">({selectedTags.length}개 선택)</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tagsData.tags.map((tag) => (
              <InterestChip
                key={tag.id}
                label={tag.name}
                isSelected={selectedTags.includes(tag.name)}
                onToggle={() => toggleTag(tag.name)}
              />
            ))}
          </div>
        </div>
      )}

      {companies.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            회사{' '}
            {selectedCompanyIds.length > 0 ? (
              <span className="text-foreground">({selectedCompanyIds.length}개 선택)</span>
            ) : (
              <span>({companies.length}개)</span>
            )}
          </p>

          {/* 선택된 회사는 항상 상단에 고정 */}
          {selectedCompanies.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {selectedCompanies.map((company) => (
                <InterestChip
                  key={company.id}
                  label={company.name}
                  isSelected
                  onToggle={() => toggleCompany(company.id)}
                />
              ))}
            </div>
          )}

          {/* 회사 검색 */}
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={companyQuery}
              onChange={(event) => setCompanyQuery(event.target.value)}
              placeholder="회사 검색"
              className="w-full rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>

          {visibleCompanies.length > 0 ? (
            <div
              className={`flex flex-wrap gap-1.5 ${isSearching || showAllCompanies ? 'max-h-64 overflow-y-auto pr-1' : ''}`}
            >
              {visibleCompanies.map((company) => (
                <InterestChip
                  key={company.id}
                  label={company.name}
                  isSelected={false}
                  onToggle={() => toggleCompany(company.id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-2 text-xs text-muted-foreground">검색 결과가 없습니다.</p>
          )}

          {!isSearching && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllCompanies(true)}
              className="mt-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              + {hiddenCount}개 회사 더보기
            </button>
          )}
          {!isSearching && showAllCompanies && (
            <button
              type="button"
              onClick={() => setShowAllCompanies(false)}
              className="mt-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              접기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
