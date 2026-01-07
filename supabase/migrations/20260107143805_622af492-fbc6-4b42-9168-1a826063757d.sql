-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to verify credentials (read-only for login)
CREATE POLICY "Anyone can verify admin credentials"
ON public.admin_users
FOR SELECT
USING (true);

-- Insert default admin
INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', 'admin23435');