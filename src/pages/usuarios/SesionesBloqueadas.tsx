import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, AlertTriangle, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface BlockedUser {
  id: string;
  usuario: string;
  bloqueadoEn: string;
  ip: string;
  estado: "bloqueado" | "desbloqueando" | "desbloqueado";
}

const initialBlockedByPassword: BlockedUser[] = [
  { id: "blk-001", usuario: "mr07", bloqueadoEn: "2024-05-15 10:23:45", ip: "192.168.1.127", estado: "bloqueado" },
  { id: "blk-002", usuario: "mr12", bloqueadoEn: "2024-05-15 09:15:00", ip: "192.168.1.145", estado: "bloqueado" },
  { id: "blk-003", usuario: "sfm056", bloqueadoEn: "2024-05-14 18:30:00", ip: "10.0.0.42", estado: "bloqueado" },
];

const initialBlockedByPin: BlockedUser[] = [
  { id: "blk-pin-001", usuario: "mr03", bloqueadoEn: "2024-05-15 08:45:00", ip: "192.168.1.103", estado: "bloqueado" },
];

const initialBlockedIPs: BlockedUser[] = [
  { id: "blk-ip-001", usuario: "192.168.1.200", bloqueadoEn: "2024-05-15 06:00:00", ip: "192.168.1.200", estado: "bloqueado" },
  { id: "blk-ip-002", usuario: "10.0.0.99", bloqueadoEn: "2024-05-14 22:15:00", ip: "10.0.0.99", estado: "bloqueado" },
];

export default function SesionesBloqueadas() {
  const [activeTab, setActiveTab] = useState<"password" | "pin" | "ip">("password");
  const [blockedPassword, setBlockedPassword] = useState(initialBlockedByPassword);
  const [blockedPin, setBlockedPin] = useState(initialBlockedByPin);
  const [blockedIPs, setBlockedIPs] = useState(initialBlockedIPs);

  const getCurrentData = (): BlockedUser[] => {
    switch (activeTab) {
      case "password": return blockedPassword;
      case "pin": return blockedPin;
      case "ip": return blockedIPs;
      default: return blockedPassword;
    }
  };

  const setCurrentData = (updater: (prev: BlockedUser[]) => BlockedUser[]) => {
    switch (activeTab) {
      case "password": setBlockedPassword(updater); break;
      case "pin": setBlockedPin(updater); break;
      case "ip": setBlockedIPs(updater); break;
    }
  };

  const handleUnlock = (id: string) => {
    setCurrentData((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado: "desbloqueando" as const } : u))
    );
    setTimeout(() => {
      setCurrentData((prev) =>
        prev.map((u) => (u.id === id ? { ...u, estado: "desbloqueado" as const } : u))
      );
    }, 1200);
  };

  const currentData = getCurrentData();
  const activeCount = currentData.filter((u) => u.estado !== "desbloqueado").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Sesiones bloqueadas" subtitle="Gestion de sesiones bloqueadas por seguridad" />

      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Tabs */}
        <div className="border-b border-[#E5E5E0]">
          <div className="flex">
            {([
              { key: "password" as const, label: "Por Contrasena" },
              { key: "pin" as const, label: "Por Pin" },
              { key: "ip" as const, label: "Direcciones IP" },
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
          >
            {activeCount === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-16 text-[#22C55E]"
              >
                <Check size={48} />
                <p className="text-sm font-medium">No hay sesiones bloqueadas</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">
                        {activeTab === "ip" ? "Direccion IP" : "Usuario"}
                      </th>
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Bloqueado en</th>
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">IP durante el bloqueo</th>
                      <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentData
                        .filter((u) => u.estado !== "desbloqueado")
                        .map((user, idx) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, delay: idx * 0.05, ease: easeOut }}
                            className="border-b border-[#E8E8E3] bg-white hover:bg-[#F0F8F7] border-l-2 border-l-[#EF4444]"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {activeTab !== "ip" && (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100">
                                    <Lock size={12} className="text-red-600" />
                                  </span>
                                )}
                                <span className={`font-medium ${activeTab === "ip" ? "font-mono text-[13px]" : "text-[#333333]"}`}>
                                  {user.usuario}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#666666]">{user.bloqueadoEn}</td>
                            <td className="px-4 py-3 font-mono text-[13px] text-[#666666]">{user.ip}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                {user.estado === "bloqueado" && (
                                  <button
                                    onClick={() => handleUnlock(user.id)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#E5E5E0] text-[#333333] rounded-full text-xs font-medium hover:bg-[#4ECDC4] hover:text-white hover:border-[#4ECDC4] transition-all duration-200"
                                  >
                                    <Unlock size={12} />
                                    Desbloquear
                                  </button>
                                )}
                                {user.estado === "desbloqueando" && (
                                  <div className="flex items-center gap-2 text-[#F59E0B]">
                                    <span className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs">Desbloqueando...</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                    </AnimatePresence>
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
