
-- Add approval status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_approved BOOLEAN DEFAULT false,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID REFERENCES auth.users(id);

-- Create admin user type
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin';

-- Create admin credentials table
CREATE TABLE public.admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default admin credentials (admin@1234)
INSERT INTO public.admin_credentials (username, password_hash) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Enable RLS on admin_credentials
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin credentials (only allow select for authentication)
CREATE POLICY "Allow select on admin credentials" 
ON public.admin_credentials 
FOR SELECT 
USING (true);

-- Create policy for updating admin credentials (authenticated users only)
CREATE POLICY "Allow update on admin credentials" 
ON public.admin_credentials 
FOR UPDATE 
USING (true);
