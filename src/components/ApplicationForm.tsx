'use client';

import { useState } from 'react';
import { Application, ApplicationFormData, DEFAULT_APPLICATION_VALUES, STATUS_OPTIONS, SEMESTER_OPTIONS } from '@/types/application';
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
    city: initialData?.city || DEFAULT_APPLICATION_VALUES.city,
    deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : '',
    status: initialData?.status || 'Planning',
    semester: initialData?.semester || DEFAULT_APPLICATION_VALUES.semester,
    courseLink: initialData?.courseLink || DEFAULT_APPLICATION_VALUES.courseLink,
    applicationLink: initialData?.applicationLink || DEFAULT_APPLICATION_VALUES.applicationLink,
    appliedDate: initialData?.appliedDate ? initialData.appliedDate.split('T')[0] : DEFAULT_APPLICATION_VALUES.appliedDate,
    uniAssistRequired: initialData?.uniAssistRequired || DEFAULT_APPLICATION_VALUES.uniAssistRequired,
    languageRequirement: initialData?.languageRequirement || DEFAULT_APPLICATION_VALUES.languageRequirement,
    semesterContribution: initialData?.semesterContribution || DEFAULT_APPLICATION_VALUES.semesterContribution,
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
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
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
          Program Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="courseName"
            name="courseName"
            label="Program/Course Name *"
            value={formData.courseName}
            onChange={handleChange}
            error={errors.courseName}
            placeholder="e.g., M.Sc. Computer Science"
          />
          <Input
            id="university"
            name="university"
            label="University *"
            value={formData.university}
            onChange={handleChange}
            error={errors.university}
            placeholder="e.g., TU Munich"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="city"
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Munich, Berlin"
          />
          <Select
            id="semester"
            name="semester"
            label="Intake Semester"
            value={formData.semester}
            onChange={handleChange}
            options={SEMESTER_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="deadline"
            name="deadline"
            type="date"
            label="Application Deadline *"
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

      {/* Links Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="courseLink"
            name="courseLink"
            type="url"
            label="Course Details Link"
            value={formData.courseLink}
            onChange={handleChange}
            placeholder="Link to course information page"
          />
          <Input
            id="applicationLink"
            name="applicationLink"
            type="url"
            label="Application Portal Link"
            value={formData.applicationLink}
            onChange={handleChange}
            placeholder="Link to apply for this program"
          />
        </div>
      </div>

      {/* Application Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Application Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="appliedDate"
            name="appliedDate"
            type="date"
            label="Applied Date"
            value={formData.appliedDate}
            onChange={handleChange}
          />
          <Input
            id="languageRequirement"
            name="languageRequirement"
            label="Language Requirement"
            value={formData.languageRequirement}
            onChange={handleChange}
            placeholder="e.g., IELTS 6.5, B2 German"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="semesterContribution"
            name="semesterContribution"
            label="Semester Contribution"
            value={formData.semesterContribution}
            onChange={handleChange}
            placeholder="e.g., 150 EUR"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="uniAssistRequired"
            name="uniAssistRequired"
            checked={formData.uniAssistRequired}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-[#2979FF] focus:ring-[#2979FF]"
          />
          <label htmlFor="uniAssistRequired" className="text-sm text-gray-700">
            Uni-Assist required for this application
          </label>
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
          placeholder="Add any notes, requirements, documents needed, etc."
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
