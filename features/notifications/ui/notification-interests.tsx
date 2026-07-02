'use client';

import { useToast } from '@/hooks';
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
 */
export function NotificationInterests({ preferences }: NotificationInterestsProps) {
  const { updateInterests } = useNotificationPreferences();
  const { data: tagsData } = useInterestTagOptions();
  const { data: companiesData } = useInterestCompanyOptions();
  const { showToast } = useToast();

  const selectedTags = preferences.subscribed_tags;
  const selectedCompanyIds = preferences.subscribed_company_ids;
  const isAllSelected = selectedTags.length === 0 && selectedCompanyIds.length === 0;

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
        <div className="mb-3">
          <p className="mb-2 text-xs text-muted-foreground">태그</p>
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

      {companiesData && companiesData.companies.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">회사</p>
          <div className="flex flex-wrap gap-1.5">
            {companiesData.companies.map((company) => (
              <InterestChip
                key={company.id}
                label={company.name}
                isSelected={selectedCompanyIds.includes(company.id)}
                onToggle={() => toggleCompany(company.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
