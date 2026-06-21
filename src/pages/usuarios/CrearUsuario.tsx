import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface PrivilegeCategory {
  name: string;
  privileges: string[];
  expanded: boolean;
}

const initialPrivileges: PrivilegeCategory[] = [
  {
    name: "Acceso al sistema",
    expanded: true,
    privileges: [
      "ACCESO AL SISTEMA",
      "DASHBOARD ADMINISTRATIVO",
    ],
  },
  {
    name: "Transacciones",
    expanded: false,
    privileges: [
      "CREAR AJUSTES",
      "CREAR CATEGORIAS DE GASTOS",
      "CREAR COBROS",
      "CREAR PAGOS",
      "CREAR RETIROS",
      "CREAR TRANSFERENCIAS",
      "MANEJAR ENTIDADES CONTABLES",
      "MANEJAR TRANSACCIONES",
      "PAGOS Y COBROS (ACCESO RAPIDO)",
      "TRANSACCIONES SIMPLIFICADAS",
      "VER TODOS LOS GRUPOS DE TRANSACCIONES",
    ],
  },
  {
    name: "Usuarios",
    expanded: false,
    privileges: [
      "CAMBIAR CONTRASEÑAS DE ADMINISTRADORES",
      "CAMBIAR CONTRASEÑAS DE BANCAS",
      "ENVIAR NOTIFICACIONES",
      "MANEJAR SEGURIDAD DEL GRUPO",
      "MANEJAR USUARIOS",
      "VER INICIOS DE SESION",
      "VER INICIOS DE SESION ADMINISTRATIVOS",
    ],
  },
  {
    name: "Bancas",
    expanded: false,
    privileges: [
      "ACCESAR RECARGAS TELEF",
      "ACCESO DE BANCAS",
      "CREAR BANCAS",
      "EDITAR CAIDA ACUMULADA",
      "MANEJAR BANCAS",
      "VER BANCAS SIN VENTAS",
    ],
  },
  {
    name: "Balances",
    expanded: false,
    privileges: [
      "BANCAS",
      "BANCOS",
      "VER REPORTE DE BANCA",
    ],
  },
  {
    name: "Ventas",
    expanded: false,
    privileges: [
      "PROCESAR TICKETS DE HOY",
      "PROCESAR VENTAS DE AYER",
      "VER VENTAS",
    ],
  },
  {
    name: "Tickets",
    expanded: false,
    privileges: [
      "CANCELAR TICKET",
      "CANCELAR TICKETS EN CUALQUIER MOMENTO",
      "LIMPIAR PENDIENTES DE PAGO",
      "MARCAR CUALQUIER TICKET COMO PAGO",
      "MONITOREO DE TICKETS",
      "VENDER COMO CUALQUIER BANCA",
      "VENDER FUERA DE HORARIO",
      "VENDER TICKETS",
      "VER ANOMALIAS",
    ],
  },
  {
    name: "Otros",
    expanded: false,
    privileges: [
      "MANEJAR RECEPTORES DE CORREOS",
      "MANEJAR ZONAS",
    ],
  },
  {
    name: "Sorteos",
    expanded: false,
    privileges: [
      "MANEJAR HORARIO DE SORTEOS",
      "MANEJAR LIMITE DE BANCAS",
      "MANEJAR LIMITES",
      "MANEJAR SORTEOS",
      "PUBLICAR RESULTADOS DE DIAS PASADOS",
      "PUBLICAR RESULTADOS DE HOY",
      "VER RESULTADOS",
    ],
  },
];

export default function CrearUsuario() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
    confirmar: "",
  });
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());
  const [selectedBanca, setSelectedBanca] = useState("");
  const [privileges, setPrivileges] = useState<PrivilegeCategory[]>(initialPrivileges);
  const [checkedPrivileges, setCheckedPrivileges] = useState<Set<string>>(new Set());

  const toggleCategory = (idx: number) => {
    setPrivileges((prev) =>
      prev.map((cat, i) => (i === idx ? { ...cat, expanded: !cat.expanded } : cat))
    );
  };

  const selectAllInCategory = (category: PrivilegeCategory) => {
    setCheckedPrivileges((prev) => {
      const next = new Set(prev);
      const allChecked = category.privileges.every((p) => next.has(p));
      category.privileges.forEach((p) => {
        if (allChecked) next.delete(p);
        else next.add(p);
      });
      return next;
    });
  };

  const toggleZone = (zoneId: string) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  };

  const handleCreate = () => {
    alert("Usuario creado exitosamente!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Crear Usuario" subtitle="Registre un nuevo usuario con sus privilegios" />

      {/* Basic Data */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-semibold text-[#333333] mb-4">Datos basicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
              placeholder="Nombre de usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Contrasena <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Confirmar contrasena <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmar}
              onChange={(e) => setFormData({ ...formData, confirmar: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Asignar banca</label>
            <select
              value={selectedBanca}
              onChange={(e) => setSelectedBanca(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            >
              <option value="">Sin banca</option>
              {bancasRaw.map((bp) => (
                <option key={bp.id} value={bp.id}>{bp.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zonas */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#333333] mb-2">Zonas</label>
          <div className="flex flex-wrap gap-2">
            {zonasRaw.map((z) => (
              <label
                key={z.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedZones.has(z.id)
                    ? "bg-[#F0F8F7] border-[#4ECDC4]"
                    : "bg-white border-[#E5E5E0] hover:bg-[#FAFAF8]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedZones.has(z.id)}
                  onChange={() => toggleZone(z.id)}
                  className="rounded text-[#4ECDC4] focus:ring-[#4ECDC4]"
                />
                <span className="text-sm text-[#333333]">{z.nombre}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Privileges */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-5 border-b border-[#E5E5E0]">
          <h3 className="text-sm font-semibold text-[#333333]">Privilegios</h3>
          <p className="text-xs text-[#999999] mt-1">
            {checkedPrivileges.size} privilegios seleccionados
          </p>
        </div>
        <div className="divide-y divide-[#F0F0EB]">
          {privileges.map((category, catIdx) => (
            <div key={category.name}>
              <button
                onClick={() => toggleCategory(catIdx)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#333333]">{category.name}</span>
                  <span className="text-xs text-[#999999]">
                    {category.privileges.filter((p) => checkedPrivileges.has(p)).length}/{category.privileges.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAllInCategory(category);
                    }}
                    className="text-xs text-[#4ECDC4] hover:underline"
                  >
                    Seleccionar todos
                  </button>
                  {category.expanded ? (
                    <ChevronUp size={16} className="text-[#999999]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#999999]" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {category.expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.privileges.map((priv) => (
                        <motion.label
                          key={priv}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FAFAF8] cursor-pointer"
                          onClick={() => setCheckedPrivileges(prev => { const next = new Set(prev); if(next.has(priv)) next.delete(priv); else next.add(priv); return next; })}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              checkedPrivileges.has(priv)
                                ? "bg-[#4ECDC4] border-[#4ECDC4]"
                                : "border-gray-300"
                            }`}
                          >
                            {checkedPrivileges.has(priv) && <Check size={10} className="text-white" />}
                          </div>
                          <span className="text-sm text-[#333333]">{priv}</span>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-[#4ECDC4] text-white rounded-full text-sm font-medium hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
        >
          Crear usuario
        </button>
      </div>
    </motion.div>
  );
}
