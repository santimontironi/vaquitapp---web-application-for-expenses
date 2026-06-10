import { useEffect } from "react"
import type { AllMembersProps } from "../../types/groups.types"
import useGroup from "../../hooks/useGroup"
import MemberItem from "./MemberItem"
import Swal from "sweetalert2"

const AllMembers = ({ idGroup }: AllMembersProps) => {
  const { members, getMembersByGroup, deleteMember, groups, getAdminRole } = useGroup()
  const isAdmin = groups?.find(g => g.group._id === idGroup)?.role === "admin"

  useEffect(() => {
    getMembersByGroup(idGroup)
  }, [idGroup])

  const handleGrantAdmin = async (idUser: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Dar rol de admin?",
        text: "Este miembro pasará a ser administrador del grupo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, dar admin",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          popup: "va-swal-popup",
          title: "va-swal-title",
          htmlContainer: "va-swal-text",
          confirmButton: "va-swal-confirm",
          cancelButton: "va-swal-cancel",
        },
      })
      if (result.isConfirmed) {
        await getAdminRole(idGroup, idUser)
        await getMembersByGroup(idGroup)
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.log(error.response.data.message)
      }
    }
  }

  const handleDeleteMember = async (idUser: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar miembro?",
        text: "¿Estás seguro de que quieres eliminar a este miembro del grupo? Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
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
        await deleteMember(idGroup, idUser)
      }
    } catch (error) {
      console.error("Error al eliminar al miembro del grupo:", error)
    }
  }

  return (
    <div className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-[#FFD166]/40 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
            <i className="bi bi-people text-[#BC96E6] text-sm" />
          </div>
          <h2 className="text-white font-semibold text-base">Miembros</h2>
        </div>
        {members && (
          <span className="bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">
            {members.length} {members.length === 1 ? "miembro" : "miembros"}
          </span>
        )}
      </div>

      <div className="border-t border-white/[0.07] mb-4" />

      {members && members.length > 0 ? (
        <div className="space-y-2">
          {members.map((member) => (
            <MemberItem
              isAdmin={isAdmin}
              key={member._id}
              member={member}
              onDeleteMember={() => handleDeleteMember(member.user._id)}
              onGrantAdmin={() => handleGrantAdmin(member.user._id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-10 gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center">
            <i className="bi bi-people text-[#BC96E6]/40 text-xl" />
          </div>
          <p className="text-white/30 text-sm">No hay miembros en este grupo todavía.</p>
        </div>
      )}
    </div>
  )
}

export default AllMembers
