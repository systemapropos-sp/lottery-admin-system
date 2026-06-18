import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Search, Pencil, Trash2, Plus, Mail } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Receptor {
  id: string;
  email: string;
  zones: string[];
  emailTypes: string[];
}

const receptoresData: Receptor[] = [
  {
    id: "rec-001",
    email: "smartboyslab@gmail.com",
    zones: ["General"],
    emailTypes: ["Reportes diarios", "Alertas de seguridad", "Resultados", "Reportes de ventas"],
  },
];

export default function ListaReceptores() {
  const navigate = useNavigate();
  const [receptores, setReceptores] = useState<Receptor[]>(receptoresData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Receptor | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return receptores;
    const q = searchQuery.toLowerCase();
    return receptores.filter((r) => r.email.toLowerCase().includes(q));
  }, [receptores, searchQuery]);

  function handleDelete(r: Receptor) {
    setReceptores((prev) => prev.filter((x) => x.id !== r.id));
    setDeleteTarget(null);
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
            onClick={() => navigate("/mail-receptors/new")}
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
