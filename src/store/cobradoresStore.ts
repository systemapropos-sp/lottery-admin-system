// Cobradores store — reads from cobradores, cobrador_cobros, cobrador_rutas, cobrador_capital
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Cobrador {
  id: string;
  name: string;
  pin: string;
  phone: string;
  notes: string;
  status: "activo" | "inactivo";
  banca_ids: string[];
  zona_id: string | null;
  zona_nombre: string | null;
  balance: number;
  biometric_credential: string | null;
  created_at: string;
  updated_at: string;
}

export interface CobradorCobro {
  id: string;
  cobrador_id: string;
  banca_id: string | null;
  banca_name: string;
  fecha: string;
  monto: number;
  tipo: "cobro" | "entrega" | "ajuste" | "prestamo";
  notas: string;
  created_at: string;
  updated_at: string;
}

export interface CobradorRuta {
  id: string;
  cobrador_id: string;
  banca_id: string;
  banca_name: string;
  zona_nombre: string;
  orden: number;
  monto_esperado: number;
  is_active: boolean;
  created_at: string;
}

export interface CobradorCapital {
  id: string;
  cobrador_id: string;
  fecha: string;
  capital_inicial: number;
  total_cobros: number;
  total_entregas: number;
  total_prestamos: number;
  saldo_final: number;
  notas: string;
  created_at: string;
}

interface CobradoresState {
  cobradores: Cobrador[];
  cobros: CobradorCobro[];
  rutas: CobradorRuta[];
  capital: CobradorCapital[];
  loading: boolean;
  error: string | null;

  fetchCobradores: () => Promise<void>;
  fetchCobros: (cobradorId?: string, fecha?: string) => Promise<void>;
  fetchRutas: (cobradorId?: string) => Promise<void>;
  fetchCapital: (cobradorId?: string, fecha?: string) => Promise<void>;

  createCobrador: (data: Pick<Cobrador, "name" | "pin" | "phone" | "notes" | "zona_id" | "zona_nombre">) => Promise<{ ok: boolean; error?: string }>;
  updateCobrador: (id: string, data: Partial<Cobrador>) => Promise<boolean>;
  deleteCobrador: (id: string) => Promise<boolean>;

  createCobro: (data: Omit<CobradorCobro, "id" | "created_at" | "updated_at">) => Promise<{ ok: boolean; error?: string }>;
  deleteCobro: (id: string) => Promise<boolean>;

  addRuta: (data: Omit<CobradorRuta, "id" | "created_at">) => Promise<{ ok: boolean; error?: string }>;
  updateRutaOrden: (id: string, orden: number) => Promise<boolean>;
  removeRuta: (id: string) => Promise<boolean>;
}

export const useCobradoresStore = create<CobradoresState>((set, get) => ({
  cobradores: [],
  cobros: [],
  rutas: [],
  capital: [],
  loading: false,
  error: null,

  fetchCobradores: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("cobradores")
      .select("*")
      .order("name", { ascending: true });
    if (error) set({ loading: false, error: error.message });
    else set({ loading: false, cobradores: (data ?? []) as Cobrador[] });
  },

  fetchCobros: async (cobradorId?: string, fecha?: string) => {
    set({ loading: true });
    let query = supabase
      .from("cobrador_cobros")
      .select("*")
      .order("created_at", { ascending: false });
    if (cobradorId) query = query.eq("cobrador_id", cobradorId);
    if (fecha) query = query.eq("fecha", fecha);
    const { data, error } = await query;
    if (error) set({ loading: false, error: error.message });
    else set({ loading: false, cobros: (data ?? []) as CobradorCobro[] });
  },

  fetchRutas: async (cobradorId?: string) => {
    set({ loading: true });
    let query = supabase
      .from("cobrador_rutas")
      .select("*")
      .eq("is_active", true)
      .order("orden", { ascending: true });
    if (cobradorId) query = query.eq("cobrador_id", cobradorId);
    const { data, error } = await query;
    if (error) set({ loading: false, error: error.message });
    else set({ loading: false, rutas: (data ?? []) as CobradorRuta[] });
  },

  fetchCapital: async (cobradorId?: string, fecha?: string) => {
    set({ loading: true });
    let query = supabase
      .from("cobrador_capital")
      .select("*")
      .order("fecha", { ascending: false });
    if (cobradorId) query = query.eq("cobrador_id", cobradorId);
    if (fecha) query = query.eq("fecha", fecha);
    const { data, error } = await query;
    if (error) set({ loading: false, error: error.message });
    else set({ loading: false, capital: (data ?? []) as CobradorCapital[] });
  },

  createCobrador: async (fields) => {
    const { data, error } = await supabase
      .from("cobradores")
      .insert({ ...fields, status: "activo", banca_ids: [], balance: 0 })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ cobradores: [...s.cobradores, data as Cobrador] }));
    return { ok: true };
  },

  updateCobrador: async (id, fields) => {
    const { data, error } = await supabase
      .from("cobradores")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return false;
    set((s) => ({ cobradores: s.cobradores.map((c) => (c.id === id ? { ...c, ...(data as Cobrador) } : c)) }));
    return true;
  },

  deleteCobrador: async (id) => {
    const { error } = await supabase.from("cobradores").delete().eq("id", id);
    if (error) return false;
    set((s) => ({ cobradores: s.cobradores.filter((c) => c.id !== id) }));
    return true;
  },

  createCobro: async (fields) => {
    const { data, error } = await supabase
      .from("cobrador_cobros")
      .insert(fields)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ cobros: [data as CobradorCobro, ...s.cobros] }));
    return { ok: true };
  },

  deleteCobro: async (id) => {
    const { error } = await supabase.from("cobrador_cobros").delete().eq("id", id);
    if (error) return false;
    set((s) => ({ cobros: s.cobros.filter((c) => c.id !== id) }));
    return true;
  },

  addRuta: async (fields) => {
    const { data, error } = await supabase
      .from("cobrador_rutas")
      .insert(fields)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ rutas: [...s.rutas, data as CobradorRuta].sort((a, b) => a.orden - b.orden) }));
    return { ok: true };
  },

  updateRutaOrden: async (id, orden) => {
    const { error } = await supabase.from("cobrador_rutas").update({ orden }).eq("id", id);
    if (error) return false;
    set((s) => ({ rutas: s.rutas.map((r) => (r.id === id ? { ...r, orden } : r)).sort((a, b) => a.orden - b.orden) }));
    return true;
  },

  removeRuta: async (id) => {
    const { error } = await supabase.from("cobrador_rutas").update({ is_active: false }).eq("id", id);
    if (error) return false;
    set((s) => ({ rutas: s.rutas.filter((r) => r.id !== id) }));
    return true;
  },
}));
