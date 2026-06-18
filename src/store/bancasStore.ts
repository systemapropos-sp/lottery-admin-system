// Bancas (Betting Pools) store — persiste en Supabase
import { create } from "zustand";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

export interface Banca {
  id: string;
  business_id: string;
  nombre: string;
  codigo: string;
  mwr_code: string;
  balance: number;
  is_active: boolean;
  zona_id: string | null;
  notas: string;
  created_at: string;
}

interface BancasState {
  bancas: Banca[];
  loading: boolean;
  error: string | null;
  fetchBancas: () => Promise<void>;
  createBanca: (data: Pick<Banca, "nombre" | "codigo" | "mwr_code" | "balance" | "is_active" | "zona_id" | "notas">) => Promise<{ ok: boolean; error?: string }>;
  updateBanca: (id: string, data: Partial<Banca>) => Promise<boolean>;
  deleteBanca: (id: string) => Promise<boolean>;
}

export const useBancasStore = create<BancasState>((set, get) => ({
  bancas: [],
  loading: false,
  error: null,

  fetchBancas: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("bancas")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: true });
    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ loading: false, bancas: data ?? [] });
    }
  },

  createBanca: async (fields) => {
    const { data, error } = await supabase
      .from("bancas")
      .insert({ ...fields, business_id: BUSINESS_ID })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set(s => ({ bancas: [...s.bancas, data] }));
    return { ok: true };
  },

  updateBanca: async (id, fields) => {
    const { data, error } = await supabase
      .from("bancas")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return false;
    set(s => ({ bancas: s.bancas.map(b => b.id === id ? { ...b, ...data } : b) }));
    return true;
  },

  deleteBanca: async (id) => {
    const { error } = await supabase.from("bancas").delete().eq("id", id);
    if (error) return false;
    set(s => ({ bancas: s.bancas.filter(b => b.id !== id) }));
    return true;
  },
}));
