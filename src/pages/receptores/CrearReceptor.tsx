import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Check } from "lucide-react";

const availableZones = ["Default", "SFM"];

const availableEmailTypes = [
  "Reportes diarios",
  "Alertas de seguridad",
  "Resultados",
  "Reportes de ventas",
  "Notificaciones de sistema",
  "Resumen semanal",
];

export default function CrearReceptor() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/mail-receptors");
  };

  const isValid =
    email.trim() && email.includes("@") && selectedZones.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/mail-receptors")}
          className="p-2 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[#F5F5F0] transition-colors"
          title="Volver"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Crear Receptor</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Configure un nuevo receptor de correo electronico
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Correo electronico <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: admin@lottery.com"
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            />
          </div>

          {/* Zones */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Zonas <span className="text-[#EF4444]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableZones.map((zone) => {
                const isSelected = selectedZones.includes(zone);
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      isSelected
                        ? "border-[#4ECDC4] bg-[#E0F7F5] text-[#0F766E]"
                        : "border-[#E5E5E0] bg-white text-[#666666] hover:border-[#CCCCCC]"
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {zone}
                  </button>
                );
              })}
            </div>
            {selectedZones.length === 0 && (
              <p className="text-xs text-[#999999] mt-1.5">
                Seleccione al menos una zona
              </p>
            )}
          </div>

          {/* Email Types */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Tipos de correo
            </label>
            <div className="flex flex-wrap gap-2">
              {availableEmailTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      isSelected
                        ? "border-[#4ECDC4] bg-[#E0F7F5] text-[#0F766E]"
                        : "border-[#E5E5E0] bg-white text-[#666666] hover:border-[#CCCCCC]"
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {type}
                  </button>
                );
              })}
            </div>
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
              onClick={() => navigate("/mail-receptors")}
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
