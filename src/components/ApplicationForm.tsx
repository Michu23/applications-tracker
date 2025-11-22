'use client';

import { useState } from 'react';
import { Application, ApplicationFormData, DEFAULT_APPLICATION_VALUES, STATUS_OPTIONS } from '@/types/application';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import TextArea from './ui/TextArea';
import StarRating from './ui/StarRating';

interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    courseName: initialData?.courseName || '',
    university: initialData?.university || '',
    location: initialData?.location || DEFAULT_APPLICATION_VALUES.location,
    deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : '',
    status: initialData?.status || 'Planning',
    applicationLink: initialData?.applicationLink || DEFAULT_APPLICATION_VALUES.applicationLink,
    appliedDate: initialData?.appliedDate ? initialData.appliedDate.split('T')[0] : DEFAULT_APPLICATION_VALUES.appliedDate,
    tuitionFee: initialData?.tuitionFee || DEFAULT_APPLICATION_VALUES.tuitionFee,
    priority: initialData?.priority || DEFAULT_APPLICATION_VALUES.priority,
    notes: initialData?.notes || DEFAULT_APPLICATION_VALUES.notes,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ApplicationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePriorityChange = (value: number) => {
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Required Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="courseName"
            name="courseName"
            label="Course Name *"
            value={formData.courseName}
            onChange={handleChange}
            error={errors.courseName}
            placeholder="e.g., Computer Science MSc"
          />
          <Input
            id="university"
            name="university"
            label="University *"
            value={formData.university}
            onChange={handleChange}
            error={errors.university}
            placeholder="e.g., MIT"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="deadline"
            name="deadline"
            type="date"
            label="Deadline *"
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
          />
          <Select
            id="status"
            name="status"
            label="Status *"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          />
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Cambridge, MA"
          />
          <Input
            id="tuitionFee"
            name="tuitionFee"
            label="Tuition Fee"
            value={formData.tuitionFee}
            onChange={handleChange}
            placeholder="e.g., $50,000/year"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="applicationLink"
            name="applicationLink"
            type="url"
            label="Application Link"
            value={formData.applicationLink}
            onChange={handleChange}
            placeholder="https://..."
          />
          <Input
            id="appliedDate"
            name="appliedDate"
            type="date"
            label="Applied Date"
            value={formData.appliedDate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <StarRating value={formData.priority} onChange={handlePriorityChange} />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Notes</h3>
        <TextArea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes, requirements, professor contacts, etc."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Application'}
        </Button>
      </div>
    </form>
  );
}
