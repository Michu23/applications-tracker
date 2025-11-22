'use client';

import { useRef, useState } from 'react';
import { exportApplications, importApplications, validateImportData, ExportData } from '@/lib/storage';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface ImportExportProps {
  onImportComplete: () => void;
}

export default function ImportExport({ onImportComplete }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportApplications();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const today = new Date().toISOString().split('T')[0];
      const filename = `applications-backup-${today}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(null);
    setIsImportModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let data: unknown;

      try {
        data = JSON.parse(text);
      } catch {
        setImportError('Invalid JSON file. Please select a valid backup file.');
        return;
      }

      if (!validateImportData(data)) {
        setImportError('Invalid backup file structure. The file does not contain valid application data.');
        return;
      }

      const result = await importApplications(data as ExportData, false);

      if (result.success) {
        setImportSuccess(`Successfully imported ${result.count} application${result.count !== 1 ? 's' : ''}.`);
        onImportComplete();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportSuccess(null);
        }, 2000);
      } else {
        setImportError(result.error || 'Failed to import applications.');
      }
    } catch {
      setImportError('An error occurred while reading the file.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport} disabled={isExporting}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleImportClick}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Import
        </Button>
      </div>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Applications"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select a previously exported JSON file to import your applications. Imported applications will be added to your existing list.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Click to select a JSON file
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Only .json files are accepted
              </span>
            </label>
          </div>

          {importError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {importError}
            </div>
          )}

          {importSuccess && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {importSuccess}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
