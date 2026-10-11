
/*
# PathFinder – Full Database Schema

## Overview
Creates the complete persistence layer for the PathFinder education guidance platform
for Pakistani students. Migrates all user data from localStorage to Supabase.

## New Tables

### 1. `profiles`
Stores each signed-in student's academic profile used for personalized matching.
Columns: id (FK to auth.users), full_name, education_level, intermediate_group,
gpa, intended_degree, preferred_field, preferred_countries[], budget,
scholarship_needed, english_test, career_goal, created_at, updated_at.

### 2. `saved_universities`
Replaces the `pathfinder_saved_universities` localStorage key.
Columns: id, user_id (FK auth.users), university_id (text, references static data),
notes, saved_at. Unique constraint on (user_id, university_id).

### 3. `saved_scholarships`
Replaces the `pathfinder_saved_scholarships` localStorage key.
Columns: id, user_id (FK auth.users), scholarship_id (text, references static data),
notes, saved_at. Unique constraint on (user_id, scholarship_id).

### 4. `checklist_items`
Replaces the `pathfinder_checklist` localStorage key. Stores per-user application
checklist state with label, done flag, category, and sort_order.

### 5. `assessment_results`
Persists quiz/aptitude assessment answers and the resulting field recommendations
(jsonb) so users can revisit past results.

### 6. `cv_drafts`
Persists CV builder state between sessions (title + full jsonb content blob).
Users can have multiple saved drafts.

## Security
- RLS enabled on all tables.
- All policies are authenticated-only (owner-scoped via auth.uid() = user_id).
- INSERT policies use DEFAULT auth.uid() column so clients can omit user_id.
- Separate SELECT / INSERT / UPDATE / DELETE policies on every table.
*/

-- ─── profiles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           text,
  education_level     text,
  intermediate_group  text,
  gpa                 text,
  intended_degree     text,
  preferred_field     text,
  preferred_countries text[],
  budget              text,
  scholarship_needed  boolean,
  english_test        text,
  career_goal         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own"  ON profiles;

CREATE POLICY "profiles_select_own"  ON profiles FOR SELECT    TO authenticated USING      (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON profiles FOR INSERT    TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON profiles FOR UPDATE    TO authenticated USING      (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own"  ON profiles FOR DELETE    TO authenticated USING      (auth.uid() = id);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── saved_universities ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_universities (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id   text        NOT NULL,
  notes           text,
  saved_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, university_id)
);

ALTER TABLE saved_universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_unis_select_own"  ON saved_universities;
DROP POLICY IF EXISTS "saved_unis_insert_own"  ON saved_universities;
DROP POLICY IF EXISTS "saved_unis_update_own"  ON saved_universities;
DROP POLICY IF EXISTS "saved_unis_delete_own"  ON saved_universities;

CREATE POLICY "saved_unis_select_own"  ON saved_universities FOR SELECT    TO authenticated USING      (auth.uid() = user_id);
CREATE POLICY "saved_unis_insert_own"  ON saved_universities FOR INSERT    TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_unis_update_own"  ON saved_universities FOR UPDATE    TO authenticated USING      (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_unis_delete_own"  ON saved_universities FOR DELETE    TO authenticated USING      (auth.uid() = user_id);

-- ─── saved_scholarships ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id  text        NOT NULL,
  notes           text,
  saved_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, scholarship_id)
);

ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_scholarships_select_own"  ON saved_scholarships;
DROP POLICY IF EXISTS "saved_scholarships_insert_own"  ON saved_scholarships;
DROP POLICY IF EXISTS "saved_scholarships_update_own"  ON saved_scholarships;
DROP POLICY IF EXISTS "saved_scholarships_delete_own"  ON saved_scholarships;

