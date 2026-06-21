import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/ui/PageHeader";
import { useZonasStore } from "@/store/zonasStore";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrearZona() {
  const navigate = useNavigate();
  const { createZona } = useZonasStore();
  const { refetch } = useBancasZonas();

  const [nombre, setNombre]       = useState("");
  const [descripcion, setDesc]    = useState("");
  const [errors, setErrors]       = useState<{ nombre?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [errMsg, setErrMsg]       = useState("");

  function validate(): boolean {
    const newErrors: { nombre?: string } = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrMsg("");

    const res = await createZona({
      nombre:      nombre.trim(),
      descripcion: descripcion.trim(),
      is_active:   true,
    });

    if (!res.ok) {
      setErrMsg(res.error ?? "Error al crear la zona");
      setIsSubmitting(false);
      return;
    }

    // Refresh the global context so the list updates
    await refetch();

    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate("/zones"), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="space-y-6 max-w-lg"
    >
      <PageHeader title="Crear Zona" />

      {/* Back link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate("/zones")}
        className="flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#4ECDC4] transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Zonas
      </motion.button>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
      >
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="w-12 h-12 rounded-full bg-[#22C55E] text-white flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 size={24} />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#333333] mb-1">
              Zona creada exitosamente
            </h3>
            <p className="text-sm text-[#666666]">
              Redirigiendo a la lista de zonas...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error message */}
            {errMsg && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errMsg}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="nombre" className="block text-sm font-medium text-[#333333]">
                Nombre <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) setErrors((p) => ({ ...p, nombre: undefined }));
                }}
                placeholder="Ej: Bronx, Manhattan, Norte..."
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all ${
                  errors.nombre
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-[#E5E5E0] focus:border-[#4ECDC4]"
                }`}
              />
              {errors.nombre && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[#EF4444]">
                  {errors.nombre}
                </motion.p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label htmlFor="descripcion" className="block text-sm font-medium text-[#333333]">
                Descripción <span className="text-[#999999] font-normal">(opcional)</span>
              </label>
              <input
                id="descripcion"
                type="text"
                value={descripcion}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Ej: Zona Norte de la ciudad"
                className="w-full px-4 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Plus size={15} />
              )}
              Crear Zona
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
