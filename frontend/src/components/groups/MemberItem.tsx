import type { MemberItemProps } from "../../types/groups.types"
import { formatJoinedDate } from "../../utils/date"
import useAuth from "../../hooks/useAuth"

const MemberItem = ({ member, onDeleteMember }: MemberItemProps) => {

  const { user } = useAuth();

  const initials = member.user.username.slice(0, 2).toUpperCase()

  const isAdmin = member.role === "admin"

  const isActualUser = user?._id === member.user._id

  const roleBadge = isAdmin ? (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] shrink-0 transition-all duration-200 group-hover:bg-[#10B981]/15 group-hover:border-[#10B981]/40">
      <i className="bi bi-shield-check" />
      Admin
    </span>
  ) : (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] shrink-0 transition-all duration-200 group-hover:bg-[#3B82F6]/15 group-hover:border-[#3B82F6]/40">
      <i className="bi bi-person" />
      Miembro
    </span>
  )

  const hoverBorder = isAdmin
    ? "hover:border-[#10B981]/25"
    : "hover:border-[#3B82F6]/20"

  return (
    <div className={`group flex items-center gap-3 px-3 py-3 sm:px-4 rounded-xl bg-white/3 border border-white/6 ${hoverBorder} hover:bg-white/6 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-200 cursor-default`}>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#10B981]/20 to-[#3B82F6]/20 border border-white/10 flex items-center justify-center transition-all duration-200 group-hover:border-white/20 group-hover:from-[#10B981]/30 group-hover:to-[#3B82F6]/30">
          <span className="text-white/70 font-semibold transition-colors duration-200 group-hover:text-white/90">{initials}</span>
        </div>
        {isAdmin && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#0A1020] flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <i className="bi bi-shield-check text-white" style={{ fontSize: "8px" }} />
          </div>
        )}
      </div>

      {/* Username + email — takes all available space */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-white font-medium truncate transition-colors duration-200 group-hover:text-white">{member.user.username}</span>
        <span className="text-white/35 truncate transition-colors duration-200 group-hover:text-white/50">{member.user.email}</span>
      </div>

      {/* Join date — hidden on xs, visible from sm */}
      <div className="hidden sm:flex items-center gap-1.5 text-white/25 shrink-0 transition-colors duration-200 group-hover:text-white/40">
        <i className="bi bi-calendar3" />
        <span>{formatJoinedDate(member.joined_at)}</span>
      </div>

      {/* Role badge */}
      {roleBadge}

      {/* Delete button */}
      {!isActualUser && (
        <button
          onClick={onDeleteMember}
          className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 active:scale-95 cursor-pointer"
          aria-label="Eliminar miembro"
        >
          <i className="bi bi-trash3" style={{ fontSize: "13px" }} />
        </button>
      )}

    </div>
  )
}

export default MemberItem
