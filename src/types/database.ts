export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
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
        };
        Insert: {
          id?: string;
          course_name: string;
          university: string;
          city?: string | null;
          deadline: string;
          status: string;
          semester?: string | null;
          application_link?: string | null;
          applied_date?: string | null;
          uni_assist_required?: boolean;
          language_requirement?: string | null;
          semester_contribution?: string | null;
          priority?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_name?: string;
          university?: string;
          city?: string | null;
          deadline?: string;
          status?: string;
          semester?: string | null;
          application_link?: string | null;
          applied_date?: string | null;
          uni_assist_required?: boolean;
          language_requirement?: string | null;
          semester_contribution?: string | null;
          priority?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
