import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { useAuthStore, useTranslation } from "@/store/authStore";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─── Local types & placeholder data ─────────────────────────────────────────
interface Transaction {
  id: string; type: string; amount: number; bettingPoolId: string;
  bettingPoolName: string; mwrCode: string; createdBy: string;
  createdAt: string; category: string; notes: string;
}
const transactions: Transaction[] = [];
const salesActivity: { dayEn: string; dayEs: string; day: string; date: string; count: number; totalAmount: number; }[] = [];
const topPools: { name: string; mwrCode: string; salesAmount: number; }[] = [];

// ─── Dashboard Content ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation();
  const addNotification = useAuthStore((s) => s.addNotification);
  const { bancas: bancasRaw } = useBancasZonas();

  const [activeTab, setActiveTab] = useState<"COBRO" | "PAGO">("COBRO");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MWR codes
  const mwrCodes = useMemo(
    () =>
      bancasRaw.map((bp) => ({
        value: bp.mwr_code,
        label: `${bp.mwr_code} - ${bp.name}`,
      })),
    [bancasRaw]
  );

  // Sales activity
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayEs = (() => {
    const day = new Date().getDay();
    return ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"][day];
  })();

  const todayActivity = salesActivity.find(
    (s) => s.dayEn.toLowerCase() === today.toLowerCase()
  );

  const stats = [
    {
      label: t("dashboard.sellingPools") + ": " + todayEs,
      labelEn: "Pools selling",
      value: todayActivity?.count ?? 0,
      color: "#22C55E",
      icon: Building2,
      format: "number" as const,
    },
    {
      label: "Total Bancas",
      labelEn: "Total Pools",
      value: bancasRaw.length,
      color: "#333333",
      icon: Building2,
      format: "number" as const,
    },
    {
      label: "Total Ventas Hoy",
      labelEn: "Today's Sales",
      value: todayActivity?.totalAmount ?? 0,
      color: "#4ECDC4",
      icon: TrendingUp,
      format: "currency" as const,
      prefix: "$",
    },
    {
      label: "Balance General",
      labelEn: "General Balance",
      value: 0,
      color: "#6B7280",
      icon: Wallet,
      format: "currency" as const,
      prefix: "$",
    },
  ];

  const chartData = topPools.map((pool) => ({
    name: pool.name.length > 12 ? pool.name.slice(0, 12) + "..." : pool.name,
    mwrCode: pool.mwrCode,
    Ventas: pool.salesAmount,
  }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBanca || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const pool = bancasRaw.find((bp) => bp.mwr_code === selectedBanca);
    if (pool) {
      const newTxn: Transaction = {
        id: `txn-${Date.now()}`,
        type: activeTab,
        amount: Number(amount),
        bettingPoolId: pool.id,
        bettingPoolName: pool.name,
        mwrCode: pool.mwr_code ?? "",
        createdBy: "alex",
        createdAt: new Date().toISOString(),
        category: activeTab === "COBRO" ? "Recaudacion" : "Pago",
        notes: `${activeTab} desde dashboard`,
      };
      transactions.unshift(newTxn);

      addNotification({
        title: `${activeTab} registrado`,
        message: `${activeTab} de $${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} para ${pool.name}`,
        type: "success",
        isRead: false,
      });
    }

    setAmount("");
    setSelectedBanca("");
    setIsSubmitting(false);
  }

  return (
    <div>
      <PageHeader
        title={t("dashboard.title")}
        actions={
          <span className="px-3 py-1.5 text-xs font-semibold text-[#4ECDC4] bg-[#E0F7F5] rounded-full border border-[#4ECDC4]/20">
            Dashboard
          </span>
        }
      />

      <div className="space-y-6">
        {/* ── Cobros & Pagos Card ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard size={18} className="text-[#4ECDC4]" />
            <h2 className="text-lg font-semibold text-[#333333]">
              {t("dashboard.cobrosPagos")}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E5E0] mb-5">
            {(["COBRO", "PAGO"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setAmount("");
                  setSelectedBanca("");
                }}
                className={`px-6 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab === "COBRO" ? t("dashboard.cobro") : t("dashboard.pago")}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
            {/* Bank Code Selector */}
            <div className="flex flex-col gap-1.5 min-w-[220px] flex-1 max-w-[320px]">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                {t("dashboard.bankCode")}
              </label>
              <select
                value={selectedBanca}
                onChange={(e) => setSelectedBanca(e.target.value)}
                className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
              >
                <option value="">{t("dashboard.selectBank")}</option>
                {mwrCodes.map((mwr) => (
                  <option key={mwr.value} value={mwr.value}>
                    {mwr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-1.5 min-w-[160px] flex-1 max-w-[240px]">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                {t("dashboard.amount")}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#999999] font-mono">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white font-mono text-right focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
                />
              </div>
            </div>

            {/* Create Button */}
            <motion.button
              type="submit"
              disabled={!selectedBanca || !amount || Number(amount) <= 0 || isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("dashboard.create")
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* ── Estadísticas Card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-lg font-semibold text-[#333333] mb-4">
            {t("dashboard.statistics")}
          </h2>

          {/* Day pills */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-sm text-[#666666]">
              {t("dashboard.sellingPools")}:
            </span>
            {salesActivity.map((day) => {
              const isToday =
                day.dayEn.toLowerCase() === today.toLowerCase();
              return (
                <span
                  key={day.date}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    day.count > 0
                      ? "bg-[#E0F7F5] text-[#0D9488]"
                      : "bg-[#F5F5F0] text-[#999999]"
                  } ${isToday ? "ring-2 ring-[#4ECDC4] ring-offset-1" : ""}`}
                >
                  {day.day}: {day.count}
                </span>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                prefix={stat.prefix}
                color={stat.color}
                icon={stat.icon}
                format={stat.format}
                delay={idx}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Bancas con Mayor Actividad ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-[#4ECDC4]" />
            <h2 className="text-lg font-semibold text-[#333333]">
              {t("dashboard.topPools")}
            </h2>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F0F0EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#666666" }}
                    axisLine={{ stroke: "#E5E5E0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#999999" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    }
                    contentStyle={{
                      background: "#1E1E1E",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="Ventas"
                    fill="#4ECDC4"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-[#999999] py-8">
              {t("dashboard.noSalesData")}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
