import { useEffect } from "react";
import type { PlanHistoryModalProps } from "../../types/plans.types";
import usePlan from "../../hooks/usePlan";
import { formatJoinedDate } from "../../utils/date";
import Loader from "../ui/Loader";

const PlanHistory = ({ idGroup, onClose }: PlanHistoryModalProps) => {
    const { getPlanHistory, planHistory, loading } = usePlan();

    useEffect(() => {
        getPlanHistory(idGroup);
    }, [idGroup]);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-[#0A1020]/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl z-10">
                <div className="p-px rounded-3xl bg-linear-to-br from-[#10B981]/35 via-white/5 to-[#3B82F6]/25 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                    <div className="bg-[#0A1020]/95 backdrop-blur-3xl rounded-[23px] p-6 flex flex-col gap-5 max-h-[85vh]">

                        <div className="flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                    <i className="bi bi-clock-history text-[#10B981]" />
                                </div>
                                <h2 className="text-white font-semibold">Historial de planes</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {planHistory.length > 0 && (
                                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                                        {planHistory.length} {planHistory.length === 1 ? "plan" : "planes"}
                                    </span>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                                >
                                    <i className="bi bi-x text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent shrink-0" />

                        <div className="overflow-y-auto flex flex-col gap-2 pr-1">
                            {loading.fetchLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader />
                                </div>
                            ) : planHistory.length > 0 ? (
                                planHistory.map(plan => (
                                    <div
                                        key={plan._id}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/6"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <i className="bi bi-calendar-event text-white/30" />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-white font-medium truncate">{plan.name}</span>
                                                {plan.state === "completed" && (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] text-xs shrink-0">
                                                        <i className="bi bi-check-circle" />
                                                        Completado
                                                    </span>
                                                )}
                                                {plan.state === "cancelled" && (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/25 text-red-400 text-xs shrink-0">
                                                        <i className="bi bi-x-circle" />
                                                        Cancelado
                                                    </span>
                                                )}
                                            </div>

                                            {plan.description && (
                                                <span className="text-white/40 text-xs">{plan.description}</span>
                                            )}

                                            {plan.members.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {plan.members.map(m => (
                                                        <span
                                                            key={m._id}
                                                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs"
                                                        >
                                                            <i className="bi bi-person" style={{ fontSize: "10px" }} />
                                                            {m.username}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <span className="text-white/25 text-xs">{formatJoinedDate(plan.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                        <i className="bi bi-clock-history text-[#10B981]" />
                                    </div>
                                    <p className="text-white/30 text-sm max-w-xs">No hay planes completados o cancelados todavía.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanHistory;
