import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Pencil, Trash2, Plus, Shield, User, Building2, LayoutGrid, LayoutList } from "lucide-react";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─────────────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string; username: string; fullName: string; email: string;
  role: "superadmin"|"admin"|"supervisor"; isActive: boolean; lastLogin: string;
}

interface BancaUser {
  id: string; code: string; name: string; owner: string;
  zone: string; isActive: boolean; lastLogin: string;
}

const adminUsers: AdminUser[] = [
  {id:"a1",username:"superadmin",  fullName:"Super Administrador", email:"super@nmvapp.com", role:"superadmin", isActive:true,  lastLogin:""},
  {id:"a2",username:"admin",       fullName:"Administrador NMV",   email:"admin@nmvapp.com", role:"admin",      isActive:true,  lastLogin:""},
  {id:"a3",username:"supervisor1", fullName:"Supervisor Zona 1",   email:"sup1@nmvapp.com",  role:"supervisor", isActive:true,  lastLogin:""},
  {id:"a4",username:"supervisor2", fullName:"Supervisor SFM",      email:"sup2@nmvapp.com",  role:"supervisor", isActive:false, lastLogin:""},
];

const roleConfig = {
  superadmin: {label:"Super Admin", color:"text-purple-700", bg:"bg-purple-50 border-purple-200"},
  admin:      {label:"Admin",       color:"text-blue-700",   bg:"bg-blue-50 border-blue-200"},
  supervisor: {label:"Supervisor",  color:"text-teal-700",   bg:"bg-teal-50 border-teal-200"},
};

