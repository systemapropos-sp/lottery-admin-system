import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Lock,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useZonasStore } from "@/store/zonasStore";
import { useCobradoresStore } from "@/store/cobradoresStore";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Field Component ─────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#555555] uppercase tracking-wide">
        <Icon size={12} className="text-[#14B8A6]" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 border border-[#E5E5E0] rounded-lg text-sm text-[#333333] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[rgba(20,184,166,0.12)] transition-all bg-white placeholder:text-[#BBBBBB]";

// ─── Component ────────────────────────────────────────────────────────────────

export default function CrearCobrador() {
  const navigate = useNavigate();
  const { zonas, fetchZonas } = useZonasStore();
  const { createCobrador } = useCobradoresStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    zona_id: "",
    pin: "",
    confirmPin: "",
    notes: "",
    status: "activo",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchZonas();
  }, [fetchZonas]);

  const activeZones = zonas.filter((z) => z.is_active);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.pin !== form.confirmPin) {
      setErrorMsg("Los PINs no coinciden");
      return;
    }
    setErrorMsg("");
    setSaving(true);

    const selectedZona = activeZones.find((z) => z.id === form.zona_id);
    const notesExtra = form.email ? `Email: ${form.email}${form.notes ? " | " + form.notes : ""}` : form.notes;

    const result = await createCobrador({
      name: form.name,
      pin: form.pin,
      phone: form.phone,
      notes: notesExtra,
      zona_id: form.zona_id || null,
      zona_nombre: selectedZona?.nombre ?? null,
    });

    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => navigate("/cobradores/lista"), 1200);
    } else {
      setErrorMsg(result.error ?? "Error al guardar");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5 max-w-3xl"
    >
      <PageHeader
        title="Crear Cobrador"
        subtitle="Registrar un nuevo cobrador en el sistema"
        actions={
          <button
            onClick={() => navigate("/cobradores/lista")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] hover:text-[#333333] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
          >
            <ArrowLeft size={14} />
            Volver a lista
          </button>
        }
      />

      <form onSubmit={handleSave}>
        {/* ── Personal Info ── */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-[#F0F0EC] bg-[#FAFAF8]">
            <h3 className="text-[13px] font-semibold text-[#333333]">Información Personal</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre completo" icon={User} required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Pedro González"
                className={inputCls}
                required
              />
            </Field>

            <Field label="Teléfono" icon={Phone} required>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="809-555-0000"
                className={inputCls}
                type="tel"
                required
              />
            </Field>

            <Field label="Correo electrónico" icon={Mail}>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cobrador@nmv.com"
                className={inputCls}
                type="email"
              />
            </Field>
          </div>
        </div>

        {/* ── Zone & Access ── */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-[#F0F0EC] bg-[#FAFAF8]">
            <h3 className="text-[13px] font-semibold text-[#333333]">Zona y Acceso</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Zona asignada" icon={MapPin}>
              <select
                name="zona_id"
                value={form.zona_id}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Sin zona asignada</option>
                {activeZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estado" icon={AlertCircle}>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </Field>

            <Field label="PIN de acceso" icon={Lock} required>
              <input
                name="pin"
                value={form.pin}
                onChange={handleChange}
                placeholder="PIN numérico (4-6 dígitos)"
                className={inputCls}
                type="password"
                maxLength={6}
                required
              />
            </Field>

            <Field label="Confirmar PIN" icon={Lock} required>
              <input
                name="confirmPin"
                value={form.confirmPin}
                onChange={handleChange}
                placeholder="Repetir PIN"
                className={inputCls}
                type="password"
                maxLength={6}
                required
              />
              {form.pin && form.confirmPin && form.pin !== form.confirmPin && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  Los PINs no coinciden
                </p>
              )}
            </Field>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-[#F0F0EC] bg-[#FAFAF8]">
            <h3 className="text-[13px] font-semibold text-[#333333]">Notas adicionales</h3>
          </div>
          <div className="p-5">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Observaciones o notas sobre el cobrador..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* ── Error Message ── */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mb-5">
            <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* ── Info Banner ── */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5">
          <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-amber-700 leading-relaxed">
            Este cobrador se integrará con el portal{" "}
            <strong>cobrador.nmvapp.com</strong> una vez que el portal esté disponible. El PIN se
            usará para autenticación en dicho portal.
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/cobradores/lista")}
            className="px-4 py-2.5 text-sm text-[#666666] hover:text-[#333333] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || saved}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-70"
            style={{
              background: saved
                ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                : "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)",
            }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>✔ Guardado</>
            ) : (
              <>
                <Save size={14} />
                Guardar Cobrador
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
