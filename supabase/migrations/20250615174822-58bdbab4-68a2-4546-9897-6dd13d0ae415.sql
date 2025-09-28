
-- Add doctor_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN doctor_id TEXT;

-- Create a unique index on doctor_id to ensure no duplicates
CREATE UNIQUE INDEX idx_profiles_doctor_id ON public.profiles(doctor_id) 
WHERE doctor_id IS NOT NULL;
