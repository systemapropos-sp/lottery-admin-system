import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  LayoutGrid,
  List,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useCobradoresStore } from "@/store/cobradoresStore";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ListaCobradores() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activo" | "inactivo">("todos");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { cobradores, loading, fetchCobradores, deleteCobrador } = useCobradoresStore();

  useEffect(() => {
    fetchCobradores();
  }, [fetchCobradores]);

  const filtered = useMemo(() => {
    return cobradores.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        (c.zona_nombre ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "todos" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cobradores, search, statusFilter]);

  const activos = cobradores.filter((c) => c.status === "activo").length;
  const totalBalance = cobradores.reduce((sum, c) => sum + (c.balance ?? 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Lista de Cobradores"
        subtitle="Gestión de cobradores registrados en el sistema"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/cobradores")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] hover:text-[#333333] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
            >
              <ArrowLeft size={14} />
              Cobradores
            </button>
            <button
              onClick={() => navigate("/cobradores/crear")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg transition-colors"
              style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)" }}
            >
              <UserPlus size={14} />
              Nuevo Cobrador
            </button>
          </div>
        }
      />

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Cobradores", value: cobradores.length, color: "#14B8A6" },
          { label: "Activos", value: activos, color: "#10B981" },
          { label: "Inactivos", value: cobradores.length - activos, color: "#94A3B8" },
          {
            label: "Balance Total",
            value: `$${totalBalance.toLocaleString()}`,
            color: "#F59E0B",
          },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.06, ease: easeOut }}
            className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[11px] text-[#999999] uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Table / Grid Card ── */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Filters bar */}
        <div className="p-4 border-b border-[#E5E5E0] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID, zona..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#F5F5F0] rounded-lg p-0.5 gap-0.5 ml-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#14B8A6] shadow-sm"
                  : "text-[#999999] hover:text-[#666666]"
              }`}
              title="Vista tabla"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#14B8A6] shadow-sm"
                  : "text-[#999999] hover:text-[#666666]"
              }`}
              title="Vista grid"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="px-4 py-12 text-center text-[#999999] text-sm">Cargando cobradores...</div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F8F5] text-[#666666] text-[12px] font-semibold uppercase tracking-[0.04em]">
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Teléfono</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Zona</th>
                  <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Bancas</th>
                  <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Balance</th>
                  <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Estado</th>
                  <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#999999] text-sm">
                      No se encontraron cobradores
                    </td>
                  </tr>
                ) : (
                  filtered.map((cobrador, idx) => (
                    <motion.tr
                      key={cobrador.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04, ease: easeOut }}
                      className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7] group`}
                    >
                      <td className="px-4 py-3 font-medium text-[#333333]">{cobrador.name}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-[12px] text-[#666666]">
                          <Phone size={11} className="text-[#999999]" />
                          {cobrador.phone || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-[13px] text-[#555555]">
                          <MapPin size={12} className="text-[#8B5CF6]" />
                          {cobrador.zona_nombre ?? "Sin zona"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-[#333333]">
                          {cobrador.banca_ids?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#F59E0B]">
                        ${(cobrador.balance ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {cobrador.status === "activo" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={10} />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            <XCircle size={10} />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors" title="Ver">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors" title="Editar">
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-md hover:bg-red-50 text-[#666666] hover:text-red-500 transition-colors"
                            title="Eliminar"
                            onClick={() => {
                              if (confirm(`¿Eliminar a ${cobrador.name}?`)) {
                                deleteCobrador(cobrador.id);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Grid View ── */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cobrador, idx) => (
              <motion.div
                key={cobrador.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05, ease: easeOut }}
                className="border border-[#E5E5E0] rounded-xl p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#333333] text-sm mt-0.5">{cobrador.name}</p>
                  </div>
                  {cobrador.status === "activo" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={9} /> Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                      <XCircle size={9} /> Inactivo
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
                    <Phone size={11} className="text-[#999999]" /> {cobrador.phone || "—"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
                    <MapPin size={11} className="text-[#8B5CF6]" /> {cobrador.zona_nombre ?? "Sin zona"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0EC]">
                  <div className="text-center">
                    <p className="text-[10px] text-[#999999]">Bancas</p>
                    <p className="font-bold text-sm text-[#333333]">{cobrador.banca_ids?.length ?? 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-[#999999]">Balance</p>
                    <p className="font-bold text-sm text-[#F59E0B]">
                      ${(cobrador.balance ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                      <Eye size={13} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-red-50 text-[#666666] hover:text-red-500 transition-colors"
                      onClick={() => {
                        if (confirm(`¿Eliminar a ${cobrador.name}?`)) {
                          deleteCobrador(cobrador.id);
                        }
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E0] bg-[#FAFAF8] flex items-center justify-between">
          <span className="text-[12px] text-[#999999]">
            {filtered.length} de {cobradores.length} cobradores
          </span>
        </div>
      </div>
    </motion.div>
  );
}
