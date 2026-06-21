-- ═══════════════════════════════════════════════════════════════════════
-- PERMISOS BANCA — Real-Time via Supabase
-- Ejecutar en: Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────
-- 1. TABLA: banca_permisos
--    Almacena permisos por banca en JSON.
--    Admin escribe aquí → portal vendedor lee en real-time.
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banca_permisos (
  banca_id     TEXT        NOT NULL,
  business_id  UUID        NOT NULL,
  permisos     JSONB       NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by   TEXT        NOT NULL DEFAULT 'admin',
  PRIMARY KEY (banca_id, business_id)
);

-- Add columns if table already exists without them
ALTER TABLE banca_permisos ADD COLUMN IF NOT EXISTS banca_id    TEXT        NOT NULL DEFAULT '';
ALTER TABLE banca_permisos ADD COLUMN IF NOT EXISTS business_id UUID        NOT NULL DEFAULT 'bb000001-0000-0000-0000-000000000001';
ALTER TABLE banca_permisos ADD COLUMN IF NOT EXISTS permisos    JSONB       NOT NULL DEFAULT '{}';
ALTER TABLE banca_permisos ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE banca_permisos ADD COLUMN IF NOT EXISTS updated_by  TEXT        NOT NULL DEFAULT 'admin';

-- Index for fast vendor-side lookup
CREATE INDEX IF NOT EXISTS idx_banca_permisos_banca_id ON banca_permisos (banca_id);

-- RLS: service_role can do everything (admin uses service_role key)
ALTER TABLE banca_permisos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_banca_permisos" ON banca_permisos;
CREATE POLICY "service_role_all_banca_permisos" ON banca_permisos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS: anon + authenticated can READ (vendor portal uses anon key for real-time)
DROP POLICY IF EXISTS "read_banca_permisos" ON banca_permisos;
CREATE POLICY "read_banca_permisos" ON banca_permisos
  FOR SELECT TO anon, authenticated USING (true);

-- Enable Supabase Realtime replication for this table
ALTER PUBLICATION supabase_realtime ADD TABLE banca_permisos;

-- ────────────────────────────────────────────────────────────────────────
-- 2. UPDATE Maria: vendor_code = 'RDV-R01'
--    Conecta a Maria con la banca RDV-R01 del admin
-- ────────────────────────────────────────────────────────────────────────
UPDATE vendors
SET
  vendor_code = 'RDV-R01',
  business_id = 'bb000001-0000-0000-0000-000000000001',
  updated_at  = now()
WHERE pin = '1234'
  AND is_active = true;

-- Verificar cambio
SELECT id, name, pin, vendor_code, business_id, is_active
FROM vendors
WHERE pin = '1234';

-- ────────────────────────────────────────────────────────────────────────
-- 3. UPDATE ticket_sequences para RDV-R01
--    El prefijo NMV será reemplazado en el código por vendor_code
--    Pero actualizamos banca_number para que sea 'R01'
-- ────────────────────────────────────────────────────────────────────────
INSERT INTO ticket_sequences (business_id, banca_number, last_seq, updated_at)
VALUES ('bb000001-0000-0000-0000-000000000001', 'R01', 0, now())
ON CONFLICT (business_id) DO UPDATE
  SET banca_number = 'R01', updated_at = now();

-- ────────────────────────────────────────────────────────────────────────
-- 4. INSERT permisos por defecto para RDV-R01 (todos ON)
-- ────────────────────────────────────────────────────────────────────────
INSERT INTO banca_permisos (banca_id, business_id, permisos, updated_by)
VALUES (
  'RDV-R01',
  'bb000001-0000-0000-0000-000000000001',
  '{
    "monitoreo": true, "pendiente_pago": true, "balances": true,
    "contabilidad": true, "clientes": true, "ventas_historicas": true,
    "imprimir_reporte": true, "duplicar_jugadas": true, "jugadas": true,
    "pagar": true, "ver_ventas": true, "horarios": true, "ayuda": true,
    "configuracion": true, "autorizar_ponchado": true, "reportes": true,
    "generador_jugadas": true, "resultados": true, "escanear": true,
    "movil": true
  }',
  'admin'
)
ON CONFLICT (banca_id, business_id) DO NOTHING;

-- ════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN FINAL
-- ════════════════════════════════════════════════════════════════════════
SELECT 'banca_permisos' AS table_name, banca_id, business_id, updated_at FROM banca_permisos;
SELECT 'ticket_sequences' AS table_name, business_id, banca_number, last_seq FROM ticket_sequences;
