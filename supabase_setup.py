"""
NMV Admin - Supabase Tables Setup
Ejecutar: python supabase_setup.py
"""
import urllib.request
import json

SUPABASE_URL = "https://acvnyvsofwsatxqyjjfk.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk"

# ─── Check which tables exist ───────────────────────────────────────────────────
def check_table(name):
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/{name}?limit=1",
            headers={
                "apikey": SERVICE_KEY,
                "Authorization": f"Bearer {SERVICE_KEY}",
            }
        )
        r = urllib.request.urlopen(req)
        data = json.loads(r.read().decode())
        print(f"  ✅ Tabla '{name}' existe — {len(data)} filas")
        return True
    except Exception as e:
        if "404" in str(e):
            print(f"  ❌ Tabla '{name}' NO existe")
        else:
            print(f"  ⚠️  Error en '{name}': {e}")
        return False

print("\n=== Verificando tablas existentes ===")
tables = ["bancas", "zonas", "vendors", "zones", "betting_pools", "cobradores", "transactions"]
for t in tables:
    check_table(t)

print("\nSi las tablas NO existen, ve a:")
print("https://supabase.com/dashboard/project/acvnyvsofwsatxqyjjfk/editor")
print("\nY ejecuta el siguiente SQL:\n")
print("""
-- ============================================================
-- NMV ADMIN - Crear Tablas Básicas
-- Copiar y pegar en el SQL Editor de Supabase
-- ============================================================

-- Tabla de Bancas (Betting Pools)
CREATE TABLE IF NOT EXISTS bancas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL DEFAULT 'bb000001-0000-0000-0000-000000000001'::UUID,
  nombre      TEXT NOT NULL,
  codigo      TEXT NOT NULL UNIQUE,
  mwr_code    TEXT,
  balance     NUMERIC(12,2) DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  zona_id     UUID REFERENCES zonas(id) ON DELETE SET NULL,
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Zonas
CREATE TABLE IF NOT EXISTS zonas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL DEFAULT 'bb000001-0000-0000-0000-000000000001'::UUID,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Dar permisos al rol anon y service_role
ALTER TABLE bancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE zonas  ENABLE ROW LEVEL SECURITY;

-- Políticas: service_role puede hacer todo
CREATE POLICY "service_role full access bancas" ON bancas FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role full access zonas"  ON zonas  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- También permitir anon para el panel admin
CREATE POLICY "anon read bancas" ON bancas FOR SELECT TO anon USING (true);
CREATE POLICY "anon read zonas"  ON zonas  FOR SELECT TO anon USING (true);
""")
