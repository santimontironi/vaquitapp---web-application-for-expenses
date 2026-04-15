import { useEffect } from "react"
import type { AllMembersProps } from "../../types/groups.types"
import useGroup from "../../hooks/useGroup"
import MemberItem from "./MemberItem"
import Swal from "sweetalert2"

const AllMembers = ({ idGroup }: AllMembersProps) => {
  const { members, getMembersByGroup, deleteMember } = useGroup()

  useEffect(() => {
    getMembersByGroup(idGroup)
  }, [idGroup])

  const handleDeleteMember = async (idUser: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar miembro?",
        text: "¿Estás seguro de que quieres eliminar a este miembro del grupo? Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })
      if (result.isConfirmed) {
        await deleteMember(idGroup, idUser)
      }
    } catch (error) {
      console.error("Error al eliminar al miembro del grupo:", error)
    }
  }
  return (
    <div className="relative p-px rounded-2xl bg-linear-to-br from-[#10B981]/20 via-white/4 to-[#3B82F6]/15 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="relative rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 md:p-8 overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3B82F6]/4 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative flex flex-col gap-5">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                <i className="bi bi-people text-[#10B981]" />
              </div>
              <h2 className="text-white font-semibold">Miembros</h2>
            </div>
            {members && (
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                {members.length} {members.length === 1 ? "miembro" : "miembros"}
              </span>
            )}
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

          {members && members.length > 0 ? (
            <div className="flex flex-col gap-2">
              {members.map((member) => (
                <MemberItem key={member._id} member={member} onDeleteMember={() => handleDeleteMember(member.user._id)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                <i className="bi bi-people text-[#10B981]" />
              </div>
              <p className="text-white/40 max-w-xs">
                No hay miembros en este grupo todavía.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AllMembers
