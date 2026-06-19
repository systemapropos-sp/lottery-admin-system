// Bancas (Betting Pools) store — reads from betting_pools table in Supabase
import { create } from "zustand";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

export interface Banca {
  id: string;
  code: string;
  name: string;
  mwr_code: string;
  balance: number;
  zone_id: string | null;
  zone_name: string | null;
  is_active: boolean;
  has_sales_today: boolean;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  created_at: string;
  updated_at: string;
}

interface BancasState {
  bancas: Banca[];
  loading: boolean;
  error: string | null;
  fetchBancas: () => Promise<void>;
  createBanca: (data: {
    name: string;
    code: string;
    mwr_code: string;
    balance: number;
    zone_id: string | null;
    zone_name: string | null;
    is_active: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  updateBanca: (id: string, data: Partial<Banca>) => Promise<boolean>;
  deleteBanca: (id: string) => Promise<boolean>;
}

export const useBancasStore = create<BancasState>((set) => ({
  bancas: [],
  loading: false,
  error: null,

  fetchBancas: async () => {
    set({ loading: true, error: null });
    // Note: betting_pools has no business_id filter yet (schema cache stale)
    // All pools in this table belong to this admin for now
    const { data, error } = await supabase
      .from("betting_pools")
      .select("id,code,name,mwr_code,balance,zone_id,zone_name,is_active,has_sales_today,phone,address,city,province,created_at,updated_at")
      .order("code", { ascending: true });
    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ loading: false, bancas: (data ?? []) as Banca[] });
    }
  },

  createBanca: async (fields) => {
    const { data, error } = await supabase
      .from("betting_pools")
      .insert({
        name:            fields.name,
        code:            fields.code,
        mwr_code:        fields.mwr_code,
        balance:         fields.balance,
        zone_id:         fields.zone_id,
        zona_id:         fields.zone_id,
        zone_name:       fields.zone_name,
        is_active:       fields.is_active,
        has_sales_today: false,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ bancas: [...s.bancas, data as Banca] }));
    return { ok: true };
  },

  updateBanca: async (id, fields) => {
    const { data, error } = await supabase
      .from("betting_pools")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return false;
    set((s) => ({ bancas: s.bancas.map((b) => (b.id === id ? { ...b, ...(data as Banca) } : b)) }));
    return true;
  },

  deleteBanca: async (id) => {
    const { error } = await supabase.from("betting_pools").delete().eq("id", id);
    if (error) return false;
    set((s) => ({ bancas: s.bancas.filter((b) => b.id !== id) }));
    return true;
  },
}));
