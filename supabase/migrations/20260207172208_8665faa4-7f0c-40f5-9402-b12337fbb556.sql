-- Create enum for game status
CREATE TYPE public.game_status AS ENUM ('locked', 'unlocked', 'in_progress', 'completed');

-- Create user_game_progress table
CREATE TABLE public.user_game_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    game_id TEXT NOT NULL,
    best_score INTEGER DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
    attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
    total_time_seconds INTEGER DEFAULT 0 CHECK (total_time_seconds >= 0),
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    status public.game_status DEFAULT 'locked',
    first_played_at TIMESTAMP WITH TIME ZONE,
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, game_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_game_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies: users can only read/write their own rows
CREATE POLICY "Users can view their own game progress"
ON public.user_game_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
ON public.user_game_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
ON public.user_game_progress
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game progress"
ON public.user_game_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_game_progress_updated_at
BEFORE UPDATE ON public.user_game_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_user_game_progress_user_id ON public.user_game_progress(user_id);
CREATE INDEX idx_user_game_progress_game_id ON public.user_game_progress(game_id);