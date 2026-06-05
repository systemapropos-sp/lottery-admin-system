import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import { banks } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function BalanceBancos() {
  const [pageSize, setPageSize] = useState(10);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Balances - Bancos" subtitle="Vista de balances por entidad bancaria" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <span>Entradas por pagina:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-[#E5E5E0] rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Codigo</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Zona</th>
                <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Balance</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank, idx) => (
                <motion.tr
                  key={bank.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1, ease: easeOut }}
                  className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                >
                  <td className="px-4 py-4 text-[#333333] font-medium">{bank.name}</td>
                  <td className="px-4 py-4 font-mono text-[13px] text-[#666666]">{bank.id}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      —
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`font-mono text-[13px] font-semibold ${
                        bank.balance > 0
                          ? "text-green-600"
                          : bank.balance < 0
                          ? "text-red-600"
                          : "text-[#999999]"
                      }`}
                    >
                      {formatCurrency(bank.balance)}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-[#999999]">{banks.length} entradas</div>
      </div>
    </motion.div>
  );
}
