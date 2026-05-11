import type { User } from "../../types/auth.types";

interface PaidByPickerProps {
    members: User[];
    value: string;
    onChange: (id: string) => void;
    error?: string | null;
}

const PaidByPicker = ({ members, value, onChange, error }: PaidByPickerProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">
                ¿Quién pagó? <span className="text-[#EF4444]">*</span>
            </label>
            <p className="text-white/30 text-xs -mt-0.5">Si varios pagaron, registrá un gasto por cada pagador.</p>
            <div className="flex flex-col gap-1.5">
                {members.map(member => (
                    <button
                        key={member._id}
                        type="button"
                        onClick={() => onChange(member._id)}
                        className={[
                            "flex items-center gap-3 w-full px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer",
                            value === member._id
                                ? "bg-[#3B82F6]/10 border-[#3B82F6]/35 text-white"
                                : "bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white/80"
                        ].join(" ")}
                    >
                        <div className={[
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                            value === member._id ? "border-[#3B82F6]" : "border-white/20"
                        ].join(" ")}>
                            {value === member._id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                            )}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-white/60 font-semibold text-xs">
                                {member.username.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-sm">{member.username}</span>
                    </button>
                ))}
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-[#EF4444] text-sm">
                    <i className="bi bi-exclamation-circle" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default PaidByPicker;
