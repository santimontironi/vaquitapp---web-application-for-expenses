import type { MyGroupsProps } from "../../types/groups.types"
import Loader from "../ui/Loader"
import MyGroupCard from "./MyGroupCard"

const MyGroups = ({ myGroups, loading }: MyGroupsProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
            <i className="bi bi-people text-[#10B981]" />
          </div>
          <h2 className="text-white">Mis grupos</h2>
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-white/8 to-transparent" />
        <span className="text-white/30 shrink-0">{myGroups.length} grupo{myGroups.length !== 1 ? "s" : ""}</span>
      </div>

      {loading.fetchLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
          {myGroups.map(group => (
            <MyGroupCard key={group._id} myGroup={group} />
          ))}
        </div>
      )}

    </div>
  )
}

export default MyGroups
