import { useEffect } from "react";
import { motion } from "motion/react";
import { modalBackdrop, modalPanel } from "../../utils/motion";
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
            <motion.div {...modalBackdrop} onClick={onClose} className="absolute inset-0 bg-[#210B2C]/80 backdrop-blur-md" />

            <motion.div {...modalPanel} className="relative w-full max-w-lg z-10 max-h-[85vh] flex flex-col">
                <div className="bg-[#210B2C] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

                    <div className="flex items-center justify-between p-5 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
                                <i className="bi bi-clock-history text-[#BC96E6] text-sm" />
                            </div>
                            <h2 className="text-white font-semibold text-lg">Historial de planes</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {planHistory.length > 0 && (
                                <span className="bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {planHistory.length} {planHistory.length === 1 ? "plan" : "planes"}
                                </span>
                            )}
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/10 text-white/40 hover:text-[#BC96E6] hover:bg-[#BC96E6]/8 hover:border-[#BC96E6]/20 transition-all duration-150 cursor-pointer"
                            >
                                <i className="bi bi-x text-lg" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.07] mx-5" />

                    <div className="overflow-y-auto p-5 space-y-3">
                        {loading.fetchLoading ? (
                            <div className="py-6">
                                <Loader />
                            </div>
                        ) : planHistory.length > 0 ? (
                            planHistory.map(plan => (
                                <div key={plan._id} className="flex items-start gap-3 bg-white/4 border border-white/[0.07] rounded-xl px-4 py-3.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <i className="bi bi-calendar-event text-[#BC96E6]/60 text-xs" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-white/80 font-medium text-sm">{plan.name}</span>
                                            {plan.state === "completed" && (
                                                <span className="flex items-center gap-1 bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    <i className="bi bi-check-circle text-xs" />
                                                    Completado
                                                </span>
                                            )}
                                            {plan.state === "cancelled" && (
                                                <span className="flex items-center gap-1 bg-white/10 text-white/40 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    <i className="bi bi-x-circle text-xs" />
                                                    Cancelado
                                                </span>
                                            )}
                                        </div>

                                        {plan.description && (
                                            <span className="text-white/40 text-xs block mb-1.5">{plan.description}</span>
                                        )}

                                        {plan.members.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                                                {plan.members.map(m => (
                                                    <span key={m._id} className="flex items-center gap-1 bg-[#BC96E6]/10 text-[#BC96E6]/70 text-xs px-2 py-0.5 rounded-full">
                                                        <i className="bi bi-person text-xs" />
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
                            <div className="flex flex-col items-center text-center py-12 gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center">
                                    <i className="bi bi-clock-history text-[#BC96E6]/40 text-xl" />
                                </div>
                                <p className="text-white/30 text-sm">No hay planes completados o cancelados todavía.</p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default PlanHistory;
