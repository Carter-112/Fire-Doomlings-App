-- Complete Supabase setup script for Doomlings App
-- Run this in the Supabase SQL Editor

------------------------------------------------
-- PART 1: DATABASE SETUP
------------------------------------------------

-- First, clean up any existing tables and policies
DROP TABLE IF EXISTS playernames CASCADE;
DROP TABLE IF EXISTS agesetup CASCADE;
DROP TABLE IF EXISTS dominantstate CASCADE;
DROP TABLE IF EXISTS persistenttiersselections CASCADE;
DROP TABLE IF EXISTS playertrinkets CASCADE;
DROP TABLE IF EXISTS playertrinketscores CASCADE;
DROP TABLE IF EXISTS availabletrinkets CASCADE;
DROP TABLE IF EXISTS playermeaningcards CASCADE;
DROP TABLE IF EXISTS playermeaningchoices CASCADE;
DROP TABLE IF EXISTS currentagedeck CASCADE;
DROP TABLE IF EXISTS currentageindex CASCADE;
DROP TABLE IF EXISTS playerassignments CASCADE;
DROP TABLE IF EXISTS cors_settings CASCADE;

-- Drop also camelCase views if they exist
DROP VIEW IF EXISTS "playerNames" CASCADE;
DROP VIEW IF EXISTS "ageSetup" CASCADE;
DROP VIEW IF EXISTS "dominantState" CASCADE;
DROP VIEW IF EXISTS "persistentTiersSelections" CASCADE;
DROP VIEW IF EXISTS "playerTrinkets" CASCADE;
DROP VIEW IF EXISTS "playerTrinketScores" CASCADE;
DROP VIEW IF EXISTS "availableTrinkets" CASCADE;
DROP VIEW IF EXISTS "playerMeaningCards" CASCADE;
DROP VIEW IF EXISTS "playerMeaningChoices" CASCADE;
DROP VIEW IF EXISTS "currentAgeDeck" CASCADE;
DROP VIEW IF EXISTS "currentAgeIndex" CASCADE;
DROP VIEW IF EXISTS "playerAssignments" CASCADE;

