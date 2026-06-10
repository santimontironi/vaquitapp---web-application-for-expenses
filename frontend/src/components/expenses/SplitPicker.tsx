import type { User } from "../../types/auth.types";

interface SplitPickerProps {
    members: User[];
    value: string[];
    onChange: (id: string) => void;
    error?: string | null;
}

const SplitPicker = ({ members, value, onChange, error }: SplitPickerProps) => {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Dividir entre <span className="text-[#BC96E6]">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
                {members.map(member => {
                    const isSelected = value.includes(member._id);
                    return (
                        <button
                            key={member._id}
                            type="button"
                            onClick={() => onChange(member._id)}
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? "bg-[#BC96E6]/15 border-[#BC96E6]/30 text-[#BC96E6]"
                                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/9 hover:text-white/70 hover:border-white/20"
                            }`}
                        >
                            <i className={`text-sm ${isSelected ? "bi bi-check-circle-fill text-[#BC96E6]" : "bi bi-circle text-white/25"}`} />
                            {member.username}
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                    <i className="bi bi-exclamation-circle" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default SplitPicker;
