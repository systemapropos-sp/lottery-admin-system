// receptoresStore — CRUD sobre tabla `receptores_correo` en Supabase
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

const BUSINESS_ID = "bb000001-0000-0000-0000-000000000001";

export interface Receptor {
  id: string;
  business_id: string;
  email: string;
  zones: string[];
  email_types: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type NuevoReceptor = Pick<Receptor, "email" | "zones" | "email_types">;

interface ReceptoresState {
  receptores: Receptor[];
  loading: boolean;
  error: string | null;

  fetchReceptores: () => Promise<void>;
  createReceptor: (data: NuevoReceptor) => Promise<{ ok: boolean; error?: string }>;
  updateReceptor: (id: string, data: Partial<NuevoReceptor>) => Promise<{ ok: boolean; error?: string }>;
  deleteReceptor: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

export const useReceptoresStore = create<ReceptoresState>((set) => ({
  receptores: [],
  loading: false,
  error: null,

  fetchReceptores: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("receptores_correo")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: false });

    if (error) { set({ loading: false, error: error.message }); return; }
    set({ receptores: (data ?? []) as Receptor[], loading: false });
  },

  createReceptor: async (data) => {
    const payload = { ...data, business_id: BUSINESS_ID, is_active: true };
    const { data: inserted, error } = await supabase
      .from("receptores_correo")
      .insert([payload])
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    set((s) => ({ receptores: [inserted as Receptor, ...s.receptores] }));
    return { ok: true };
  },

  updateReceptor: async (id, data) => {
    const { data: updated, error } = await supabase
      .from("receptores_correo")
      .update(data)
      .eq("id", id)
      .eq("business_id", BUSINESS_ID)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    set((s) => ({
      receptores: s.receptores.map((r) => (r.id === id ? (updated as Receptor) : r)),
    }));
    return { ok: true };
  },

  deleteReceptor: async (id) => {
    const { error } = await supabase
      .from("receptores_correo")
      .delete()
      .eq("id", id)
      .eq("business_id", BUSINESS_ID);

    if (error) return { ok: false, error: error.message };
    set((s) => ({ receptores: s.receptores.filter((r) => r.id !== id) }));
    return { ok: true };
  },
}));
