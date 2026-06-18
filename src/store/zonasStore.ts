// Zonas store — persiste en Supabase
import { create } from "zustand";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

export interface Zona {
  id: string;
  business_id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: string;
}

interface ZonasState {
  zonas: Zona[];
  loading: boolean;
  error: string | null;
  fetchZonas: () => Promise<void>;
  createZona: (data: Pick<Zona, "nombre" | "descripcion" | "is_active">) => Promise<{ ok: boolean; error?: string }>;
  updateZona: (id: string, data: Partial<Zona>) => Promise<boolean>;
  deleteZona: (id: string) => Promise<boolean>;
}

export const useZonasStore = create<ZonasState>((set) => ({
  zonas: [],
  loading: false,
  error: null,

  fetchZonas: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("zonas")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: true });
    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ loading: false, zonas: data ?? [] });
    }
  },

  createZona: async (fields) => {
    const { data, error } = await supabase
      .from("zonas")
      .insert({ ...fields, business_id: BUSINESS_ID })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set(s => ({ zonas: [...s.zonas, data] }));
    return { ok: true };
  },

  updateZona: async (id, fields) => {
    const { data, error } = await supabase
      .from("zonas")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return false;
    set(s => ({ zonas: s.zonas.map(z => z.id === id ? { ...z, ...data } : z) }));
    return true;
  },

  deleteZona: async (id) => {
    const { error } = await supabase.from("zonas").delete().eq("id", id);
    if (error) return false;
    set(s => ({ zonas: s.zonas.filter(z => z.id !== id) }));
    return true;
  },
}));
