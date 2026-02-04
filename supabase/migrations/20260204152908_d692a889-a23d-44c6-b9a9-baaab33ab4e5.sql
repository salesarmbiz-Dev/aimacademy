
-- Add is_demo column to organizations if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'organizations' 
    AND column_name = 'is_demo'
  ) THEN
    ALTER TABLE organizations ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
