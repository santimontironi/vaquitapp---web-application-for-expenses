import type { User } from "../../types/auth.types";

interface PaidByPickerProps {
    members: User[];
    value: string;
    onChange: (id: string) => void;
    error?: string | null;
}

const PaidByPicker = ({ members, value, onChange, error }: PaidByPickerProps) => {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                ¿Quién pagó? <span className="text-[#BC96E6]">*</span>
            </label>
            <p className="text-white/30 text-xs">Si varios pagaron, registrá un gasto por cada pagador.</p>
            <div className="flex flex-wrap gap-2 mt-1">
                {members.map(member => (
                    <button
                        key={member._id}
                        type="button"
                        onClick={() => onChange(member._id)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium border transition-all duration-150 cursor-pointer ${
                            value === member._id
                                ? "bg-[#BC96E6]/15 border-[#BC96E6]/30 text-[#BC96E6]"
                                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/9 hover:text-white/70 hover:border-white/20"
                        }`}
                    >
                        <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                            value === member._id ? "border-[#BC96E6]" : "border-white/20"
                        }`}>
                            {value === member._id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#BC96E6]" />
                            )}
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            value === member._id ? "bg-[#BC96E6]/25 text-[#BC96E6]" : "bg-white/10 text-white/40"
                        }`}>
                            <span>{member.username.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span>{member.username}</span>
                    </button>
                ))}
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

export default PaidByPicker;
