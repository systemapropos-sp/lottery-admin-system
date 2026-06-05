import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { expenseCategories } from "@/data/mockData";

interface CategoriaRow {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: string;
  color: string;
}

export default function CategoriasGastos() {
  const [data, setData] = useState<CategoriaRow[]>(() =>
    expenseCategories.map((c) => ({
      id: c.id,
      nombre: c.name,
      codigo: c.id.replace("exp-", "CAT-"),
      descripcion: c.description,
      estado: c.isActive ? "Activo" : "Inactivo",
      color: c.color,
    }))
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formCodigo, setFormCodigo] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formColor, setFormColor] = useState("#4ECDC4");
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((d) => d.nombre.toLowerCase().includes(search.toLowerCase()) || d.codigo.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const columns: Column<CategoriaRow>[] = [
    {
      key: "color",
      header: "",
      accessor: () => "",
      align: "center",
      width: "50px",
      cell: (r) => <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: r.color }} />,
    },
    { key: "nombre", header: "Nombre", accessor: (r) => r.nombre, sortable: true },
    { key: "codigo", header: "Codigo", accessor: (r) => r.codigo, sortable: true },
    { key: "descripcion", header: "Descripcion", accessor: (r) => r.descripcion, sortable: false },
    {
      key: "estado",
      header: "Estado",
      accessor: (r) => r.estado,
      sortable: true,
      cell: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.estado === "Activo" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#E5E7EB] text-[#374151]"}`}>
          {r.estado}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-md text-[#666666] hover:bg-[rgba(78,205,196,0.1)] hover:text-[#4ECDC4] transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => { setSelectedId(r.id); setShowDelete(true); }}
            className="p-1.5 rounded-md text-[#666666] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-colors"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  function openEdit(row: CategoriaRow) {
    setSelectedId(row.id);
    setFormNombre(row.nombre);
    setFormCodigo(row.codigo);
    setFormDescripcion(row.descripcion);
    setFormColor(row.color);
    setShowEdit(true);
  }

  function resetForm() {
    setFormNombre("");
    setFormCodigo("");
    setFormDescripcion("");
    setFormColor("#4ECDC4");
    setSelectedId(null);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newRow: CategoriaRow = {
      id: `exp-${String(data.length + 1).padStart(3, "0")}`,
      nombre: formNombre,
      codigo: formCodigo || `CAT-${String(data.length + 1).padStart(3, "0")}`,
      descripcion: formDescripcion,
      estado: "Activo",
      color: formColor,
    };
    setData((prev) => [...prev, newRow]);
    setShowCreate(false);
    resetForm();
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    setData((prev) =>
      prev.map((r) =>
        r.id === selectedId
          ? { ...r, nombre: formNombre, codigo: formCodigo, descripcion: formDescripcion, color: formColor }
          : r
      )
    );
    setShowEdit(false);
    resetForm();
  }

  function handleDelete() {
    if (!selectedId) return;
    setData((prev) => prev.filter((r) => r.id !== selectedId));
    setShowDelete(false);
    resetForm();
  }

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader
        title="Categorias de Gastos"
        subtitle="Administrar categorias para clasificacion de transacciones"
        actions={
          <button
            onClick={() => { resetForm(); setShowCreate(true); }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            Crear categoria
          </button>
        }
      />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex items-center gap-3">
          <Tag size={16} className="text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o codigo..."
            className="flex-1 text-sm bg-transparent outline-none text-[#333333] placeholder:text-[#999999]"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <DataTable columns={columns} data={filteredData} keyExtractor={(r) => r.id} pageSize={10} />
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setShowCreate(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[480px] w-[calc(100%-2rem)] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-3">
                <h3 className="text-lg font-semibold text-[#333333]">Nueva Categoria</h3>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Nombre</label>
                  <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} required placeholder="Ej. Premios" className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Codigo</label>
                  <input type="text" value={formCodigo} onChange={(e) => setFormCodigo(e.target.value)} placeholder="CAT-XXX" className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Descripcion</label>
                  <textarea value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} rows={3} placeholder="Descripcion de la categoria..." className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[#E5E5E0] cursor-pointer" />
                    <span className="text-sm text-[#666666]">{formColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Crear
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setShowEdit(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[480px] w-[calc(100%-2rem)] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-3">
                <h3 className="text-lg font-semibold text-[#333333]">Editar Categoria</h3>
                <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEdit} className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Nombre</label>
                  <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} required className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Codigo</label>
                  <input type="text" value={formCodigo} onChange={(e) => setFormCodigo(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Descripcion</label>
                  <textarea value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[#E5E5E0] cursor-pointer" />
                    <span className="text-sm text-[#666666]">{formColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Eliminar categoria"
        message="Estas seguro de que deseas eliminar esta categoria?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => { setShowDelete(false); setSelectedId(null); }}
      />
    </div>
  );
}
