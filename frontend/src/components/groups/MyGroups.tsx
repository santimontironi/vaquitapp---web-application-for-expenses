import type { MyGroupsProps } from "../../types/groups.types"
import Loader from "../ui/Loader"
import MyGroupCard from "./MyGroupCard"

const MyGroups = ({ myGroups, loading }: MyGroupsProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.15)]">
            <i className="bi bi-people text-[#10B981]" />
          </div>
          <h2 className="text-white">Mis grupos</h2>
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-[#10B981]/15 to-transparent" />
        <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] font-medium shadow-[0_0_12px_rgba(16,185,129,0.12)]">
          <i className="bi bi-collection" style={{ fontSize: "11px" }} />
          {myGroups.length} grupo{myGroups.length !== 1 ? "s" : ""}
        </span>
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
