import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, PlusCircle, UserPlus, Users, ArrowDownCircle,
  CreditCard, XCircle, Ticket, Trophy, BarChart3,
  Building2, ChevronDown, Check, Loader2, CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase, BUSINESS_ID } from "@/lib/supabase";
import { useBancasZonas } from "@/context/BancasZonasContext";
import type { Banca } from "@/store/bancasStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NmvClient {
  id: string;
  full_name: string;
  phone: string;
  balance: number;
  is_active: boolean;
  code: string;
  banca_code: string;
}

interface MovilTicket {
  id: string;
  ticket_number: string;
  client_code: string;
  amount: number;
  plays: { numbers: string; type: string; lotteryName: string; amount: number }[];
  status: string;
  created_at: string;
}

type Section =
  | "ver-todo" | "crear-ticket" | "crear-cliente" | "lista-clientes"
  | "retiro" | "recargas" | "cancelar-recarga" | "tickets" | "premios" | "ver-reporte";

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const show = useCallback((text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }, []);
  return { msg, show };
}

function Toast({ msg }: { msg: { text: string; ok: boolean } | null }) {
  if (!msg) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold
        ${msg.ok ? "bg-teal-600" : "bg-red-500"}`}>
      {msg.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg.text}
    </motion.div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({ icon: Icon, iconColor, title, banca, children }: {
  icon: React.ElementType; iconColor: string; title: string;
  banca: Banca; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E0] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0F0EF]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: iconColor + "18" }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
          <p className="text-xs text-[#999]">{banca.name} · {banca.code}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

const inputCls = "w-full border border-[#E5E5E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 transition-colors bg-white";

// ─── 1. VER TODO ─────────────────────────────────────────────────────────────

function VerTodo({ banca, onSection }: { banca: Banca; onSection: (s: Section) => void }) {
  const items = [
    { section: "crear-cliente" as Section, label: "Crear cliente",    icon: UserPlus,       color: "#0D9488" },
    { section: "lista-clientes" as Section, label: "Lista de clientes", icon: Users,          color: "#0891B2" },
    { section: "retiro" as Section, label: "Retiro",           icon: ArrowDownCircle, color: "#f59e0b" },
    { section: "recargas" as Section, label: "Recargas",         icon: CreditCard,     color: "#10b981" },
    { section: "cancelar-recarga" as Section, label: "Cancelar recarga", icon: XCircle,    color: "#ef4444" },
    { section: "tickets" as Section, label: "Tickets",          icon: Ticket,         color: "#8b5cf6" },
    { section: "premios" as Section, label: "Premios",          icon: Trophy,         color: "#f59e0b" },
    { section: "ver-reporte" as Section, label: "Ver reporte",   icon: BarChart3,      color: "#64748b" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E0] p-6">
      <p className="text-sm font-semibold text-teal-600 mb-4">Banca: {banca.name}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(i => (
          <button key={i.section} onClick={() => onSection(i.section)}
            className="bg-[#F9F9F8] hover:bg-white border border-[#E5E5E0] rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: i.color + "18" }}>
              <i.icon size={20} style={{ color: i.color }} />
            </div>
            <span className="text-xs font-semibold text-[#444]">{i.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 2. CREAR CLIENTE ────────────────────────────────────────────────────────

function CrearCliente({ banca }: { banca: Banca }) {
  const { msg, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", pin: "", balance: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.first_name || !form.phone || !form.pin) { show("Nombre, teléfono y PIN son requeridos", false); return; }
    if (form.pin.length !== 4 || !/^\d+$/.test(form.pin)) { show("PIN debe ser exactamente 4 dígitos", false); return; }
    setLoading(true);
    const full_name = `${form.first_name.trim()} ${form.last_name.trim()}`.trim();
    const code = `C${Date.now().toString().slice(-6)}`;
    const username = form.first_name.toLowerCase().replace(/\s+/g, "") + code.slice(-4);
    const initialBalance = parseFloat(form.balance) || 0;
    const { error } = await supabase.from("nmv_clients").insert({
      username, full_name, phone: form.phone.trim(),
      pin: form.pin, banca_code: banca.code,
      balance: initialBalance, code, business_id: BUSINESS_ID, is_active: true,
    });
    setLoading(false);
    if (error) { show(`Error: ${error.message}`, false); return; }
    show(`✅ Cliente "${full_name}" creado`);
    setForm({ first_name: "", last_name: "", phone: "", email: "", pin: "", balance: "" });
  };

  return (
    <>
      <Toast msg={msg} />
      <SectionCard icon={UserPlus} iconColor="#0D9488" title="Crear cliente" banca={banca}>
        <p className="text-xs font-semibold text-teal-600 mb-4">● Banca: {banca.name}</p>
        <div className="grid grid-cols-2 gap-4 mb-4 max-w-xl">
          {[
            { label: "Nombre *",   key: "first_name", placeholder: "Nombre del cliente" },
            { label: "Apellido",   key: "last_name",  placeholder: "Apellido" },
            { label: "Teléfono *", key: "phone",      placeholder: "+1 (809) 000-0000" },
            { label: "Email",      key: "email",      placeholder: "email@ejemplo.com" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{f.label}</label>
              <input className={inputCls} value={form[f.key as keyof typeof form]} onChange={set(f.key)} placeholder={f.placeholder} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">PIN (4 dígitos) *</label>
            <input className={inputCls} type="password" inputMode="numeric" maxLength={4} value={form.pin} onChange={set("pin")} placeholder="••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Balance inicial (RD$)</label>
            <input className={inputCls} type="number" min="0" step="0.01" value={form.balance} onChange={set("balance")} placeholder="0.00" />
          </div>
        </div>
        <div className="flex justify-end mt-6 max-w-xl">
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-bold disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
            Crear Cliente
          </button>
        </div>
      </SectionCard>
    </>
  );
}

// ─── 3. LISTA CLIENTES ────────────────────────────────────────────────────────

function ListaClientes({ banca }: { banca: Banca }) {
  const [clients, setClients] = useState<NmvClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("nmv_clients")
      .select("id,full_name,phone,balance,is_active,code,banca_code")
      .eq("banca_code", banca.code).eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setClients((data || []).map(r => ({ ...r, balance: parseFloat(r.balance ?? "0") })));
        setLoading(false);
      });
  }, [banca.code]);

  return (
    <SectionCard icon={Users} iconColor="#0891B2" title="Lista de clientes" banca={banca}>
      <p className="text-xs font-semibold text-teal-600 mb-4">Clientes de: {banca.name}</p>
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#999]"><Loader2 size={20} className="animate-spin mr-2" />Cargando...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10 text-[#999] text-sm">No hay clientes para esta banca</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E0]">
                {["ID","NOMBRE","TELÉFONO","BALANCE","ESTADO"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[11px] font-bold text-[#999] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-[#F9F9F8] hover:bg-[#F9F9F8]">
                  <td className="py-3 px-3 font-mono text-xs text-[#666]">{c.code}</td>
                  <td className="py-3 px-3 font-semibold text-[#1A1A1A]">{c.full_name}</td>
                  <td className="py-3 px-3 text-[#666]">{c.phone || "—"}</td>
                  <td className="py-3 px-3 font-bold text-teal-600">${c.balance.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${c.is_active ? "bg-green-100 text-green-700" : "bg-[#F0F0EF] text-[#999]"}`}>
                      {c.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

// ─── CLIENT SEARCH HELPER ─────────────────────────────────────────────────────

function useClientSearch(bancaCode: string) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<NmvClient | null>(null);
  const [searching, setSearching] = useState(false);
  const { msg, show } = useToast();

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    const { data } = await supabase.from("nmv_clients")
      .select("id,full_name,phone,balance,is_active,code,banca_code")
      .eq("banca_code", bancaCode).eq("business_id", BUSINESS_ID)
      .or(`code.ilike.%${q}%,full_name.ilike.%${q}%,username.ilike.%${q}%`)
      .limit(1);
    const client = data && data.length > 0 ? { ...data[0], balance: parseFloat(data[0].balance ?? "0") } : null;
    setFound(client);
    if (!client) show("Cliente no encontrado", false);
    setSearching(false);
  };

  return { query, setQuery, found, setFound, searching, search, searchMsg: msg, searchShow: show };
}

