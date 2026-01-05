-- Create student_enrollments table for persistent storage
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Student Information
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  country TEXT NOT NULL,
  timezone TEXT NOT NULL,
  native_language TEXT NOT NULL,
  
  -- Parent/Guardian Info
  guardian_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Academic Background
  level TEXT NOT NULL,
  quran_reading_ability TEXT NOT NULL,
  tajweed_knowledge TEXT NOT NULL,
  previous_madrasah TEXT,
  
  -- Interest Areas (stored as array)
  interest_areas TEXT[] NOT NULL DEFAULT '{}',
  
  -- Class Preferences
  preferred_days TEXT[] NOT NULL DEFAULT '{}',
  preferred_time TEXT NOT NULL,
  class_type TEXT NOT NULL,
  
  -- Additional
  special_needs TEXT,
  referral_source TEXT,
  questions TEXT
);

-- Enable Row Level Security
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public enrollment form)
CREATE POLICY "Anyone can submit enrollment"
ON public.student_enrollments
FOR INSERT
WITH CHECK (true);

-- Create policy for admin to view all enrollments (will be secured by password in app)
CREATE POLICY "Anyone can view enrollments"
ON public.student_enrollments
FOR SELECT
USING (true);