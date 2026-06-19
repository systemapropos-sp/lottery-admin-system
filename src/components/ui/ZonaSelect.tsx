/**
 * ZonaSelect — Dropdown reutilizable de Zonas
 * Lee datos reales de Supabase vía BancasZonasContext.
 * Uso: <ZonaSelect value={id} onChange={setId} />
 */
import { useBancasZonas } from "@/context/BancasZonasContext";

interface ZonaSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;      // adds "Todas las Zonas" as first option
  className?: string;
  disabled?: boolean;
}

export default function ZonaSelect({
  value,
  onChange,
  placeholder = "Seleccionar zona...",
  includeAll = true,
  className = "",
  disabled = false,
}: ZonaSelectProps) {
  const { zonas, zonasLoading } = useBancasZonas();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || zonasLoading}
      className={`px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] bg-white disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
    >
      {includeAll && <option value="">Todas las Zonas</option>}
      {!includeAll && <option value="">{placeholder}</option>}
      {zonasLoading && <option disabled>Cargando...</option>}
      {!zonasLoading && zonas.length === 0 && (
        <option disabled>Sin zonas disponibles</option>
      )}
      {zonas.map((z) => (
        <option key={z.id} value={z.id}>
          {z.nombre}
        </option>
      ))}
    </select>
  );
}
