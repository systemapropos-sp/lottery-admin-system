import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://acvnyvsofwsatxqyjjfk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk"
);

const BUSINESS_ID = "bb000001-0000-0000-0000-000000000001";

// ── 1. Add business_id column to betting_pools ────────────────────────────────
const sql1 = "ALTER TABLE betting_pools ADD COLUMN IF NOT EXISTS business_id uuid";
const r1 = await supabase.rpc("exec_sql", { sql_text: sql1 });
console.log("ADD business_id to betting_pools:", r1.error ? r1.error.message : "OK");

// Add color column to zonas if missing
const sql2 = "ALTER TABLE zonas ADD COLUMN IF NOT EXISTS color text DEFAULT '#4ECDC4'";
const r2 = await supabase.rpc("exec_sql", { sql_text: sql2 });
console.log("ADD color to zonas:", r2.error ? r2.error.message : "OK");

// ── 2. Clear old data ─────────────────────────────────────────────────────────
await supabase.from("zonas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
console.log("Cleared zonas table");

await supabase.from("betting_pools").delete().neq("id", "00000000-0000-0000-0000-000000000000");
console.log("Cleared betting_pools table");

// ── 3. Insert Zonas ───────────────────────────────────────────────────────────
const { data: insertedZonas, error: zonasErr } = await supabase
  .from("zonas")
  .insert([
    { business_id: BUSINESS_ID, nombre: "Manhattan", descripcion: "Zona Manhattan, New York", is_active: true },
    { business_id: BUSINESS_ID, nombre: "Bronx",     descripcion: "Zona Bronx, New York",     is_active: true },
  ])
  .select();

if (zonasErr) {
  console.log("Error inserting zonas:", zonasErr.message);
  process.exit(1);
}
console.log("✅ Zonas creadas:");
insertedZonas.forEach(z => console.log(`   - ${z.nombre} → ${z.id}`));

const manhattan = insertedZonas.find(z => z.nombre === "Manhattan");
const bronx     = insertedZonas.find(z => z.nombre === "Bronx");

// ── 4. Insert Bancas ──────────────────────────────────────────────────────────
const { data: insertedBancas, error: bancasErr } = await supabase
  .from("betting_pools")
  .insert([
    {
      business_id: BUSINESS_ID,
      code:        "RDV-R01",
      name:        "RDV-R01",
      mwr_code:    "RDV-R01",
      balance:     0,
      zone_id:     manhattan.id,
      zona_id:     manhattan.id,
      zone_name:   "Manhattan",
      is_active:   true,
      has_sales_today: false,
    },
    {
      business_id: BUSINESS_ID,
      code:        "RDV-R02",
      name:        "RDV-R02",
      mwr_code:    "RDV-R02",
      balance:     0,
      zone_id:     bronx.id,
      zona_id:     bronx.id,
      zone_name:   "Bronx",
      is_active:   true,
      has_sales_today: false,
    },
  ])
  .select();

if (bancasErr) {
  console.log("Error inserting bancas:", bancasErr.message);
  process.exit(1);
}
console.log("✅ Bancas creadas:");
insertedBancas.forEach(b => console.log(`   - ${b.code} → ${b.zone_name} (${b.id})`));

// ── 5. Final verification ─────────────────────────────────────────────────────
const { data: fz } = await supabase.from("zonas").select("nombre").eq("business_id", BUSINESS_ID).order("nombre");
const { data: fb } = await supabase.from("betting_pools").select("code,zone_name").eq("business_id", BUSINESS_ID).order("code");

console.log("\n=== ESTADO FINAL ===");
console.log("Zonas:", fz?.map(z => z.nombre).join(", "));
console.log("Bancas:", fb?.map(b => `${b.code}(${b.zone_name})`).join(", "));
console.log("\n🎉 Setup completo!");
