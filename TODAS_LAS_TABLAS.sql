-- ═══════════════════════════════════════════════════════════════════════
-- TODAS LAS TABLAS PENDIENTES — NMV Lottery Admin
-- Ejecutar en: Supabase SQL Editor
-- SEGURO: usa IF NOT EXISTS y ADD COLUMN IF NOT EXISTS
-- ═══════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────
-- 1. TABLA: entidades  (Empleados, Bancos, Otros)
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entidades (
  id              UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  codigo          TEXT NOT NULL DEFAULT '',
  tipo            TEXT NOT NULL DEFAULT 'otros',
  balance         NUMERIC(12,2) NOT NULL DEFAULT 0,
  caida_acumulada NUMERIC(12,2) NOT NULL DEFAULT 0,
  prestamo        NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  notas           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agregar columnas que pueden faltar si la tabla ya existía
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS id UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS business_id UUID;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS nombre TEXT;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS codigo TEXT NOT NULL DEFAULT '';
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'otros';
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS caida_acumulada NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS prestamo NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS notas TEXT NOT NULL DEFAULT '';
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE entidades ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Índices
CREATE INDEX IF NOT EXISTS idx_entidades_business_id ON entidades (business_id);
CREATE INDEX IF NOT EXISTS idx_entidades_tipo        ON entidades (tipo);
CREATE INDEX IF NOT EXISTS idx_entidades_is_active   ON entidades (is_active);

-- RLS
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_entidades" ON entidades;
CREATE POLICY "service_role_all_entidades" ON entidades
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_entidades_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_entidades_updated_at ON entidades;
CREATE TRIGGER trg_entidades_updated_at
  BEFORE UPDATE ON entidades
  FOR EACH ROW EXECUTE FUNCTION update_entidades_updated_at();

-- ────────────────────────────────────────────────────────────────────────
-- 2. TABLA: receptores_correo
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS receptores_correo (
  id          UUID NOT NULL DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agregar columnas que pueden faltar
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS id UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS business_id UUID;
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS zones TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS email_types TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE receptores_correo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Índices
CREATE INDEX IF NOT EXISTS idx_receptores_business_id ON receptores_correo (business_id);
CREATE INDEX IF NOT EXISTS idx_receptores_email       ON receptores_correo (email);

-- RLS
ALTER TABLE receptores_correo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_receptores" ON receptores_correo;
CREATE POLICY "service_role_all_receptores" ON receptores_correo
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_receptores_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_receptores_updated_at ON receptores_correo;
CREATE TRIGGER trg_receptores_updated_at
  BEFORE UPDATE ON receptores_correo
  FOR EACH ROW EXECUTE FUNCTION update_receptores_updated_at();

-- ────────────────────────────────────────────────────────────────────────
-- 3. TABLA: contabilidad
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contabilidad (
  id            UUID NOT NULL DEFAULT gen_random_uuid(),
  fecha         DATE NOT NULL DEFAULT now(),
  descripcion   TEXT NOT NULL DEFAULT '',
  categoria     TEXT NOT NULL DEFAULT 'gastos',
  subcategoria  TEXT NOT NULL DEFAULT '',
  monto         NUMERIC(12,2) NOT NULL DEFAULT 0,
  tipo          TEXT NOT NULL DEFAULT 'egreso',
  estado        TEXT NOT NULL DEFAULT 'pagado',
  referencia    TEXT NOT NULL DEFAULT '',
  notas         TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agregar columnas que pueden faltar
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS id UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS business_id UUID;
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS fecha DATE;
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS categoria TEXT;
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS subcategoria TEXT NOT NULL DEFAULT '';
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS monto NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'egreso';
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'pagado';
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS referencia TEXT NOT NULL DEFAULT '';
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS notas TEXT NOT NULL DEFAULT '';
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE contabilidad ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Índices
CREATE INDEX IF NOT EXISTS idx_contabilidad_business_id ON contabilidad (business_id);
CREATE INDEX IF NOT EXISTS idx_contabilidad_fecha       ON contabilidad (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_contabilidad_categoria   ON contabilidad (categoria);

-- RLS
ALTER TABLE contabilidad ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_contabilidad" ON contabilidad;
CREATE POLICY "service_role_all_contabilidad" ON contabilidad
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_contabilidad_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contabilidad_updated_at ON contabilidad;
CREATE TRIGGER trg_contabilidad_updated_at
  BEFORE UPDATE ON contabilidad
  FOR EACH ROW EXECUTE FUNCTION update_contabilidad_updated_at();

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════════════════
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('entidades','receptores_correo','contabilidad')
ORDER BY table_name, ordinal_position;
