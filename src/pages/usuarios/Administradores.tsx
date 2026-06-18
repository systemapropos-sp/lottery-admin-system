import { motion } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { adminUsers } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Administradores() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Administradores" subtitle="Usuarios con privilegios administrativos" />

      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre de usuario</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre completo</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Zona</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Ultimo acceso</th>
                <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08, ease: easeOut }}
                  className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7] group`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-[13px] font-medium text-[#4ECDC4] hover:underline cursor-pointer">
                      {user.username}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{user.fullName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.zoneName === "SFM" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.zoneName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#666666] text-xs">
                    {new Date(user.lastLogin).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-50 text-[#666666] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-[#999999]">{adminUsers.length} administradores</div>
      </div>
    </motion.div>
  );
}
