import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Plus,
  Users,
  DollarSign,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";
import type { Banca } from "@/store/bancasStore";
import type { Zona } from "@/store/zonasStore";

// ─── Zone Card Data ───────────────────────────────────────────────────────────

interface ZoneCardData {
  zone: Zona;
  pools: Banca[];
  totalBalance: number;
  activePools: number;
}

// ─── Format currency ──────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManejarZonas() {
  const navigate = useNavigate();
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();

  const zoneCards = useMemo<ZoneCardData[]>(() => {
    return zonasRaw.map((zone) => {
      const pools = bancasRaw.filter((bp) => bp.zone_id === zone.id);
      const totalBalance = pools.reduce((sum, p) => sum + (p.balance ?? 0), 0);
      const activePools = pools.filter((p) => p.is_active).length;
      return { zone, pools, totalBalance, activePools };
    });
  }, [zonasRaw, bancasRaw]);

  const grandTotal = useMemo(
    () => zoneCards.reduce((sum, z) => sum + z.totalBalance, 0),
    [zoneCards]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      className="space-y-6"
    >
      <PageHeader title="Manejar Zonas" />

      {/* Back + Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <button
          onClick={() => navigate("/zones")}
          className="flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#4ECDC4] transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a Zonas
        </button>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[#666666]">
            <Building2 size={16} className="text-[#4ECDC4]" />
            <span>{zoneCards.length} zonas</span>
          </div>
          <div className="flex items-center gap-2 text-[#666666]">
            <Users size={16} className="text-[#4ECDC4]" />
            <span>{bancasRaw.length} bancas</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-[#4ECDC4]" />
            <span
              className={`font-semibold tabular-nums ${
                grandTotal >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"
              }`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {grandTotal >= 0 ? "" : "-"}
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Zone Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {zoneCards.map((card, idx) => (
          <motion.div
            key={card.zone.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: idx * 0.08,
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 transition-all"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-teal-500"
              >
                {card.zone.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#333333]">
                  {card.zone.nombre}
                </h3>
                <p className="text-xs text-[#999999]">
                  {(card.zone as any).descripcion ?? ""}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#F8F8F5] rounded-lg p-3">
                <p className="text-xs text-[#999999] mb-1">Bancas</p>
                <p className="text-xl font-bold text-[#333333] tabular-nums">
                  {card.pools.length}
                </p>
                <p className="text-xs text-[#22C55E]">
                  {card.activePools} activas
                </p>
              </div>
              <div className="bg-[#F8F8F5] rounded-lg p-3">
                <p className="text-xs text-[#999999] mb-1">Balance Total</p>
                <p
                  className={`text-xl font-bold tabular-nums ${
                    card.totalBalance >= 0
                      ? "text-[#22C55E]"
                      : "text-[#EF4444]"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {card.totalBalance >= 0 ? "" : "-"}
                  {formatCurrency(card.totalBalance)}
                </p>
              </div>
            </div>

            {/* Pool list preview */}
            <div className="space-y-1.5 mb-4 max-h-28 overflow-y-auto scrollbar-thin">
              {card.pools.slice(0, 5).map((pool) => (
                <div
                  key={pool.id}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#F8F8F5] transition-colors"
                >
                  <span className="text-xs text-[#333333] truncate">
                    {pool.name}
                  </span>
                  <span
                    className={`text-xs tabular-nums ml-2 ${
                      pool.balance >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                  >
                    {pool.balance >= 0 ? "" : "-"}
                    {formatCurrency(pool.balance)}
                  </span>
                </div>
              ))}
              {card.pools.length > 5 && (
                <p className="text-xs text-[#999999] text-center py-1">
                  y {card.pools.length - 5} mas...
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#F0F0EB]">
              <button
                onClick={() => navigate("/betting-pools")}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#4ECDC4] bg-[rgba(78,205,196,0.1)] hover:bg-[rgba(78,205,196,0.2)] transition-colors"
              >
                <Eye size={14} />
                Ver bancas
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add new zone card */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: zoneCards.length * 0.08,
            duration: 0.3,
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/zones/new")}
          className="bg-white rounded-xl border-2 border-dashed border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex flex-col items-center justify-center gap-3 text-[#999999] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-full bg-[rgba(78,205,196,0.1)] flex items-center justify-center">
            <Plus size={24} className="text-[#4ECDC4]" />
          </div>
          <span className="text-sm font-medium">Nueva Zona</span>
        </motion.button>
      </motion.div>

      {/* Assignment table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5"
      >
        <h3 className="text-base font-semibold text-[#333333] mb-4">
          Asignacion de Bancas por Zona
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">
                  Banca
                </th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">
                  MWR Code
                </th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">
                  Zona
                </th>
                <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {bancasRaw.map((pool, idx) => (
                <motion.tr
                  key={pool.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.015 }}
                  className={`border-b border-[#E8E8E3] hover:bg-[#F0F8F7] transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-[#333333]">
                    {pool.name}
                  </td>
                  <td className="px-4 py-2.5 text-[#666666] font-mono text-xs">
                    {pool.mwr_code}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: pool.zone_id
                          ? "rgba(78,205,196,0.12)"
                          : "rgba(245,158,11,0.12)",
                        color: pool.zone_id ? "#4ECDC4" : "#F59E0B",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: pool.zone_id ? "#4ECDC4" : "#F59E0B",
                        }}
                      />
                      {pool.zone_name ?? "Sin zona"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        pool.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pool.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
