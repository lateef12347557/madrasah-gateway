-- Allow inserting new admins (public for now since no auth system)
CREATE POLICY "Anyone can add admins"
ON public.admin_users
FOR INSERT
WITH CHECK (true);

-- Allow deleting admins (public for now since no auth system)
CREATE POLICY "Anyone can delete admins"
ON public.admin_users
FOR DELETE
USING (true);