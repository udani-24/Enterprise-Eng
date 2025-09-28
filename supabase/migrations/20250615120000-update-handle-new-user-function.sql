
-- Update the handle_new_user function to handle doctor_id and approval status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, doctor_id, is_approved)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'patient'),
    new.raw_user_meta_data->>'doctor_id',
    CASE 
      WHEN COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'patient') = 'doctor' THEN false
      ELSE true
    END
  );
  RETURN new;
END;
$function$
