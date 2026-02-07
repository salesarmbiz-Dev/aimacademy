-- Create table for storing debugger game results per level
CREATE TABLE public.game_debugger_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 10),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
    bugs_found INTEGER DEFAULT 0,
    bugs_total INTEGER DEFAULT 0,
    types_correct INTEGER DEFAULT 0,
    fix_quality_score INTEGER DEFAULT 0,
    time_seconds INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    xp_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, level)
);

-- Enable Row Level Security
ALTER TABLE public.game_debugger_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own debugger results"
ON public.game_debugger_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debugger results"
ON public.game_debugger_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debugger results"
ON public.game_debugger_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX idx_debugger_results_user_id ON public.game_debugger_results(user_id);
CREATE INDEX idx_debugger_results_level ON public.game_debugger_results(level);