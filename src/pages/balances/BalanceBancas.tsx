import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, RotateCw, Printer, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

type BalanceFilter = "Todos" | "Positivos" | "Negativos";

export default function BalanceBancas() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();

  const bettingPools = bancasRaw.map(b => ({
    id: b.id,
    name: b.name,
    code: b.code,
    mwrCode: b.mwr_code ?? "",
    zoneId: b.zone_id ?? "",
    zoneName: b.zone_name ?? "",
    balance: b.balance ?? 0,
    prestamo: 0,
    isActive: b.is_active,
  }));

  const zones = zonasRaw.map(z => ({ id: z.id, name: z.nombre }));

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>("Todos");
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const filteredData = useMemo(() => {
    let data = bettingPools;
    if (selectedZones.length > 0) {
      data = data.filter((bp) => selectedZones.includes(bp.zoneId));
    }
    if (balanceFilter === "Positivos") {
      data = data.filter((bp) => bp.balance > 0);
    } else if (balanceFilter === "Negativos") {
      data = data.filter((bp) => bp.balance < 0);
    }
    return data;
  }, [bettingPools, selectedZones, balanceFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <PageHeader title="Balances - Bancas" subtitle="Vista de balances financieros por banca" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-4">
        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#999] font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"
          />
        </div>

        {/* Zone dropdown */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-xs text-[#999] font-medium">Zonas</label>
          <div
            onClick={() => setShowZoneDropdown((p) => !p)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white cursor-pointer hover:border-[#14B8A6] min-w-[160px]"
          >
            <span className="flex-1 text-[#555]">
              {selectedZones.length === 0 ? "Todas" : `${selectedZones.length} zona(s)`}
            </span>
            <ChevronDown size={13} className={`text-[#999] transition-transform ${showZoneDropdown ? "rotate-180" : ""}`} />
          </div>
          {showZoneDropdown && (
            <div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2">
              {zones.map((z) => (
                <label key={z.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F0] cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes(z.id)}
                    onChange={() =>
                      setSelectedZones((prev) =>
                        prev.includes(z.id) ? prev.filter((x) => x !== z.id) : [...prev, z.id]
                      )
                    }
                    className="accent-[#14B8A6]"
                  />
                  {z.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Balance filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#999] font-medium">Balances</label>
          <div className="flex gap-1">
            {(["Todos", "Positivos", "Negativos"] as BalanceFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setBalanceFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  balanceFilter === f
                    ? "bg-[#14B8A6] text-white"
                    : "bg-[#F5F5F0] text-[#666] hover:bg-[#E5E5E0]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0]">
            <Printer size={14} /> Imprimir
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626]">
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
              {["NUMERO", "NOMBRE", "USUARIOS", "REFERENCIA", "ZONA", "BALANCE", "PRESTAMO", "NETO"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-[#999]">
                  No hay bancas registradas
                </td>
              </tr>
            ) : (
              filteredData.map((bp, i) => (
                <tr
                  key={bp.id}
                  className={`border-b border-[#F0F0EB] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20 transition-colors`}
                >
                  <td className="px-4 py-2.5 font-medium text-[#333]">{i + 1}</td>
                  <td className="px-4 py-2.5 text-[#333]">{bp.name}</td>
                  <td className="px-4 py-2.5 text-[#555]">{bp.code}</td>
                  <td className="px-4 py-2.5 text-[#14B8A6] font-medium">{bp.mwrCode || bp.code}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 text-xs bg-[#F0F0EB] rounded-full text-[#555]">
                      {bp.zoneName || zones.find(z => z.id === bp.zoneId)?.name || "—"}
                    </span>
                  </td>
                  <td className={`px-4 py-2.5 font-semibold ${bp.balance > 0 ? "text-[#22C55E]" : bp.balance < 0 ? "text-[#EF4444]" : "text-[#999]"}`}>
                    {fmt(bp.balance)}
                  </td>
                  <td className="px-4 py-2.5 text-[#555]">{fmt(bp.prestamo)}</td>
                  <td className={`px-4 py-2.5 font-semibold ${(bp.balance - bp.prestamo) > 0 ? "text-[#22C55E]" : "text-[#999]"}`}>
                    {fmt(bp.balance - bp.prestamo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">
          Mostrando {filteredData.length} de {bettingPools.length} bancas
        </p>
      </div>
    </motion.div>
  );
}
