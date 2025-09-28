-- Update the handle_new_user function to include patient_id_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, doctor_id, patient_id_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role),
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'doctor' 
      THEN new.raw_user_meta_data->>'doctor_id'
      ELSE NULL
    END,
    new.raw_user_meta_data->>'patient_id_number'
  );
  RETURN new;
END;
$function$;