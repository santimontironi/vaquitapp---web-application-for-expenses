import type { Members } from "../../types/groups.types"

interface MemberOptionProps {
  member: Members
  active: boolean
  onToggle: (id: string) => void
}

const MemberOption = ({ member, active, onToggle }: MemberOptionProps) => (
  <button
    type="button"
    onClick={() => onToggle(member.user._id)}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors cursor-pointer ${active ? "bg-[#10B981]/10 border-[#10B981]/50 text-[#10B981]" : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"}`}
  >
    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
      {member.user.username.charAt(0).toUpperCase()}
    </span>
    {member.user.username}
    {active && <i className="bi bi-check" />}
  </button>
)

export default MemberOption
