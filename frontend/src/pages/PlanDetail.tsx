import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { fadeUp } from "../utils/motion"
import Swal from "sweetalert2"
import usePlan from "../hooks/usePlan"
import useExpense from "../hooks/useExpense"
import Loader from "../components/ui/Loader"
import { formatJoinedDate } from "../utils/date"
import CreateExpense from "../components/expenses/CreateExpense"
import ExpenseCard from "../components/expenses/ExpenseCard"

const PlanDetail = () => {
    const { idGroup, idPlan } = useParams<{ idGroup: string; idPlan: string }>()
    const { getPlanById, planById, loading } = usePlan()
    const { getExpenses, expenses, deleteExpense, completeAllExpenses, getBalanceData, balances, loading: expenseLoading, completedExpenses, getCompletedExpenses } = useExpense()
    const navigate = useNavigate()
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

    useEffect(() => {
        if (idGroup && idPlan) {
            getPlanById(idGroup, idPlan)
            getExpenses(idGroup, idPlan)
            getBalanceData(idGroup, idPlan)
            getCompletedExpenses(idGroup, idPlan)
        }
    }, [idGroup, idPlan])

    if (loading.fetchByIdLoading) {
        return (
            <div className="min-h-screen bg-[#210B2C] flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (!planById) {
        return (
            <div className="min-h-screen bg-[#210B2C] flex items-center justify-center">
                <p className="text-white/50 text-sm">No se encontró el plan.</p>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-[#210B2C] relative">
        
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
                    <div className="absolute top-14 left-0 w-72 h-px bg-linear-to-r from-[#BC96E6]/60 to-transparent" />
                    <div className="absolute top-28 left-0 w-48 h-px bg-linear-to-r from-[#FFD166]/45 to-transparent" />
                    <div className="absolute top-44 left-0 w-28 h-px bg-linear-to-r from-[#BC96E6]/35 to-transparent" />
                    <div className="absolute top-16 right-0 w-68 h-px bg-linear-to-l from-[#BC96E6]/55 to-transparent" />
                    <div className="absolute top-32 right-0 w-44 h-px bg-linear-to-l from-[#FFD166]/40 to-transparent" />
                    <div className="absolute bottom-28 right-0 w-56 h-px bg-linear-to-l from-[#BC96E6]/45 to-transparent" />
                    <div className="absolute bottom-44 right-0 w-32 h-px bg-linear-to-l from-[#FFD166]/32 to-transparent" />
                    <div className="absolute top-[35%] right-8 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/50 to-transparent" />
                    <div className="absolute top-[55%] left-10 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/38 to-transparent" />
                    <div className="absolute top-[70%] right-28 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/32 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-6 md:py-8">

                    {/* Header */}
                    <motion.div {...fadeUp()} className="flex items-center gap-3 mb-8">
                        <button
                            onClick={() => navigate(`/grupo/${idGroup}`)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/10 text-white/60 hover:text-[#BC96E6] hover:bg-[#BC96E6]/8 hover:border-[#BC96E6]/20 transition-all duration-150 cursor-pointer shrink-0"
                        >
                            <i className="bi bi-arrow-left" />
                        </button>
                        <h1 className="text-white font-bold text-xl md:text-2xl tracking-tight">{planById.name}</h1>
                    </motion.div>

                    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">

                        <motion.div {...fadeUp(0.08)} className="space-y-5">

                            {planById.image ? (
                                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video xl:aspect-square shadow-lg shadow-black/20">
                                    <img src={planById.image} alt={planById.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-[#BC96E6]/5 border border-[#BC96E6]/15 aspect-video xl:aspect-square flex flex-col items-center justify-center gap-2">
                                    <div className="w-16 h-16 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center">
                                        <i className="bi bi-calendar-event text-[#BC96E6] text-2xl" />
                                    </div>
                                    <span className="text-white/30 text-xs">Sin imagen</span>
                                </div>
                            )}

                            <div className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-[#FFD166]/40 transition-colors duration-200">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-7 h-7 rounded-lg bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
                                        <i className="bi bi-info-circle text-[#BC96E6] text-xs" />
                                    </div>
                                    <h2 className="text-white font-semibold">Detalles</h2>
                                </div>

                                <div className="border-t border-white/[0.07] mb-4" />

                                {planById.description && (
                                    <div className="mb-4 pl-3 border-l-2 border-[#BC96E6]/30">
                                        <p className="text-white/60 text-sm leading-relaxed">{planById.description}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                            <i className="bi bi-person text-white/40 text-sm" />
                                        </div>
                                        <div>
                                            <span className="text-white/30 text-xs block">Creado por</span>
                                            <span className="text-white/80 text-sm font-medium">{planById.created_by.username}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                            <i className="bi bi-calendar3 text-white/40 text-sm" />
                                        </div>
                                        <div>
                                            <span className="text-white/30 text-xs block">Creación</span>
                                            <span className="text-[#FFD166]/70 text-sm font-medium">{formatJoinedDate(planById.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-[#FFD166]/40 transition-colors duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
                                            <i className="bi bi-people text-[#BC96E6] text-xs" />
                                        </div>
                                        <h2 className="text-white font-semibold">Miembros</h2>
                                    </div>
                                    <span className="bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">{planById.members.length}</span>
                                </div>

                                <div className="border-t border-white/[0.07] mb-4" />

                                {planById.members.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {planById.members.map((member) => (
                                            <div key={member._id} className="flex items-center gap-2 bg-white/4 border border-white/[0.07] rounded-xl px-3 py-2">
                                                <div className="w-6 h-6 rounded-full bg-[#BC96E6]/20 flex items-center justify-center shrink-0">
                                                    <span className="text-[#BC96E6] font-semibold text-xs">{member.username.slice(0, 2).toUpperCase()}</span>
                                                </div>
                                                <span className="text-white/70 text-sm">{member.username}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/30 text-sm">Sin miembros asignados.</p>
                                )}
                            </div>
                        </motion.div>

                        <motion.div {...fadeUp(0.16)} className="space-y-5">

                            <div className="bg-white/6 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-[#FFD166]/40 transition-colors duration-200">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#FFD166]/10 flex items-center justify-center shrink-0">
                                            <i className="bi bi-receipt text-[#FFD166] text-sm" />
                                        </div>
                                        <h2 className="text-white font-semibold text-lg">Gastos</h2>
                                        {expenses.length > 0 && (
                                            <span className="bg-white/8 text-white/50 text-xs font-semibold px-2.5 py-1 rounded-full">{expenses.length}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsExpenseModalOpen(true)}
                                        className="flex items-center gap-1.5 bg-[#FFD166]/10 border border-[#FFD166]/25 text-[#FFD166] font-semibold rounded-xl px-3.5 py-2 text-xs hover:bg-[#FFD166]/20 hover:border-[#FFD166]/40 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                                    >
                                        <i className="bi bi-plus-circle" />
                                        <span>Agregar gasto</span>
                                    </button>
                                </div>

                                <div className="border-t border-white/[0.07] mb-4" />

                                {expenseLoading.fetchLoading ? (
                                    <div className="py-4">
                                        <Loader />
                                    </div>
                                ) : expenses.length > 0 ? (
                                    <div className="space-y-3">
                                        {expenses.map(expense => (
                                            <ExpenseCard
                                                key={expense._id}
                                                expense={expense}
                                                onDelete={() => deleteExpense(idGroup!, idPlan!, expense._id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-8 gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#FFD166]/10 flex items-center justify-center">
                                            <i className="bi bi-receipt text-[#FFD166]/40 text-xl" />
                                        </div>
                                        <p className="text-white/30 text-sm">Los gastos de este plan aparecerán aquí.</p>
                                    </div>
                                )}

                                {expenses.length > 0 && (
                                    <>
                                        <div className="border-t border-white/[0.07] my-4" />
                                        <button
                                            onClick={async () => {
                                                const result = await Swal.fire({
                                                    title: "¿Saldar todos los gastos?",
                                                    text: "Hacé esto cuando ya cobraste tu parte a todos. Los gastos activos del plan desaparecerán del balance.",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "Sí, saldar todo",
                                                    cancelButtonText: "Cancelar",
                                                    buttonsStyling: false,
                                                    customClass: {
                                                        popup: "va-swal-popup",
                                                        title: "va-swal-title",
                                                        htmlContainer: "va-swal-text",
                                                        confirmButton: "va-swal-confirm va-swal-confirm-amber",
                                                        cancelButton: "va-swal-cancel",
                                                    },
                                                })
                                                if (result.isConfirmed) {
                                                    completeAllExpenses(idGroup!, idPlan!)
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-500/10 transition-all duration-150 cursor-pointer"
                                        >
                                            <i className="bi bi-check2-all text-[#FFD166]" />
                                            <span>Saldar todos los gastos</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {expenses.length > 0 && (
                                <div className="bg-white/6 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-[#FFD166]/40 transition-colors duration-200">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-[#FFD166]/10 flex items-center justify-center shrink-0">
                                            <i className="bi bi-arrow-left-right text-[#FFD166] text-sm" />
                                        </div>
                                        <h2 className="text-white font-semibold text-lg">Balances</h2>
                                    </div>

                                    <div className="border-t border-white/[0.07] mb-4" />

                                    {expenseLoading.balancesLoading ? (
                                        <div className="py-4">
                                            <Loader />
                                        </div>
                                    ) : balances.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {balances.map((tx, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/4 border border-white/10 rounded-xl px-4 py-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#BC96E6]/20 flex items-center justify-center shrink-0">
                                                        <span className="text-[#BC96E6] font-semibold text-xs">{tx.from.username.slice(0, 2).toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-white/70 text-sm">
                                                            <span className="text-white font-medium">{tx.from.username}</span>
                                                            <span className="text-[#FFD166]/60"> le debe a </span>
                                                            <span className="text-white font-medium">{tx.to.username}</span>
                                                        </span>
                                                    </div>
                                                    <span className="text-[#FFD166] font-bold text-base shrink-0 tabular-nums">${tx.amount.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center py-8 gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <i className="bi bi-check2-circle text-emerald-400 text-xl" />
                                            </div>
                                            <p className="text-white/30 text-sm">Todos están al día. No hay deudas pendientes.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {completedExpenses.length > 0 && (
                                <div className="bg-white/6 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-[#FFD166]/40 transition-colors duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
                                                <i className="bi bi-clock-history text-[#BC96E6] text-sm" />
                                            </div>
                                            <h2 className="text-white font-semibold text-lg">Historial de gastos saldados</h2>
                                        </div>
                                        <span className="bg-white/8 text-white/50 text-xs font-semibold px-2.5 py-1 rounded-full">{completedExpenses.length}</span>
                                    </div>

                                    <div className="border-t border-white/[0.07] mb-4" />

                                    <div className="space-y-3">
                                        {completedExpenses.map((expense) => (
                                            <div key={expense._id} className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-4 py-3">
                                                <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <i className="bi bi-check-circle-fill text-emerald-400 text-xs" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <span className="text-white/70 text-sm block truncate">
                                                        {expense.description
                                                            ? expense.description
                                                            : <span className="text-white/30 italic">Sin descripción</span>
                                                        }
                                                    </span>
                                                    <span className="text-white/30 text-xs">
                                                        Pagó: <span className="text-[#FFD166]/60">{expense.paid_by.username}</span>
                                                    </span>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <span className="text-[#FFD166] font-bold text-sm block tabular-nums">${expense.amount.toFixed(2)}</span>
                                                    <span className="text-white/30 text-xs">{formatJoinedDate(expense.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpenseModalOpen && (
                    <CreateExpense
                        idGroup={idGroup!}
                        idPlan={idPlan!}
                        members={planById.members}
                        onClose={() => setIsExpenseModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default PlanDetail
