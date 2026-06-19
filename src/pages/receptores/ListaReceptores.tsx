import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pencil, Trash2, Plus, Mail, X, Save, Tag } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Receptor {
  id: string;
  email: string;
  zones: string[];
  emailTypes: string[];
}

const ALL_ZONES = ["General", "Norte", "Sur", "Este", "Oeste", "Santo Domingo", "Santiago"];
const ALL_EMAIL_TYPES = [
  "Reportes diarios",
  "Alertas de seguridad",
  "Resultados",
  "Reportes de ventas",
  "Cobros",
  "Pagos",
  "Alertas de sistema",
  "Balances",
];

const receptoresData: Receptor[] = [
  {
    id: "rec-001",
    email: "smartboyslab@gmail.com",
    zones: ["General"],
    emailTypes: ["Reportes diarios", "Alertas de seguridad", "Resultados", "Reportes de ventas"],
  },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditReceptorModal({
  receptor,
  onSave,
  onClose,
}: {
  receptor: Receptor;
  onSave: (updated: Receptor) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(receptor.email);
  const [zones, setZones] = useState<string[]>(receptor.zones);
  const [emailTypes, setEmailTypes] = useState<string[]>(receptor.emailTypes);
  const [emailError, setEmailError] = useState("");

  function toggleZone(z: string) {
    setZones((prev) => prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]);
  }
  function toggleType(t: string) {
    setEmailTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function handleSave() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      return;
    }
    onSave({ ...receptor, email: email.trim(), zones, emailTypes });
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.45)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.92, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 24, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Mail size={15} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#333333]">Editar Receptor</h2>
                <p className="text-xs text-[#999999]">Modifica los datos del receptor de correo</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#999999] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-[#4ECDC4] transition-colors ${emailError ? "border-red-400 bg-red-50" : "border-[#E5E5E0]"}`}
                placeholder="correo@ejemplo.com"
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            {/* Zones */}
            <div>
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">
                Zonas
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_ZONES.map((z) => (
                  <button
                    key={z}
                    onClick={() => toggleZone(z)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      zones.includes(z)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-[#666666] border-[#E5E5E0] hover:border-blue-300"
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Types */}
            <div>
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">
                Tipos de Correo
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_EMAIL_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      emailTypes.includes(t)
                        ? "bg-[#4ECDC4] text-white border-[#4ECDC4]"
                        : "bg-white text-[#666666] border-[#E5E5E0] hover:border-[#4ECDC4]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#666666] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F5] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
            >
              <Save size={14} />
              Guardar cambios
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ListaReceptores() {
  const navigate = useNavigate();
  const [receptores, setReceptores] = useState<Receptor[]>(receptoresData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Receptor | null>(null);
  const [editTarget, setEditTarget] = useState<Receptor | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return receptores;
    const q = searchQuery.toLowerCase();
    return receptores.filter((r) => r.email.toLowerCase().includes(q));
  }, [receptores, searchQuery]);

  function handleDelete(r: Receptor) {
    setReceptores((prev) => prev.filter((x) => x.id !== r.id));
    setDeleteTarget(null);
  }

  function handleSaveEdit(updated: Receptor) {
    setReceptores((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setEditTarget(null);
  }

  const columns: Column<Receptor>[] = [
    {
      key: "email",
      header: "Correo Electronico",
      accessor: (r) => r.email,
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Mail size={14} className="text-teal-600" />
          </div>
          <span className="font-medium text-[#333333]">{r.email}</span>
        </div>
      ),
    },
    {
      key: "zones",
      header: "Zonas",
      accessor: (r) => r.zones.join(", "),
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.zones.map((z) => (
            <span key={z} className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
              {z}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "emailTypes",
      header: "Tipos de Correo",
      accessor: (r) => r.emailTypes.join(", "),
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.emailTypes.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      width: "100px",
      cell: (r) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setEditTarget(r)}
            className="p-1.5 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(r)}
            className="p-1.5 rounded-lg text-[#666666] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }} className="space-y-6"
    >
      {/* Edit Modal */}
      {editTarget && (
        <EditReceptorModal
          receptor={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Receptores de Correo</h1>
          <p className="text-sm text-[#666666] mt-0.5">Gestiona quienes reciben reportes y alertas del sistema</p>
        </div>
        <button onClick={() => navigate("/mail-receptors/new")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
        >
          <Plus size={15} /> Crear Receptor
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
        <input type="text" placeholder="Buscar por correo..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] transition-all"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          pageSize={10}
          emptyMessage="No hay receptores configurados"
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar Receptor"
        message={`¿Seguro que deseas eliminar "${deleteTarget?.email}"?`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
