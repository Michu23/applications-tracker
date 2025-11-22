'use client';

import { Application } from '@/types/application';
import ApplicationCard from './ApplicationCard';

interface ApplicationListProps {
  applications: Application[];
}

export default function ApplicationList({ applications }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
        <p className="mt-2 text-gray-500">Get started by creating your first application.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
