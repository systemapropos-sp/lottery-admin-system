-- ================================================================
-- NMV Lottery — Tabla sortition_results
-- Pegar en: https://supabase.com/dashboard/project/acvnyvsofwsatxqyjjfk/sql
-- ================================================================

CREATE TABLE IF NOT EXISTS sortition_results (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id     TEXT NOT NULL DEFAULT 'RDV-01',
  sorteo_name  TEXT NOT NULL,
  lottery_id   TEXT,
  categoria    TEXT,
  fecha        DATE NOT NULL,
  hora         TEXT,
  color        TEXT,
  num1         TEXT,
  num2         TEXT,
  num3         TEXT,
  p3           TEXT,
  p4           TEXT,
  p5           TEXT,
  locked       BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (admin_id, sorteo_name, fecha)
);

-- Add color column to existing table (safe to run if already created without it)
ALTER TABLE sortition_results ADD COLUMN IF NOT EXISTS color TEXT;

-- RLS
ALTER TABLE sortition_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Public read sortition_results" ON sortition_results;
DROP POLICY IF EXISTS "Service role manage sortition_results" ON sortition_results;

-- Public read (vendor portal can see results)
CREATE POLICY "Public read sortition_results"
  ON sortition_results FOR SELECT USING (true);

-- Service role full access (admin can insert/update)
CREATE POLICY "Service role manage sortition_results"
  ON sortition_results FOR ALL USING (true) WITH CHECK (true);
