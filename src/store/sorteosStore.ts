import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface Sorteo {
  id: string;
  nombre: string;
  abreviacion: string;
  horario: string;       // apertura, ej: "7:00 PM"
  horarioCierre?: string; // cierre, ej: "7:30 PM" (opcional)
  color: string;
  activo: boolean;
  orden: number;
}

// ─── Business ID fijo ─────────────────────────────────────────────────────────
const BIZ_ID = 'bb000001-0000-0000-0000-000000000001';

// ─── Sync helpers → Supabase ─────────────────────────────────────────────────

const toRow = (s: Sorteo) => ({
  id:              s.id,
  business_id:     BIZ_ID,
  nombre:          s.nombre,
  abreviacion:     s.abreviacion,
  horario:         s.horario,
  horario_cierre:  s.horarioCierre || '',
  color:           s.color,
  activo:          s.activo,
  orden:           s.orden,
});

async function upsertSorteo(s: Sorteo) {
  try {
    await supabase.from('sorteos').upsert(toRow(s), { onConflict: 'id,business_id' });
  } catch (e) {
    console.warn('[sorteosStore] upsert error:', e);
  }
}

async function deleteSorteoRemote(id: string) {
  try {
    await supabase.from('sorteos').delete().eq('id', id).eq('business_id', BIZ_ID);
  } catch (e) {
    console.warn('[sorteosStore] delete error:', e);
  }
}

