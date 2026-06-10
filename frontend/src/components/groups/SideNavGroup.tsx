import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import type { SideNavGroupProps } from "../../types/groups.types"
import useGroup from "../../hooks/useGroup"

const SideNavGroup = ({ itemSelected, setSelectedItem, groupId }: SideNavGroupProps) => {
  const { groups, members, leaveGroup } = useGroup()
  const navigate = useNavigate()

  const isAdmin = groups?.find(gm => gm.group._id === groupId)?.role === "admin"

  const handleLeaveGroup = async () => {
    const admins = members?.filter(m => m.role === 'admin') ?? []
    const isOnlyAdmin = isAdmin && admins.length === 1

    if (isOnlyAdmin) {
      await Swal.fire({
        title: "No podés abandonar el grupo",
        text: "Sos el único administrador. Asigná el rol de admin a otro miembro antes de salir.",
        icon: "error",
        confirmButtonText: "Entendido",
        buttonsStyling: false,
        customClass: {
          popup: "va-swal-popup",
          title: "va-swal-title",
          htmlContainer: "va-swal-text",
          confirmButton: "va-swal-confirm",
        },
      })
      return
    }

    const result = await Swal.fire({
      title: "¿Abandonar grupo?",
      text: "Vas a dejar de ser parte de este grupo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, abandonar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        popup: "va-swal-popup",
        title: "va-swal-title",
        htmlContainer: "va-swal-text",
        confirmButton: "va-swal-confirm va-swal-confirm-danger",
        cancelButton: "va-swal-cancel",
      },
    })

    if (result.isConfirmed) {
      await leaveGroup(groupId)
      navigate('/inicio')
    }
  }

  const navBtnBase = "flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
  const navBtnActive = `${navBtnBase} bg-[#BC96E6]/15 text-[#BC96E6] border border-[#BC96E6]/20`
  const navBtnInactive = `${navBtnBase} text-white/50 hover:text-white/80 hover:bg-white/[0.06]`

  const mobileBtnBase = "flex items-center justify-center w-10 h-10 rounded-xl text-base transition-all duration-150 cursor-pointer"
  const mobileBtnActive = `${mobileBtnBase} bg-[#BC96E6]/15 text-[#BC96E6] border border-[#BC96E6]/20`
  const mobileBtnInactive = `${mobileBtnBase} text-white/40 hover:text-white/80 hover:bg-white/[0.07]`

  return (
    <>
      <div className="flex md:hidden w-full">
        <div className="flex items-center gap-2 bg-white/5 border border-[#FFD166] rounded-2xl p-2 w-full overflow-x-auto">
          <nav className="flex items-center justify-center gap-1.5 w-full">
            <button
              onClick={() => setSelectedItem("members")}
              title="Miembros"
              className={itemSelected === "members" ? mobileBtnActive : mobileBtnInactive}
            >
              <i className="bi bi-people" />
            </button>

            {isAdmin && (
              <button
                onClick={() => setSelectedItem("add-member")}
                title="Agregar miembro"
                className={itemSelected === "add-member" ? mobileBtnActive : mobileBtnInactive}
              >
                <i className="bi bi-person-plus" />
              </button>
            )}

            <button
              onClick={() => setSelectedItem("view-plans")}
              title="Ver planes"
              className={itemSelected === "view-plans" ? mobileBtnActive : mobileBtnInactive}
            >
              <i className="bi bi-card-list" />
            </button>

            <button
              onClick={() => setSelectedItem("create-plan")}
              title="Nuevo plan"
              className={itemSelected === "create-plan" ? mobileBtnActive : mobileBtnInactive}
            >
              <i className="bi bi-plus-circle" />
            </button>

            <button
              onClick={handleLeaveGroup}
              title="Abandonar grupo"
              className={`${mobileBtnBase} text-red-400/60 hover:text-red-400 hover:bg-red-500/10`}
            >
              <i className="bi bi-box-arrow-left" />
            </button>
          </nav>
        </div>
      </div>

      <aside className="hidden md:block w-52 xl:w-56 shrink-0">
        <div className="bg-white/5 border border-[#FFD166] rounded-2xl p-3 sticky top-24">
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedItem("members")}
              className={itemSelected === "members" ? navBtnActive : navBtnInactive}
            >
              <i className="bi bi-people text-base" />
              <span>Miembros</span>
            </button>

            <div className="h-px bg-white/6 my-1" />

            {isAdmin && (
              <button
                onClick={() => setSelectedItem("add-member")}
                className={itemSelected === "add-member" ? navBtnActive : navBtnInactive}
              >
                <i className="bi bi-person-plus text-base" />
                <span>Agregar miembro</span>
              </button>
            )}

            <button
              onClick={() => setSelectedItem("view-plans")}
              className={itemSelected === "view-plans" ? navBtnActive : navBtnInactive}
            >
              <i className="bi bi-card-list text-base" />
              <span>Ver planes</span>
            </button>

            <button
              onClick={() => setSelectedItem("create-plan")}
              className={itemSelected === "create-plan" ? navBtnActive : navBtnInactive}
            >
              <i className="bi bi-plus-circle text-base" />
              <span>Nuevo plan</span>
            </button>

            <div className="h-px bg-white/6 my-1" />

            <button
              onClick={handleLeaveGroup}
              className={`${navBtnBase} text-red-400/60 hover:text-red-400 hover:bg-red-500/8`}
            >
              <i className="bi bi-box-arrow-left text-base" />
              <span>Abandonar grupo</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default SideNavGroup
