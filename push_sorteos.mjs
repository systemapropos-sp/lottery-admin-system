// push_sorteos.mjs — Fuerza los 24 sorteos correctos en Supabase
// Ejecutar: node push_sorteos.mjs

const SUPABASE_URL = "https://acvnyvsofwsatxqyjjfk.supabase.co";
const SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk";
const BIZ_ID       = "bb000001-0000-0000-0000-000000000001";

const headers = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "resolution=merge-duplicates,return=minimal",
};

const SORTEOS = [
  { id:"s01", business_id:BIZ_ID, nombre:"LA PRIMERA 7PM",           abreviacion:"LP7",   horario:"7:00 PM",  horario_cierre:"7:30 PM",  color:"#14B8A6", activo:true, orden:1  },
  { id:"s02", business_id:BIZ_ID, nombre:"FLORIDA PM",                abreviacion:"FLP",   horario:"1:30 PM",  horario_cierre:"10:00 PM", color:"#3B82F6", activo:true, orden:2  },
  { id:"s03", business_id:BIZ_ID, nombre:"LOTEKA",                    abreviacion:"LTK",   horario:"7:55 PM",  horario_cierre:"8:00 PM",  color:"#8B5CF6", activo:true, orden:3  },
  { id:"s04", business_id:BIZ_ID, nombre:"LA SUERTE",                 abreviacion:"LS",    horario:"12:00 PM", horario_cierre:"12:30 PM", color:"#F59E0B", activo:true, orden:4  },
  { id:"s05", business_id:BIZ_ID, nombre:"LA PRIMERA",                abreviacion:"LP",    horario:"12:00 PM", horario_cierre:"12:30 PM", color:"#10B981", activo:true, orden:5  },
  { id:"s06", business_id:BIZ_ID, nombre:"GANA MAS",                  abreviacion:"GM",    horario:"8:55 PM",  horario_cierre:"9:00 PM",  color:"#EF4444", activo:true, orden:6  },
  { id:"s07", business_id:BIZ_ID, nombre:"QUINIELA REAL",             abreviacion:"QR",    horario:"6:00 PM",  horario_cierre:"6:30 PM",  color:"#F97316", activo:true, orden:7  },
  { id:"s08", business_id:BIZ_ID, nombre:"SUPER PALE REAL-GANA MAS",  abreviacion:"SPRGM", horario:"8:55 PM",  horario_cierre:"9:00 PM",  color:"#EC4899", activo:true, orden:8  },
  { id:"s09", business_id:BIZ_ID, nombre:"Anguila 10AM",              abreviacion:"AN AM", horario:"10:00 AM", horario_cierre:"10:30 AM", color:"#06B6D4", activo:true, orden:9  },
  { id:"s10", business_id:BIZ_ID, nombre:"NEW YORK AM",               abreviacion:"NYAM",  horario:"12:30 PM", horario_cierre:"1:00 PM",  color:"#6366F1", activo:true, orden:10 },
  { id:"s11", business_id:BIZ_ID, nombre:"Anguila 6PM",               abreviacion:"AN 6",  horario:"6:00 PM",  horario_cierre:"6:30 PM",  color:"#0EA5E9", activo:true, orden:11 },
  { id:"s12", business_id:BIZ_ID, nombre:"NACIONAL",                  abreviacion:"NAC",   horario:"6:00 PM",  horario_cierre:"6:30 PM",  color:"#84CC16", activo:true, orden:12 },
  { id:"s13", business_id:BIZ_ID, nombre:"NEW YORK PM",               abreviacion:"NYPM",  horario:"7:30 PM",  horario_cierre:"8:00 PM",  color:"#4F46E5", activo:true, orden:13 },
  { id:"s14", business_id:BIZ_ID, nombre:"Anguila 9PM",               abreviacion:"AN 9",  horario:"9:00 PM",  horario_cierre:"9:30 PM",  color:"#0284C7", activo:true, orden:14 },
  { id:"s15", business_id:BIZ_ID, nombre:"Anguila 1PM",               abreviacion:"AN 1",  horario:"1:00 PM",  horario_cierre:"1:30 PM",  color:"#0891B2", activo:true, orden:15 },
  { id:"s16", business_id:BIZ_ID, nombre:"LA SUERTE 6PM",             abreviacion:"LS 6",  horario:"6:00 PM",  horario_cierre:"6:30 PM",  color:"#D97706", activo:true, orden:16 },
  { id:"s17", business_id:BIZ_ID, nombre:"QUINIELA PALE",             abreviacion:"QP",    horario:"6:00 PM",  horario_cierre:"6:30 PM",  color:"#EA580C", activo:true, orden:17 },
  { id:"s18", business_id:BIZ_ID, nombre:"FLORIDA AM",                abreviacion:"FLAM",  horario:"11:00 AM", horario_cierre:"11:30 AM", color:"#2563EB", activo:true, orden:18 },
  { id:"s19", business_id:BIZ_ID, nombre:"LOTEDOM",                   abreviacion:"LTD",   horario:"5:30 PM",  horario_cierre:"6:00 PM",  color:"#7C3AED", activo:true, orden:19 },
  { id:"s20", business_id:BIZ_ID, nombre:"King Lottery AM",           abreviacion:"KING",  horario:"12:00 PM", horario_cierre:"12:30 PM", color:"#FFD54F", activo:true, orden:20 },
  { id:"s21", business_id:BIZ_ID, nombre:"King Lottery PM",           abreviacion:"KINGP", horario:"7:30 PM",  horario_cierre:"8:00 PM",  color:"#FFB74D", activo:true, orden:21 },
  { id:"s22", business_id:BIZ_ID, nombre:"QUINIELA REAL 2PM",         abreviacion:"QR2",   horario:"2:00 PM",  horario_cierre:"2:30 PM",  color:"#CE93D8", activo:true, orden:22 },
  { id:"s23", business_id:BIZ_ID, nombre:"NEW YORK TARDE",            abreviacion:"NYT",   horario:"10:30 PM", horario_cierre:"11:00 PM", color:"#42A5F5", activo:true, orden:23 },
  { id:"s24", business_id:BIZ_ID, nombre:"LOTECA",                    abreviacion:"LTCA",  horario:"7:00 PM",  horario_cierre:"7:30 PM",  color:"#81C784", activo:true, orden:24 },
];

async function main() {
  console.log("1. Borrando sorteos existentes de business_id:", BIZ_ID);
  const del = await fetch(
    `${SUPABASE_URL}/rest/v1/sorteos?business_id=eq.${BIZ_ID}`,
    { method: "DELETE", headers }
  );
  console.log("   DELETE status:", del.status, del.statusText);

  console.log("2. Insertando 24 sorteos nuevos...");
  const ins = await fetch(
    `${SUPABASE_URL}/rest/v1/sorteos`,
    { method: "POST", headers, body: JSON.stringify(SORTEOS) }
  );
  const txt = await ins.text();
  console.log("   INSERT status:", ins.status, ins.statusText);
  if (txt) console.log("   Body:", txt.substring(0, 300));

  if (ins.status < 300) {
    console.log("\n✅ 24 sorteos sincronizados a Supabase correctamente.");
  } else {
    console.error("\n❌ Error al insertar:", txt);
  }
}

main().catch(console.error);
