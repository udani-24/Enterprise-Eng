-- Add patient_id_number field to profiles table for patient identification
ALTER TABLE public.profiles 
ADD COLUMN patient_id_number TEXT UNIQUE;

-- Create index for better search performance
CREATE INDEX idx_profiles_patient_id_number ON public.profiles(patient_id_number);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.patient_id_number IS 'Unique patient identification number for medical records';