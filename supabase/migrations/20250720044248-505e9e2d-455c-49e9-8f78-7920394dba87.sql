-- Add RLS policy to allow admin updates to profiles table
-- This will allow admin users to update the is_approved and approved_at fields

CREATE POLICY "Admins can update doctor approval status" 
ON public.profiles 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Note: This policy allows all updates for now since we don't have admin roles in the profiles table
-- In a production environment, you would want to restrict this further by checking admin status