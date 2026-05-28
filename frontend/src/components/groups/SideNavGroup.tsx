import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import type { SideNavGroupProps } from "../../types/groups.types"
import useGroup from "../../hooks/useGroup"

const SideNavGroup = ({ itemSelected, setSelectedItem, groupId }: SideNavGroupProps) => {
  const { groups, members, leaveGroup } = useGroup()
  const navigate = useNavigate()

  const isAdmin = groups?.find(gm => gm.group._id === groupId)?.role === "admin"

  const handleLeaveGroup = async () => {
    const admins = members?.filter(m => m.role === 'admin') ?? [] // admins se encarga de filtrar los miembros que son admins, si members es undefined devuelve un array vacío para evitar errores
    const isOnlyAdmin = isAdmin && admins.length === 1

    if (isOnlyAdmin) {
      await Swal.fire({
        title: "No podés abandonar el grupo",
        text: "Sos el único administrador. Asigná el rol de admin a otro miembro antes de salir.",
        icon: "error",
        confirmButtonColor: "#10B981",
        confirmButtonText: "Entendido",
        background: "#0F172A",
        color: "#ffffff",
      })
      return
    }

    const result = await Swal.fire({
      title: "¿Abandonar grupo?",
      text: "Vas a dejar de ser parte de este grupo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Sí, abandonar",
      cancelButtonText: "Cancelar",
      background: "#0F172A",
      color: "#ffffff",
    })

    if (result.isConfirmed) {
      await leaveGroup(groupId)
      navigate('/inicio')
    }
  }

  const sideActiveClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]"
  const sideActiveBlueClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 bg-[#3B82F6]/12 border border-[#3B82F6]/30 text-[#3B82F6] shadow-[0_2px_12px_rgba(59,130,246,0.1)]"
  const sideInactiveClass = "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"

  return (
    <>
      <div className="md:hidden w-full p-px rounded-2xl bg-linear-to-br from-[#10B981]/35 via-white/5 to-[#3B82F6]/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <div className="rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#3B82F6]/15 to-transparent pointer-events-none" />
          <nav className="flex overflow-x-auto scrollbar-none gap-1 p-2">

            <button
              onClick={() => setSelectedItem("members")}
              title="Miembros"
              className={`flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${itemSelected === "members" ? "bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]" : "border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"}`}
            >
              <i className={`bi bi-people text-lg ${itemSelected === "members" ? "text-[#10B981]" : "text-white/40"}`} />
            </button>

            {isAdmin && (
              <button
                onClick={() => setSelectedItem("add-member")}
                title="Agregar miembro"
                className={`flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${itemSelected === "add-member" ? "bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] shadow-[0_2px_12px_rgba(16,185,129,0.1)]" : "border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"}`}
              >
                <i className={`bi bi-person-plus text-lg ${itemSelected === "add-member" ? "text-[#10B981]" : "text-white/40"}`} />
              </button>
            )}

            <button
              onClick={() => setSelectedItem("view-plans")}
              title="Ver planes"
              className={`flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${itemSelected === "view-plans" ? "bg-[#3B82F6]/12 border border-[#3B82F6]/30 text-[#3B82F6] shadow-[0_2px_12px_rgba(59,130,246,0.1)]" : "border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"}`}
            >
              <i className={`bi bi-card-list text-lg ${itemSelected === "view-plans" ? "text-[#3B82F6]" : "text-white/40"}`} />
            </button>

            <button
              onClick={() => setSelectedItem("create-plan")}
              title="Nuevo plan"
              className={`flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${itemSelected === "create-plan" ? "bg-[#3B82F6]/12 border border-[#3B82F6]/30 text-[#3B82F6] shadow-[0_2px_12px_rgba(59,130,246,0.1)]" : "border border-transparent text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80"}`}
            >
              <i className={`bi bi-plus-circle text-lg ${itemSelected === "create-plan" ? "text-[#3B82F6]" : "text-white/40"}`} />
            </button>

            <button
              onClick={handleLeaveGroup}
              title="Abandonar grupo"
              className="flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300"
            >
              <i className="bi bi-box-arrow-left text-lg text-red-400" />
            </button>

          </nav>
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 p-px rounded-2xl bg-linear-to-br from-[#10B981]/40 via-white/5 to-[#3B82F6]/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] self-start sticky top-28">
        <div className="rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/25 to-transparent pointer-events-none" />
          <nav className="flex flex-col gap-1 p-2">

            <button onClick={() => setSelectedItem("members")} className={itemSelected === "members" ? sideActiveClass : sideInactiveClass}>
              <i className={`bi bi-people ${itemSelected === "members" ? "text-[#10B981]" : "text-white/40"}`} />
              <span>Miembros</span>
            </button>

            <div className="my-1 h-px bg-white/6 mx-1" />

            {isAdmin && (
              <button onClick={() => setSelectedItem("add-member")} className={itemSelected === "add-member" ? sideActiveClass : sideInactiveClass}>
                <i className={`bi bi-person-plus ${itemSelected === "add-member" ? "text-[#10B981]" : "text-white/40"}`} />
                <span>Agregar miembro</span>
              </button>
            )}

            <button onClick={() => setSelectedItem("view-plans")} className={itemSelected === "view-plans" ? sideActiveBlueClass : sideInactiveClass}>
              <i className={`bi bi-card-list ${itemSelected === "view-plans" ? "text-[#3B82F6]" : "text-white/40"}`} />
              <span>Ver planes</span>
            </button>

            <button onClick={() => setSelectedItem("create-plan")} className={itemSelected === "create-plan" ? sideActiveBlueClass : sideInactiveClass}>
              <i className={`bi bi-plus-circle ${itemSelected === "create-plan" ? "text-[#3B82F6]" : "text-white/40"}`} />
              <span>Nuevo plan</span>
            </button>

            <div className="my-1 h-px bg-white/6 mx-1" />

            <button
              onClick={handleLeaveGroup}
              className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300"
            >
              <i className="bi bi-box-arrow-left text-red-400" />
              <span>Abandonar grupo</span>
            </button>

          </nav>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#3B82F6]/5 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        </div>
      </aside>
    </>
  )
}

export default SideNavGroup
