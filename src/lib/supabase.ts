import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://acvnyvsofwsatxqyjjfk.supabase.co";

// Service role key bypasses Row Level Security — safe for admin panel only
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdm55dnNvZndzYXR4cXlqamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc4MzU0MiwiZXhwIjoyMDk2MzU5NTQyfQ.3w_FwFIOe4Xn-ilrcBSyTh9SXIMTs08j8unh61ScUMk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const BUSINESS_ID = "bb000001-0000-0000-0000-000000000001";
