import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/ui/PageHeader";

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrearZona() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [errors, setErrors] = useState<{ nombre?: string; codigo?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const newErrors: { nombre?: string; codigo?: string } = {};
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!codigo.trim()) {
      newErrors.codigo = "El codigo es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Redirect after success
      setTimeout(() => {
        navigate("/zones");
      }, 1200);
    }, 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
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
              <Plus size={24} />
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
            {/* Nombre */}
            <div className="space-y-1.5">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-[#333333]"
              >
                Nombre <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre)
                    setErrors((prev) => ({ ...prev, nombre: undefined }));
                }}
                placeholder="Ej: Norte, Sur, SFM..."
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all ${
                  errors.nombre
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-[#E5E5E0] focus:border-[#4ECDC4]"
                }`}
              />
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#EF4444]"
                >
                  {errors.nombre}
                </motion.p>
              )}
            </div>

            {/* Codigo */}
            <div className="space-y-1.5">
              <label
                htmlFor="codigo"
                className="block text-sm font-medium text-[#333333]"
              >
                Codigo <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  if (errors.codigo)
                    setErrors((prev) => ({ ...prev, codigo: undefined }));
                }}
                placeholder="Ej: ZN-001"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all ${
                  errors.codigo
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-[#E5E5E0] focus:border-[#4ECDC4]"
                }`}
              />
              {errors.codigo && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#EF4444]"
                >
                  {errors.codigo}
                </motion.p>
              )}
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
              Crear
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
