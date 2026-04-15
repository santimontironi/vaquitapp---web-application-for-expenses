import type { SideNavGroupProps } from "../../types/groups.types"

const navItems = [
  { key: "members",     icon: "bi-people",       label: "Miembros",   labelShort: "Miembros"  },
  { key: "add-member",  icon: "bi-person-plus",  label: "Agregar miembro", labelShort: "Agregar" },
  { key: "view-plans",  icon: "bi-card-list",    label: "Ver planes", labelShort: "Planes"    },
  { key: "create-plan", icon: "bi-plus-circle",  label: "Nuevo plan", labelShort: "Nuevo"     },
] as const

const SideNavGroup = ({ itemSelected, setSelectedItem }: SideNavGroupProps) => {

  const sideActiveClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]"
  const sideInactiveClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"

  return (
    <>
      {/* ── Mobile: horizontal tab bar ── */}
      <div className="md:hidden w-full p-px rounded-2xl bg-linear-to-br from-[#10B981]/25 via-white/5 to-[#3B82F6]/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <div className="rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <nav className="flex overflow-x-auto scrollbar-none gap-1 p-2">
            {navItems.map((item) => {
              const isActive = itemSelected === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedItem(item.key)}
                  className={`flex-1 min-w-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? "bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]"
                      : "border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"
                    }`}
                >
                  <i className={`bi ${item.icon} ${isActive ? "text-[#10B981]" : "text-white/40"}`} />
                  <span className="truncate w-full text-center">{item.labelShort}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 p-px rounded-2xl bg-linear-to-br from-[#10B981]/30 via-white/5 to-[#3B82F6]/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] self-start sticky top-28">
        <div className="rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item, idx) => {
              const isActive = itemSelected === item.key
              const showDivider = idx === 0
              return (
                <div key={item.key}>
                  <button onClick={() => setSelectedItem(item.key)} className={isActive ? sideActiveClass : sideInactiveClass}>
                    <i className={`bi ${item.icon} ${isActive ? "text-[#10B981]" : "text-white/40"}`} />
                    <span>{item.label}</span>
                  </button>
                  {showDivider && <div className="my-1 h-px bg-white/6 mx-1" />}
                </div>
              )
            })}
          </nav>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        </div>
      </aside>
    </>
  )
}

export default SideNavGroup
