import { createClient } from "@supabase/supabase-js";

const s = createClient(
  "https://acvnyvsofwsatxqyjjfk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk"
);

const SQL_ENTIDADES =
  "CREATE TABLE IF NOT EXISTS entidades (" +
  "id uuid PRIMARY KEY DEFAULT gen_random_uuid()," +
  "nombre text NOT NULL," +
  "codigo text," +
  "tipo text NOT NULL," +
  "balance numeric NOT NULL DEFAULT 0," +
  "caida_acumulada numeric NOT NULL DEFAULT 0," +
  "prestamo numeric NOT NULL DEFAULT 0," +
  "descripcion text," +
  "is_active boolean NOT NULL DEFAULT true," +
  "created_at timestamptz NOT NULL DEFAULT now()," +
  "updated_at timestamptz NOT NULL DEFAULT now()" +
  ")";

const SQL_MOV =
  "CREATE TABLE IF NOT EXISTS entidad_movimientos (" +
  "id uuid PRIMARY KEY DEFAULT gen_random_uuid()," +
  "entidad_id uuid NOT NULL REFERENCES entidades(id) ON DELETE CASCADE," +
  "monto numeric NOT NULL," +
  "tipo_tx text NOT NULL," +
  "concepto text," +
  "created_by text," +
  "created_at timestamptz NOT NULL DEFAULT now()" +
  ")";

async function main() {
  const r1 = await s.rpc("exec_sql", { sql_text: SQL_ENTIDADES });
  console.log("entidades:", r1.error ? "ERR: " + r1.error.message : "OK");

  const r2 = await s.rpc("exec_sql", { sql_text: SQL_MOV });
  console.log("entidad_movimientos:", r2.error ? "ERR: " + r2.error.message : "OK");

  const { data, error } = await s.from("entidades").select("id").limit(1);
  console.log("Verify:", error ? "FAIL: " + error.message : "entidades table EXISTS! rows=" + data.length);
}

main();
