export type ApplicationStatus =
  | 'Planning'
  | 'Applied'
  | 'Admitted'
  | 'Rejected'
  | 'Waitlist';

export type KanbanStatus =
  | 'Planning'
  | 'In Progress'
  | 'Applied'
  | 'Decision Pending'
  | 'Done';

export type Semester = 'Winter' | 'Summer' | '';

export interface Application {
  id: string;
  courseName: string;
  university: string;
  city?: string;
  deadline: string; // ISO date string
  status: ApplicationStatus;
  semester?: Semester;
  applicationLink?: string;
  appliedDate?: string; // ISO date string
  uniAssistRequired?: boolean;
  languageRequirement?: string;
  semesterContribution?: string;
  priority: number; // 1-5
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ApplicationFormData {
  courseName: string;
  university: string;
  city: string;
  deadline: string;
  status: ApplicationStatus;
  semester: Semester;
  applicationLink: string;
  appliedDate: string;
  uniAssistRequired: boolean;
  languageRequirement: string;
  semesterContribution: string;
  priority: number;
  notes: string;
}

export const DEFAULT_APPLICATION_VALUES: Omit<ApplicationFormData, 'courseName' | 'university' | 'deadline' | 'status'> = {
  city: '',
  semester: '',
  applicationLink: '',
  appliedDate: '',
  uniAssistRequired: false,
  languageRequirement: '',
  semesterContribution: '',
  priority: 3,
  notes: '',
};

export const STATUS_OPTIONS: ApplicationStatus[] = [
  'Planning',
  'Applied',
  'Admitted',
  'Rejected',
  'Waitlist',
];

export const SEMESTER_OPTIONS: { value: Semester; label: string }[] = [
  { value: '', label: 'Select Semester' },
  { value: 'Summer', label: 'Summer 2026' },
  { value: 'Winter', label: 'Winter 2026/27' },
];

export const KANBAN_COLUMNS: { id: KanbanStatus; title: string; statuses: ApplicationStatus[] }[] = [
  { id: 'Planning', title: 'Planning', statuses: ['Planning'] },
  { id: 'In Progress', title: 'In Progress', statuses: [] },
  { id: 'Applied', title: 'Applied', statuses: ['Applied'] },
  { id: 'Decision Pending', title: 'Decision Pending', statuses: ['Waitlist'] },
  { id: 'Done', title: 'Done', statuses: ['Admitted', 'Rejected'] },
];

// Helper to map Application status to Kanban column
export function getKanbanColumnForStatus(status: ApplicationStatus): KanbanStatus {
  switch (status) {
    case 'Planning':
      return 'Planning';
    case 'Applied':
      return 'Applied';
    case 'Waitlist':
      return 'Decision Pending';
    case 'Admitted':
    case 'Rejected':
      return 'Done';
    default:
      return 'Planning';
  }
}

// Helper to map Kanban column to default Application status
export function getStatusForKanbanColumn(column: KanbanStatus): ApplicationStatus {
  switch (column) {
    case 'Planning':
      return 'Planning';
    case 'In Progress':
      return 'Planning';
    case 'Applied':
      return 'Applied';
    case 'Decision Pending':
      return 'Waitlist';
    case 'Done':
      return 'Admitted';
    default:
      return 'Planning';
  }
}