// ─── Action Buttons helper ────────────────────────────────────────────────────
function ActionBtns({onView,onEdit,onDelete}:{onView:()=>void;onEdit:()=>void;onDelete:()=>void}) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onView}   className="p-1.5 rounded-lg text-[#666] hover:text-[#14B8A6] hover:bg-[#E0F7F5] transition-colors" title="Ver"><Eye size={14}/></button>
      <button onClick={onEdit}   className="p-1.5 rounded-lg text-[#666] hover:text-[#6366F1] hover:bg-[#EEF2FF] transition-colors" title="Editar"><Pencil size={14}/></button>
      <button onClick={onDelete} className="p-1.5 rounded-lg text-[#666] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors" title="Eliminar"><Trash2 size={14}/></button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ListaUsuarios() {
  const { bancas: bancasRaw } = useBancasZonas();

  // Bancas desde Supabase — datos reales
  const bancaUsers: BancaUser[] = bancasRaw.map(b => ({
    id:       b.id,
    code:     b.code,
    name:     b.name,
    owner:    "",
    zone:     b.zone_name ?? b.zone_id ?? "",
    isActive: b.is_active,
    lastLogin:"",
  }));

  const [activeTab, setActiveTab] = useState<"administradores"|"bancas">("administradores");
  const [searchAdmin, setSearchAdmin] = useState("");
  const [searchBanca, setSearchBanca] = useState("");
  const [viewMode, setViewMode] = useState<"list"|"grid">("list");

  const filteredAdmins = useMemo(()=>
    adminUsers.filter(u=>
      u.username.toLowerCase().includes(searchAdmin.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchAdmin.toLowerCase()) ||
      u.email.toLowerCase().includes(searchAdmin.toLowerCase())
    ),[searchAdmin]);

  const filteredBancas = useMemo(()=>
    bancaUsers.filter(b=>
      b.code.toLowerCase().includes(searchBanca.toLowerCase()) ||
      b.name.toLowerCase().includes(searchBanca.toLowerCase())
    ),[searchBanca, bancaUsers]);

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Usuarios</h1>
          <p className="text-sm text-[#999] mt-0.5">
            {adminUsers.length} administradores · {bancaUsers.length} operadores de banca
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-xl hover:bg-[#3DBDB5] shadow-sm transition-colors">
          <Plus size={15}/> Crear Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:"Admins Activos",  val:adminUsers.filter(u=>u.isActive).length,  icon:Shield,   color:"text-purple-600", bg:"bg-purple-50"},
          {label:"Admins Inactivos",val:adminUsers.filter(u=>!u.isActive).length, icon:Shield,   color:"text-gray-400",   bg:"bg-gray-50"},
          {label:"Bancas Activas",  val:bancaUsers.filter(b=>b.isActive).length,  icon:Building2,color:"text-teal-600",   bg:"bg-teal-50"},
          {label:"Bancas Inactivas",val:bancaUsers.filter(b=>!b.isActive).length, icon:Building2,color:"text-red-400",    bg:"bg-red-50"},
        ].map(s=>{
          const Icon=s.icon;
          return(
            <div key={s.label} className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={18} className={s.color}/>
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-[#999]">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Controls */}
      <div className="bg-white rounded-xl border border-[#E5E5E0]">
        <div className="flex items-center justify-between border-b border-[#F0F0EB] px-4">
          <div className="flex">
            {([{key:"administradores",label:"Administradores",icon:User},{key:"bancas",label:"Bancas",icon:Building2}] as const).map(t=>{
              const Icon=t.icon;
              return(
                <button key={t.key} onClick={()=>setActiveTab(t.key)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab===t.key?"text-[#4ECDC4]":"text-[#999] hover:text-[#666]"}`}>
                  <Icon size={14}/>{t.label}
                  {activeTab===t.key&&(
                    <motion.div layoutId="usr-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]"
                      transition={{type:"spring",stiffness:400,damping:30}}/>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 pr-1">
            <button onClick={()=>setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode==="list"?"bg-[#E0F7F5] text-[#14B8A6]":"text-[#999] hover:text-[#666]"}`}
              title="Vista lista"><LayoutList size={16}/></button>
            <button onClick={()=>setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode==="grid"?"bg-[#E0F7F5] text-[#14B8A6]":"text-[#999] hover:text-[#666]"}`}
              title="Vista cuadrícula"><LayoutGrid size={16}/></button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
            <input
              value={activeTab==="administradores"?searchAdmin:searchBanca}
              onChange={e=>activeTab==="administradores"?setSearchAdmin(e.target.value):setSearchBanca(e.target.value)}
              placeholder={activeTab==="administradores"?"Buscar administrador...":"Buscar banca..."}
              className="w-full sm:w-72 pl-8 pr-4 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>

          <AnimatePresence mode="wait">
            {activeTab==="administradores"&&(
              <motion.div key="admins" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                {viewMode==="list"?(
                  <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
                        {["Usuario","Nombre completo","Email","Rol","Estado","Último acceso","Acciones"].map(h=>(
                          <th key={h} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {filteredAdmins.length===0?(
                          <tr><td colSpan={7} className="py-10 text-center text-sm text-[#999]">No se encontraron administradores</td></tr>
                        ):filteredAdmins.map((u,ri)=>{
                          const rc=roleConfig[u.role];
                          return(
                            <tr key={u.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20 transition-colors`}>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#E0F7F5] flex items-center justify-center text-[#14B8A6] font-bold text-xs">
                                    {u.username.slice(0,2).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-[#333]">{u.username}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5 text-[#444]">{u.fullName}</td>
                              <td className="px-3 py-2.5 text-[#666] text-xs">{u.email}</td>
                              <td className="px-3 py-2.5">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${rc.bg} ${rc.color}`}>{rc.label}</span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${u.isActive?"bg-[#F0FDF4] text-[#16A34A]":"bg-[#F9FAFB] text-[#999]"}`}>
                                  {u.isActive?"Activo":"Inactivo"}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-xs text-[#999]">{u.lastLogin}</td>
                              <td className="px-3 py-2.5">
                                <ActionBtns onView={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredAdmins.map(u=>{
                      const rc=roleConfig[u.role];
                      return(
                        <div key={u.id} className="bg-white rounded-xl border border-[#E5E5E0] p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-[#E0F7F5] flex items-center justify-center text-[#14B8A6] font-bold">
                                {u.username.slice(0,2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-[#333] text-sm">{u.username}</p>
                                <p className="text-xs text-[#999]">{u.fullName}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${rc.bg} ${rc.color}`}>{rc.label}</span>
                          </div>
                          <p className="text-xs text-[#666] mb-3 truncate">{u.email}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${u.isActive?"bg-[#F0FDF4] text-[#16A34A]":"bg-[#F9FAFB] text-[#999]"}`}>
                              {u.isActive?"Activo":"Inactivo"}
                            </span>
                            <ActionBtns onView={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab==="bancas"&&(
              <motion.div key="bancas" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                {viewMode==="list"?(
                  <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
                        {["Código","Nombre","Zona","Estado","Acciones"].map(h=>(
                          <th key={h} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {filteredBancas.length===0?(
                          <tr><td colSpan={5} className="py-10 text-center text-sm text-[#999]">No hay bancas registradas</td></tr>
                        ):filteredBancas.map((b,ri)=>(
                          <tr key={b.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20 transition-colors`}>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-lg bg-[#F5F5F0] text-[#555]">{b.code}</span>
                            </td>
                            <td className="px-3 py-2.5 font-medium text-[#333]">{b.name}</td>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 text-xs rounded-full bg-[#E0F7F5] text-[#14B8A6]">{b.zone || "—"}</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${b.isActive?"bg-[#F0FDF4] text-[#16A34A]":"bg-[#F9FAFB] text-[#999]"}`}>
                                {b.isActive?"Activa":"Inactiva"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <ActionBtns onView={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredBancas.map(b=>(
                      <div key={b.id} className="bg-white rounded-xl border border-[#E5E5E0] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-[#E0F7F5] flex items-center justify-center">
                              <Building2 size={16} className="text-[#14B8A6]"/>
                            </div>
                            <div>
                              <p className="font-bold text-sm font-mono text-[#333]">{b.code}</p>
                              <p className="text-xs text-[#999]">{b.name}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${b.isActive?"bg-[#F0FDF4] text-[#16A34A]":"bg-[#F9FAFB] text-[#999]"}`}>
                            {b.isActive?"Activa":"Inactiva"}
                          </span>
                        </div>
                        <p className="text-xs text-[#999] mb-3">Zona: <span className="text-[#14B8A6] font-medium">{b.zone || "—"}</span></p>
                        <ActionBtns onView={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
