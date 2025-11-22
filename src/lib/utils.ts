import { Application, ApplicationStatus } from '@/types/application';

// Date utilities
export function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDeadlineColor(deadline: string): 'red' | 'orange' | 'default' {
  const daysRemaining = getDaysRemaining(deadline);

  if (daysRemaining < 0) return 'red';
  if (daysRemaining <= 7) return 'red';
  if (daysRemaining <= 30) return 'orange';
  return 'default';
}

export function isDeadlineIn3Days(deadline: string): boolean {
  const daysRemaining = getDaysRemaining(deadline);
  return daysRemaining >= 0 && daysRemaining <= 3;
}

// Sorting utilities
export function sortApplications(
  applications: Application[],
  sortBy: 'deadline' | 'status' | 'university' | 'priority',
  sortOrder: 'asc' | 'desc'
): Application[] {
  const sorted = [...applications].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'deadline':
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'status':
        const statusOrder: ApplicationStatus[] = ['Planning', 'Applied', 'Waitlist', 'Admitted', 'Rejected'];
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        break;
      case 'university':
        comparison = a.university.localeCompare(b.university);
        break;
      case 'priority':
        comparison = b.priority - a.priority; // Higher priority first by default
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Filter utilities
export function filterApplications(
  applications: Application[],
  filterStatus: string | null
): Application[] {
  if (!filterStatus) return applications;
  return applications.filter(app => app.status === filterStatus);
}

// Statistics utilities
export function getApplicationStats(applications: Application[]) {
  const total = applications.length;
  const applied = applications.filter(app => app.status === 'Applied').length;
  const admitted = applications.filter(app => app.status === 'Admitted').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;
  const waitlist = applications.filter(app => app.status === 'Waitlist').length;
  const planning = applications.filter(app => app.status === 'Planning').length;
  const upcomingDeadlines = applications.filter(app => isDeadlineIn3Days(app.deadline)).length;

  return {
    total,
    applied,
    admitted,
    rejected,
    waitlist,
    planning,
    upcomingDeadlines,
  };
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Get status color
export function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'Planning':
      return 'bg-gray-100 text-gray-800';
    case 'Applied':
      return 'bg-blue-100 text-blue-800';
    case 'Admitted':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Waitlist':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// CN helper for conditional class names
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
