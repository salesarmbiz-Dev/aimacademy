-- Create survey_responses table for post-game feedback
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trigger_context TEXT NOT NULL, -- 'set1_complete' | 'set2_complete' | 'manual'
  nps_score INTEGER NOT NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  nps_followup TEXT,
  rating_fun INTEGER CHECK (rating_fun >= 1 AND rating_fun <= 5),
  rating_difficulty INTEGER CHECK (rating_difficulty >= 1 AND rating_difficulty <= 5),
  rating_usefulness INTEGER CHECK (rating_usefulness >= 1 AND rating_usefulness <= 5),
  open_feedback TEXT,
  continue_interest TEXT CHECK (continue_interest IN ('yes', 'maybe', 'no')),
  desired_topics TEXT,
  xp_earned INTEGER DEFAULT 25,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Users can insert their own responses
CREATE POLICY "Users can insert their own survey responses"
ON public.survey_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own responses
CREATE POLICY "Users can view their own survey responses"
ON public.survey_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_survey_responses_user_context ON public.survey_responses(user_id, trigger_context);
CREATE INDEX idx_survey_responses_submitted ON public.survey_responses(submitted_at);