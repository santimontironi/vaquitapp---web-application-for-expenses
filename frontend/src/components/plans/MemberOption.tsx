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
    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer border ${
      active
        ? "bg-[#BC96E6]/15 border-[#BC96E6]/30 text-[#BC96E6]"
        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/9 hover:text-white/70 hover:border-white/20"
    }`}
  >
    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
      active ? "bg-[#BC96E6]/25 text-[#BC96E6]" : "bg-white/10 text-white/40"
    }`}>
      {member.user.username.charAt(0).toUpperCase()}
    </span>
    {member.user.username}
    {active && <i className="bi bi-check text-xs ml-0.5" />}
  </button>
)

export default MemberOption
