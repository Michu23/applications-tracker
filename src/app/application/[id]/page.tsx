'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Application, ApplicationFormData } from '@/types/application';
import { getApplication, updateApplication, deleteApplication } from '@/lib/storage';
import { cn, formatDate, getDeadlineColor, getDaysRemaining, getStatusColor } from '@/lib/utils';
import ApplicationForm from '@/components/ApplicationForm';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadApplication = useCallback(async () => {
    const app = await getApplication(id);
    setApplication(app);
  }, [id]);

  useEffect(() => {
    setMounted(true);
    loadApplication();
  }, [loadApplication]);

  const handleUpdate = async (data: ApplicationFormData) => {
    setIsLoading(true);
    try {
      const updated = await updateApplication(id, {
        courseName: data.courseName,
        university: data.university,
        city: data.city || undefined,
        deadline: new Date(data.deadline).toISOString(),
        status: data.status,
        semester: data.semester || undefined,
        applicationLink: data.applicationLink || undefined,
        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : undefined,
        uniAssistRequired: data.uniAssistRequired,
        languageRequirement: data.languageRequirement || undefined,
        semesterContribution: data.semesterContribution || undefined,
        priority: data.priority,
        notes: data.notes || undefined,
      });

      if (updated) {
        setApplication(updated);
        setIsEditing(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const deleted = await deleteApplication(id);
    if (deleted) {
      router.push('/');
    }
  };

  if (!mounted || !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (application === null && mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Application not found</h2>
          <p className="text-gray-500 mt-2">The application you&apos;re looking for doesn&apos;t exist.</p>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(application.deadline);
  const deadlineColor = getDeadlineColor(application.deadline);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{application.courseName}</h1>
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      getStatusColor(application.status)
                    )}
                  >
                    {application.status}
                  </span>
                  {application.semester && (
                    <span className="text-sm px-2.5 py-1 bg-[#2979FF]/10 text-[#2979FF] rounded-full">
                      {application.semester} 2026
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600">{application.university}</p>
                {application.city && (
                  <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {application.city}, Germany
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Deadline and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Application Deadline</h3>
                <p
                  className={cn(
                    'text-xl font-semibold',
                    deadlineColor === 'red' && 'text-red-600',
                    deadlineColor === 'orange' && 'text-orange-500',
                    deadlineColor === 'default' && 'text-gray-900'
                  )}
                >
                  {formatDate(application.deadline)}
                </p>
                <p
                  className={cn(
                    'text-sm mt-1',
                    deadlineColor === 'red' && 'text-red-500',
                    deadlineColor === 'orange' && 'text-orange-400',
                    deadlineColor === 'default' && 'text-gray-500'
                  )}
                >
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} days ago`
                    : daysRemaining === 0
                    ? 'Today!'
                    : `${daysRemaining} days remaining`}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                <StarRating value={application.priority} readonly size="lg" />
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Application Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {application.uniAssistRequired !== undefined && (
                  <DetailItem
                    label="Uni-Assist Required"
                    value={application.uniAssistRequired ? 'Yes' : 'No'}
                  />
                )}
                {application.appliedDate && (
                  <DetailItem label="Applied Date" value={formatDate(application.appliedDate)} />
                )}
                {application.languageRequirement && (
                  <DetailItem label="Language Requirement" value={application.languageRequirement} />
                )}
                {application.semesterContribution && (
                  <DetailItem label="Semester Contribution" value={application.semesterContribution} />
                )}
              </div>
            </div>

            {/* Links */}
            {application.applicationLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={application.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#2979FF] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Application Portal
                  </a>
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200 text-sm text-gray-400">
              <p>Created: {formatDate(application.createdAt)}</p>
              <p>Last updated: {formatDate(application.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Application"
        size="xl"
      >
        <ApplicationForm
          initialData={application}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Application"
        message={`Are you sure you want to delete "${application.courseName}" at ${application.university}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
