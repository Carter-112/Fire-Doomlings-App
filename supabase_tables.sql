-- Complete Supabase setup script for Doomlings App
-- Run this in the Supabase SQL Editor

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

-- Create a function to get the current authenticated user ID
CREATE OR REPLACE FUNCTION get_auth_user_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create tables with proper constraints and defaults
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

-- For anonymous access - create a special policy that allows any authenticated user
-- to insert with their ID and only access their own data

-- Playernames policies
CREATE POLICY playernames_select_policy ON playernames 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playernames_insert_policy ON playernames 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playernames_update_policy ON playernames 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playernames_delete_policy ON playernames 
  FOR DELETE USING (user_id = auth.uid());

-- Agesetup policies
CREATE POLICY agesetup_select_policy ON agesetup 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY agesetup_insert_policy ON agesetup 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY agesetup_update_policy ON agesetup 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY agesetup_delete_policy ON agesetup 
  FOR DELETE USING (user_id = auth.uid());

-- Dominantstate policies
CREATE POLICY dominantstate_select_policy ON dominantstate 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY dominantstate_insert_policy ON dominantstate 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY dominantstate_update_policy ON dominantstate 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY dominantstate_delete_policy ON dominantstate 
  FOR DELETE USING (user_id = auth.uid());

-- Persistenttiersselections policies
CREATE POLICY persistenttiersselections_select_policy ON persistenttiersselections 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY persistenttiersselections_insert_policy ON persistenttiersselections 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY persistenttiersselections_update_policy ON persistenttiersselections 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY persistenttiersselections_delete_policy ON persistenttiersselections 
  FOR DELETE USING (user_id = auth.uid());

-- Playertrinkets policies
CREATE POLICY playertrinkets_select_policy ON playertrinkets 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playertrinkets_insert_policy ON playertrinkets 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playertrinkets_update_policy ON playertrinkets 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playertrinkets_delete_policy ON playertrinkets 
  FOR DELETE USING (user_id = auth.uid());

-- Playertrinketscores policies
CREATE POLICY playertrinketscores_select_policy ON playertrinketscores 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playertrinketscores_insert_policy ON playertrinketscores 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playertrinketscores_update_policy ON playertrinketscores 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playertrinketscores_delete_policy ON playertrinketscores 
  FOR DELETE USING (user_id = auth.uid());

-- Availabletrinkets policies
CREATE POLICY availabletrinkets_select_policy ON availabletrinkets 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY availabletrinkets_insert_policy ON availabletrinkets 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY availabletrinkets_update_policy ON availabletrinkets 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY availabletrinkets_delete_policy ON availabletrinkets 
  FOR DELETE USING (user_id = auth.uid());

-- Playermeaningcards policies
CREATE POLICY playermeaningcards_select_policy ON playermeaningcards 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playermeaningcards_insert_policy ON playermeaningcards 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playermeaningcards_update_policy ON playermeaningcards 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playermeaningcards_delete_policy ON playermeaningcards 
  FOR DELETE USING (user_id = auth.uid());

-- Playermeaningchoices policies
CREATE POLICY playermeaningchoices_select_policy ON playermeaningchoices 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playermeaningchoices_insert_policy ON playermeaningchoices 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playermeaningchoices_update_policy ON playermeaningchoices 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playermeaningchoices_delete_policy ON playermeaningchoices 
  FOR DELETE USING (user_id = auth.uid());

-- Currentagedeck policies
CREATE POLICY currentagedeck_select_policy ON currentagedeck 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY currentagedeck_insert_policy ON currentagedeck 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY currentagedeck_update_policy ON currentagedeck 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY currentagedeck_delete_policy ON currentagedeck 
  FOR DELETE USING (user_id = auth.uid());

-- Currentageindex policies
CREATE POLICY currentageindex_select_policy ON currentageindex 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY currentageindex_insert_policy ON currentageindex 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY currentageindex_update_policy ON currentageindex 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY currentageindex_delete_policy ON currentageindex 
  FOR DELETE USING (user_id = auth.uid());

-- Playerassignments policies
CREATE POLICY playerassignments_select_policy ON playerassignments 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY playerassignments_insert_policy ON playerassignments 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY playerassignments_update_policy ON playerassignments 
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY playerassignments_delete_policy ON playerassignments 
  FOR DELETE USING (user_id = auth.uid());

-- Create special public-access function to test permissions
CREATE OR REPLACE FUNCTION check_permissions() 
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
DECLARE
  current_user_id UUID;
  result jsonb;
BEGIN
  current_user_id := auth.uid();
  
  result := jsonb_build_object(
    'user_id', current_user_id,
    'timestamp', NOW(),
    'anonymous', current_user_id IS NOT NULL
  );
  
  RETURN result;
END;
$$; 