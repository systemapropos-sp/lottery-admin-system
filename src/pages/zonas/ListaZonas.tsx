import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Pencil,
  Trash2,
  Settings,
  Check,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/ui/PageHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { zones as allZones, type Zone } from "@/data/mockData";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListaZonas() {
  const navigate = useNavigate();
  const [zoneList, setZoneList] = useState<Zone[]>(allZones);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null);

  // Filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return zoneList;
    const q = searchQuery.toLowerCase();
    return zoneList.filter((z) => z.name.toLowerCase().includes(q));
  }, [zoneList, searchQuery]);

  // Page size options with "Todos" as 0
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const displayPageSize = pageSize === 0 ? filtered.length : pageSize;

  // Inline edit
  function startEdit(zone: Zone) {
    setEditingId(zone.id);
    setEditName(zone.name);
  }

  function saveEdit() {
    if (!editingId || !editName.trim()) return;
    setZoneList((prev) =>
      prev.map((z) => (z.id === editingId ? { ...z, name: editName.trim() } : z))
    );
    setEditingId(null);
    setEditName("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function handleDelete(zone: Zone) {
    setZoneList((prev) => prev.filter((z) => z.id !== zone.id));
    setDeleteTarget(null);
  }

  // Columns
  const columns: Column<Zone>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Nombre",
        accessor: (row) => row.name,
        sortable: true,
        cell: (row) =>
          editingId === row.id ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="border border-[#E5E5E0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                autoFocus
              />
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={saveEdit}
                className="p-1 rounded-md bg-[#4ECDC4] text-white hover:bg-[#3DBDB5]"
              >
                <Check size={13} />
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={cancelEdit}
                className="p-1 rounded-md bg-[#EF4444] text-white hover:bg-[#DC2626]"
              >
                <X size={13} />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: row.color }}
              />
              <span className="font-medium text-[#333333]">{row.name}</span>
            </div>
          ),
      },
      {
        key: "description",
        header: "Descripcion",
        accessor: (row) => row.description,
        cell: (row) => (
          <span className="text-[#666666] text-sm">{row.description}</span>
        ),
      },
      {
        key: "bettingPoolCount",
        header: "Bancas",
        accessor: (row) => row.bettingPoolCount,
        sortable: true,
        align: "center",
        width: "100px",
        cell: (row) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F8F7] text-[#4ECDC4]">
            {row.bettingPoolCount}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Acciones",
        accessor: () => "",
        align: "center",
        width: "140px",
        cell: (row) =>
          editingId === row.id ? null : (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => navigate("/zones/manage")}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                title="Configurar"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={() => startEdit(row)}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] transition-colors"
                title="Editar"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ),
      },
    ],
    [editingId, editName, navigate]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      className="space-y-6"
    >
      <PageHeader title="Zonas" />

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <input
            type="text"
            placeholder="Filtrar zonas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Page size + Crear */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <span>Entradas por pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-[#E5E5E0] rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value={0}>Todos</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/zones/new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
          >
            <Plus size={15} />
            Crear Zona
          </motion.button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5"
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          pageSize={displayPageSize}
          pageSizeOptions={pageSizeOptions}
          emptyMessage="No se encontraron zonas"
        />
      </motion.div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            isOpen={!!deleteTarget}
            title="Confirmar accion"
            message={`Estas seguro de que deseas eliminar la zona "${deleteTarget.name}"?`}
            confirmLabel="Eliminar"
            cancelLabel="Cancelar"
            variant="danger"
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
