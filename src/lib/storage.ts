import { Application, ApplicationStatus, Semester } from '@/types/application';
import { supabase } from './supabase';

// Database row interface
interface DbApplication {
  id: string;
  course_name: string;
  university: string;
  city: string | null;
  deadline: string;
  status: string;
  semester: string | null;
  application_link: string | null;
  applied_date: string | null;
  uni_assist_required: boolean;
  language_requirement: string | null;
  semester_contribution: string | null;
  priority: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Transform database row to Application type
function dbToApplication(row: DbApplication): Application {
  return {
    id: row.id,
    courseName: row.course_name,
    university: row.university,
    city: row.city || undefined,
    deadline: row.deadline,
    status: row.status as ApplicationStatus,
    semester: (row.semester as Semester) || undefined,
    applicationLink: row.application_link || undefined,
    appliedDate: row.applied_date || undefined,
    uniAssistRequired: row.uni_assist_required,
    languageRequirement: row.language_requirement || undefined,
    semesterContribution: row.semester_contribution || undefined,
    priority: row.priority,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Transform Application to database insert format
function applicationToDb(app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    course_name: app.courseName,
    university: app.university,
    city: app.city || null,
    deadline: app.deadline,
    status: app.status,
    semester: app.semester || null,
    application_link: app.applicationLink || null,
    applied_date: app.appliedDate || null,
    uni_assist_required: app.uniAssistRequired || false,
    language_requirement: app.languageRequirement || null,
    semester_contribution: app.semesterContribution || null,
    priority: app.priority,
    notes: app.notes || null,
  };
}

// Applications Storage
export async function getApplications(): Promise<Application[]> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      console.error('Failed to fetch applications:', error);
      return [];
    }

    return (data || []).map((row) => dbToApplication(row as DbApplication));
  } catch (error) {
    console.error('Failed to read applications from Supabase:', error);
    return [];
  }
}

export async function getApplication(id: string): Promise<Application | null> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Failed to fetch application:', error);
      return null;
    }

    return data ? dbToApplication(data as DbApplication) : null;
  } catch (error) {
    console.error('Failed to read application from Supabase:', error);
    return null;
  }
}

export async function createApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application | null> {
  try {
    const dbData = applicationToDb(data);

    const { data: created, error } = await supabase
      .from('applications')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create application:', error);
      return null;
    }

    return created ? dbToApplication(created as DbApplication) : null;
  } catch (error) {
    console.error('Failed to create application:', error);
    return null;
  }
}

export async function updateApplication(
  id: string,
  updates: Partial<Omit<Application, 'id' | 'createdAt'>>
): Promise<Application | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.courseName !== undefined) dbUpdates.course_name = updates.courseName;
    if (updates.university !== undefined) dbUpdates.university = updates.university;
    if (updates.city !== undefined) dbUpdates.city = updates.city || null;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.semester !== undefined) dbUpdates.semester = updates.semester || null;
    if (updates.applicationLink !== undefined) dbUpdates.application_link = updates.applicationLink || null;
    if (updates.appliedDate !== undefined) dbUpdates.applied_date = updates.appliedDate || null;
    if (updates.uniAssistRequired !== undefined) dbUpdates.uni_assist_required = updates.uniAssistRequired;
    if (updates.languageRequirement !== undefined) dbUpdates.language_requirement = updates.languageRequirement || null;
    if (updates.semesterContribution !== undefined) dbUpdates.semester_contribution = updates.semesterContribution || null;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;

    const { data: updated, error } = await supabase
      .from('applications')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update application:', error);
      return null;
    }

    return updated ? dbToApplication(updated as DbApplication) : null;
  } catch (error) {
    console.error('Failed to update application:', error);
    return null;
  }
}

export async function deleteApplication(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete application:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete application:', error);
    return false;
  }
}

// Settings Storage (kept in localStorage as it's user preference)
export interface Settings {
  viewMode: 'list' | 'kanban';
  sortBy: 'deadline' | 'status' | 'university' | 'priority';
  sortOrder: 'asc' | 'desc';
  filterStatus: string | null;
}

const SETTINGS_KEY = 'uniTracker:settings';

const DEFAULT_SETTINGS: Settings = {
  viewMode: 'list',
  sortBy: 'deadline',
  sortOrder: 'asc',
  filterStatus: null,
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;

  try {
    const data = localStorage.getItem(SETTINGS_KEY);
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
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
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

export async function exportApplications(): Promise<ExportData> {
  const applications = await getApplications();
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

export async function importApplications(
  data: ExportData,
  replace: boolean = false
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // If replacing, delete all existing applications first
    if (replace) {
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (deleteError) {
        console.error('Failed to delete existing applications:', deleteError);
        return { success: false, count: 0, error: 'Failed to clear existing applications' };
      }
    }

    // Insert new applications
    const dbApplications = data.applications.map(app => applicationToDb(app));

    const { error: insertError } = await supabase
      .from('applications')
      .insert(dbApplications);

    if (insertError) {
      console.error('Failed to import applications:', insertError);
      return { success: false, count: 0, error: 'Failed to import applications' };
    }

    return { success: true, count: data.applications.length };
  } catch (error) {
    console.error('Failed to import applications:', error);
    return { success: false, count: 0, error: 'Import failed due to an error' };
  }
}
