-- ═══════════════════════════════════════════════════════════════════════
-- TABLA: contabilidad
-- NMV Lottery — Admin Panel
-- Ejecutar en: Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Crear tabla
CREATE TABLE IF NOT EXISTS contabilidad (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID        NOT NULL,
  fecha         DATE        NOT NULL,
  descripcion   TEXT        NOT NULL,
  categoria     TEXT        NOT NULL CHECK (categoria IN ('gastos','compras','rentas','empleados','inversion','premios','prestamos')),
  subcategoria  TEXT        NOT NULL DEFAULT '',
  monto         NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (monto >= 0),
  tipo          TEXT        NOT NULL DEFAULT 'egreso' CHECK (tipo IN ('ingreso','egreso')),
  estado        TEXT        NOT NULL DEFAULT 'pagado' CHECK (estado IN ('pagado','pendiente','cancelado')),
  referencia    TEXT        NOT NULL DEFAULT '',
  notas         TEXT        NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_contabilidad_business_id  ON contabilidad (business_id);
CREATE INDEX IF NOT EXISTS idx_contabilidad_fecha        ON contabilidad (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_contabilidad_categoria    ON contabilidad (categoria);
CREATE INDEX IF NOT EXISTS idx_contabilidad_estado       ON contabilidad (estado);

-- 3. Trigger: auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_contabilidad_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contabilidad_updated_at ON contabilidad;
CREATE TRIGGER trg_contabilidad_updated_at
  BEFORE UPDATE ON contabilidad
  FOR EACH ROW EXECUTE FUNCTION update_contabilidad_updated_at();

-- 4. Row Level Security
ALTER TABLE contabilidad ENABLE ROW LEVEL SECURITY;

-- Política: service_role accede a todo (para el admin)
CREATE POLICY "service_role_all" ON contabilidad
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Política: usuarios autenticados solo ven su business_id
CREATE POLICY "authenticated_own_business" ON contabilidad
  FOR ALL
  TO authenticated
  USING (business_id = (current_setting('app.business_id', true))::UUID)
  WITH CHECK (business_id = (current_setting('app.business_id', true))::UUID);

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════════════════
-- SELECT * FROM contabilidad LIMIT 5;
-- SELECT COUNT(*) FROM contabilidad;
