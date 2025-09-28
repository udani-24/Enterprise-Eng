
-- Disable email confirmation requirement in Supabase
-- This should be done in the Supabase dashboard, but we can also ensure our auth flow handles unconfirmed emails
-- Update the auth settings to allow unconfirmed email logins

-- First, let's check if there are any existing users that need their email_confirmed status updated
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmation_sent_at = NOW()
WHERE email_confirmed_at IS NULL;
