import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function IniciosSesion() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();

  // Sesiones reales — por ahora vacías (se llenará desde Supabase)
  const poolSessions = bancasRaw.map(bp => ({
    id: `sess-pool-${bp.id}`,
    banca: bp.name,
    usuario: bp.code,
    primeraWeb: "", ultimaWeb: "",
    primeraCelular: "", ultimaCelular: "",
    primeraApp: "", ultimaApp: "",
    zoneId: bp.zone_id ?? "",
  }));

  const adminSessions: typeof poolSessions = [];
  const ipCollisions: { id: string; banca: string; usuario: string; ip: string; primeraWeb: string; ultimaWeb: string; primeraCelular: string; ultimaCelular: string; primeraApp: string; ultimaApp: string; zoneId: string }[] = [];

  const [activeTab, setActiveTab] = useState<"bancas" | "administradores" | "colision">("bancas");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const getCurrentData = () => {
    switch (activeTab) {
      case "bancas": return poolSessions;
      case "administradores": return adminSessions;
      case "colision": return ipCollisions;
      default: return poolSessions;
    }
  };

  const filteredData = useMemo(() => {
    let data = getCurrentData();
    if (selectedZones.length > 0) {
      data = data.filter((s) => selectedZones.includes(s.zoneId));
    }
    return data;
  }, [activeTab, selectedZones]);

  const SessionBadge = ({ time }: { time: string }) => {
    if (!time) return <span className="text-[#CCCCCC] text-xs">-</span>;
    const isOnline = time.includes("2024-05-15");
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}>
        {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
        {time}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Inicios de sesion" subtitle="Registro de sesiones de usuarios" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#333333]">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
              className="flex items-center gap-2 px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm text-[#333333] hover:border-[#4ECDC4] transition-colors bg-white"
            >
              <span>Zonas</span>
              <ChevronDown size={14} className={`transition-transform ${showZoneDropdown ? "rotate-180" : ""}`} />
              {selectedZones.length > 0 && (
                <span className="ml-1 bg-[#4ECDC4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedZones.length}
                </span>
              )}
            </button>
            {showZoneDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E0] rounded-lg shadow-lg z-20 min-w-[160px] py-1"
              >
                {zonasRaw.map((z) => (
                  <label key={z.id} className="flex items-center gap-2 px-3 py-2 hover:bg-[#F5F5F0] cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(z.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedZones([...selectedZones, z.id]);
                        else setSelectedZones(selectedZones.filter((id) => id !== z.id));
                      }}
                      className="rounded border-gray-300 text-[#4ECDC4] focus:ring-[#4ECDC4]"
                    />
                    <span>{z.nombre}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#E5E5E0]">
          <div className="flex">
            {([
              { key: "bancas" as const, label: "Bancas" },
              { key: "administradores" as const, label: "Administradores" },
              { key: "colision" as const, label: "Colision de IPs" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Banca</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Usuario</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Primera sesion (Web)</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Ultima sesion (Web)</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Primera sesion (Celular)</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Ultima sesion (Celular)</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Primera sesion (App)</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Ultima sesion (App)</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((session, idx) => (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02, ease: easeOut }}
                    className={`border-b border-[#E8E8E3] ${
                      activeTab === "colision" ? "bg-amber-50 border-l-2 border-l-[#F59E0B]" : idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                    } hover:bg-[#F0F8F7]`}
                  >
                    <td className="px-4 py-3 text-[#333333] font-medium">{session.banca}</td>
                    <td className="px-4 py-3 font-mono text-[13px] text-[#4ECDC4]">{session.usuario}</td>
                    <td className="px-4 py-3"><SessionBadge time={session.primeraWeb} /></td>
                    <td className="px-4 py-3"><SessionBadge time={session.ultimaWeb} /></td>
                    <td className="px-4 py-3"><SessionBadge time={session.primeraCelular} /></td>
                    <td className="px-4 py-3"><SessionBadge time={session.ultimaCelular} /></td>
                    <td className="px-4 py-3"><SessionBadge time={session.primeraApp} /></td>
                    <td className="px-4 py-3"><SessionBadge time={session.ultimaApp} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
