import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import usePlan from "../hooks/usePlan"
import useExpense from "../hooks/useExpense"
import Loader from "../components/ui/Loader"
import { formatJoinedDate } from "../utils/date"
import CreateExpense from "../components/expenses/CreateExpense"
import ExpenseCard from "../components/expenses/ExpenseCard"

const PlanDetail = () => {
    const { idGroup, idPlan } = useParams<{ idGroup: string; idPlan: string }>()
    const { getPlanById, planById, loading } = usePlan()
    const { getExpenses, expenses, completeExpense, getBalanceData, balances, loading: expenseLoading } = useExpense()
    const navigate = useNavigate()
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

    useEffect(() => {
        if (idGroup && idPlan) {
            getPlanById(idGroup, idPlan)
            getExpenses(idGroup, idPlan)
            getBalanceData(idGroup, idPlan)
        }
    }, [idGroup, idPlan])

    if (loading.fetchByIdLoading) {
        return (
            <div className="min-h-screen bg-[#0A1020] flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (!planById) {
        return (
            <div className="min-h-screen bg-[#0A1020] flex items-center justify-center">
                <p className="text-white/40">No se encontró el plan.</p>
            </div>
        )
    }

    return (
        <>
        <div className="min-h-screen bg-[#0A1020] text-white">

            <div className="relative border-b border-white/6 bg-[#0A1020]/90 backdrop-blur-xl px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/grupo/${idGroup}`)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                >
                    <i className="bi bi-arrow-left" />
                </button>
                <h1 className="text-white font-semibold truncate">{planById.name}</h1>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">

                {planById.image ? (
                    <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/8">
                        <img src={planById.image} alt={planById.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0A1020]/70 to-transparent" />
                    </div>
                ) : (
                    <div className="w-full h-52 rounded-2xl border border-white/8 bg-linear-to-br from-[#10B981]/10 via-[#0A1020] to-[#3B82F6]/10 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                            <i className="bi bi-calendar-event text-[#10B981] text-xl" />
                        </div>
                        <span className="text-white/30 text-sm">Sin imagen</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="p-px rounded-2xl bg-linear-to-br from-[#10B981]/20 via-white/4 to-[#3B82F6]/15 xl:h-50 2xl:h-55 h-40">
                        <div className="rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-5 flex flex-col gap-4 h-full">

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                                    <i className="bi bi-info-circle text-[#10B981]" />
                                </div>
                                <h2 className="text-white font-semibold">Detalles</h2>
                            </div>

                            <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                            {planById.description && (
                                <div className="flex gap-3">
                                    <div className="w-0.5 rounded-full bg-[#10B981]/40 shrink-0" />
                                    <p className="text-white/55 leading-relaxed">{planById.description}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mt-auto">
                                <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8">
                                    <i className="bi bi-person text-white/30 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white/30 leading-none mb-0.5" style={{ fontSize: "10px" }}>Creado por</span>
                                        <span className="text-white/70 font-medium truncate">{planById.created_by.username}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8">
                                    <i className="bi bi-calendar3 text-white/30 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white/30 leading-none mb-0.5" style={{ fontSize: "10px" }}>Creación</span>
                                        <span className="text-white/70 truncate">{formatJoinedDate(planById.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="p-px rounded-2xl bg-linear-to-br from-[#10B981]/20 via-white/4 to-[#3B82F6]/15">
                        <div className="rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 flex flex-col gap-5 h-full">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                        <i className="bi bi-people text-[#10B981]" />
                                    </div>
                                    <h2 className="text-white font-semibold">Miembros</h2>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                                    {planById.members.length}
                                </span>
                            </div>


                            
                            <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                            {planById.members.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {planById.members.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#10B981]/20 to-[#3B82F6]/20 border border-white/10 flex items-center justify-center shrink-0">
                                                <span className="text-white/70 font-semibold text-xs">
                                                    {member.username.slice(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-white/70 text-sm">{member.username}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/30 text-sm text-center py-4">Sin miembros asignados.</p>
                            )}

                        </div>
                    </div>

                    <div className="md:col-span-2 p-px rounded-2xl bg-linear-to-br from-[#3B82F6]/15 via-white/4 to-[#10B981]/10">
                        <div className="rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 flex flex-col gap-5">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                                        <i className="bi bi-receipt text-[#3B82F6]" />
                                    </div>
                                    <h2 className="text-white font-semibold">Gastos</h2>
                                </div>
                                <button
                                    onClick={() => setIsExpenseModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-xs font-medium
                                               hover:-translate-y-0.5 hover:bg-[#10B981]/18 hover:border-[#10B981]/45 hover:shadow-[0_4px_16px_rgba(16,185,129,0.25)]
                                               active:translate-y-0 active:scale-[0.97]
                                               transition-all duration-200 cursor-pointer"
                                >
                                    <i className="bi bi-plus-circle" />
                                    <span className="hidden sm:inline">Agregar gasto</span>
                                    <span className="sm:hidden">Agregar</span>
                                </button>
                            </div>

                            <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                            {expenseLoading.fetchLoading ? (
                                <div className="flex justify-center py-6">
                                    <Loader />
                                </div>
                            ) : expenses.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {expenses.map(expense => (
                                        <ExpenseCard
                                            key={expense._id}
                                            expense={expense}
                                            onDelete={() => completeExpense(idGroup!, idPlan!, expense._id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                                        <i className="bi bi-receipt text-[#3B82F6]" />
                                    </div>
                                    <p className="text-white/30 text-sm max-w-xs">Los gastos de este plan aparecerán aquí.</p>
                                </div>
                            )}

                        </div>
                    </div>
                        
                    {expenses.length > 0 && <div className="md:col-span-2 p-px rounded-2xl bg-linear-to-br from-[#F59E0B]/15 via-white/4 to-[#10B981]/10">
                        <div className="rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 flex flex-col gap-5">

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                                    <i className="bi bi-arrow-left-right text-[#F59E0B]" />
                                </div>
                                <h2 className="text-white font-semibold">Balances</h2>
                            </div>

                            <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                            {expenseLoading.balancesLoading ? (
                                <div className="flex justify-center py-6">
                                    <Loader />
                                </div>
                            ) : balances.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {balances.map((tx, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/6">
                                            <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-red-400 font-semibold text-xs">
                                                    {tx.from.username.slice(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-white/80 text-sm font-medium truncate">
                                                    <span className="text-red-400">{tx.from.username}</span>
                                                    <span className="text-white/40 mx-1">le debe a</span>
                                                    <span className="text-[#10B981]">{tx.to.username}</span>
                                                </span>
                                            </div>
                                            <span className="text-[#F59E0B] font-semibold text-sm shrink-0">
                                                ${tx.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                        <i className="bi bi-check2-circle text-[#10B981] text-xl" />
                                    </div>
                                    <p className="text-white/30 text-sm max-w-xs">Todos están al día. No hay deudas pendientes.</p>
                                </div>
                            )}

                        </div>
                    </div>}

                </div>
            </div>
        </div>

        {isExpenseModalOpen && (
            <CreateExpense
                idGroup={idGroup!}
                idPlan={idPlan!}
                members={planById.members}
                onClose={() => setIsExpenseModalOpen(false)}
            />
        )}
        </>
    )
}

export default PlanDetail
