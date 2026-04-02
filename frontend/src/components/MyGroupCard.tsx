import type { MyGroupCardProps } from "../types"
import { formatJoinedDate } from "../utils/date"

const MyGroupCard = ({ myGroup }: MyGroupCardProps) => {
  
  const joinedDate = formatJoinedDate(myGroup.joined_at)

  const roleBadge = myGroup.role === "admin" ? (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] shrink-0">
      <i className="bi bi-shield-check" />
      Admin
    </span>
  ) : (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] shrink-0">
      <i className="bi bi-person" />
      Miembro
    </span>
  )

  return (
    <div className="relative p-px rounded-2xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/30 shadow-[0_0_40px_rgba(16,185,129,0.06),0_20px_60px_rgba(0,0,0,0.50)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(16,185,129,0.12),0_30px_70px_rgba(0,0,0,0.65)] cursor-pointer group/card">

      <div className="relative rounded-[15px] bg-[#0A1020]/90 backdrop-blur-2xl overflow-hidden h-full flex flex-col">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/25 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        {myGroup.group.image ? (
          <div className="relative w-full h-40 shrink-0 overflow-hidden">
            <img
              src={myGroup.group.image}
              alt={myGroup.group.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0A1020]/70 pointer-events-none" />
          </div>
        ) : (
          <div className="relative flex items-start justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/card:bg-[#10B981]/15 group-hover/card:border-[#10B981]/35">
              <i className="bi bi-people text-[#10B981]" />
            </div>
            {roleBadge}
          </div>
        )}

        <div className="relative flex flex-col gap-4 p-5 md:p-6 flex-1">

          <div className="relative flex flex-col gap-1.5 flex-1">
            <h3 className="text-white group-hover/card:text-[#10B981] transition-colors duration-200 truncate">
              {myGroup.group.name}
            </h3>
            <p className="text-white/40 line-clamp-2">
              {myGroup.group.description}
            </p>
          </div>

          <div className="relative flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-white/30">
              <i className="bi bi-calendar3" />
              <span>Desde {joinedDate}</span>
            </div>
            {roleBadge}
          </div>

        </div>
      </div>
    </div>
  )
}

export default MyGroupCard
