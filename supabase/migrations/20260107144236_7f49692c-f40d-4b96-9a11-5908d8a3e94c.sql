-- Allow updating admin passwords
CREATE POLICY "Anyone can update admins"
ON public.admin_users
FOR UPDATE
USING (true)
WITH CHECK (true);