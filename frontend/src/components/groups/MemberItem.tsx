import type { MemberItemProps } from "../../types/groups.types"
import { formatJoinedDate } from "../../utils/date"
import useAuth from "../../hooks/useAuth"

const MemberItem = ({ member, onDeleteMember, onGrantAdmin, isAdmin }: MemberItemProps) => {
  const { user } = useAuth();
  const initials = member.user.username.slice(0, 2).toUpperCase()
  const isActualUser = user?._id === member.user._id
  const isMemberAdmin = member.role === 'admin'

  const roleBadge = isMemberAdmin ? (
    <span className="flex items-center gap-1 bg-[#BC96E6]/15 text-[#BC96E6] text-xs font-semibold px-2.5 py-1 rounded-full">
      <i className="bi bi-shield-check text-xs" />
      Admin
    </span>
  ) : (
    <span className="flex items-center gap-1 bg-white/10 text-white/60 text-xs font-medium px-2.5 py-1 rounded-full">
      <i className="bi bi-person text-xs" />
      Miembro
    </span>
  )

  return (
    <div>
      <div className="flex md:hidden items-center gap-3 bg-white/4 border border-white/[0.07] rounded-xl px-3 py-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#BC96E6]/20 flex items-center justify-center">
            <span className="text-[#BC96E6] font-semibold text-sm">{initials}</span>
          </div>
          {isMemberAdmin && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#BC96E6] flex items-center justify-center">
              <i className="bi bi-shield-check text-[#210B2C] text-[8px]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/90 font-medium text-sm">{member.user.username}</span>
            {roleBadge}
          </div>
          <span className="flex items-center gap-1 text-[#FFD166]/50 text-xs mt-0.5">
            <i className="bi bi-calendar3" />
            {formatJoinedDate(member.joined_at)}
          </span>
        </div>

        {!isActualUser && isAdmin && (
          <div className="flex items-center gap-1.5 shrink-0">
            {!isMemberAdmin && (
              <button
                onClick={onGrantAdmin}
                aria-label="Dar admin"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#BC96E6]/10 border border-[#BC96E6]/20 text-[#BC96E6] hover:bg-[#BC96E6]/20 transition-all duration-150 cursor-pointer"
              >
                <i className="bi bi-shield-plus text-xs" />
              </button>
            )}
            <button
              onClick={onDeleteMember}
              aria-label="Eliminar miembro"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-150 cursor-pointer"
            >
              <i className="bi bi-trash3 text-xs" />
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4 bg-white/4 border border-white/8 rounded-xl px-5 py-4">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#BC96E6]/20 flex items-center justify-center">
            <span className="text-[#BC96E6] font-semibold text-sm">{initials}</span>
          </div>
          {isMemberAdmin && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#BC96E6] flex items-center justify-center">
              <i className="bi bi-shield-check text-[#210B2C] text-[8px]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-white/90 font-medium text-sm block">{member.user.username}</span>
          <span className="text-white/30 text-xs">{member.user.email}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#FFD166]/50 text-xs">
          <i className="bi bi-calendar3" />
          <span>{formatJoinedDate(member.joined_at)}</span>
        </div>

        {roleBadge}

        {!isActualUser && isAdmin && !isMemberAdmin && (
          <button
            onClick={onGrantAdmin}
            aria-label="Dar admin"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#BC96E6]/10 border border-[#BC96E6]/20 text-[#BC96E6] hover:bg-[#BC96E6]/20 transition-all duration-150 cursor-pointer"
          >
            <i className="bi bi-shield-plus text-xs" />
          </button>
        )}

        {!isActualUser && isAdmin && (
          <button
            onClick={onDeleteMember}
            aria-label="Eliminar miembro"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-150 cursor-pointer"
          >
            <i className="bi bi-trash3 text-xs" />
          </button>
        )}
      </div>
    </div>
  )
}

export default MemberItem
