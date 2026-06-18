// Ejecutar: node create-tables.mjs
// Desde la carpeta nmv-admin donde está instalado @supabase/supabase-js

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://acvnyvsofwsatxqyjjfk.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkTable(name) {
  const { data, error } = await supabase.from(name).select("id").limit(1);
  if (error?.code === "42P01") return false; // table doesn't exist
  if (error) { console.log(`⚠️  ${name}: ${error.message}`); return false; }
  console.log(`✅ Tabla '${name}' existe — ${data.length} filas`);
  return true;
}

console.log("\n=== Verificando tablas ===");
const bancasExist = await checkTable("zonas");
const zonasExist  = await checkTable("bancas");

if (!bancasExist || !zonasExist) {
  console.log(`
❌ Tablas faltantes. Pega esto en el SQL Editor de Supabase:
   https://supabase.com/dashboard/project/acvnyvsofwsatxqyjjfk/sql/new

──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zonas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL DEFAULT 'bb000001-0000-0000-0000-000000000001'::UUID,
  nombre      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bancas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL DEFAULT 'bb000001-0000-0000-0000-000000000001'::UUID,
  nombre      TEXT NOT NULL,
  codigo      TEXT NOT NULL,
  mwr_code    TEXT DEFAULT '',
  balance     NUMERIC(12,2) DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  zona_id     UUID REFERENCES zonas(id) ON DELETE SET NULL,
  notas       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE zonas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bancas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_access_zonas"  ON zonas  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_access_bancas" ON bancas FOR ALL USING (true) WITH CHECK (true);
──────────────────────────────────────────────────────────
`);
} else {
  console.log("\n✅ ¡Todas las tablas existen!");
}
