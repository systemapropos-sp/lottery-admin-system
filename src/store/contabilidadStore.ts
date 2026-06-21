// contabilidadStore — CRUD sobre tabla `contabilidad` en Supabase
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

const BUSINESS_ID = "bb000001-0000-0000-0000-000000000001";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoriaContable =
  | "gastos" | "compras" | "rentas" | "empleados"
  | "inversion" | "premios" | "prestamos";

export interface EntradaContable {
  id: string;
  business_id: string;
  fecha: string;               // "YYYY-MM-DD"
  descripcion: string;
  categoria: CategoriaContable;
  subcategoria: string;
  monto: number;
  tipo: "ingreso" | "egreso";
  estado: "pagado" | "pendiente" | "cancelado";
  referencia: string;
  notas: string;
  created_at: string;
  updated_at: string;
}

export type NuevaEntrada = Omit<EntradaContable, "id" | "business_id" | "created_at" | "updated_at">;

// ─── Store ────────────────────────────────────────────────────────────────────

interface ContabilidadState {
  entradas: EntradaContable[];
  loading: boolean;
  error: string | null;

  fetchEntradas: () => Promise<void>;
  createEntrada: (data: NuevaEntrada) => Promise<{ ok: boolean; error?: string }>;
  updateEntrada: (id: string, data: Partial<NuevaEntrada>) => Promise<{ ok: boolean; error?: string }>;
  deleteEntrada: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

export const useContabilidadStore = create<ContabilidadState>((set, get) => ({
  entradas: [],
  loading: false,
  error: null,

  // ── Fetch ALL ──────────────────────────────────────────────────────────────
  fetchEntradas: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("contabilidad")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ entradas: (data ?? []) as EntradaContable[], loading: false });
  },

  // ── Create ─────────────────────────────────────────────────────────────────
  createEntrada: async (data) => {
    const payload = { ...data, business_id: BUSINESS_ID };
    const { data: inserted, error } = await supabase
      .from("contabilidad")
      .insert([payload])
      .select()
      .single();

    if (error) return { ok: false, error: error.message };

    set((s) => ({ entradas: [inserted as EntradaContable, ...s.entradas] }));
    return { ok: true };
  },

  // ── Update ─────────────────────────────────────────────────────────────────
  updateEntrada: async (id, data) => {
    const { data: updated, error } = await supabase
      .from("contabilidad")
      .update(data)
      .eq("id", id)
      .eq("business_id", BUSINESS_ID)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };

    set((s) => ({
      entradas: s.entradas.map((e) => (e.id === id ? (updated as EntradaContable) : e)),
    }));
    return { ok: true };
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  deleteEntrada: async (id) => {
    const { error } = await supabase
      .from("contabilidad")
      .delete()
      .eq("id", id)
      .eq("business_id", BUSINESS_ID);

    if (error) return { ok: false, error: error.message };

    set((s) => ({ entradas: s.entradas.filter((e) => e.id !== id) }));
    return { ok: true };
  },
}));
