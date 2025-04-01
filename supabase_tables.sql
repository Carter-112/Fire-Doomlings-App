-- Supabase SQL setup for Doomlings App
-- Run this in the Supabase SQL Editor

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

-- Create policies for each table to allow users to access only their own data
CREATE POLICY "playernames_policy" ON playernames FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "agesetup_policy" ON agesetup FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "dominantstate_policy" ON dominantstate FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "persistenttiersselections_policy" ON persistenttiersselections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playertrinkets_policy" ON playertrinkets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playertrinketscores_policy" ON playertrinketscores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "availabletrinkets_policy" ON availabletrinkets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playermeaningcards_policy" ON playermeaningcards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playermeaningchoices_policy" ON playermeaningchoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "currentagedeck_policy" ON currentagedeck FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "currentageindex_policy" ON currentageindex FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playerassignments_policy" ON playerassignments FOR ALL USING (auth.uid() = user_id); 