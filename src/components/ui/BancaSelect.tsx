/**
 * BancaSelect — Dropdown reutilizable de Bancas
 * Lee datos reales de Supabase vía BancasZonasContext.
 * Uso: <BancaSelect value={id} onChange={setId} />
 */
import { useBancasZonas } from "@/context/BancasZonasContext";

interface BancaSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;      // adds "Todas las Bancas" as first option
  className?: string;
  disabled?: boolean;
  filterByZona?: string;     // optional zona_id to filter bancas
}

export default function BancaSelect({
  value,
  onChange,
  placeholder = "Seleccionar banca...",
  includeAll = true,
  className = "",
  disabled = false,
  filterByZona,
}: BancaSelectProps) {
  const { bancas, bancasLoading } = useBancasZonas();

  const filtered = filterByZona
    ? bancas.filter((b) => b.zone_id === filterByZona || b.zone_name === filterByZona)
    : bancas;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || bancasLoading}
      className={`px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] bg-white disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
    >
      {includeAll && <option value="">Todas las Bancas</option>}
      {!includeAll && <option value="">{placeholder}</option>}
      {bancasLoading && <option disabled>Cargando...</option>}
      {!bancasLoading && filtered.length === 0 && (
        <option disabled>Sin bancas disponibles</option>
      )}
      {filtered.map((b) => (
        <option key={b.id} value={b.id}>
          {b.code} {b.zone_name ? `— ${b.zone_name}` : ""}
        </option>
      ))}
    </select>
  );
}