CREATE POLICY "saved_scholarships_select_own"  ON saved_scholarships FOR SELECT    TO authenticated USING      (auth.uid() = user_id);
CREATE POLICY "saved_scholarships_insert_own"  ON saved_scholarships FOR INSERT    TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_scholarships_update_own"  ON saved_scholarships FOR UPDATE    TO authenticated USING      (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_scholarships_delete_own"  ON saved_scholarships FOR DELETE    TO authenticated USING      (auth.uid() = user_id);

-- ─── checklist_items ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS checklist_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label       text        NOT NULL,
  done        boolean     NOT NULL DEFAULT false,
  category    text,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "checklist_select_own"  ON checklist_items;
DROP POLICY IF EXISTS "checklist_insert_own"  ON checklist_items;
DROP POLICY IF EXISTS "checklist_update_own"  ON checklist_items;
DROP POLICY IF EXISTS "checklist_delete_own"  ON checklist_items;

CREATE POLICY "checklist_select_own"  ON checklist_items FOR SELECT    TO authenticated USING      (auth.uid() = user_id);
CREATE POLICY "checklist_insert_own"  ON checklist_items FOR INSERT    TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checklist_update_own"  ON checklist_items FOR UPDATE    TO authenticated USING      (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checklist_delete_own"  ON checklist_items FOR DELETE    TO authenticated USING      (auth.uid() = user_id);

DROP TRIGGER IF EXISTS checklist_updated_at ON checklist_items;
CREATE TRIGGER checklist_updated_at BEFORE UPDATE ON checklist_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── assessment_results ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_results (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  answers             jsonb       NOT NULL DEFAULT '{}',
  recommended_fields  jsonb       NOT NULL DEFAULT '[]',
  taken_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assessment_select_own"  ON assessment_results;
DROP POLICY IF EXISTS "assessment_insert_own"  ON assessment_results;
DROP POLICY IF EXISTS "assessment_update_own"  ON assessment_results;
DROP POLICY IF EXISTS "assessment_delete_own"  ON assessment_results;

CREATE POLICY "assessment_select_own"  ON assessment_results FOR SELECT    TO authenticated USING      (auth.uid() = user_id);
CREATE POLICY "assessment_insert_own"  ON assessment_results FOR INSERT    TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_update_own"  ON assessment_results FOR UPDATE    TO authenticated USING      (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_delete_own"  ON assessment_results FOR DELETE    TO authenticated USING      (auth.uid() = user_id);

-- ─── cv_drafts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cv_drafts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL DEFAULT 'My CV',
  content     jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cv_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cv_drafts_select_own"  ON cv_drafts;
DROP POLICY IF EXISTS "cv_drafts_insert_own"  ON cv_drafts;
DROP POLICY IF EXISTS "cv_drafts_update_own"  ON cv_drafts;
DROP POLICY IF EXISTS "cv_drafts_delete_own"  ON cv_drafts;

CREATE POLICY "cv_drafts_select_own"  ON cv_drafts FOR SELECT    TO authenticated USING      (auth.uid() = user_id);
CREATE POLICY "cv_drafts_insert_own"  ON cv_drafts FOR INSERT    TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cv_drafts_update_own"  ON cv_drafts FOR UPDATE    TO authenticated USING      (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cv_drafts_delete_own"  ON cv_drafts FOR DELETE    TO authenticated USING      (auth.uid() = user_id);

DROP TRIGGER IF EXISTS cv_drafts_updated_at ON cv_drafts;
CREATE TRIGGER cv_drafts_updated_at BEFORE UPDATE ON cv_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS saved_unis_user_idx          ON saved_universities(user_id);
CREATE INDEX IF NOT EXISTS saved_scholarships_user_idx  ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS checklist_user_order_idx     ON checklist_items(user_id, sort_order);
CREATE INDEX IF NOT EXISTS assessment_user_idx          ON assessment_results(user_id, taken_at DESC);
CREATE INDEX IF NOT EXISTS cv_drafts_user_idx           ON cv_drafts(user_id, updated_at DESC);
