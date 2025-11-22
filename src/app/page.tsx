'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationFormData } from '@/types/application';
import { getApplications, createApplication, getSettings, saveSettings, Settings } from '@/lib/storage';
import { sortApplications, filterApplications } from '@/lib/utils';
import DashboardStats from '@/components/DashboardStats';
import ApplicationList from '@/components/ApplicationList';
import FilterBar from '@/components/FilterBar';
import ApplicationForm from '@/components/ApplicationForm';
import ImportExport from '@/components/ImportExport';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [settings, setSettings] = useState<Settings>({
    viewMode: 'list',
    sortBy: 'deadline',
    sortOrder: 'asc',
    filterStatus: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadData = useCallback(() => {
    const apps = getApplications();
    const savedSettings = getSettings();
    setApplications(apps);
    setSettings(savedSettings);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const handleSortByChange = (sortBy: Settings['sortBy']) => {
    setSettings((prev) => ({ ...prev, sortBy }));
    saveSettings({ sortBy });
  };

  const handleSortOrderChange = (sortOrder: Settings['sortOrder']) => {
    setSettings((prev) => ({ ...prev, sortOrder }));
    saveSettings({ sortOrder });
  };

  const handleFilterStatusChange = (filterStatus: string | null) => {
    setSettings((prev) => ({ ...prev, filterStatus }));
    saveSettings({ filterStatus });
  };

  const handleClearFilters = () => {
    const newSettings = { sortBy: 'deadline' as const, sortOrder: 'asc' as const, filterStatus: null };
    setSettings((prev) => ({ ...prev, ...newSettings }));
    saveSettings(newSettings);
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
        tuitionFee: data.tuitionFee || undefined,
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

  // Apply sorting and filtering
  const filteredApplications = filterApplications(applications, settings.filterStatus);
  const displayedApplications = sortApplications(
    filteredApplications,
    settings.sortBy,
    settings.sortOrder
  );

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Track and manage your university applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ImportExport onImportComplete={loadData} />
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
        </div>

        {/* Dashboard Stats */}
        <DashboardStats applications={applications} />

        {/* Filter Bar */}
        <FilterBar
          sortBy={settings.sortBy}
          sortOrder={settings.sortOrder}
          filterStatus={settings.filterStatus}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
          onFilterStatusChange={handleFilterStatusChange}
          onClearFilters={handleClearFilters}
        />

        {/* Application List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications
              {filteredApplications.length !== applications.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (showing {filteredApplications.length} of {applications.length})
                </span>
              )}
            </h2>
          </div>
          <ApplicationList applications={displayedApplications} />
        </div>
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
