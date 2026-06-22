-- ============================================================
--  lottery_results — RLS policies
--  Ejecutar en Supabase SQL Editor si los vendedores
--  no ven los resultados (tabla retorna vacío al anon).
-- ============================================================

-- 1. Habilitar RLS (por si no está habilitado)
ALTER TABLE lottery_results ENABLE ROW LEVEL SECURITY;

-- 2. Permitir lectura pública (vendor + cliente móvil usan anon key)
--    Si ya existe esta política, omitirla.
DROP POLICY IF EXISTS "public read lottery_results" ON lottery_results;
CREATE POLICY "public read lottery_results"
  ON lottery_results FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Solo service_role puede INSERT / UPDATE / DELETE
DROP POLICY IF EXISTS "service write lottery_results" ON lottery_results;
CREATE POLICY "service write lottery_results"
  ON lottery_results FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. También permite al admin (authenticated) escribir
DROP POLICY IF EXISTS "authenticated write lottery_results" ON lottery_results;
CREATE POLICY "authenticated write lottery_results"
  ON lottery_results FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
