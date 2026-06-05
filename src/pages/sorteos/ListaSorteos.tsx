import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Search, X, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { lotteries as allLotteries, type Lottery } from "@/data/mockData";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditingRow {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListaSorteos() {
  const [lotteryList, setLotteryList] = useState<Lottery[]>(allLotteries);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lottery | null>(null);

  // Filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return lotteryList;
    const q = searchQuery.toLowerCase();
    return lotteryList.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.abbreviation.toLowerCase().includes(q) ||
        l.color.toLowerCase().includes(q)
    );
  }, [lotteryList, searchQuery]);

  // Inline edit handlers
  function startEdit(lottery: Lottery) {
    setEditingRow({
      id: lottery.id,
      name: lottery.name,
      abbreviation: lottery.abbreviation,
      color: lottery.color,
    });
  }

  function saveEdit() {
    if (!editingRow) return;
    setLotteryList((prev) =>
      prev.map((l) =>
        l.id === editingRow.id
          ? {
              ...l,
              name: editingRow.name,
              abbreviation: editingRow.abbreviation,
              color: editingRow.color,
            }
          : l
      )
    );
    setEditingRow(null);
  }

  function cancelEdit() {
    setEditingRow(null);
  }

  function handleDelete(lottery: Lottery) {
    setLotteryList((prev) => prev.filter((l) => l.id !== lottery.id));
    setDeleteTarget(null);
  }

  // Columns
  const columns: Column<Lottery>[] = useMemo(
    () => [
      {
        key: "color",
        header: "Color",
        accessor: (row) => row.color,
        align: "center",
        width: "80px",
        cell: (row) => (
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
                delay: allLotteries.indexOf(row) * 0.025,
              }}
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: row.color }}
            />
          </div>
        ),
      },
      {
        key: "name",
        header: "Nombre",
        accessor: (row) => row.name,
        sortable: true,
        cell: (row) =>
          editingRow?.id === row.id ? (
            <input
              type="text"
              value={editingRow.name}
              onChange={(e) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              className="w-full border border-[#E5E5E0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
              autoFocus
            />
          ) : (
            <span className="font-medium text-[#333333]">{row.name}</span>
          ),
      },
      {
        key: "abbreviation",
        header: "Abreviacion",
        accessor: (row) => row.abbreviation,
        sortable: true,
        align: "center",
        width: "120px",
        cell: (row) =>
          editingRow?.id === row.id ? (
            <input
              type="text"
              value={editingRow.abbreviation}
              onChange={(e) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, abbreviation: e.target.value } : null
                )
              }
              className="w-24 border border-[#E5E5E0] rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
            />
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F0] text-[#666666]">
              {row.abbreviation}
            </span>
          ),
      },
      {
        key: "colorValue",
        header: "Color",
        accessor: (row) => row.color,
        align: "center",
        width: "120px",
        cell: (row) =>
          editingRow?.id === row.id ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="color"
                value={editingRow.color}
                onChange={(e) =>
                  setEditingRow((prev) =>
                    prev ? { ...prev, color: e.target.value } : null
                  )
                }
                className="w-8 h-8 rounded cursor-pointer border border-[#E5E5E0]"
              />
              <span className="text-xs text-[#666666] font-mono">
                {editingRow.color}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-6 h-6 rounded border border-[#E5E5E0]"
                style={{ backgroundColor: row.color }}
              />
              <span className="text-xs text-[#999999] font-mono">
                {row.color}
              </span>
            </div>
          ),
      },
      {
        key: "drawTime",
        header: "Horario",
        accessor: (row) => row.drawTime,
        sortable: true,
        align: "center",
        width: "100px",
        cell: (row) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F8F7] text-[#4ECDC4]">
            {row.drawTime}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Acciones",
        accessor: () => "",
        align: "center",
        width: "120px",
        cell: (row) =>
          editingRow?.id === row.id ? (
            <div className="flex items-center justify-center gap-1">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={saveEdit}
                className="p-1.5 rounded-lg bg-[#4ECDC4] text-white hover:bg-[#3DBDB5] transition-colors"
                title="Guardar"
              >
                <Check size={14} />
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={cancelEdit}
                className="p-1.5 rounded-lg bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
                title="Cancelar"
              >
                <X size={14} />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
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
    [editingRow]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="space-y-6"
    >
      <PageHeader title="Sorteos" />

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4"
      >
        <div className="flex items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            />
            <input
              type="text"
              placeholder="Buscar sorteo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
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
          <span className="text-sm text-[#999999] whitespace-nowrap">
            {filtered.length} sorteo{filtered.length !== 1 ? "s" : ""}
          </span>
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
          pageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyMessage="No se encontraron sorteos"
        />
      </motion.div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            key="delete-dialog"
            isOpen={!!deleteTarget}
            title="Confirmar accion"
            message={`Estas seguro de que deseas eliminar el sorteo "${deleteTarget.name}"?`}
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
