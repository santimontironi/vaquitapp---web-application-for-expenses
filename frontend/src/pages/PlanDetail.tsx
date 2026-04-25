import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import usePlan from "../hooks/usePlan"
import Loader from "../components/ui/Loader"
import { formatJoinedDate } from "../utils/date"

const PlanDetail = () => {
    const { idGroup, idPlan } = useParams<{ idGroup: string; idPlan: string }>()
    const { getPlanById, planById, loading } = usePlan()
    const navigate = useNavigate()

    useEffect(() => {
        if (idGroup && idPlan) {
            getPlanById(idGroup, idPlan)
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
        <div className="min-h-screen bg-[#0A1020] text-white">

            <div className="relative border-b border-white/6 bg-[#0A1020]/90 backdrop-blur-xl px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/grupo/${idGroup}`)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                >
                    <i className="bi bi-arrow-left" />
                </button>
                <h1 className="text-white font-semibold truncate">{planById.name}</h1>
                <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs shrink-0 bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]">
                    <i className="bi bi-play-circle" style={{ fontSize: "11px" }} />
                    Activo
                </span>
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

                    <div className="p-px rounded-2xl bg-linear-to-br from-[#10B981]/20 via-white/4 to-[#3B82F6]/15">
                        <div className="rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 flex flex-col gap-5 h-full">

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                    <i className="bi bi-info-circle text-[#10B981]" />
                                </div>
                                <h2 className="text-white font-semibold">Detalles</h2>
                            </div>

                            <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                            {planById.description && (
                                <p className="text-white/55 leading-relaxed">{planById.description}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/30 text-xs">Creado por</span>
                                    <span className="text-white/70 text-sm font-medium">{planById.created_by.username}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/30 text-xs">Fecha de creación</span>
                                    <span className="text-white/70 text-sm">{formatJoinedDate(planById.created_at)}</span>
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

                            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                                    <i className="bi bi-receipt text-[#3B82F6]" />
                                </div>
                                <p className="text-white/30 text-sm max-w-xs">Los gastos de este plan aparecerán aquí.</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PlanDetail
