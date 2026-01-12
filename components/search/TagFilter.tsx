'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface Tag {
  id: string;
  name: string;
}

export default function TagFilter({ selectedTags, onTagToggle, isOpen, onClose }: TagFilterProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tags?sort=name');
        const data = await response.json();
        setAllTags(data.tags || []);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">태그 선택</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close modal">
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Tags Grid */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
              </div>
            ) : allTags.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-600 dark:text-gray-400">태그가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => onTagToggle(tag.name)}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      selectedTags.includes(tag.name)
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
            <button
              onClick={() => {
                // Clear all tags
                selectedTags.forEach((tag) => onTagToggle(tag));
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
