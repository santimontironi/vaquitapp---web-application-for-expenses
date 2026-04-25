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
      className="group flex flex-col rounded-2xl bg-white/3 border border-white/6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#10B981]/20 hover:bg-white/6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] cursor-pointer"
    >

      {plan.image ? (
        <div className="relative w-full h-36 overflow-hidden">
          <img
            src={plan.image}
            alt={plan.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A1020]/80 via-[#0A1020]/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-white font-semibold truncate drop-shadow-lg">{plan.name}</h3>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-36 bg-linear-to-br from-[#10B981]/15 via-[#0A1020] to-[#3B82F6]/15 flex flex-col items-center justify-center gap-2 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#10B981]/8 to-[#3B82F6]/8" />
          <div className="relative w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
            <i className="bi bi-calendar-event text-[#10B981]" />
          </div>
          <span className="relative text-white/40 truncate max-w-[80%] text-center">{plan.name}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">

        <div className="flex items-start justify-between gap-2">
          {plan.image && (
            <h3 className="text-white font-semibold truncate flex-1">{plan.name}</h3>
          )}
          {!plan.image && (
            <span className="sr-only">{plan.name}</span>
          )}
          {plan.state === "active" && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 transition-all duration-200 bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981] group-hover:bg-[#10B981]/15 group-hover:border-[#10B981]/40">
              <i className="bi bi-play-circle" style={{ fontSize: "11px" }} />
              <span style={{ fontSize: "11px" }}>Activo</span>
            </span>
          )}
          {plan.state === "completed" && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 transition-all duration-200 bg-[#3B82F6]/10 border-[#3B82F6]/25 text-[#3B82F6] group-hover:bg-[#3B82F6]/15 group-hover:border-[#3B82F6]/40">
              <i className="bi bi-check-circle" style={{ fontSize: "11px" }} />
              <span style={{ fontSize: "11px" }}>Completado</span>
            </span>
          )}
          {plan.state === "cancelled" && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 transition-all duration-200 bg-red-400/10 border-red-400/25 text-red-400 group-hover:bg-red-400/15 group-hover:border-red-400/40">
              <i className="bi bi-x-circle" style={{ fontSize: "11px" }} />
              <span style={{ fontSize: "11px" }}>Cancelado</span>
            </span>
          )}
        </div>

        {plan.description && (
          <p className="text-white/40 line-clamp-2 transition-colors duration-200 group-hover:text-white/55">
            {plan.description}
          </p>
        )}

        <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

        {plan.members.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {visibleMembers.map((member) => (
                <div
                  key={member._id}
                  title={member.username}
                  className="w-7 h-7 rounded-full bg-linear-to-br from-[#10B981]/20 to-[#3B82F6]/20 border-2 border-[#0A1020] flex items-center justify-center transition-all duration-200 group-hover:border-[#0A1020]/80"
                >
                  <span className="text-white/70 font-semibold" style={{ fontSize: "10px" }}>
                    {member.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-7 h-7 rounded-full bg-white/8 border-2 border-[#0A1020] flex items-center justify-center">
                  <span className="text-white/50" style={{ fontSize: "9px" }}>+{extraCount}</span>
                </div>
              )}
            </div>
            <span className="text-white/30 transition-colors duration-200 group-hover:text-white/45" style={{ fontSize: "11px" }}>
              {plan.members.length} {plan.members.length === 1 ? "miembro" : "miembros"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-white/30 transition-colors duration-200 group-hover:text-white/45">
            <i className="bi bi-person" style={{ fontSize: "12px" }} />
            <span className="truncate" style={{ fontSize: "12px" }}>{plan.created_by.username}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/25 transition-colors duration-200 group-hover:text-white/40">
            <i className="bi bi-calendar3" style={{ fontSize: "11px" }} />
            <span style={{ fontSize: "11px" }}>{formatJoinedDate(plan.created_at)}</span>
          </div>
        </div>

        {plan.state === "active" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckCompleted(); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#10B981]/20 bg-[#10B981]/8 text-[#10B981]/70 text-xs font-medium transition-all duration-200 hover:bg-[#10B981]/15 hover:border-[#10B981]/40 hover:text-[#10B981] cursor-pointer"
          >
            <i className="bi bi-check-circle" style={{ fontSize: "13px" }} />
            Marcar como completado
          </button>
        )}

      </div>
    </div>
  )
}

export default PlanItem
