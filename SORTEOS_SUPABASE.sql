-- ═══════════════════════════════════════════════════════════════════════
-- SORTEOS TABLE — NMV Lottery Admin → Vendor Sync
-- Ejecutar en: Supabase SQL Editor
-- Permite que el admin edite sorteos (nombre, color, horario, activo)
-- y que el portal vendedor y numeros los reciba en tiempo real.
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Crear tabla sorteos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sorteos (
  id            TEXT NOT NULL,
  business_id   UUID NOT NULL,
  nombre        TEXT NOT NULL,
  abreviacion   TEXT NOT NULL DEFAULT '',
  horario       TEXT NOT NULL DEFAULT '',      -- apertura, ej: "11:00 AM"
  horario_cierre TEXT DEFAULT '',              -- cierre, ej: "11:30 AM"
  color         TEXT NOT NULL DEFAULT '#14B8A6',
  activo        BOOLEAN NOT NULL DEFAULT true,
  orden         INT NOT NULL DEFAULT 0,
  icon          TEXT DEFAULT NULL,             -- URL de logo (opcional)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, business_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sorteos_business_id ON sorteos (business_id);
CREATE INDEX IF NOT EXISTS idx_sorteos_activo      ON sorteos (activo);
CREATE INDEX IF NOT EXISTS idx_sorteos_orden       ON sorteos (orden);

-- ── 2. RLS — solo service_role puede escribir; anon puede leer ────────────
ALTER TABLE sorteos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_sorteos" ON sorteos;
CREATE POLICY "service_role_all_sorteos" ON sorteos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_sorteos" ON sorteos;
CREATE POLICY "anon_read_sorteos" ON sorteos
  FOR SELECT TO anon USING (true);

-- ── 3. Trigger updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_sorteos_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sorteos_updated_at ON sorteos;
CREATE TRIGGER trg_sorteos_updated_at
  BEFORE UPDATE ON sorteos
  FOR EACH ROW EXECUTE FUNCTION update_sorteos_updated_at();

-- ── 4. Habilitar Realtime ────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE sorteos;

-- ── 5. Insertar sorteos por defecto para RDV business ────────────────────
-- Solo corre si la tabla está vacía para este business
INSERT INTO sorteos (id, business_id, nombre, abreviacion, horario, horario_cierre, color, activo, orden)
SELECT * FROM (VALUES
  ('s01', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LA PRIMERA 7PM',          'LP7',   '7:00 PM',  '7:30 PM',  '#14B8A6', true,  1),
  ('s02', 'bb000001-0000-0000-0000-000000000001'::UUID, 'FLORIDA PM',               'FLP',   '1:30 PM',  '10:00 PM', '#3B82F6', true,  2),
  ('s03', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LOTEKA',                   'LTK',   '7:55 PM',  '8:00 PM',  '#8B5CF6', true,  3),
  ('s04', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LA SUERTE',                'LS',    '12:00 PM', '12:30 PM', '#F59E0B', true,  4),
  ('s05', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LA PRIMERA',               'LP',    '12:00 PM', '12:30 PM', '#10B981', true,  5),
  ('s06', 'bb000001-0000-0000-0000-000000000001'::UUID, 'GANA MAS',                 'GM',    '8:55 PM',  '9:00 PM',  '#EF4444', true,  6),
  ('s07', 'bb000001-0000-0000-0000-000000000001'::UUID, 'QUINIELA REAL',            'QR',    '6:00 PM',  '6:30 PM',  '#F97316', true,  7),
  ('s08', 'bb000001-0000-0000-0000-000000000001'::UUID, 'SUPER PALE REAL-GANA MAS', 'SPRGM', '8:55 PM',  '9:00 PM',  '#EC4899', true,  8),
  ('s09', 'bb000001-0000-0000-0000-000000000001'::UUID, 'Anguila 10AM',             'ANG10', '10:00 AM', '10:30 AM', '#06B6D4', true,  9),
  ('s10', 'bb000001-0000-0000-0000-000000000001'::UUID, 'NEW YORK AM',              'NYAM',  '12:30 PM', '1:00 PM',  '#6366F1', true,  10),
  ('s11', 'bb000001-0000-0000-0000-000000000001'::UUID, 'Anguila 6PM',              'ANG6',  '6:00 PM',  '6:30 PM',  '#0EA5E9', true,  11),
  ('s12', 'bb000001-0000-0000-0000-000000000001'::UUID, 'NACIONAL',                 'NAC',   '6:00 PM',  '6:30 PM',  '#84CC16', true,  12),
  ('s13', 'bb000001-0000-0000-0000-000000000001'::UUID, 'NEW YORK PM',              'NYPM',  '7:30 PM',  '8:00 PM',  '#4F46E5', true,  13),
  ('s14', 'bb000001-0000-0000-0000-000000000001'::UUID, 'Anguila 9PM',              'ANG9',  '9:00 PM',  '9:30 PM',  '#0284C7', true,  14),
  ('s15', 'bb000001-0000-0000-0000-000000000001'::UUID, 'Anguila 1PM',              'ANG1',  '1:00 PM',  '1:30 PM',  '#0891B2', true,  15),
  ('s16', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LA SUERTE 6PM',            'LS6',   '6:00 PM',  '6:30 PM',  '#D97706', true,  16),
  ('s17', 'bb000001-0000-0000-0000-000000000001'::UUID, 'QUINIELA PALE',            'QP',    '6:00 PM',  '6:30 PM',  '#EA580C', true,  17),
  ('s18', 'bb000001-0000-0000-0000-000000000001'::UUID, 'FLORIDA AM',              'FLAM',  '11:00 AM', '11:30 AM', '#2563EB', true,  18),
  ('s19', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LOTEDOM',                  'LTD',   '5:30 PM',  '6:00 PM',  '#7C3AED', true,  19),
  ('s20', 'bb000001-0000-0000-0000-000000000001'::UUID, 'King Lottery AM',          'KING',  '12:00 PM', '12:30 PM', '#FFD54F', true,  20),
  ('s21', 'bb000001-0000-0000-0000-000000000001'::UUID, 'King Lottery PM',          'KINGP', '7:30 PM',  '8:00 PM',  '#FFB74D', true,  21),
  ('s22', 'bb000001-0000-0000-0000-000000000001'::UUID, 'QUINIELA REAL',            'QREAL', '2:00 PM',  '2:30 PM',  '#CE93D8', true,  22),
  ('s23', 'bb000001-0000-0000-0000-000000000001'::UUID, 'NEW YORK PM',              'NYPM2', '10:30 PM', '11:00 PM', '#42A5F5', true,  23),
  ('s24', 'bb000001-0000-0000-0000-000000000001'::UUID, 'LOTECA',                   'LTCA',  '7:00 PM',  '7:30 PM',  '#81C784', true,  24)
) AS v(id, business_id, nombre, abreviacion, horario, horario_cierre, color, activo, orden)
WHERE NOT EXISTS (
  SELECT 1 FROM sorteos WHERE business_id = 'bb000001-0000-0000-0000-000000000001'
);
