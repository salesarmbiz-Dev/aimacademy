-- Create certificates table for storing user achievements
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  certificate_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verify_code TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  skills_snapshot JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_certificates_user ON public.certificates(user_id);
CREATE INDEX idx_certificates_verify ON public.certificates(verify_code);
CREATE INDEX idx_certificates_type ON public.certificates(certificate_type);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- SELECT: Everyone can read (for public verification page)
CREATE POLICY "Certificates are publicly viewable for verification"
ON public.certificates
FOR SELECT
USING (true);

-- INSERT: Only authenticated users can insert their own certificates
CREATE POLICY "Users can create their own certificates"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- DELETE: Only certificate owner can delete
CREATE POLICY "Users can delete their own certificates"
ON public.certificates
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);