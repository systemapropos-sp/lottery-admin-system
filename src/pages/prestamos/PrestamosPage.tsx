import { useState } from "react";
import { useLocation } from "react-router";
import { Plus, Pencil, Trash2, Search, HandCoins, CircleDollarSign, ArrowDownCircle, ArrowUpCircle, X } from "lucide-react";
// ─── Bancas locales (sin mockData) ───────────────────────────────────────────
const bettingPools = [
  {id:"b01",name:"NMV RD 01",code:"NMV-0001",isActive:true},
  {id:"b02",name:"NMV RD 02",code:"NMV-0002",isActive:true},
  {id:"b03",name:"NMV RD 03",code:"NMV-0003",isActive:true},
  {id:"b04",name:"NMV RD 04",code:"NMV-0004",isActive:true},
  {id:"b05",name:"NMV RD 05",code:"NMV-0005",isActive:true},
  {id:"b06",name:"NMV RD 06",code:"NMV-0006",isActive:true},
  {id:"b07",name:"NMV RD 07",code:"NMV-0007",isActive:false},
  {id:"b08",name:"NMV RD 08",code:"NMV-0008",isActive:true},
  {id:"b09",name:"NMV RD 09",code:"NMV-0009",isActive:true},
  {id:"b10",name:"NMV RD 10",code:"NMV-0010",isActive:true},
  {id:"b11",name:"NMV RD 11",code:"NMV-0011",isActive:true},
  {id:"b12",name:"NMV RD 12",code:"NMV-0012",isActive:true},
  {id:"b13",name:"NMV RD 13",code:"NMV-0013",isActive:false},
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Prestamo {
  id: string;
  bancaId: string;
  bancaNombre: string;
  monto: number;
  saldo: number;
  tipo: "efectivo" | "comision";
  estado: "activo" | "pagado" | "mora";
  fecha: string;
  notas?: string;
}

interface Abono {
  id: string;
  prestamoId: string;
  monto: number;
  tipo: "efectivo" | "comision";
  fecha: string;
  notas?: string;
}

// ─── Nueva Modal Préstamo ─────────────────────────────────────────────────────

function PrestamoModal({
  onSave, onClose, editPrestamo,
}: {
  onSave: (p: Prestamo) => void;
  onClose: () => void;
  editPrestamo?: Prestamo;
}) {
  const [form, setForm] = useState({
    bancaId: editPrestamo?.bancaId ?? bettingPools[0]?.id ?? "",
    monto: editPrestamo?.monto ?? 0,
    tipo: editPrestamo?.tipo ?? "efectivo" as "efectivo" | "comision",
    notas: editPrestamo?.notas ?? "",
    fecha: editPrestamo?.fecha ?? new Date().toISOString().split("T")[0],
  });

  const selectedBanca = bettingPools.find((b) => b.id === form.bancaId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{editPrestamo ? "Editar Préstamo" : "Nuevo Préstamo"}</h3>
            <p className="text-sm text-gray-500 mt-0.5">Préstamo a una banca</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banca</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.bancaId}
              onChange={(e) => setForm({ ...form, bancaId: e.target.value })}
            >
              {bettingPools.map((b) => (
                <option key={b.id} value={b.id}>{b.code} — {b.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (RD$)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cobro</label>
            <div className="flex gap-3">
              {(["efectivo", "comision"] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setForm({ ...form, tipo })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.tipo === tipo
                      ? "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tipo === "efectivo" ? "💵 Efectivo" : "💳 Comisión"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() =>
              onSave({
                id: editPrestamo?.id ?? `loan-${Date.now()}`,
                bancaId: form.bancaId,
                bancaNombre: selectedBanca ? `${selectedBanca.code} — ${selectedBanca.name}` : form.bancaId,
                monto: form.monto,
                saldo: editPrestamo?.saldo ?? form.monto,
                tipo: form.tipo,
                estado: editPrestamo?.estado ?? "activo",
                fecha: form.fecha,
                notas: form.notas,
              })
            }
            className="px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Abono Modal ──────────────────────────────────────────────────────────────

function AbonoModal({
  prestamos, onSave, onClose,
}: {
  prestamos: Prestamo[];
  onSave: (a: Abono, prestamoId: string, abonado: number) => void;
  onClose: () => void;
}) {
  const activos = prestamos.filter((p) => p.estado === "activo");
  const [form, setForm] = useState({
    prestamoId: activos[0]?.id ?? "",
    monto: 0,
    tipo: "efectivo" as "efectivo" | "comision",
    notas: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const selectedLoan = activos.find((p) => p.id === form.prestamoId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Registrar Abono</h3>
            <p className="text-sm text-gray-500 mt-0.5">Abono a un préstamo activo</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {activos.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay préstamos activos</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Préstamo</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={form.prestamoId}
                  onChange={(e) => setForm({ ...form, prestamoId: e.target.value })}
                >
                  {activos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.bancaNombre} — Saldo: ${p.saldo.toLocaleString("es-DO")}
                    </option>
                  ))}
                </select>
              </div>
              {selectedLoan && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <span className="text-amber-700 font-medium">Saldo pendiente: </span>
                  <span className="text-amber-800 font-bold">${selectedLoan.saldo.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto abono (RD$)</label>
                  <input
                    type="number"
                    max={selectedLoan?.saldo}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={form.monto}
                    onChange={(e) => setForm({ ...form, monto: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pago</label>
                <div className="flex gap-3">
                  {(["efectivo", "comision"] as const).map((tipo) => (
                    <button key={tipo} onClick={() => setForm({ ...form, tipo })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.tipo === tipo ? "border-teal-400 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}>
                      {tipo === "efectivo" ? "💵 Efectivo" : "💳 Comisión"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          {activos.length > 0 && (
            <button
              onClick={() => onSave({ id: `abono-${Date.now()}`, prestamoId: form.prestamoId, monto: form.monto, tipo: form.tipo, fecha: form.fecha, notas: form.notas }, form.prestamoId, form.monto)}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}
            >Registrar Abono</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ estado }: { estado: Prestamo["estado"] }) {
  const map = {
    activo: "bg-teal-100 text-teal-700",
    pagado: "bg-green-100 text-green-700",
    mora: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${map[estado]}`}>
      {estado}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PrestamosPage() {
  const location = useLocation();
  const sub = location.pathname.split("/").pop()!;

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState<"prestamo" | "abono" | null>(null);
  const [editPrestamo, setEditPrestamo] = useState<Prestamo | undefined>();

  const handleSavePrestamo = (p: Prestamo) => {
    setPrestamos((prev) =>
      prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]
    );
    setShowModal(null);
    setEditPrestamo(undefined);
  };

  const handleSaveAbono = (a: Abono, prestamoId: string, abonado: number) => {
    setAbonos((prev) => [...prev, a]);
    setPrestamos((prev) =>
      prev.map((p) => {
        if (p.id !== prestamoId) return p;
        const nuevoSaldo = p.saldo - abonado;
        return { ...p, saldo: Math.max(0, nuevoSaldo), estado: nuevoSaldo <= 0 ? "pagado" : p.estado };
      })
    );
    setShowModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este préstamo?")) setPrestamos((prev) => prev.filter((p) => p.id !== id));
  };

  const totalPendiente = prestamos.filter((p) => p.estado === "activo").reduce((s, p) => s + p.saldo, 0);
  const totalPrestado = prestamos.reduce((s, p) => s + p.monto, 0);
  const totalPagado = prestamos.filter((p) => p.estado === "pagado").reduce((s, p) => s + p.monto, 0);

  // Filter by sub-page
  const visiblePrestamos = prestamos.filter((p) => {
    if (sub === "abonos") return abonos.some((a) => a.prestamoId === p.id);
    if (sub === "cobros") return p.estado === "activo";
    return p.bancaNombre.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
            <HandCoins size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sub === "nuevo" ? "Nuevo Préstamo"
                : sub === "abonos" ? "Historial de Abonos"
                : sub === "cobros" ? "Cobros Pendientes"
                : "Préstamos a Bancas"}
            </h1>
            <p className="text-gray-500 text-sm">{prestamos.length} préstamos registrados</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal("abono")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
          >
            <ArrowDownCircle size={15} />
            Registrar Abono
          </button>
          <button
            onClick={() => { setEditPrestamo(undefined); setShowModal("prestamo"); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl shadow-sm"
            style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}
          >
            <Plus size={15} />
            Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CircleDollarSign size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-500">Total Prestado</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalPrestado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpCircle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-gray-500">Saldo Pendiente</span>
          </div>
          <p className="text-2xl font-bold text-red-600">${totalPendiente.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownCircle size={16} className="text-green-500" />
            <span className="text-sm font-medium text-gray-500">Recuperado</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${totalPagado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Buscar por banca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {prestamos.length === 0 ? (
          <div className="p-12 text-center">
            <HandCoins size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No hay préstamos registrados</p>
            <p className="text-gray-400 text-sm mt-1">Crea el primer préstamo con el botón "Nuevo Préstamo"</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Banca</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Fecha</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Monto Original</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Saldo Pendiente</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Tipo Cobro</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visiblePrestamos.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{p.bancaNombre}</div>
                    {p.notas && <div className="text-xs text-gray-400 mt-0.5">{p.notas}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.fecha}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-700">
                    ${p.monto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">
                    ${p.saldo.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 capitalize">
                      {p.tipo === "efectivo" ? "💵 Efectivo" : "💳 Comisión"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge estado={p.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setEditPrestamo(p); setShowModal("prestamo"); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showModal === "prestamo" && (
        <PrestamoModal onSave={handleSavePrestamo} onClose={() => { setShowModal(null); setEditPrestamo(undefined); }} editPrestamo={editPrestamo} />
      )}
      {showModal === "abono" && (
        <AbonoModal prestamos={prestamos} onSave={handleSaveAbono} onClose={() => setShowModal(null)} />
      )}
    </div>
  );
}
