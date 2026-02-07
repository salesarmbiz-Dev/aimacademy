-- Create asset category enum
CREATE TYPE public.asset_category AS ENUM ('prompt', 'sop', 'pattern', 'workflow', 'template');

-- Create asset status enum
CREATE TYPE public.asset_status AS ENUM ('active', 'archived');

-- Create user_assets table for unified asset storage
CREATE TABLE public.user_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category asset_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_game TEXT NOT NULL,
  quality_score INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status asset_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own assets"
  ON public.user_assets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
  ON public.user_assets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON public.user_assets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.user_assets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_assets_user_id ON public.user_assets(user_id);
CREATE INDEX idx_user_assets_category ON public.user_assets(category);
CREATE INDEX idx_user_assets_status ON public.user_assets(status);
CREATE INDEX idx_user_assets_created_at ON public.user_assets(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_user_assets_updated_at
  BEFORE UPDATE ON public.user_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();