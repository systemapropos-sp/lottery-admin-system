import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const tabs = [
  "General",
  "Configuracion",
  "Pies de pagina",
  "Premios & Comisiones",
  "Horarios de sorteos",
  "Sorteos",
  "Gastos automaticos",
];

interface FormData {
  nombre: string;
  nombreUsuario: string;
  contrasena: string;
  confirmacion: string;
  numero: string;
  ubicacion: string;
  referencia: string;
  comentario: string;
}

export default function CrearBanca() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    nombreUsuario: "",
    contrasena: "",
    confirmacion: "",
    numero: "",
    ubicacion: "",
    referencia: "",
    comentario: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    alert("Banca creada exitosamente!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Crear Banca" subtitle="Complete el formulario para registrar una nueva banca" />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#E5E5E0] overflow-x-auto">
          <div className="flex">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === idx
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="p-5"
          >
            {activeTab === 0 && (
              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => updateField("nombre", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                      placeholder="Nombre de la banca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Nombre de usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombreUsuario}
                      onChange={(e) => updateField("nombreUsuario", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                      placeholder="mrXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Contrasena <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.contrasena}
                      onChange={(e) => updateField("contrasena", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Confirmacion <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmacion}
                      onChange={(e) => updateField("confirmacion", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Numero <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.numero}
                      onChange={(e) => updateField("numero", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                      placeholder="Numero de banca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">Ubicacion</label>
                    <input
                      type="text"
                      value={formData.ubicacion}
                      onChange={(e) => updateField("ubicacion", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                      placeholder="Direccion fisica"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">Referencia</label>
                    <input
                      type="text"
                      value={formData.referencia}
                      onChange={(e) => updateField("referencia", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] font-mono"
                      placeholder="MWR-XXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">Comentario</label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => updateField("comentario", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] resize-none"
                    placeholder="Notas adicionales..."
                  />
                </div>

                {/* Copiar de banca plantilla */}
                <div className="border-t border-[#E5E5E0] pt-5">
                  <h3 className="text-sm font-semibold text-[#333333] mb-3">
                    Copiar de banca plantilla
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {bettingPools.map((bp) => (
                      <label
                        key={bp.id}
                        onClick={() =>
                          setSelectedTemplate(
                            selectedTemplate === bp.id ? null : bp.id
                          )
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${
                          selectedTemplate === bp.id
                            ? "bg-[#F0F8F7] border-[#4ECDC4]"
                            : "bg-white border-[#E5E5E0] hover:bg-[#FAFAF8]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selectedTemplate === bp.id
                              ? "bg-[#4ECDC4] border-[#4ECDC4]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedTemplate === bp.id && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-sm text-[#333333] truncate">{bp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-4 max-w-lg">
                <h3 className="text-sm font-semibold text-[#333333]">Configuracion general</h3>
                {[
                  "Balance de desactivacion",
                  "Limite de venta diaria",
                  "Imprimir copia",
                  "Control tickets ganadores",
                  "Usar premios normalizados",
                  "Permitir pasar bote",
                ].map((label) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#F0F0EB]">
                    <span className="text-sm text-[#333333]">{label}</span>
                    <Toggle />
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm text-[#666666] mb-1">Minutos para cancelar</label>
                    <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666666] mb-1">Tickets a cancelar</label>
                    <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#666666] mb-1">Idioma</label>
                    <select className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm">
                      <option>Espanol</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#666666] mb-1">Modo impresion</label>
                    <select className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm">
                      <option>Normal</option>
                      <option>Silenciosa</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 max-w-lg">
                <h3 className="text-sm font-semibold text-[#333333]">Pies de pagina</h3>
                {["Pie de pagina ticket", "Pie de pagina web", "Pie de pagina movil", "Mensaje de agradecimiento"].map((label) => (
                  <div key={label}>
                    <label className="block text-sm text-[#666666] mb-1">{label}</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] resize-none"
                      placeholder={`Texto de ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#333333]">Premios & Comisiones</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Quiniela", "Pale", "Tripleta", "Super Pale", "Combo"].map((tipo) => (
                    <div key={tipo} className="bg-[#FAFAF8] rounded-lg p-3 border border-[#E5E5E0]">
                      <label className="block text-sm font-medium text-[#333333] mb-1">{tipo}</label>
                      <input
                        type="number"
                        defaultValue={85}
                        className="w-full px-2 py-1.5 border border-[#E5E5E0] rounded text-sm font-mono"
                      />
                      <span className="text-xs text-[#999999] mt-1 block">Multiplicador</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#333333]">Horarios de sorteos</h3>
                <p className="text-sm text-[#999999]">Configure los horarios de cierre para cada sorteo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["Anguila 10AM", "Anguila 1PM", "Anguila 6PM", "Anguila 9PM", "LA PRIMERA", "LOTEDOM", "LA SUERTE", "LOTEKA"].map((s) => (
                    <div key={s} className="flex items-center justify-between py-2 px-3 bg-[#FAFAF8] rounded-lg border border-[#E5E5E0]">
                      <span className="text-sm text-[#333333]">{s}</span>
                      <input type="time" defaultValue="09:30" className="px-2 py-1 border border-[#E5E5E0] rounded text-sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#333333]">Sorteos asociados</h3>
                <p className="text-sm text-[#999999]">Seleccione los sorteos disponibles para esta banca.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {[
                    "Anguila 10AM", "Anguila 1PM", "Anguila 6PM", "Anguila 9PM",
                    "LA PRIMERA", "LOTEDOM", "LA SUERTE", "King Lottery AM",
                    "King Lottery PM", "QUINIELA REAL", "FLORIDA AM", "FLORIDA PM",
                    "NEW YORK AM", "NEW YORK PM", "LOTEKA", "NACIONAL",
                    "GANA MAS", "Loteca", "Leidsa", "Real",
                  ].map((lot) => (
                    <label key={lot} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E0] hover:bg-[#FAFAF8] cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#4ECDC4] focus:ring-[#4ECDC4]" />
                      <span className="text-sm text-[#333333]">{lot}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#333333]">Gastos automaticos</h3>
                <p className="text-sm text-[#999999]">Configure los gastos que se aplican automaticamente a esta banca.</p>
                <div className="space-y-3 max-w-lg">
                  {[
                    { name: "Gasto administrativo", amount: 0, active: true },
                    { name: "Gasto por venta", amount: 0, active: false },
                    { name: "Gasto por ticket", amount: 0, active: false },
                    { name: "Comision bancaria", amount: 0, active: false },
                  ].map((gasto) => (
                    <div key={gasto.name} className="flex items-center justify-between py-2 px-3 bg-[#FAFAF8] rounded-lg border border-[#E5E5E0]">
                      <div className="flex items-center gap-3">
                        <Toggle />
                        <span className="text-sm text-[#333333]">{gasto.name}</span>
                      </div>
                      <input
                        type="number"
                        defaultValue={gasto.amount}
                        className="w-24 px-2 py-1 border border-[#E5E5E0] rounded text-sm font-mono text-right"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-[#4ECDC4] text-white rounded-full text-sm font-medium hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
        >
          Crear
        </button>
      </div>
    </motion.div>
  );
}

function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-200 ${
        on ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
