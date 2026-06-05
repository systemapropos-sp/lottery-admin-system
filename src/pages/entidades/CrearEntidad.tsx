import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Plus } from "lucide-react";

const entityTypes = [
  { value: "", label: "Seleccionar tipo..." },
  { value: "banca", label: "Banca" },
  { value: "empleado", label: "Empleado" },
  { value: "banco", label: "Banco" },
  { value: "zona", label: "Zona" },
  { value: "otro", label: "Otro" },
];

export default function CrearEntidad() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [balance, setBalance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: just navigate back
    navigate("/accountable-entities");
  };

  const isValid = tipo && nombre.trim() && codigo.trim() && balance.trim();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/accountable-entities")}
          className="p-2 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[#F5F5F0] transition-colors"
          title="Volver"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Crear Entidad</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Complete los datos de la nueva entidad contable
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Tipo <span className="text-[#EF4444]">*</span>
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            >
              {entityTypes.map((et) => (
                <option key={et.value} value={et.value}>
                  {et.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Nombre <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: MATADOR-SPORT"
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            />
          </div>

          {/* Codigo */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Codigo <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: MWR-0001"
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            />
          </div>

          {/* Balance Inicial */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Balance inicial <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Plus size={16} />
              Crear
            </button>
            <button
              type="button"
              onClick={() => navigate("/accountable-entities")}
              className="px-5 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
