import { useNavigate } from "react-router-dom"
import type { PlanItemProps } from "../../types/plans.types"
import { formatJoinedDate } from "../../utils/date"

const MAX_VISIBLE_AVATARS = 3

const PlanItem = ({ plan, idGroup, onCheckCompleted }: PlanItemProps) => {
  const navigate = useNavigate()
  const visibleMembers = plan.members.slice(0, MAX_VISIBLE_AVATARS)
  const extraCount = plan.members.length - MAX_VISIBLE_AVATARS

  return (
    <div
      onClick={() => navigate(`/grupo/${idGroup}/planes/${plan._id}`)}
      className="bg-white/[0.07] border border-white/15 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:bg-white/10 hover:border-[#BC96E6]/35 hover:shadow-xl hover:shadow-[#BC96E6]/5 hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
    >
      {plan.image ? (
        <div className="relative h-32 md:h-36 overflow-hidden">
          <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#210B2C]/90 via-[#210B2C]/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-white font-bold text-lg tracking-tight">{plan.name}</h3>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 pt-5 pb-0">
          <div className="w-10 h-10 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
            <i className="bi bi-calendar-event text-[#BC96E6] text-base" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">{plan.name}</span>
        </div>
      )}

      <div className="p-4 md:p-5 pt-3 md:pt-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          {plan.image && <span className="sr-only">{plan.name}</span>}
          {!plan.image && <span />}

          <div className="flex items-center gap-1.5 ml-auto">
            {plan.state === "active" && (
              <span className="flex items-center gap-1 bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">
                <i className="bi bi-play-circle text-xs" />
                <span>Activo</span>
              </span>
            )}
            {plan.state === "completed" && (
              <span className="flex items-center gap-1 bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">
                <i className="bi bi-check-circle text-xs" />
                <span>Completado</span>
              </span>
            )}
            {plan.state === "cancelled" && (
              <span className="flex items-center gap-1 bg-white/10 text-white/40 text-xs font-semibold px-2.5 py-1 rounded-full">
                <i className="bi bi-x-circle text-xs" />
                <span>Cancelado</span>
              </span>
            )}
          </div>
        </div>

        {plan.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">{plan.description}</p>
        )}

        <div className="border-t border-white/10 my-3" />

        {plan.members.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {visibleMembers.map((member) => (
                <div
                  key={member._id}
                  title={member.username}
                  className="w-8 h-8 rounded-full bg-[#BC96E6]/20 border-2 border-[#210B2C] flex items-center justify-center"
                >
                  <span className="text-[#BC96E6] text-xs font-semibold">{member.username.slice(0, 2).toUpperCase()}</span>
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#210B2C] flex items-center justify-center">
                  <span className="text-white/50 text-xs font-medium">+{extraCount}</span>
                </div>
              )}
            </div>
            <span className="text-[#FFD166]/70 text-xs font-medium">
              {plan.members.length} {plan.members.length === 1 ? "miembro" : "miembros"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 text-white/35 text-xs">
          <div className="flex items-center gap-1">
            <i className="bi bi-person" />
            <span>{plan.created_by.username}</span>
          </div>
          <div className="flex items-center gap-1 text-[#FFD166]/60">
            <i className="bi bi-calendar3" />
            <span>{formatJoinedDate(plan.created_at)}</span>
          </div>
        </div>

        {plan.state === "active" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckCompleted(); }}
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-[#FFD166] text-[#210B2C] text-xs font-bold rounded-xl px-3 py-2.5 hover:bg-[#FFD166]/85 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <i className="bi bi-check-circle-fill" />
            Marcar como completado
          </button>
        )}
      </div>
    </div>
  )
}

export default PlanItem
