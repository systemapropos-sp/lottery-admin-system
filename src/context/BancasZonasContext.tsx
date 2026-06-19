/**
 * BancasZonasContext — Global Provider
 * Loads bancas (from betting_pools) and zonas once at app startup.
 * Any component in the tree can call useBancasZonas() to get real data.
 */
import React, { createContext, useContext, useEffect } from "react";
import { useBancasStore, type Banca } from "@/store/bancasStore";
import { useZonasStore, type Zona } from "@/store/zonasStore";

interface BancasZonasContextValue {
  bancas: Banca[];
  zonas: Zona[];
  bancasLoading: boolean;
  zonasLoading: boolean;
  refetch: () => void;
}

const BancasZonasContext = createContext<BancasZonasContextValue>({
  bancas: [],
  zonas: [],
  bancasLoading: false,
  zonasLoading: false,
  refetch: () => {},
});

export function BancasZonasProvider({ children }: { children: React.ReactNode }) {
  const { bancas, loading: bancasLoading, fetchBancas } = useBancasStore();
  const { zonas, loading: zonasLoading, fetchZonas } = useZonasStore();

  const refetch = () => {
    fetchBancas();
    fetchZonas();
  };

  // Load once on mount
  useEffect(() => {
    fetchBancas();
    fetchZonas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BancasZonasContext.Provider value={{ bancas, zonas, bancasLoading, zonasLoading, refetch }}>
      {children}
    </BancasZonasContext.Provider>
  );
}

/** Hook — use anywhere in the app */
export function useBancasZonas() {
  return useContext(BancasZonasContext);
}
