import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { adminUsers, bettingPools } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ListaUsuarios() {
  const [activeTab, setActiveTab] = useState<"administradores" | "bancas">("administradores");
  const [searchAdmin, setSearchAdmin] = useState("");
  const [searchBanca, setSearchBanca] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((u) =>
      u.username.toLowerCase().includes(searchAdmin.toLowerCase())
    );
  }, [searchAdmin]);

  const filteredBancaUsers = useMemo(() => {
    return bettingPools.filter((bp) =>
      bp.code.toLowerCase().includes(searchBanca.toLowerCase())
    );
  }, [searchBanca]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Usuarios" subtitle="Gestion de usuarios del sistema" />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#E5E5E0]">
          <div className="flex">
            {(["administradores", "bancas"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab === "administradores" ? "Administradores" : "Bancas"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-[#E5E5E0]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input
                type="text"
                placeholder={activeTab === "administradores" ? "Buscar administrador..." : "Buscar usuario de banca..."}
                value={activeTab === "administradores" ? searchAdmin : searchBanca}
                onChange={(e) =>
                  activeTab === "administradores"
                    ? setSearchAdmin(e.target.value)
                    : setSearchBanca(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
              />
            </div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
            >
              <option value="">Usuario</option>
              {activeTab === "administradores"
                ? adminUsers.map((u) => (
                    <option key={u.id} value={u.username}>{u.username}</option>
                  ))
                : bettingPools.map((bp) => (
                    <option key={bp.id} value={bp.code}>{bp.code}</option>
                  ))}
            </select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "administradores" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Usuario</th>
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre completo</th>
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Rol</th>
                      <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05, ease: easeOut }}
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
                            user.role === "superadmin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Usuario</th>
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Banca</th>
                      <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBancaUsers.map((bp, idx) => (
                      <motion.tr
                        key={bp.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: easeOut }}
                        className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7] group`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-[13px] font-medium text-[#4ECDC4] hover:underline cursor-pointer">
                            {bp.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#333333]">{bp.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
