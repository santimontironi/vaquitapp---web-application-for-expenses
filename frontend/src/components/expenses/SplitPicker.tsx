import type { User } from "../../types/auth.types";

interface SplitPickerProps {
    members: User[];
    value: string[];
    onChange: (id: string) => void;
    error?: string | null;
}

const SplitPicker = ({ members, value, onChange, error }: SplitPickerProps) => {
    return (
        <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">
                Dividir entre <span className="text-[#EF4444]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {members.map(member => (
                    <button
                        key={member._id}
                        type="button"
                        onClick={() => onChange(member._id)}
                        className={[
                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer text-sm",
                            value.includes(member._id)
                                ? "bg-[#10B981]/12 border-[#10B981]/35 text-[#10B981]"
                                : "bg-white/3 border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                        ].join(" ")}
                    >
                        <i className={value.includes(member._id) ? "bi bi-check-circle-fill" : "bi bi-circle"} />
                        {member.username}
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

export default SplitPicker;
