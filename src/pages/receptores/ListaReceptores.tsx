import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Receptor {
  id: string;
  email: string;
  zones: string[];
  emailTypes: string[];
}



const receptoresData: Receptor[] = [
  {
    id: "rec-001",
    email: "admin@lottery.com",
    zones: ["Default", "SFM"],
    emailTypes: ["Reportes diarios", "Alertas de seguridad"],
  },
  {
    id: "rec-002",
    email: "operaciones@lottery.com",
    zones: ["SFM"],
    emailTypes: ["Resultados", "Reportes de ventas"],
  },
  {
    id: "rec-003",
    email: "soporte@lottery.com",
    zones: ["Default"],
    emailTypes: ["Notificaciones de sistema", "Alertas de seguridad"],
  },
  {
    id: "rec-004",
    email: "ventas@lottery.com",
    zones: ["Default", "SFM"],
    emailTypes: ["Reportes de ventas", "Resumen semanal"],
  },
  {
    id: "rec-005",
    email: "gerencia@lottery.com",
    zones: ["Default"],
    emailTypes: ["Reportes diarios", "Resultados", "Resumen semanal"],
  },
  {
    id: "rec-006",
    email: "alertas@lottery.com",
    zones: ["SFM"],
    emailTypes: ["Alertas de seguridad", "Notificaciones de sistema"],
  },
];

const zoneBadgeColors: Record<string, string> = {
  Default: "bg-[#F5F5F0] text-[#666666]",
  SFM: "bg-[#E0F2FE] text-[#0369A1]",
};

const typeBadgeColors: Record<string, string> = {
  "Reportes diarios": "bg-[#E0F7F5] text-[#0F766E]",
  "Alertas de seguridad": "bg-[#FEE2E2] text-[#991B1B]",
  Resultados: "bg-[#E0E7FF] text-[#3730A3]",
  "Reportes de ventas": "bg-[#ECFCCB] text-[#3F6212]",
  "Notificaciones de sistema": "bg-[#F3E8FF] text-[#6B21A8]",
  "Resumen semanal": "bg-[#FEF9C3] text-[#854D0E]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListaReceptores() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [data, setData] = useState(receptoresData);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lower = filter.toLowerCase();
    return data.filter(
      (r) =>
        r.email.toLowerCase().includes(lower) ||
        r.zones.some((z) => z.toLowerCase().includes(lower)) ||
        r.emailTypes.some((t) => t.toLowerCase().includes(lower))
    );
  }, [data, filter]);

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((r) => r.id !== id));
    setDeleteTarget(null);
  };

  const columns: Column<Receptor>[] = [
    {
      key: "email",
      header: "Correo",
      accessor: (row) => row.email,
      sortable: true,
    },
    {
      key: "zones",
      header: "Zonas",
      accessor: (row) => row.zones.join(", "),
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.zones.map((zone) => (
            <span
              key={zone}
              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                zoneBadgeColors[zone] ?? "bg-[#F5F5F0] text-[#666666]"
              }`}
            >
              {zone}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "emailTypes",
      header: "Tipos de correo",
      accessor: (row) => row.emailTypes.join(", "),
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[280px]">
          {row.emailTypes.map((type) => (
            <span
              key={type}
              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                typeBadgeColors[type] ?? "bg-[#F5F5F0] text-[#666666]"
              }`}
            >
              {type}
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
      cell: (row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mail-receptors/new?edit=${row.id}`);
            }}
            className="p-1.5 rounded-lg text-[#999999] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row.id);
            }}
            className="p-1.5 rounded-lg text-[#999999] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Receptores de Correo</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Gestion de direcciones de correo para notificaciones y reportes
          </p>
        </div>
        <button
          onClick={() => navigate("/mail-receptors/new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_12px_rgba(78,205,196,0.4)]"
        >
          <Plus size={16} />
          Crear receptor
        </button>
      </div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5"
      >
        {/* Quick Filter */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <input
            type="text"
            placeholder="Buscar correo, zona o tipo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-80 pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(row) => row.id}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Eliminar receptor"
        message="Esta seguro de que desea eliminar este receptor de correo? Esta accion no se puede deshacer."
        variant="danger"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
