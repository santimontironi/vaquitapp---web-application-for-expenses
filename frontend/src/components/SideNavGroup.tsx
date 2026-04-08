import type { SideNavGroupProps } from "../types"

const SideNavGroup = ({ itemSelected, setSelectedItem }: SideNavGroupProps) => {

  const activeClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]"
  const inactiveClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-2 p-px rounded-2xl bg-linear-to-br from-[#10B981]/30 via-white/5 to-[#3B82F6]/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] self-start sticky top-28">

      <div className="rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        <nav className="flex flex-col gap-1 p-2">

          <button onClick={() => setSelectedItem("members")} className={itemSelected === "members" ? activeClass : inactiveClass}>
            <i className={`bi bi-people ${itemSelected === "members" ? "text-[#10B981]" : "text-white/40"}`} />
            <span>Listado de miembros</span>
          </button>

          <div className="my-1 h-px bg-white/6 mx-1" />

          <button onClick={() => setSelectedItem("add-member")} className={itemSelected === "add-member" ? activeClass : inactiveClass}>
            <i className={`bi bi-person-plus ${itemSelected === "add-member" ? "text-[#10B981]" : "text-white/40"}`} />
            <span>Agregar miembro</span>
          </button>

          <button onClick={() => setSelectedItem("view-plans")} className={itemSelected === "view-plans" ? activeClass : inactiveClass}>
            <i className={`bi bi-card-list ${itemSelected === "view-plans" ? "text-[#10B981]" : "text-white/40"}`} />
            <span>Ver planes</span>
          </button>

          <button className={inactiveClass}>
            <i className="bi bi-plus-circle text-white/40" />
            <span>Nuevo plan</span>
          </button>

        </nav>

        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />
      </div>
    </aside>
  )
}

export default SideNavGroup
