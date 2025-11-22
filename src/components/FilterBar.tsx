'use client';

import { STATUS_OPTIONS } from '@/types/application';
import Button from './ui/Button';

interface FilterBarProps {
  sortBy: 'deadline' | 'status' | 'university' | 'priority';
  sortOrder: 'asc' | 'desc';
  filterStatus: string | null;
  onSortByChange: (value: 'deadline' | 'status' | 'university' | 'priority') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onFilterStatusChange: (value: string | null) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  sortBy,
  sortOrder,
  filterStatus,
  onSortByChange,
  onSortOrderChange,
  onFilterStatusChange,
  onClearFilters,
}: FilterBarProps) {
  const sortOptions = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'status', label: 'Status' },
    { value: 'university', label: 'University' },
    { value: 'priority', label: 'Priority' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
  ];

  const hasFilters = filterStatus !== null || sortBy !== 'deadline' || sortOrder !== 'asc';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as typeof sortBy)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#2979FF] focus:outline-none focus:ring-1 focus:ring-[#2979FF]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filterStatus || ''}
            onChange={(e) => onFilterStatusChange(e.target.value || null)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#2979FF] focus:outline-none focus:ring-1 focus:ring-[#2979FF]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