// ─── 4. RETIRO ────────────────────────────────────────────────────────────────

function Retiro({ banca }: { banca: Banca }) {
  const { msg, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const { query, setQuery, found, setFound, searching, search, searchMsg } = useClientSearch(banca.code);

  const handleSubmit = async () => {
    if (!found) { show("Busca un cliente primero", false); return; }
    const amt = parseFloat(monto);
    if (!amt || amt <= 0) { show("Monto inválido", false); return; }
    if (amt > found.balance) { show(`Saldo insuficiente: $${found.balance.toFixed(2)}`, false); return; }
    setLoading(true);
    const balAfter = found.balance - amt;
    await supabase.from("nmv_clients").update({ balance: balAfter, updated_at: new Date().toISOString() }).eq("id", found.id);
    await supabase.from("movil_transactions").insert({
      client_id: found.id, client_code: found.code, client_name: found.full_name,
      banca_code: banca.code, business_id: BUSINESS_ID,
      type: "retiro", amount: -amt, balance_before: found.balance, balance_after: balAfter,
      status: "completed", notes: concepto || `Retiro $${amt.toFixed(2)}`, created_by: "admin",
    });
    show(`✅ Retiro de $${amt.toFixed(2)} procesado`);
    setFound({ ...found, balance: balAfter });
    setMonto(""); setConcepto("");
    setLoading(false);
  };

  return (
    <>
      <Toast msg={msg} />
      <Toast msg={searchMsg} />
      <SectionCard icon={ArrowDownCircle} iconColor="#f59e0b" title="Retiro" banca={banca}>
        <p className="text-xs font-semibold text-teal-600 mb-4">Banca: {banca.name}</p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cliente</label>
            <div className="flex gap-2">
              <input className={inputCls} value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()} placeholder="ID o nombre del cliente" />
              <button onClick={search} disabled={searching}
                className="px-4 py-2 bg-[#F0F0EF] text-[#555] rounded-lg text-sm font-semibold hover:bg-[#E5E5E0] disabled:opacity-50">
                {searching ? <Loader2 size={14} className="animate-spin" /> : "Buscar"}
              </button>
            </div>
            {found && (
              <div className="mt-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm">
                <span className="font-bold text-teal-700">{found.full_name}</span>
                <span className="text-teal-500 ml-2">— Saldo: ${found.balance.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Monto</label>
            <input className={inputCls} type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" min="0.01" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Concepto</label>
            <input className={inputCls} value={concepto} onChange={e => setConcepto(e.target.value)} placeholder="Descripción del retiro" />
          </div>
          <div className="flex justify-center">
            <button onClick={handleSubmit} disabled={loading || !found}
              className="px-8 py-2.5 rounded-full text-white text-sm font-bold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              {loading ? <Loader2 size={15} className="animate-spin inline mr-1" /> : null}
              Procesar Retiro
            </button>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

// ─── 5. RECARGAS ──────────────────────────────────────────────────────────────

function Recargas({ banca }: { banca: Banca }) {
  const { msg, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const { query, setQuery, found, setFound, searching, search, searchMsg } = useClientSearch(banca.code);

  const handleSubmit = async () => {
    if (!found) { show("Busca un cliente primero", false); return; }
    const amt = parseFloat(monto);
    if (!amt || amt <= 0) { show("Monto inválido", false); return; }
    setLoading(true);
    const balAfter = found.balance + amt;
    await supabase.from("nmv_clients").update({ balance: balAfter, updated_at: new Date().toISOString() }).eq("id", found.id);
    await supabase.from("movil_transactions").insert({
      client_id: found.id, client_code: found.code, client_name: found.full_name,
      banca_code: banca.code, business_id: BUSINESS_ID,
      type: "recarga", amount: amt, balance_before: found.balance, balance_after: balAfter,
      status: "completed", notes: referencia ? `Ref: ${referencia}` : `Recarga $${amt.toFixed(2)}`, created_by: "admin",
    });
    show(`✅ Recarga de $${amt.toFixed(2)} aplicada a ${found.full_name}`);
    setFound({ ...found, balance: balAfter });
    setMonto(""); setReferencia("");
    setLoading(false);
  };

  return (
    <>
      <Toast msg={msg} />
      <Toast msg={searchMsg} />
      <SectionCard icon={CreditCard} iconColor="#10b981" title="Recargas" banca={banca}>
        <p className="text-xs font-semibold text-teal-600 mb-4">Banca: {banca.name}</p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cliente</label>
            <div className="flex gap-2">
              <input className={inputCls} value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()} placeholder="ID o nombre del cliente" />
              <button onClick={search} disabled={searching}
                className="px-4 py-2 bg-[#F0F0EF] text-[#555] rounded-lg text-sm font-semibold hover:bg-[#E5E5E0] disabled:opacity-50">
                {searching ? <Loader2 size={14} className="animate-spin" /> : "Buscar"}
              </button>
            </div>
            {found && (
              <div className="mt-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm">
                <span className="font-bold text-teal-700">{found.full_name}</span>
                <span className="text-teal-500 ml-2">— Saldo: ${found.balance.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Monto de Recarga</label>
            <input className={inputCls} type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" min="0.01" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Referencia</label>
            <input className={inputCls} value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Número de referencia (opcional)" />
          </div>
          <div className="flex justify-center">
            <button onClick={handleSubmit} disabled={loading || !found}
              className="px-8 py-2.5 rounded-full text-white text-sm font-bold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#10b981,#0D9488)" }}>
              {loading ? <Loader2 size={15} className="animate-spin inline mr-1" /> : null}
              Procesar Recarga
            </button>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

// ─── 6. CANCELAR RECARGA ──────────────────────────────────────────────────────

function CancelarRecarga({ banca }: { banca: Banca }) {
  const { msg, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [recargaId, setRecargaId] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleSubmit = async () => {
    if (!recargaId.trim()) { show("Ingresa el ID de la recarga", false); return; }
    setLoading(true);
    const { data: txn } = await supabase.from("movil_transactions")
      .select("*").eq("id", recargaId.trim()).eq("type", "recarga").eq("status", "completed").single();

    if (!txn) { show("Recarga no encontrada o ya cancelada", false); setLoading(false); return; }

    const amt = parseFloat(txn.amount);
    const newBal = parseFloat(txn.balance_before ?? "0");
    await supabase.from("nmv_clients").update({ balance: newBal, updated_at: new Date().toISOString() }).eq("id", txn.client_id);
    await supabase.from("movil_transactions").update({ status: "cancelled" }).eq("id", recargaId.trim());
    await supabase.from("movil_transactions").insert({
      client_id: txn.client_id, client_name: txn.client_name,
      banca_code: banca.code, business_id: BUSINESS_ID,
      type: "recarga_cancelada", amount: -amt,
      balance_before: parseFloat(txn.balance_after ?? "0"), balance_after: newBal,
      status: "completed", notes: motivo || `Cancelación ${recargaId.slice(-8)}`,
      created_by: "admin",
    });
    show(`✅ Recarga cancelada — $${amt.toFixed(2)} devueltos`);
    setRecargaId(""); setMotivo("");
    setLoading(false);
  };

  return (
    <>
      <Toast msg={msg} />
      <SectionCard icon={XCircle} iconColor="#ef4444" title="Cancelar recarga" banca={banca}>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">ID de Recarga</label>
            <input className={inputCls} value={recargaId} onChange={e => setRecargaId(e.target.value)} placeholder="ID de la recarga a cancelar" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Motivo</label>
            <input className={inputCls} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Razón de la cancelación" />
          </div>
          <div className="flex justify-center">
            <button onClick={handleSubmit} disabled={loading}
              className="px-8 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50">
              {loading ? <Loader2 size={15} className="animate-spin inline mr-1" /> : null}
              Cancelar Recarga
            </button>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

// ─── 7. TICKETS ───────────────────────────────────────────────────────────────

function Tickets({ banca }: { banca: Banca }) {
  const [tickets, setTickets] = useState<MovilTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("movil_tickets")
      .select("*").eq("banca_code", banca.code).eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => {
        setTickets((data || []).map(r => ({ ...r, amount: parseFloat(r.amount ?? "0") })));
        setLoading(false);
      });
  }, [banca.code]);

  return (
    <SectionCard icon={Ticket} iconColor="#8b5cf6" title="Tickets" banca={banca}>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#999]"><Loader2 size={20} className="animate-spin mr-2" />Cargando...</div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-[#CCC]">
          <Ticket size={40} className="mb-3" />
          <p className="text-sm font-medium text-[#999]">Historial de tickets — {banca.name}</p>
          <p className="text-xs text-[#BBB]">No hay tickets para esta banca aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E0]">
                {["#TICKET","CLIENTE","MONTO","JUGADAS","ESTADO","FECHA"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[11px] font-bold text-[#999] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-b border-[#F9F9F8] hover:bg-[#F9F9F8]">
                  <td className="py-3 px-3 font-mono text-xs text-violet-600 font-semibold">#{t.ticket_number}</td>
                  <td className="py-3 px-3 text-[#666]">{t.client_code}</td>
                  <td className="py-3 px-3 font-bold">${t.amount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center text-[#666]">{(t.plays || []).length}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${t.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                      {t.status === "cancelled" ? "Anulado" : "Activo"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#999]">{new Date(t.created_at).toLocaleDateString("es-DO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

// ─── 8. PREMIOS ───────────────────────────────────────────────────────────────

function Premios({ banca }: { banca: Banca }) {
  const [loading, setLoading] = useState(true);
  const [premios, setPremios] = useState<{ numero: string; tipo: string; monto: number; tickets: number; estado: string }[]>([]);
  const [stats, setStats] = useState({ total: 0, pagado: 0, pendiente: 0 });

  useEffect(() => {
    supabase.from("movil_tickets")
      .select("*").eq("banca_code", banca.code).eq("business_id", BUSINESS_ID).eq("status", "won")
      .then(({ data }) => {
        const list = (data || []).map(r => ({
          numero: r.plays?.[0]?.numbers || "—", tipo: r.plays?.[0]?.type || "—",
          monto: parseFloat(r.amount ?? "0"), tickets: (r.plays || []).length, estado: "Pendiente",
        }));
        setPremios(list);
        setStats({ total: list.length, pagado: 0, pendiente: list.reduce((s, x) => s + x.monto, 0) });
        setLoading(false);
      });
  }, [banca.code]);

  return (
    <SectionCard icon={Trophy} iconColor="#f59e0b" title="Premios" banca={banca}>
      <p className="text-xs font-semibold text-amber-600 mb-4">🏆 Premios — {banca.name}</p>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#999]"><Loader2 size={20} className="animate-spin mr-2" />Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#F9F9F8] rounded-xl p-4 text-center border border-[#E5E5E0]">
              <p className="text-2xl font-bold text-[#1A1A1A]">{stats.total}</p>
              <p className="text-xs text-[#999] font-medium">Premios</p>
            </div>
            <div className="bg-[#F9F9F8] rounded-xl p-4 text-center border border-[#E5E5E0]">
              <p className="text-2xl font-bold text-teal-600">${stats.pagado.toLocaleString()}</p>
              <p className="text-xs text-[#999] font-medium">Pagado</p>
            </div>
            <div className="bg-[#F9F9F8] rounded-xl p-4 text-center border border-[#E5E5E0]">
              <p className="text-2xl font-bold text-red-500">${stats.pendiente.toLocaleString()}</p>
              <p className="text-xs text-[#999] font-medium">Pendiente</p>
            </div>
          </div>
          {premios.length === 0 ? (
            <div className="text-center py-8 text-[#999] text-sm">No hay premios registrados aún</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E0]">
                  {["BANCA","NÚMERO","TIPO","MONTO","TICKETS","ESTADO"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[11px] font-bold text-amber-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {premios.map((p, i) => (
                  <tr key={i} className="border-b border-[#F9F9F8] hover:bg-amber-50">
                    <td className="py-3 px-3 text-[#666]">{banca.name}</td>
                    <td className="py-3 px-3 font-bold text-amber-500 text-base">{p.numero}</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-md bg-[#F0F0EF] text-[#666] text-[11px] font-semibold">{p.tipo}</span></td>
                    <td className="py-3 px-3 font-bold">${p.monto.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center text-[#666]">{p.tickets}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">{p.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </SectionCard>
  );
}

// ─── 9. VER REPORTE ───────────────────────────────────────────────────────────

function VerReporte({ banca }: { banca: Banca }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ clientes: 0, tickets: 0, ventas: 0, recargas: 0, retiros: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("nmv_clients").select("id", { count: "exact" }).eq("banca_code", banca.code).eq("business_id", BUSINESS_ID),
      supabase.from("movil_tickets").select("amount,status").eq("banca_code", banca.code).eq("business_id", BUSINESS_ID),
      supabase.from("movil_transactions").select("type,amount").eq("banca_code", banca.code).eq("business_id", BUSINESS_ID),
    ]).then(([cli, tix, txns]) => {
      const tickets = (tix.data || []).filter(t => t.status !== "cancelled");
      const txnList = txns.data || [];
      setStats({
        clientes: cli.count || 0,
        tickets: tickets.length,
        ventas: tickets.reduce((s, t) => s + parseFloat(t.amount), 0),
        recargas: txnList.filter(t => t.type === "recarga").reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0),
        retiros: txnList.filter(t => t.type === "retiro").reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0),
      });
      setLoading(false);
    });
  }, [banca.code]);

  const cards = [
    { label: "Clientes", value: stats.clientes, color: "#0D9488" },
    { label: "Tickets", value: stats.tickets, color: "#8b5cf6" },
    { label: "Total Ventas", value: `$${stats.ventas.toFixed(2)}`, color: "#f59e0b" },
    { label: "Recargas", value: `$${stats.recargas.toFixed(2)}`, color: "#10b981" },
    { label: "Retiros", value: `$${stats.retiros.toFixed(2)}`, color: "#ef4444" },
  ];

  return (
    <SectionCard icon={BarChart3} iconColor="#64748b" title="Ver reporte" banca={banca}>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#999]"><Loader2 size={20} className="animate-spin mr-2" />Cargando...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map(c => (
            <div key={c.label} className="bg-[#F9F9F8] border border-[#E5E5E0] rounded-xl p-4">
              <p className="text-[11px] text-[#999] font-semibold uppercase mb-1">{c.label}</p>
              <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────

const navItems: { section: Section; label: string; icon: React.ElementType; activeColor: string; badge?: string }[] = [
  { section: "ver-todo",         label: "Ver todo",         icon: Globe,           activeColor: "#374151" },
  { section: "crear-ticket",     label: "Crear Ticket",     icon: PlusCircle,      activeColor: "#0891B2", badge: "NUEVO" },
  { section: "crear-cliente",    label: "Crear cliente",    icon: UserPlus,        activeColor: "#0D9488" },
  { section: "lista-clientes",   label: "Lista de clientes", icon: Users,          activeColor: "#0891B2" },
  { section: "retiro",           label: "Retiro",           icon: ArrowDownCircle, activeColor: "#f59e0b" },
  { section: "recargas",         label: "Recargas",         icon: CreditCard,      activeColor: "#10b981" },
  { section: "cancelar-recarga", label: "Cancelar recarga", icon: XCircle,         activeColor: "#ef4444" },
  { section: "tickets",          label: "Tickets",          icon: Ticket,          activeColor: "#8b5cf6" },
  { section: "premios",          label: "Premios",          icon: Trophy,          activeColor: "#f59e0b" },
  { section: "ver-reporte",      label: "Ver reporte",      icon: BarChart3,       activeColor: "#64748b" },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function MovilPage() {
  const { bancas, bancasLoading } = useBancasZonas();
  const [selectedBanca, setSelectedBanca] = useState<Banca | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("ver-todo");

  // Set first banca once loaded
  useEffect(() => {
    if (bancas.length > 0 && !selectedBanca) {
      setSelectedBanca(bancas[0]);
    }
  }, [bancas, selectedBanca]);

  if (bancasLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#999]">
        <Loader2 size={24} className="animate-spin mr-2" /> Cargando módulo móvil...
      </div>
    );
  }

  if (!selectedBanca) {
    return (
      <div className="flex items-center justify-center h-64 text-[#999] text-sm">
        No hay bancas activas configuradas.
      </div>
    );
  }

  const renderContent = () => {
    if (activeSection === "ver-todo")         return <VerTodo banca={selectedBanca} onSection={setActiveSection} />;
    if (activeSection === "crear-ticket")     return (
      <div className="bg-white rounded-2xl border border-[#E5E5E0] p-10 text-center text-[#999] text-sm">
        <PlusCircle size={32} className="text-[#CCC] mx-auto mb-2" />
        <p className="font-medium">Función Crear Ticket</p>
        <p className="text-xs text-[#BBB] mt-1">Usa el menú de Tickets del sistema principal</p>
      </div>
    );
    if (activeSection === "crear-cliente")    return <CrearCliente banca={selectedBanca} />;
    if (activeSection === "lista-clientes")   return <ListaClientes banca={selectedBanca} />;
    if (activeSection === "retiro")           return <Retiro banca={selectedBanca} />;
    if (activeSection === "recargas")         return <Recargas banca={selectedBanca} />;
    if (activeSection === "cancelar-recarga") return <CancelarRecarga banca={selectedBanca} />;
    if (activeSection === "tickets")          return <Tickets banca={selectedBanca} />;
    if (activeSection === "premios")          return <Premios banca={selectedBanca} />;
    if (activeSection === "ver-reporte")      return <VerReporte banca={selectedBanca} />;
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="space-y-4">

      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-[#1A1A1A]">Módulo Móvil</h1>
        <p className="text-sm text-[#999]">Gestión de clientes, recargas y retiros del portal móvil</p>
      </div>

      {/* Banca Active Header */}
      <div className="relative bg-white rounded-2xl border border-[#E5E5E0] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <Building2 size={20} className="text-teal-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#999] font-semibold uppercase tracking-wide">BANCA ACTIVA</p>
            <p className="text-base font-bold text-[#1A1A1A]">{selectedBanca.name}</p>
            <p className="text-xs text-[#999]">{selectedBanca.code}</p>
          </div>
        </div>
        <button onClick={() => setShowDropdown(p => !p)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F0F0EF] hover:bg-[#E5E5E0] text-[#444] rounded-xl text-sm font-semibold transition-colors">
          <Building2 size={14} /> Cambiar Banca
          <ChevronDown size={14} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl border border-[#E5E5E0] shadow-lg z-10 overflow-hidden">
              {bancas.map(b => (
                <button key={b.id} onClick={() => { setSelectedBanca(b); setShowDropdown(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F9F9F8] border-b border-[#F0F0EF] last:border-0 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{b.name}</p>
                    <p className="text-xs text-[#999]">{b.code}</p>
                  </div>
                  {selectedBanca.id === b.id && <Check size={16} className="text-teal-600" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 items-start">
        {/* Left nav */}
        <div className="w-52 shrink-0 bg-white rounded-2xl border border-[#E5E5E0] overflow-hidden">
          {navItems.map(item => {
            const isActive = activeSection === item.section;
            return (
              <button key={item.section} onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-[#F9F9F8] last:border-0
                  ${isActive ? "text-white font-semibold" : "text-[#444] hover:bg-[#F9F9F8]"}`}
                style={isActive ? { backgroundColor: item.activeColor } : {}}>
                <item.icon size={16} style={{ color: isActive ? "white" : "#666" }} />
                {item.label}
                {item.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </motion.div>
  );
}
