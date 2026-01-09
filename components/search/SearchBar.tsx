'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'
import TagFilter from './TagFilter'

interface SearchBarProps {
  onSearchChange?: (query: string) => void
  onTagsChange?: (tags: string[]) => void
}

const POPULAR_TAGS = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'AI/ML',
  'Mobile',
  'Architecture',
  'Performance',
]

export default function SearchBar({
  onSearchChange,
  onTagsChange,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagModal, setShowTagModal] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      onTagsChange?.(newTags)
      return newTags
    })
  }

  const handleTagRemove = (tag: string) => {
    handleTagToggle(tag)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="게시글 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => setShowTagModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors whitespace-nowrap"
        >
          <Filter className="w-5 h-5" />
          태그 필터
        </button>
      </div>

      {/* Popular Tags */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          인기 태그
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
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

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            선택된 태그 ({selectedTags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tag Filter Modal */}
      <TagFilter
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
      />
    </div>
  )
}
