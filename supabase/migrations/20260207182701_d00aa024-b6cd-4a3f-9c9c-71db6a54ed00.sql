-- Activity Tracking System Tables

-- Table 1: user_sessions - Tracks login/logout sessions
CREATE TABLE public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  pages_visited INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can insert their own sessions"
ON public.user_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
ON public.user_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.user_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_created ON public.user_sessions(created_at);

-- Table 2: activity_events - Granular event log
CREATE TABLE public.activity_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_events
CREATE POLICY "Users can insert their own events"
ON public.activity_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events"
ON public.activity_events FOR SELECT
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_activity_events_user_type ON public.activity_events(user_id, event_type);
CREATE INDEX idx_activity_events_created ON public.activity_events(created_at);
CREATE INDEX idx_activity_events_session ON public.activity_events(session_id);

-- Table 3: daily_user_stats - Pre-aggregated daily summary
CREATE TABLE public.daily_user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stat_date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  assets_created INTEGER DEFAULT 0,
  pages_visited INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

-- Enable RLS
ALTER TABLE public.daily_user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_user_stats
CREATE POLICY "Users can view their own daily stats"
ON public.daily_user_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily stats"
ON public.daily_user_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily stats"
ON public.daily_user_stats FOR UPDATE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_daily_user_stats_user_date ON public.daily_user_stats(user_id, stat_date);

-- Trigger for updated_at
CREATE TRIGGER update_daily_user_stats_updated_at
BEFORE UPDATE ON public.daily_user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();