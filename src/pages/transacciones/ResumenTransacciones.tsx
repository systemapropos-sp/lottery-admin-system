import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { transactions, bettingPools } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface DailySummary {
  fecha: string;
  debitos: number;
  creditos: number;
  neto: number;
}

export default function ResumenTransacciones() {
  const [periodo, setPeriodo] = useState("7d");

  const stats = useMemo(() => {
    const totalDebitos = transactions.filter((t) => t.type === "PAGO").reduce((s, t) => s + t.amount, 0);
    const totalCreditos = transactions.filter((t) => t.type === "COBRO").reduce((s, t) => s + t.amount, 0);
    return {
      totalDebitos,
      totalCreditos,
      neto: totalCreditos - totalDebitos,
      count: transactions.length,
    };
  }, []);

  const dailyData: DailySummary[] = useMemo(() => {
    const map = new Map<string, { debitos: number; creditos: number }>();
    transactions.forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString("es-ES");
      if (!map.has(date)) map.set(date, { debitos: 0, creditos: 0 });
      const entry = map.get(date)!;
      if (t.type === "PAGO") entry.debitos += t.amount;
      else entry.creditos += t.amount;
    });
    return Array.from(map.entries())
      .map(([fecha, vals]) => ({ fecha, ...vals, neto: vals.creditos - vals.debitos }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, []);

  const porBancaData = useMemo(() => {
    const map = new Map<string, { name: string; debitos: number; creditos: number }>();
    transactions.forEach((t) => {
      if (!map.has(t.bettingPoolName)) {
        map.set(t.bettingPoolName, { name: t.bettingPoolName, debitos: 0, creditos: 0 });
      }
      const entry = map.get(t.bettingPoolName)!;
      if (t.type === "PAGO") entry.debitos += t.amount;
      else entry.creditos += t.amount;
    });
    return Array.from(map.values()).map((v) => ({
      name: v.name,
      value: v.creditos + v.debitos,
    }));
  }, []);

  const porCategoriaData = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#FFD93D", "#96CEB4", "#DDA0DD", "#F9A826", "#FD79A8"];

  const summaryByEntity = useMemo(() => {
    return bettingPools.slice(0, 6).map((pool) => {
      const poolTxns = transactions.filter((t) => t.bettingPoolId === pool.id);
      const debitos = poolTxns.filter((t) => t.type === "PAGO").reduce((s, t) => s + t.amount, 0);
      const creditos = poolTxns.filter((t) => t.type === "COBRO").reduce((s, t) => s + t.amount, 0);
      return {
        name: pool.name,
        mwrCode: pool.mwrCode,
        saldoInicial: pool.balance,
        debitos,
        creditos,
        saldoFinal: pool.balance + creditos - debitos,
      };
    });
  }, []);

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Resumen de Transacciones" subtitle="Vista general de movimientos financieros" />

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Total Debitos" value={stats.totalDebitos} format="currency" prefix="$" color="#EF4444" icon={TrendingDown} delay={0} />
        <StatCard label="Total Creditos" value={stats.totalCreditos} format="currency" prefix="$" color="#22C55E" icon={TrendingUp} delay={1} />
        <StatCard label="Neto" value={stats.neto} format="currency" prefix="$" color="#4ECDC4" icon={DollarSign} delay={2} />
        <StatCard label="Transacciones" value={stats.count} format="number" color="#333333" icon={BarChart3} delay={3} />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#333333]">Volumen por dia</h3>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="px-3 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]">
              <option value="7d">Ultimos 7 dias</option>
              <option value="30d">Ultimos 30 dias</option>
              <option value="90d">Ultimos 90 dias</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: "#666666" }} />
              <YAxis tick={{ fontSize: 12, fill: "#666666" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, ""]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E5E0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Line type="monotone" dataKey="creditos" name="Creditos" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="debitos" name="Debitos" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="neto" name="Neto" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 4 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart - By Pool */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Distribucion por Banca</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={porBancaData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {porBancaData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pie Chart by Category + Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Por Categoria</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={porCategoriaData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                {porCategoriaData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Resumen por Entidad</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                  <th className="px-4 py-3 text-left">Banca</th>
                  <th className="px-4 py-3 text-right">Saldo Inicial</th>
                  <th className="px-4 py-3 text-right">Debitos</th>
                  <th className="px-4 py-3 text-right">Creditos</th>
                  <th className="px-4 py-3 text-right">Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {summaryByEntity.map((e, idx) => (
                  <tr key={e.mwrCode} className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7] transition-colors`}>
                    <td className="px-4 py-3 font-medium text-[#333333]">{e.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#333333]">${e.saldoInicial.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#EF4444]">${e.debitos.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#22C55E]">${e.creditos.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[#333333]">${e.saldoFinal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
