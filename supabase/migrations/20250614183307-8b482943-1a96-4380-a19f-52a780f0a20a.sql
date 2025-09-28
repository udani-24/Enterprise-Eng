
-- Completely disable email confirmation in Supabase
-- Update all existing users to have confirmed emails
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmation_sent_at = COALESCE(confirmation_sent_at, NOW())
WHERE email_confirmed_at IS NULL OR confirmation_sent_at IS NULL;

-- Enable auto-confirm for all new signups by updating the config
-- Note: This should ideally be done in the Supabase dashboard under Authentication > Settings
-- Set "Enable email confirmations" to OFF
-- But we can also ensure our database is prepared for unconfirmed emails
