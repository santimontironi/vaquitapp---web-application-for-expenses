import type { MyGroupsProps } from "../../types/groups.types"
import { motion } from "motion/react"
import { fadeUp } from "../../utils/motion"
import Loader from "../ui/Loader"
import MyGroupCard from "./MyGroupCard"

const MyGroups = ({ myGroups, loading }: MyGroupsProps) => {
  return (
    <div>
      <motion.div {...fadeUp()} className="text-center mb-12 md:mb-16">

        <div className="inline-flex items-center gap-2 bg-[#BC96E6]/10 border border-[#BC96E6]/20 rounded-full px-4 py-1.5 mb-6">
          <i className="bi bi-collection text-[#BC96E6] text-xs" />
          <span className="text-[#BC96E6]/80 text-[11px] font-bold uppercase tracking-[0.15em]">Mis grupos</span>
        </div>

        <h1 className="text-white font-black text-4xl md:text-5xl xl:text-6xl tracking-tight leading-tight mb-4">
          Tus <span className="text-[#BC96E6]">grupos</span>{" "}
          <span className="text-white">&</span>{" "}
          <span className="text-[#FFD166]">planes</span>
        </h1>

        <p className="text-white/35 text-sm md:text-base max-w-sm mx-auto mb-10 leading-relaxed">
          Desde acá organizás tus salidas, dividís gastos y saldás cuentas con cada grupo.
        </p>

        <div className="inline-flex items-stretch overflow-hidden rounded-2xl border border-[#BC96E6]/25 shadow-[0_0_36px_rgba(188,150,230,0.14)] mb-10">
          <div className="flex flex-col items-center justify-center bg-[#BC96E6]/12 px-8 py-4">
            <span className="text-[#BC96E6] font-black text-5xl md:text-6xl leading-none">{myGroups.length}</span>
            <span className="text-[#BC96E6]/55 text-[10px] uppercase tracking-[0.2em] font-bold mt-1.5">
              grupo{myGroups.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="w-px bg-linear-to-b from-[#BC96E6]/25 via-white/10 to-[#FFD166]/25" />
          <div className="flex flex-col items-center justify-center gap-2 bg-[#FFD166]/[0.07] px-7 py-4">
            <i className="bi bi-people-fill text-[#FFD166]/55 text-3xl" />
            <span className="text-[#FFD166]/55 text-[10px] uppercase tracking-[0.18em] font-bold">activos</span>
          </div>
        </div>

        <div className="h-px w-50 md:w-80 xl:w-200 mx-auto bg-linear-to-r from-transparent via-[#FFD166] to-transparent" />

      </motion.div>

      {loading.fetchLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {myGroups.map((group, index) => (
            <motion.div key={group._id} {...fadeUp(Math.min(index, 8) * 0.07)}>
              <MyGroupCard myGroup={group} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyGroups
