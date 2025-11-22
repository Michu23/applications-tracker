import { Application } from '@/types/application';

const STORAGE_KEYS = {
  applications: 'uniTracker:applications',
  settings: 'uniTracker:settings',
} as const;

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check if we're in browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Applications Storage
export function getApplications(): Application[] {
  if (!isBrowser()) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.applications);
    if (!data) return [];
    return JSON.parse(data) as Application[];
  } catch (error) {
    console.error('Failed to read applications from localStorage:', error);
    return [];
  }
}

export function saveApplications(applications: Application[]): boolean {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Failed to save applications to localStorage:', error);
    return false;
  }
}

export function getApplication(id: string): Application | null {
  const applications = getApplications();
  return applications.find(app => app.id === id) || null;
}

export function createApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application | null {
  try {
    const now = new Date().toISOString();
    const application: Application = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const applications = getApplications();
    applications.push(application);

    if (saveApplications(applications)) {
      return application;
    }
    return null;
  } catch (error) {
    console.error('Failed to create application:', error);
    return null;
  }
}

export function updateApplication(id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>): Application | null {
  try {
    const applications = getApplications();
    const index = applications.findIndex(app => app.id === id);

    if (index === -1) return null;

    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (saveApplications(applications)) {
      return applications[index];
    }
    return null;
  } catch (error) {
    console.error('Failed to update application:', error);
    return null;
  }
}

export function deleteApplication(id: string): boolean {
  try {
    const applications = getApplications();
    const filtered = applications.filter(app => app.id !== id);

    if (filtered.length === applications.length) return false;

    return saveApplications(filtered);
  } catch (error) {
    console.error('Failed to delete application:', error);
    return false;
  }
}

// Settings Storage
export interface Settings {
  viewMode: 'list' | 'kanban';
  sortBy: 'deadline' | 'status' | 'university' | 'priority';
  sortOrder: 'asc' | 'desc';
  filterStatus: string | null;
}

const DEFAULT_SETTINGS: Settings = {
  viewMode: 'list',
  sortBy: 'deadline',
  sortOrder: 'asc',
  filterStatus: null,
};

export function getSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error('Failed to read settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<Settings>): boolean {
  if (!isBrowser()) return false;

  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
    return false;
  }
}

// Export/Import functionality
export interface ExportData {
  version: string;
  exportedAt: string;
  applications: Application[];
}

export function exportApplications(): ExportData {
  const applications = getApplications();
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    applications,
  };
}

export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'string') return false;
  if (typeof obj.exportedAt !== 'string') return false;
  if (!Array.isArray(obj.applications)) return false;

  // Validate each application has required fields
  for (const app of obj.applications) {
    if (!app || typeof app !== 'object') return false;
    const a = app as Record<string, unknown>;
    if (typeof a.courseName !== 'string') return false;
    if (typeof a.university !== 'string') return false;
    if (typeof a.deadline !== 'string') return false;
    if (typeof a.status !== 'string') return false;
  }

  return true;
}

export function importApplications(data: ExportData, replace: boolean = false): { success: boolean; count: number; error?: string } {
  try {
    const newApplications = data.applications.map(app => ({
      ...app,
      id: generateId(), // Generate new IDs to handle duplicates
      createdAt: app.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    let applications: Application[];
    if (replace) {
      applications = newApplications;
    } else {
      const existing = getApplications();
      applications = [...existing, ...newApplications];
    }

    if (saveApplications(applications)) {
      return { success: true, count: newApplications.length };
    }
    return { success: false, count: 0, error: 'Failed to save imported applications' };
  } catch (error) {
    console.error('Failed to import applications:', error);
    return { success: false, count: 0, error: 'Import failed due to an error' };
  }
}
