-- Supabase SQL setup for Doomlings App
-- Run this in the Supabase SQL Editor

-- First drop all existing tables and policies
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

-- Create tables for all the app data with proper security

-- Player Names
CREATE TABLE playernames (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Age Setup
CREATE TABLE agesetup (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Dominant State
CREATE TABLE dominantstate (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Persistent Tier Selections
CREATE TABLE persistenttiersselections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Player Trinkets
CREATE TABLE playertrinkets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Player Trinket Scores
CREATE TABLE playertrinketscores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Available Trinkets
CREATE TABLE availabletrinkets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Player Meaning Cards
CREATE TABLE playermeaningcards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Player Meaning Choices
CREATE TABLE playermeaningchoices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Current Age Deck
CREATE TABLE currentagedeck (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Current Age Index
CREATE TABLE currentageindex (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Player Assignments
CREATE TABLE playerassignments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security on each table individually
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

-- Create explicit READ policies for each table
CREATE POLICY "playernames_read_policy" ON playernames FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agesetup_read_policy" ON agesetup FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "dominantstate_read_policy" ON dominantstate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "persistenttiersselections_read_policy" ON persistenttiersselections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playertrinkets_read_policy" ON playertrinkets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playertrinketscores_read_policy" ON playertrinketscores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "availabletrinkets_read_policy" ON availabletrinkets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playermeaningcards_read_policy" ON playermeaningcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playermeaningchoices_read_policy" ON playermeaningchoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "currentagedeck_read_policy" ON currentagedeck FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "currentageindex_read_policy" ON currentageindex FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playerassignments_read_policy" ON playerassignments FOR SELECT USING (auth.uid() = user_id);

-- Create explicit INSERT policies for each table
CREATE POLICY "playernames_insert_policy" ON playernames FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agesetup_insert_policy" ON agesetup FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dominantstate_insert_policy" ON dominantstate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "persistenttiersselections_insert_policy" ON persistenttiersselections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playertrinkets_insert_policy" ON playertrinkets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playertrinketscores_insert_policy" ON playertrinketscores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "availabletrinkets_insert_policy" ON availabletrinkets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playermeaningcards_insert_policy" ON playermeaningcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playermeaningchoices_insert_policy" ON playermeaningchoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "currentagedeck_insert_policy" ON currentagedeck FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "currentageindex_insert_policy" ON currentageindex FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playerassignments_insert_policy" ON playerassignments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create explicit UPDATE policies for each table
CREATE POLICY "playernames_update_policy" ON playernames FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agesetup_update_policy" ON agesetup FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "dominantstate_update_policy" ON dominantstate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "persistenttiersselections_update_policy" ON persistenttiersselections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playertrinkets_update_policy" ON playertrinkets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playertrinketscores_update_policy" ON playertrinketscores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "availabletrinkets_update_policy" ON availabletrinkets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playermeaningcards_update_policy" ON playermeaningcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playermeaningchoices_update_policy" ON playermeaningchoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "currentagedeck_update_policy" ON currentagedeck FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "currentageindex_update_policy" ON currentageindex FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playerassignments_update_policy" ON playerassignments FOR UPDATE USING (auth.uid() = user_id); 