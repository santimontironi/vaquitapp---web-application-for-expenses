import { useState } from "react"
import { AnimatePresence } from "motion/react"
import type { MyGroupCardProps } from "../../types/groups.types"
import { formatJoinedDate } from "../../utils/date"
import { Link } from "react-router-dom"
import EditGroupModal from "./EditGroupModal"

const MyGroupCard = ({ myGroup }: MyGroupCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const joinedDate = formatJoinedDate(myGroup.joined_at)
  const isAdmin = myGroup.role === "admin"

  return (
    <>
      <Link
        to={`/grupo/${myGroup.group._id}`}
        className="block rounded-2xl overflow-hidden border border-[#FFD166]/60 shadow-[0_0_24px_rgba(255,209,102,0.10)] hover:shadow-[0_0_36px_rgba(255,209,102,0.18)] hover:border-[#FFD166]/80 hover:scale-[1.015] transition-all duration-200 cursor-pointer group bg-white/4"
      >

        {myGroup.group.image ? (
          <div className="relative h-44 overflow-hidden">
            <img
              src={myGroup.group.image}
              alt={myGroup.group.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#210B2C] via-[#210B2C]/50 to-[#210B2C]/5" />
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <h3 className="text-white font-black text-2xl leading-tight tracking-tight truncate drop-shadow-lg group-hover:text-[#FFD166] transition-colors duration-200">{myGroup.group.name}</h3>
            </div>
          </div>
        ) : (
          <div className="relative h-36 bg-[#BC96E6]/[0.07] flex items-center gap-4 px-5 overflow-hidden">

            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#BC96E6_1px,transparent_1px),linear-gradient(90deg,#BC96E6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#BC96E6]/10 blur-2xl pointer-events-none group-hover:bg-[#BC96E6]/15 transition-colors duration-200" />

            <div className="relative w-16 h-16 rounded-2xl bg-[#BC96E6]/20 border border-[#BC96E6]/30 flex items-center justify-center shrink-0 group-hover:border-[#BC96E6]/50 transition-colors duration-200">
              <span className="text-[#BC96E6] font-black text-2xl leading-none">
                {myGroup.group.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="relative flex-1 min-w-0">
              <h3 className="text-white font-black text-xl leading-tight tracking-tight truncate mb-1.5">{myGroup.group.name}</h3>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{myGroup.group.description}</p>
            </div>
          </div>
        )}

        {myGroup.group.image && (
          <div className="px-5 pt-4 pb-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-1.5">Descripción</p>
            <p className="text-white/65 text-sm leading-relaxed line-clamp-2">{myGroup.group.description}</p>
          </div>
        )}

        <div className="px-5 py-4 bg-[#FFD166]/8 border-t border-[#FFD166]/15 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {isAdmin ? (
              <span className="flex items-center gap-1.5 bg-[#BC96E6]/15 border border-[#BC96E6]/25 text-[#BC96E6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <i className="bi bi-shield-check text-[10px]" />
                Admin
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-white/[0.07] border border-white/10 text-white/50 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <i className="bi bi-person text-[10px]" />
                Miembro
              </span>
            )}

            {isAdmin && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditOpen(true) }}
                className="flex items-center gap-1.5 bg-[#BC96E6]/15 border border-[#BC96E6]/30 text-[#BC96E6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide hover:bg-[#BC96E6]/25 hover:border-[#BC96E6]/50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <i className="bi bi-pencil text-[10px]" />
                Editar
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <i className="bi bi-calendar3 text-white/25 text-xs" />
              <span className="text-white/30 text-xs">Desde {joinedDate}</span>
            </div>

            <span className="flex items-center gap-1.5 bg-[#FFD166]/10 border border-[#FFD166]/25 text-[#FFD166] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <i className="bi bi-arrow-right text-[10px]" />
              Ver grupo
            </span>
          </div>
        </div>
      </Link>

      <AnimatePresence>
        {isEditOpen && (
          <EditGroupModal
            group={myGroup.group}
            onClose={() => setIsEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default MyGroupCard
