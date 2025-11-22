'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationFormData, KanbanStatus, getStatusForKanbanColumn } from '@/types/application';
import { getApplications, createApplication, updateApplication } from '@/lib/storage';
import KanbanBoard from '@/components/KanbanBoard';
import ApplicationForm from '@/components/ApplicationForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function KanbanPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadData = useCallback(() => {
    const apps = getApplications();
    setApplications(apps);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const handleStatusChange = (applicationId: string, newColumn: KanbanStatus) => {
    const newStatus = getStatusForKanbanColumn(newColumn);
    const updated = updateApplication(applicationId, { status: newStatus });
    if (updated) {
      loadData();
    }
  };

  const handleCreateApplication = (data: ApplicationFormData) => {
    setIsLoading(true);
    try {
      const newApp = createApplication({
        courseName: data.courseName,
        university: data.university,
        location: data.location || undefined,
        deadline: new Date(data.deadline).toISOString(),
        status: data.status,
        applicationLink: data.applicationLink || undefined,
        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : undefined,
        applicationType: data.applicationType || undefined,
        tuitionFee: data.tuitionFee || undefined,
        applicationFee: data.applicationFee || undefined,
        scholarshipLink: data.scholarshipLink || undefined,
        languageOfInstruction: data.languageOfInstruction || undefined,
        priority: data.priority,
        notes: data.notes || undefined,
      });

      if (newApp) {
        loadData();
        setIsCreateModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-gray-500 mt-1">
              Visualize and manage your application pipeline
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Application
          </Button>
        </div>

        {/* Kanban Instructions */}
        <div className="bg-[#2979FF]/5 border border-[#2979FF]/20 rounded-lg p-4">
          <p className="text-sm text-[#2979FF]">
            <strong>Tip:</strong> Drag and drop applications between columns to update their status. Click on a card to view full details.
          </p>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Create Application Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Application"
        size="xl"
      >
        <ApplicationForm
          onSubmit={handleCreateApplication}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