// ─── 24 sorteos reales del sistema (según lista oficial) ─────────────────────
const SORTEOS_DEFAULT: Sorteo[] = [
  { id:"s01", nombre:"Anguila 10AM",              abreviacion:"AG AM",  horario:"10:00 AM", horarioCierre:"10:30 AM", color:"#06B6D4", activo:true,  orden:1  },
  { id:"s02", nombre:"LA PRIMERA",                abreviacion:"LP",     horario:"12:00 PM", horarioCierre:"12:30 PM", color:"#10B981", activo:true,  orden:2  },
  { id:"s03", nombre:"LOTEDOM",                   abreviacion:"LTD",    horario:"5:30 PM",  horarioCierre:"6:00 PM",  color:"#7C3AED", activo:true,  orden:3  },
  { id:"s04", nombre:"LA SUERTE",                 abreviacion:"LS",     horario:"12:00 PM", horarioCierre:"12:30 PM", color:"#F59E0B", activo:true,  orden:4  },
  { id:"s05", nombre:"King Lottery AM",            abreviacion:"SMA",    horario:"11:30 AM", horarioCierre:"11:55 AM", color:"#F97316", activo:true,  orden:5  },
  { id:"s06", nombre:"QUINIELA REAL",             abreviacion:"LR",     horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#F97316", activo:true,  orden:6  },
  { id:"s07", nombre:"Anguila 1PM",               abreviacion:"AN AM",  horario:"1:00 PM",  horarioCierre:"1:30 PM",  color:"#0891B2", activo:true,  orden:7  },
  { id:"s08", nombre:"SUPER PALE REAL-GANA MAS",  abreviacion:"SPR",    horario:"8:55 PM",  horarioCierre:"9:00 PM",  color:"#EC4899", activo:true,  orden:8  },
  { id:"s09", nombre:"GANA MAS",                  abreviacion:"GM",     horario:"8:55 PM",  horarioCierre:"9:00 PM",  color:"#EF4444", activo:true,  orden:9  },
  { id:"s10", nombre:"SUPER PALE NY-GANA MAS",    abreviacion:"SNYGM",  horario:"9:00 PM",  horarioCierre:"9:30 PM",  color:"#D946EF", activo:true,  orden:10 },
  { id:"s11", nombre:"FLORIDA AM",                abreviacion:"FL AM",  horario:"11:00 AM", horarioCierre:"11:30 AM", color:"#2563EB", activo:true,  orden:11 },
  { id:"s12", nombre:"NEW YORK AM",               abreviacion:"NYAM",   horario:"12:30 PM", horarioCierre:"1:00 PM",  color:"#6366F1", activo:true,  orden:12 },
  { id:"s13", nombre:"Anguila 6PM",               abreviacion:"AN PM",  horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#0EA5E9", activo:true,  orden:13 },
  { id:"s14", nombre:"LA SUERTE 6:00pm",          abreviacion:"LS6PM",  horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#D97706", activo:true,  orden:14 },
  { id:"s15", nombre:"King Lottery PM",            abreviacion:"SMP",    horario:"7:30 PM",  horarioCierre:"7:55 PM",  color:"#9333EA", activo:true,  orden:15 },
  { id:"s16", nombre:"LOTEKA",                    abreviacion:"LK",     horario:"7:55 PM",  horarioCierre:"8:00 PM",  color:"#8B5CF6", activo:true,  orden:16 },
  { id:"s17", nombre:"LA PRIMERA 7PM",            abreviacion:"LPN",    horario:"7:00 PM",  horarioCierre:"7:30 PM",  color:"#14B8A6", activo:true,  orden:17 },
  { id:"s18", nombre:"NACIONAL",                  abreviacion:"LN",     horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#84CC16", activo:true,  orden:18 },
  { id:"s19", nombre:"QUINIELA PALE",             abreviacion:"QP",     horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#EA580C", activo:true,  orden:19 },
  { id:"s20", nombre:"SUPER PALE NACIONAL-QP",    abreviacion:"SPQN",   horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#D946EF", activo:true,  orden:20 },
  { id:"s21", nombre:"SUPER PALE NY-NACIONAL",    abreviacion:"SPNNY",  horario:"6:00 PM",  horarioCierre:"6:30 PM",  color:"#BE185D", activo:true,  orden:21 },
  { id:"s22", nombre:"Anguila 9PM",               abreviacion:"AG PM",  horario:"9:00 PM",  horarioCierre:"9:30 PM",  color:"#0284C7", activo:true,  orden:22 },
  { id:"s23", nombre:"FLORIDA PM",                abreviacion:"FL PM",  horario:"1:30 PM",  horarioCierre:"10:00 PM", color:"#3B82F6", activo:true,  orden:23 },
  { id:"s24", nombre:"NEW YORK PM",               abreviacion:"NYPM",   horario:"7:30 PM",  horarioCierre:"8:00 PM",  color:"#4F46E5", activo:true,  orden:24 },
];

interface SorteosState {
  sorteos: Sorteo[];
  addSorteo: (s: Omit<Sorteo, "id" | "orden">) => void;
  updateSorteo: (id: string, data: Partial<Sorteo>) => void;
  deleteSorteo: (id: string) => void;
  toggleActivo: (id: string) => void;
  getSorteosActivos: () => Sorteo[];
  getNombresActivos: () => string[];
  /** Carga sorteos desde Supabase (reemplaza estado local) */
  loadFromSupabase: () => Promise<void>;
  /** Push completo a Supabase: borra todo el negocio y reinserta */
  syncAllToSupabase: () => Promise<void>;
}

export const useSorteosStore = create<SorteosState>()(
  persist(
    (set, get) => ({
      sorteos: SORTEOS_DEFAULT,

      addSorteo: (s) => {
        const newSorteo: Sorteo = {
          ...s,
          id: `s${Date.now()}`,
          orden: get().sorteos.length + 1,
        };
        set((state) => ({ sorteos: [...state.sorteos, newSorteo] }));
        upsertSorteo(newSorteo);
      },

      updateSorteo: (id, data) => {
        set((state) => ({
          sorteos: state.sorteos.map((s) => s.id === id ? { ...s, ...data } : s),
        }));
        const updated = get().sorteos.find(s => s.id === id);
        if (updated) upsertSorteo(updated);
      },

      deleteSorteo: (id) => {
        set((state) => ({ sorteos: state.sorteos.filter((s) => s.id !== id) }));
        deleteSorteoRemote(id);
      },

      toggleActivo: (id) => {
        set((state) => ({
          sorteos: state.sorteos.map((s) => s.id === id ? { ...s, activo: !s.activo } : s),
        }));
        const updated = get().sorteos.find(s => s.id === id);
        if (updated) upsertSorteo(updated);
      },

      getSorteosActivos: () => get().sorteos.filter((s) => s.activo),
      getNombresActivos: () => get().sorteos.filter((s) => s.activo).map((s) => s.nombre),

      // ── Cargar desde Supabase → reemplaza estado local ──────────────────────
      loadFromSupabase: async () => {
        try {
          const { data, error } = await supabase
            .from('sorteos')
            .select('*')
            .eq('business_id', BIZ_ID)
            .order('orden', { ascending: true });

          if (!error && data && data.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped: Sorteo[] = (data as any[]).map((row) => ({
              id: row.id,
              nombre: row.nombre,
              abreviacion: row.abreviacion,
              horario: row.horario || '',
              horarioCierre: row.horario_cierre || '',
              color: row.color || '#14B8A6',
              activo: row.activo ?? true,
              orden: row.orden ?? 0,
            }));
            set({ sorteos: mapped });
            console.log('[sorteosStore] Loaded', mapped.length, 'sorteos from Supabase');
          }
          // If no data, keep existing (defaults)
        } catch (e) {
          console.warn('[sorteosStore] loadFromSupabase error (non-fatal):', e);
        }
      },

      // ── Sync completo: elimina todo primero → inserta lista actual ───────────
      syncAllToSupabase: async () => {
        try {
          // Eliminar todos los sorteos existentes de este negocio
          await supabase.from('sorteos').delete().eq('business_id', BIZ_ID);
          // Insertar lista completa actualizada
          const rows = get().sorteos.map(toRow);
          const { error } = await supabase.from('sorteos').upsert(rows, { onConflict: 'id,business_id' });
          if (error) throw error;
          console.log('[sorteosStore] syncAllToSupabase: synced', rows.length, 'sorteos');
        } catch (e) {
          console.warn('[sorteosStore] syncAllToSupabase error:', e);
          throw e; // Re-throw so UI can catch
        }
      },
    }),
    { name: "nmv-sorteos-store" }
  )
);

// Helper para usar en ventas pages (igual que el array hardcodeado pero reactivo)
export const getAllSorteoNames = () =>
  useSorteosStore.getState().sorteos.map((s) => s.nombre);
