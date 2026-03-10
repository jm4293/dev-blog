'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import { Check } from 'lucide-react';
import { BlogLogoImage } from '@/components/image';
import { FilterModal } from '@/components/ui';
import type { Company } from '@/supabase/types.supabase';

interface BlogFilterModalProps {
  blogs: Company[];
  selectedBlogs: string[];
  onBlogsApply: (blogs: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function BlogFilterModal({
  blogs,
  selectedBlogs,
  onBlogsApply,
  isOpen,
  onClose,
  isLoading = false,
}: BlogFilterModalProps) {
  // key를 사용하여 isOpen이 true가 될 때마다 내부 state를 리셋
  const [openCount, setOpenCount] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);

  if (isOpen && !wasOpen) {
    setOpenCount((c) => c + 1);
    setWasOpen(true);
  }
  if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  return (
    <BlogFilterModalInner
      key={openCount}
      blogs={blogs}
      selectedBlogs={selectedBlogs}
      onBlogsApply={onBlogsApply}
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}

function BlogFilterModalInner({
  blogs,
  selectedBlogs,
  onBlogsApply,
  isOpen,
  onClose,
  isLoading = false,
}: BlogFilterModalProps) {
  const [tempSelectedBlogs, setTempSelectedBlogs] = useState<string[]>(selectedBlogs);

  const handleTempToggle = (blogName: string) => {
    setTempSelectedBlogs((prev) =>
      prev.includes(blogName) ? prev.filter((name) => name !== blogName) : [...prev, blogName],
    );
  };

  const handleReset = () => {
    setTempSelectedBlogs([]);
  };

  const handleComplete = () => {
    onBlogsApply(tempSelectedBlogs);
    onClose();
  };

  return (
    <FilterModal
      title="블로그 선택"
      isOpen={isOpen}
      onClose={onClose}
      onReset={handleReset}
      onComplete={handleComplete}
      isLoading={isLoading}
      isEmpty={blogs.length === 0}
      emptyMessage="블로그 정보가 없습니다."
      selectedCount={tempSelectedBlogs.length}
    >
      <div className="grid grid-cols-3 gap-2">
        {blogs.map((blog) => {
          const isSelected = tempSelectedBlogs.includes(blog.name);
          return (
            <button
              key={blog.id}
              onClick={() => handleTempToggle(blog.name)}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-xl p-3 transition-[colors,box-shadow]',
                isSelected ? 'bg-foreground/10 ring-2 ring-foreground' : 'bg-muted hover:bg-muted/80',
              )}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                  <Check className="h-3 w-3 text-background" strokeWidth={3} />
                </span>
              )}
              <BlogLogoImage
                logoUrl={blog.logo_url}
                companyName={blog.name}
                width={32}
                height={32}
                className="object-contain"
              />
              <span
                className={cn(
                  'text-center text-xs font-semibold leading-tight',
                  isSelected ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {blog.name}
              </span>
            </button>
          );
        })}
      </div>
    </FilterModal>
  );
}
