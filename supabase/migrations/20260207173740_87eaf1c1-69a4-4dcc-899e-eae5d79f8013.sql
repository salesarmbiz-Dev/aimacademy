-- Create sop_assets table for storing generated SOPs
CREATE TABLE public.sop_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_type TEXT NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  department TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  quality_score INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sop_machine_sessions table for tracking game sessions
CREATE TABLE public.sop_machine_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_type TEXT NOT NULL,
  context_inputs JSONB DEFAULT '{}'::jsonb,
  quality_score INTEGER DEFAULT 0,
  time_seconds INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.sop_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sop_machine_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for sop_assets
CREATE POLICY "Users can view their own SOPs"
  ON public.sop_assets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SOPs"
  ON public.sop_assets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOPs"
  ON public.sop_assets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOPs"
  ON public.sop_assets
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for sop_machine_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.sop_machine_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.sop_machine_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_sop_assets_updated_at
  BEFORE UPDATE ON public.sop_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();