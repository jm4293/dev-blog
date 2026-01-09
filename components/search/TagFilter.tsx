'use client';

import { X } from 'lucide-react';

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ALL_TAGS = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'AI',
  'Mobile',
  'Architecture',
  'Performance',
  'Security',
  'Testing',
  'React',
  'Vue',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Docker',
  'Kubernetes',
  'AWS',
];

export default function TagFilter({ selectedTags, onTagToggle, isOpen, onClose }: TagFilterProps) {
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
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Tags Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white dark:bg-purple-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
            <button
              onClick={() => {
                // Clear all tags
                selectedTags.forEach((tag) => onTagToggle(tag));
              }}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
