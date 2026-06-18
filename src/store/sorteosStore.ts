import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// ─── 24 sorteos reales del sistema ───────────────────────────────────────────
const SORTEOS_DEFAULT: Sorteo[] = [
  { id:"s01", nombre:"LA PRIMERA 7PM",               abreviacion:"LP7",   horario:"7:00 PM",  color:"#14B8A6", activo:true,  orden:1  },
  { id:"s02", nombre:"FLORIDA PM",                    abreviacion:"FLP",   horario:"1:30 PM",  color:"#3B82F6", activo:true,  orden:2  },
  { id:"s03", nombre:"LOTEKA",                        abreviacion:"LTK",   horario:"7:55 PM",  color:"#8B5CF6", activo:true,  orden:3  },
  { id:"s04", nombre:"LA SUERTE",                     abreviacion:"LS",    horario:"12:00 PM", color:"#F59E0B", activo:true,  orden:4  },
  { id:"s05", nombre:"LA PRIMERA",                    abreviacion:"LP",    horario:"12:00 PM", color:"#10B981", activo:true,  orden:5  },
  { id:"s06", nombre:"GANA MAS",                      abreviacion:"GM",    horario:"8:55 PM",  color:"#EF4444", activo:true,  orden:6  },
  { id:"s07", nombre:"QUINIELA REAL",                 abreviacion:"QR",    horario:"6:00 PM",  color:"#F97316", activo:true,  orden:7  },
  { id:"s08", nombre:"SUPER PALE REAL-GANA MAS",      abreviacion:"SPRGM", horario:"8:55 PM",  color:"#EC4899", activo:true,  orden:8  },
  { id:"s09", nombre:"Anguila 10AM",                  abreviacion:"ANG10", horario:"10:00 AM", color:"#06B6D4", activo:true,  orden:9  },
  { id:"s10", nombre:"NEW YORK AM",                   abreviacion:"NYAM",  horario:"12:30 PM", color:"#6366F1", activo:true,  orden:10 },
  { id:"s11", nombre:"Anguila 6PM",                   abreviacion:"ANG6",  horario:"6:00 PM",  color:"#0EA5E9", activo:true,  orden:11 },
  { id:"s12", nombre:"SUPER PALE NACIONAL-QP",        abreviacion:"SPNQP", horario:"6:00 PM",  color:"#D946EF", activo:true,  orden:12 },
  { id:"s13", nombre:"NACIONAL",                      abreviacion:"NAC",   horario:"6:00 PM",  color:"#84CC16", activo:true,  orden:13 },
  { id:"s14", nombre:"NEW YORK PM",                   abreviacion:"NYPM",  horario:"7:30 PM",  color:"#4F46E5", activo:true,  orden:14 },
  { id:"s15", nombre:"Anguila 9PM",                   abreviacion:"ANG9",  horario:"9:00 PM",  color:"#0284C7", activo:true,  orden:15 },
  { id:"s16", nombre:"Anguila 1PM",                   abreviacion:"ANG1",  horario:"1:00 PM",  color:"#0891B2", activo:true,  orden:16 },
  { id:"s17", nombre:"LA SUERTE 6:00pm",              abreviacion:"LS6",   horario:"6:00 PM",  color:"#D97706", activo:true,  orden:17 },
  { id:"s18", nombre:"QUINIELA PALE",                 abreviacion:"QP",    horario:"6:00 PM",  color:"#EA580C", activo:true,  orden:18 },
  { id:"s19", nombre:"FLORIDA AM",                    abreviacion:"FLAM",  horario:"11:00 AM", color:"#2563EB", activo:true,  orden:19 },
  { id:"s20", nombre:"LOTEDOM",                       abreviacion:"LTD",   horario:"5:30 PM",  color:"#7C3AED", activo:true,  orden:20 },
  { id:"s21", nombre:"REAL",                          abreviacion:"REAL",  horario:"6:00 PM",  color:"#059669", activo:true,  orden:21 },
  { id:"s22", nombre:"LOTO POOL",                     abreviacion:"LP2",   horario:"9:00 PM",  color:"#0D9488", activo:true,  orden:22 },
  { id:"s23", nombre:"MEGA CHANCES",                  abreviacion:"MC",    horario:"9:00 PM",  color:"#9333EA", activo:true,  orden:23 },
  { id:"s24", nombre:"SUPER PALE PALE",               abreviacion:"SPP",   horario:"7:55 PM",  color:"#BE185D", activo:true,  orden:24 },
];

interface SorteosState {
  sorteos: Sorteo[];
  addSorteo: (s: Omit<Sorteo, "id" | "orden">) => void;
  updateSorteo: (id: string, data: Partial<Sorteo>) => void;
  deleteSorteo: (id: string) => void;
  toggleActivo: (id: string) => void;
  getSorteosActivos: () => Sorteo[];
  getNombresActivos: () => string[];
}

export const useSorteosStore = create<SorteosState>()(
  persist(
    (set, get) => ({
      sorteos: SORTEOS_DEFAULT,
      addSorteo: (s) => set((state) => ({
        sorteos: [...state.sorteos, {
          ...s,
          id: `s${Date.now()}`,
          orden: state.sorteos.length + 1,
        }],
      })),
      updateSorteo: (id, data) => set((state) => ({
        sorteos: state.sorteos.map((s) => s.id === id ? { ...s, ...data } : s),
      })),
      deleteSorteo: (id) => set((state) => ({
        sorteos: state.sorteos.filter((s) => s.id !== id),
      })),
      toggleActivo: (id) => set((state) => ({
        sorteos: state.sorteos.map((s) => s.id === id ? { ...s, activo: !s.activo } : s),
      })),
      getSorteosActivos: () => get().sorteos.filter((s) => s.activo),
      getNombresActivos: () => get().sorteos.filter((s) => s.activo).map((s) => s.nombre),
    }),
    { name: "nmv-sorteos-store" }
  )
);

// Helper para usar en ventas pages (igual que el array hardcodeado pero reactivo)
export const getAllSorteoNames = () =>
  useSorteosStore.getState().sorteos.map((s) => s.nombre);
