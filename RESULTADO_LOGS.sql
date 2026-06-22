-- ============================================================
--  resultado_logs — NMV Admin
--  Tabla de auditoría: registra cada vez que el admin
--  crea o modifica un resultado de lotería.
--
--  Ejecutar en Supabase SQL Editor (una sola vez).
-- ============================================================

CREATE TABLE IF NOT EXISTS resultado_logs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID        NOT NULL,
  draw_date   DATE        NOT NULL,
  lottery_name TEXT       NOT NULL,
  usuario     TEXT        NOT NULL DEFAULT 'admin',
  accion      TEXT        NOT NULL CHECK (accion IN ('Creo', 'Modifico', 'Bloqueo')),
  anterior    TEXT        DEFAULT '-',
  nuevo       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by date + business
CREATE INDEX IF NOT EXISTS resultado_logs_date_biz
  ON resultado_logs (draw_date, business_id);

-- Enable Row Level Security
ALTER TABLE resultado_logs ENABLE ROW LEVEL SECURITY;

-- NOTE: PostgreSQL does NOT support "CREATE POLICY IF NOT EXISTS"
-- If you get a "policy already exists" error, skip these two lines.
CREATE POLICY "service_role full access"
  ON resultado_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon insert and select"
  ON resultado_logs FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
