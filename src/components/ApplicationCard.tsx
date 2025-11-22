'use client';

import { Application } from '@/types/application';
import { cn, formatDate, getDeadlineColor, getDaysRemaining, getStatusColor, truncateText } from '@/lib/utils';
import StarRating from './ui/StarRating';
import Link from 'next/link';

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const daysRemaining = getDaysRemaining(application.deadline);
  const deadlineColor = getDeadlineColor(application.deadline);

  return (
    <Link
      href={`/application/${application.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#2979FF]/30 transition-all duration-200"
    >
      <div className="flex flex-col gap-3">
        {/* Header: Course and Priority */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {application.courseName}
            </h3>
            <p className="text-gray-600 truncate">{application.university}</p>
          </div>
          <StarRating value={application.priority} readonly size="sm" />
        </div>

        {/* Location */}
        {application.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {application.location}
          </p>
        )}

        {/* Footer: Status and Deadline */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              getStatusColor(application.status)
            )}
          >
            {application.status}
          </span>

          <div className="text-right">
            <p
              className={cn(
                'text-sm font-medium',
                deadlineColor === 'red' && 'text-red-600',
                deadlineColor === 'orange' && 'text-orange-500',
                deadlineColor === 'default' && 'text-gray-600'
              )}
            >
              {formatDate(application.deadline)}
            </p>
            <p
              className={cn(
                'text-xs',
                deadlineColor === 'red' && 'text-red-500',
                deadlineColor === 'orange' && 'text-orange-400',
                deadlineColor === 'default' && 'text-gray-400'
              )}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days ago`
                : daysRemaining === 0
                ? 'Today!'
                : `${daysRemaining} days left`}
            </p>
          </div>
        </div>

        {/* Notes preview */}
        {application.notes && (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2 mt-1">
            {truncateText(application.notes, 80)}
          </p>
        )}
      </div>
    </Link>
  );
}
