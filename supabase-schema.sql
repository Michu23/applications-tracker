-- Supabase Schema for University Application Tracker
-- Run this SQL in your Supabase SQL Editor to create the applications table

-- Create the applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  university TEXT NOT NULL,
  city TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planning',
  semester TEXT,
  application_link TEXT,
  applied_date TIMESTAMPTZ,
  uni_assist_required BOOLEAN DEFAULT false,
  language_requirement TEXT,
  semester_contribution TEXT,
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on deadline for faster sorting
CREATE INDEX IF NOT EXISTS idx_applications_deadline ON applications(deadline);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
-- Note: For a personal project without authentication, you may want to keep RLS disabled
-- or create a policy that allows all operations
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for personal use without auth)
-- Remove this if you want to add authentication later
CREATE POLICY "Allow all operations" ON applications
  FOR ALL
  USING (true)
  WITH CHECK (true);