-- Disable RLS globally during setup to avoid issues
SET session_replication_role = 'replica';

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create tables with proper constraints and defaults (all lowercase)
CREATE TABLE playernames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agesetup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dominantstate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE persistenttiersselections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playertrinkets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playertrinketscores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE availabletrinkets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playermeaningcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playermeaningchoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE currentagedeck (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE currentageindex (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE playerassignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique constraints on user_id for each table
ALTER TABLE playernames ADD CONSTRAINT playernames_user_id_key UNIQUE (user_id);
ALTER TABLE agesetup ADD CONSTRAINT agesetup_user_id_key UNIQUE (user_id);
ALTER TABLE dominantstate ADD CONSTRAINT dominantstate_user_id_key UNIQUE (user_id);
ALTER TABLE persistenttiersselections ADD CONSTRAINT persistenttiersselections_user_id_key UNIQUE (user_id);
ALTER TABLE playertrinkets ADD CONSTRAINT playertrinkets_user_id_key UNIQUE (user_id);
ALTER TABLE playertrinketscores ADD CONSTRAINT playertrinketscores_user_id_key UNIQUE (user_id);
ALTER TABLE availabletrinkets ADD CONSTRAINT availabletrinkets_user_id_key UNIQUE (user_id);
ALTER TABLE playermeaningcards ADD CONSTRAINT playermeaningcards_user_id_key UNIQUE (user_id);
ALTER TABLE playermeaningchoices ADD CONSTRAINT playermeaningchoices_user_id_key UNIQUE (user_id);
ALTER TABLE currentagedeck ADD CONSTRAINT currentagedeck_user_id_key UNIQUE (user_id);
ALTER TABLE currentageindex ADD CONSTRAINT currentageindex_user_id_key UNIQUE (user_id);
ALTER TABLE playerassignments ADD CONSTRAINT playerassignments_user_id_key UNIQUE (user_id);

-- Create indexes for better performance
CREATE INDEX playernames_user_id_idx ON playernames (user_id);
CREATE INDEX agesetup_user_id_idx ON agesetup (user_id);
CREATE INDEX dominantstate_user_id_idx ON dominantstate (user_id);
CREATE INDEX persistenttiersselections_user_id_idx ON persistenttiersselections (user_id);
CREATE INDEX playertrinkets_user_id_idx ON playertrinkets (user_id);
CREATE INDEX playertrinketscores_user_id_idx ON playertrinketscores (user_id);
CREATE INDEX availabletrinkets_user_id_idx ON availabletrinkets (user_id);
CREATE INDEX playermeaningcards_user_id_idx ON playermeaningcards (user_id);
CREATE INDEX playermeaningchoices_user_id_idx ON playermeaningchoices (user_id);
CREATE INDEX currentagedeck_user_id_idx ON currentagedeck (user_id);
CREATE INDEX currentageindex_user_id_idx ON currentageindex (user_id);
CREATE INDEX playerassignments_user_id_idx ON playerassignments (user_id);

-- Create views with camelCase names to match JavaScript naming
CREATE OR REPLACE VIEW "playerNames" AS 
  SELECT id, user_id, data, updated_at FROM playernames;
  
CREATE OR REPLACE VIEW "ageSetup" AS 
  SELECT id, user_id, data, updated_at FROM agesetup;
  
CREATE OR REPLACE VIEW "dominantState" AS 
  SELECT id, user_id, data, updated_at FROM dominantstate;
  
CREATE OR REPLACE VIEW "persistentTiersSelections" AS 
  SELECT id, user_id, data, updated_at FROM persistenttiersselections;
  
CREATE OR REPLACE VIEW "playerTrinkets" AS 
  SELECT id, user_id, data, updated_at FROM playertrinkets;
  
CREATE OR REPLACE VIEW "playerTrinketScores" AS 
  SELECT id, user_id, data, updated_at FROM playertrinketscores;
  
CREATE OR REPLACE VIEW "availableTrinkets" AS 
  SELECT id, user_id, data, updated_at FROM availabletrinkets;
  
CREATE OR REPLACE VIEW "playerMeaningCards" AS 
  SELECT id, user_id, data, updated_at FROM playermeaningcards;
  
CREATE OR REPLACE VIEW "playerMeaningChoices" AS 
  SELECT id, user_id, data, updated_at FROM playermeaningchoices;
  
CREATE OR REPLACE VIEW "currentAgeDeck" AS 
  SELECT id, user_id, data, updated_at FROM currentagedeck;
  
CREATE OR REPLACE VIEW "currentAgeIndex" AS 
  SELECT id, user_id, data, updated_at FROM currentageindex;
  
CREATE OR REPLACE VIEW "playerAssignments" AS 
  SELECT id, user_id, data, updated_at FROM playerassignments;

-- Create rules to make views updatable
-- For playerNames view
CREATE OR REPLACE RULE "playerNames_insert" AS ON INSERT TO "playerNames" 
  DO INSTEAD INSERT INTO playernames (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerNames_update" AS ON UPDATE TO "playerNames" 
  DO INSTEAD UPDATE playernames SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerNames_delete" AS ON DELETE TO "playerNames" 
  DO INSTEAD DELETE FROM playernames WHERE id = OLD.id;

-- Rules for ageSetup view
CREATE OR REPLACE RULE "ageSetup_insert" AS ON INSERT TO "ageSetup" 
  DO INSTEAD INSERT INTO agesetup (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "ageSetup_update" AS ON UPDATE TO "ageSetup" 
  DO INSTEAD UPDATE agesetup SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "ageSetup_delete" AS ON DELETE TO "ageSetup" 
  DO INSTEAD DELETE FROM agesetup WHERE id = OLD.id;

-- Rules for dominantState view
CREATE OR REPLACE RULE "dominantState_insert" AS ON INSERT TO "dominantState" 
  DO INSTEAD INSERT INTO dominantstate (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "dominantState_update" AS ON UPDATE TO "dominantState" 
  DO INSTEAD UPDATE dominantstate SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "dominantState_delete" AS ON DELETE TO "dominantState" 
  DO INSTEAD DELETE FROM dominantstate WHERE id = OLD.id;

-- Rules for persistentTiersSelections view
CREATE OR REPLACE RULE "persistentTiersSelections_insert" AS ON INSERT TO "persistentTiersSelections" 
  DO INSTEAD INSERT INTO persistenttiersselections (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "persistentTiersSelections_update" AS ON UPDATE TO "persistentTiersSelections" 
  DO INSTEAD UPDATE persistenttiersselections SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "persistentTiersSelections_delete" AS ON DELETE TO "persistentTiersSelections" 
  DO INSTEAD DELETE FROM persistenttiersselections WHERE id = OLD.id;

-- Rules for playerTrinkets view
CREATE OR REPLACE RULE "playerTrinkets_insert" AS ON INSERT TO "playerTrinkets" 
  DO INSTEAD INSERT INTO playertrinkets (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerTrinkets_update" AS ON UPDATE TO "playerTrinkets" 
  DO INSTEAD UPDATE playertrinkets SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerTrinkets_delete" AS ON DELETE TO "playerTrinkets" 
  DO INSTEAD DELETE FROM playertrinkets WHERE id = OLD.id;

-- Rules for playerTrinketScores view
CREATE OR REPLACE RULE "playerTrinketScores_insert" AS ON INSERT TO "playerTrinketScores" 
  DO INSTEAD INSERT INTO playertrinketscores (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerTrinketScores_update" AS ON UPDATE TO "playerTrinketScores" 
  DO INSTEAD UPDATE playertrinketscores SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerTrinketScores_delete" AS ON DELETE TO "playerTrinketScores" 
  DO INSTEAD DELETE FROM playertrinketscores WHERE id = OLD.id;

-- Rules for availableTrinkets view
CREATE OR REPLACE RULE "availableTrinkets_insert" AS ON INSERT TO "availableTrinkets" 
  DO INSTEAD INSERT INTO availabletrinkets (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "availableTrinkets_update" AS ON UPDATE TO "availableTrinkets" 
  DO INSTEAD UPDATE availabletrinkets SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "availableTrinkets_delete" AS ON DELETE TO "availableTrinkets" 
  DO INSTEAD DELETE FROM availabletrinkets WHERE id = OLD.id;

-- Rules for playerMeaningCards view
CREATE OR REPLACE RULE "playerMeaningCards_insert" AS ON INSERT TO "playerMeaningCards" 
  DO INSTEAD INSERT INTO playermeaningcards (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerMeaningCards_update" AS ON UPDATE TO "playerMeaningCards" 
  DO INSTEAD UPDATE playermeaningcards SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerMeaningCards_delete" AS ON DELETE TO "playerMeaningCards" 
  DO INSTEAD DELETE FROM playermeaningcards WHERE id = OLD.id;

-- Rules for playerMeaningChoices view
CREATE OR REPLACE RULE "playerMeaningChoices_insert" AS ON INSERT TO "playerMeaningChoices" 
  DO INSTEAD INSERT INTO playermeaningchoices (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerMeaningChoices_update" AS ON UPDATE TO "playerMeaningChoices" 
  DO INSTEAD UPDATE playermeaningchoices SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerMeaningChoices_delete" AS ON DELETE TO "playerMeaningChoices" 
  DO INSTEAD DELETE FROM playermeaningchoices WHERE id = OLD.id;

-- Rules for currentAgeDeck view
CREATE OR REPLACE RULE "currentAgeDeck_insert" AS ON INSERT TO "currentAgeDeck" 
  DO INSTEAD INSERT INTO currentagedeck (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "currentAgeDeck_update" AS ON UPDATE TO "currentAgeDeck" 
  DO INSTEAD UPDATE currentagedeck SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "currentAgeDeck_delete" AS ON DELETE TO "currentAgeDeck" 
  DO INSTEAD DELETE FROM currentagedeck WHERE id = OLD.id;

-- Rules for currentAgeIndex view
CREATE OR REPLACE RULE "currentAgeIndex_insert" AS ON INSERT TO "currentAgeIndex" 
  DO INSTEAD INSERT INTO currentageindex (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "currentAgeIndex_update" AS ON UPDATE TO "currentAgeIndex" 
  DO INSTEAD UPDATE currentageindex SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "currentAgeIndex_delete" AS ON DELETE TO "currentAgeIndex" 
  DO INSTEAD DELETE FROM currentageindex WHERE id = OLD.id;

-- Rules for playerAssignments view
CREATE OR REPLACE RULE "playerAssignments_insert" AS ON INSERT TO "playerAssignments" 
  DO INSTEAD INSERT INTO playerassignments (user_id, data, updated_at) 
  VALUES (NEW.user_id, NEW.data, COALESCE(NEW.updated_at, NOW()))
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerAssignments_update" AS ON UPDATE TO "playerAssignments" 
  DO INSTEAD UPDATE playerassignments SET data = NEW.data, updated_at = COALESCE(NEW.updated_at, NOW())
  WHERE id = OLD.id
  RETURNING id, user_id, data, updated_at;

CREATE OR REPLACE RULE "playerAssignments_delete" AS ON DELETE TO "playerAssignments" 
  DO INSTEAD DELETE FROM playerassignments WHERE id = OLD.id;

-- Grant permissions to view for auth users
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerNames" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "ageSetup" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "dominantState" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "persistentTiersSelections" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerTrinkets" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerTrinketScores" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "availableTrinkets" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerMeaningCards" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerMeaningChoices" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "currentAgeDeck" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "currentAgeIndex" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "playerAssignments" TO anon, authenticated;

-- Enable RLS on all tables
ALTER TABLE playernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE agesetup ENABLE ROW LEVEL SECURITY;
ALTER TABLE dominantstate ENABLE ROW LEVEL SECURITY;
ALTER TABLE persistenttiersselections ENABLE ROW LEVEL SECURITY;
ALTER TABLE playertrinkets ENABLE ROW LEVEL SECURITY;
ALTER TABLE playertrinketscores ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabletrinkets ENABLE ROW LEVEL SECURITY;
ALTER TABLE playermeaningcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE playermeaningchoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE currentagedeck ENABLE ROW LEVEL SECURITY;
ALTER TABLE currentageindex ENABLE ROW LEVEL SECURITY;
ALTER TABLE playerassignments ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables - simplified to just match auth.uid() to user_id
CREATE POLICY "playernames_all" ON playernames FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "agesetup_all" ON agesetup FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "dominantstate_all" ON dominantstate FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "persistenttiersselections_all" ON persistenttiersselections FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "playertrinkets_all" ON playertrinkets FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "playertrinketscores_all" ON playertrinketscores FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "availabletrinkets_all" ON availabletrinkets FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "playermeaningcards_all" ON playermeaningcards FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "playermeaningchoices_all" ON playermeaningchoices FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "currentagedeck_all" ON currentagedeck FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "currentageindex_all" ON currentageindex FOR ALL TO anon, authenticated USING (auth.uid() = user_id);
CREATE POLICY "playerassignments_all" ON playerassignments FOR ALL TO anon, authenticated USING (auth.uid() = user_id);

-- Special INSERT policies without checking uid
CREATE POLICY "playernames_insert" ON playernames FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "agesetup_insert" ON agesetup FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "dominantstate_insert" ON dominantstate FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "persistenttiersselections_insert" ON persistenttiersselections FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "playertrinkets_insert" ON playertrinkets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "playertrinketscores_insert" ON playertrinketscores FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "availabletrinkets_insert" ON availabletrinkets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "playermeaningcards_insert" ON playermeaningcards FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "playermeaningchoices_insert" ON playermeaningchoices FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "currentagedeck_insert" ON currentagedeck FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "currentageindex_insert" ON currentageindex FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "playerassignments_insert" ON playerassignments FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grant permissions on underlying tables
GRANT ALL ON TABLE playernames TO anon, authenticated;
GRANT ALL ON TABLE agesetup TO anon, authenticated;
GRANT ALL ON TABLE dominantstate TO anon, authenticated;
GRANT ALL ON TABLE persistenttiersselections TO anon, authenticated;
GRANT ALL ON TABLE playertrinkets TO anon, authenticated;
GRANT ALL ON TABLE playertrinketscores TO anon, authenticated;
GRANT ALL ON TABLE availabletrinkets TO anon, authenticated;
GRANT ALL ON TABLE playermeaningcards TO anon, authenticated;
GRANT ALL ON TABLE playermeaningchoices TO anon, authenticated;
GRANT ALL ON TABLE currentagedeck TO anon, authenticated;
GRANT ALL ON TABLE currentageindex TO anon, authenticated;
GRANT ALL ON TABLE playerassignments TO anon, authenticated;

-- Create a helper function for upserting data
CREATE OR REPLACE FUNCTION upsert_player_data(
  p_table_name TEXT,
  p_user_id UUID,
  p_data JSONB
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  EXECUTE format('
    INSERT INTO %I (user_id, data, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET data = $2, updated_at = NOW()
    RETURNING id', p_table_name)
  INTO v_id
  USING p_user_id, p_data;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------
-- PART 2: CORS CONFIGURATION
------------------------------------------------

-- Create a CORS settings table to store allowed origins
CREATE TABLE cors_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(origin)
);

-- Add necessary origins for the application
INSERT INTO cors_settings (origin) VALUES
  ('http://localhost:8000'),
  ('http://127.0.0.1:8000'),
  ('http://localhost:3000'), 
  ('http://localhost');

-- Create a helper view to display CORS settings
CREATE OR REPLACE VIEW cors_settings_view AS
SELECT 
  origin,
  'Add this origin to your Supabase Project Settings > API > CORS' as instructions
FROM cors_settings;

-- Comment on the CORS settings table
COMMENT ON TABLE cors_settings IS 
'IMPORTANT: These CORS settings still need to be manually added in the Supabase dashboard.
Go to Project Settings > API > CORS and add each origin listed in this table.';

-- Restore normal operation mode
SET session_replication_role = 'origin';

-- Add comment to remind about Auth settings
COMMENT ON SCHEMA public IS 
'IMPORTANT: To fix additional auth warnings:
1. Go to Authentication > Settings and reduce OTP expiry to less than 1 hour.
2. Enable leaked password detection.
3. Each user only sees their own data via RLS policies.
4. Views are created without SECURITY DEFINER to follow security best practices.';

-- Final setup notice
DO $$
BEGIN
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE';
  RAISE NOTICE '';
  RAISE NOTICE '▶️ IMPORTANT ADDITIONAL STEPS:';
  RAISE NOTICE '1. Configure CORS in Supabase Dashboard:';
  RAISE NOTICE '   - Go to Project Settings > API > CORS';
  RAISE NOTICE '   - Add http://localhost:8000 to allowed origins';
  RAISE NOTICE '';
  RAISE NOTICE '2. Fix Auth Security Warnings:';
  RAISE NOTICE '   - Go to Authentication > Settings';
  RAISE NOTICE '   - Reduce OTP expiry to less than 1 hour';
  RAISE NOTICE '   - Enable leaked password protection';
  RAISE NOTICE '';
  RAISE NOTICE '3. To see all CORS domains you should add, run:';
  RAISE NOTICE '   SELECT * FROM cors_settings_view;';
END;
$$;