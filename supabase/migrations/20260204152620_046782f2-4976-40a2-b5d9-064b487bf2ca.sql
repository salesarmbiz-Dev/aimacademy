
-- First create all tables, then RLS, then seed

-- Create demo_users table if not exists
CREATE TABLE IF NOT EXISTS demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  is_demo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_assessment_attempts table
CREATE TABLE IF NOT EXISTS demo_assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  total_questions INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  total_score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  skill_scores JSONB DEFAULT '{}'::jsonb,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_activity_log table
CREATE TABLE IF NOT EXISTS demo_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE demo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Org members can view demo users" ON demo_users;
DROP POLICY IF EXISTS "Org members can view demo assessments" ON demo_assessment_attempts;
DROP POLICY IF EXISTS "Org members can view demo activity" ON demo_activity_log;

-- Create RLS policies
CREATE POLICY "Org members can view demo users" ON demo_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_members 
      WHERE org_members.org_id = demo_users.org_id 
      AND org_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can view demo assessments" ON demo_assessment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM demo_users du
      JOIN org_members om ON om.org_id = du.org_id
      WHERE du.id = demo_assessment_attempts.user_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can view demo activity" ON demo_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM demo_users du
      JOIN org_members om ON om.org_id = du.org_id
      WHERE du.id = demo_activity_log.user_id
      AND om.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_demo_users_org ON demo_users(org_id);
CREATE INDEX IF NOT EXISTS idx_demo_assessment_user ON demo_assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_activity_user ON demo_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_activity_created ON demo_activity_log(created_at);
