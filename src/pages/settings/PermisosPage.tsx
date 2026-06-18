import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Search,
  RotateCcw, Clock, ChevronRight, ShieldCheck,
} from "lucide-react";
import { useAuthStore, BANCA_PERMISSION_KEYS, BANCA_PERM_LABELS } from "@/store/authStore";
import type { BancaPermKey } from "@/store/authStore";
import { bettingPools } from "@/data/mockData";

// ─── Permission categories (visual grouping) ─────────────────────────────────

const PERM_GROUPS: { label: string; keys: BancaPermKey[] }[] = [
  {
    label: "Ventas & Reportes",
    keys: ["ver_ventas", "ventas_historicas", "reportes", "imprimir_reporte"],
  },
  {
    label: "Jugadas",
    keys: ["jugadas", "duplicar_jugadas", "generador_jugadas", "pagar"],
  },
  {
    label: "Informacion",
    keys: ["monitoreo", "balances", "contabilidad", "clientes", "pendiente_pago"],
  },
  {
    label: "Herramientas & Sistema",
    keys: ["horarios", "ayuda", "configuracion", "autorizar_ponchado"],
  },
];

// ─── Toggle component ─────────────────────────────────────────────────────────

function PermToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 ${
        value ? "bg-[#14B8A6]" : "bg-[#CBD5E1]"
      }`}
      title={value ? "Activado — click para desactivar" : "Desactivado — click para activar"}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PermisosPage() {
  const { bancaPermissions, setBancaPermission, resetBancaPerms, permissionsLog } =
    useAuthStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showLog, setShowLog] = useState(false);

  // Filter bancas
  const filtered = useMemo(() =>
    bettingPools.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.mwrCode.toLowerCase().includes(search.toLowerCase())
    ),
  [search]);

  const selected = selectedId ? bettingPools.find((b) => b.id === selectedId) : null;

  const perms = selectedId
    ? (bancaPermissions[selectedId] ??
       Object.fromEntries(BANCA_PERMISSION_KEYS.map((k) => [k, true])))
    : null;

  const enabledCount = perms ? Object.values(perms).filter(Boolean).length : 0;

  // Log filtered by selected banca
  const bancaLog = permissionsLog.filter((e) => !selectedId || e.bancaId === selectedId).slice(0, 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={22} className="text-[#14B8A6]" />
          <h1 className="text-2xl font-bold text-[#333333]">Permisos de Acceso por Banca</h1>
        </div>
        <p className="text-sm text-[#666666]">
          Controla que funciones puede ver y usar cada vendedor. Los cambios se graban automaticamente.
        </p>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[500px]">

        {/* ── Left: Banca List ── */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-[#F0F0EB]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input
                type="text"
                placeholder="Buscar banca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-[#FAFAFA] focus:outline-none focus:border-[#14B8A6] transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F5F5F0]">
            {filtered.map((banca) => {
              const bp = bancaPermissions[banca.id];
              const on = bp ? Object.values(bp).filter(Boolean).length : BANCA_PERMISSION_KEYS.length;
              const total = BANCA_PERMISSION_KEYS.length;
              const allOn = on === total;
              const active = selectedId === banca.id;

              return (
                <button
                  key={banca.id}
                  onClick={() => { setSelectedId(banca.id); setShowLog(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    active ? "bg-[#E0F7F5]" : "hover:bg-[#F5F5F0]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    active ? "bg-[#14B8A6] text-white" : "bg-[#F5F5F0] text-[#666666]"
                  }`}>
                    <Building2 size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? "text-[#0F766E]" : "text-[#333333]"}`}>
                      {banca.name}
                    </p>
                    <p className="text-xs text-[#999999]">{banca.mwrCode}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                    <span className={`text-xs font-medium ${allOn ? "text-[#14B8A6]" : "text-[#F59E0B]"}`}>
                      {on}/{total}
                    </span>
                    <ChevronRight size={12} className="text-[#CCCCCC]" />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-[#999999]">Sin resultados</div>
            )}
          </div>
        </div>

        {/* ── Right: Permission Toggles ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F5F0] flex items-center justify-center">
                <Building2 size={24} className="text-[#CCCCCC]" />
              </div>
              <p className="text-sm text-[#999999] max-w-xs">
                Selecciona una banca de la lista para gestionar sus permisos de acceso
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {/* Banca header bar */}
              <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-[#333333]">{selected.name}</h2>
                  <p className="text-xs text-[#999999]">{selected.mwrCode} · {selected.zoneName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#14B8A6]">{enabledCount}</p>
                    <p className="text-xs text-[#999999]">de {BANCA_PERMISSION_KEYS.length} activos</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => resetBancaPerms(selected.id)}
                      title="Activar todos los permisos"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#14B8A6] bg-[#E0F7F5] rounded-lg hover:bg-[#CCFBF1] transition-colors"
                    >
                      <RotateCcw size={11} /> Activar todos
                    </button>
                    <button
                      onClick={() => setShowLog((v) => !v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        showLog ? "bg-[#333333] text-white" : "bg-[#F5F5F0] text-[#666666] hover:bg-[#EBEBEB]"
                      }`}
                    >
                      <Clock size={11} /> Historial
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showLog ? (
                  /* ── Log view ── */
                  <motion.div
                    key="log"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#F5F5F0]">
                      <p className="text-sm font-semibold text-[#333333]">Historial de cambios — {selected.name}</p>
                    </div>
                    {bancaLog.length === 0 ? (
                      <div className="py-10 text-center text-sm text-[#999999]">
                        No hay cambios registrados todavia
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F5F5F0] max-h-[420px] overflow-y-auto">
                        {bancaLog.map((entry) => (
                          <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.value ? "bg-[#14B8A6]" : "bg-[#F87171]"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#333333]">
                                <span className="font-medium">{entry.permLabel}</span>
                                {" "}→{" "}
                                <span className={entry.value ? "text-[#14B8A6] font-medium" : "text-[#EF4444] font-medium"}>
                                  {entry.value ? "ACTIVADO" : "DESACTIVADO"}
                                </span>
                              </p>
                              <p className="text-xs text-[#999999]">
                                {new Date(entry.timestamp).toLocaleString("es-DO")} · por {entry.adminUser}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* ── Permission toggles ── */
                  <motion.div
                    key="perms"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    {PERM_GROUPS.map((group) => (
                      <div
                        key={group.label}
                        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#F0F0EB]">
                          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">{group.label}</p>
                        </div>
                        <div className="divide-y divide-[#F5F5F0]">
                          {group.keys.map((key) => {
                            const isOn = perms ? (perms[key] ?? true) : true;
                            return (
                              <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOn ? "bg-[#14B8A6]" : "bg-[#CBD5E1]"}`} />
                                  <div>
                                    <p className="text-sm font-medium text-[#333333]">{BANCA_PERM_LABELS[key]}</p>
                                    <p className={`text-xs ${isOn ? "text-[#14B8A6]" : "text-[#999999]"}`}>
                                      {isOn ? "Visible en el menú del vendedor" : "Oculto del menú del vendedor"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    isOn ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                                  }`}>
                                    {isOn ? "ON" : "OFF"}
                                  </span>
                                  <PermToggle
                                    value={isOn}
                                    onChange={(v) =>
                                      setBancaPermission(selected.id, selected.name, key, v)
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
