import usePlan from "../../hooks/usePlan"
import { AnimatePresence } from "motion/react"
import Loader from "../ui/Loader"
import PlanItem from "./PlanItem"
import PlanHistory from "./PlanHistory"
import { useEffect, useState } from "react"
import type { AllPlansProps } from "../../types/plans.types"
import Swal from "sweetalert2"

const AllPlans = ({ idGroup }: AllPlansProps) => {
  const { plans, loading, getPlans, checkPlanAsCompleted } = usePlan()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    getPlans(idGroup)
  }, [idGroup])

  const handleCheckCompleted = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Marcar este plan como completado?",
      text: "Esta acción no se puede deshacer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar como completado",
      cancelButtonText: "No, cancelar",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "va-swal-popup",
        title: "va-swal-title",
        htmlContainer: "va-swal-text",
        confirmButton: "va-swal-confirm",
        cancelButton: "va-swal-cancel",
      },
    })
    if (result.isConfirmed) {
      checkPlanAsCompleted(idGroup, id)
    }
  }

  return (
    <>
      <div className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-[#FFD166]/40 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
              <i className="bi bi-calendar-event text-[#BC96E6] text-sm" />
            </div>
            <h2 className="text-white font-semibold text-base">Planes</h2>
          </div>
          <div className="flex items-center gap-2">
            {!loading.fetchLoading && (
              <span className="bg-[#FFD166]/10 text-[#FFD166] text-xs font-semibold px-2.5 py-1 rounded-full">
                {plans.length} {plans.length === 1 ? "plan" : "planes"}
              </span>
            )}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 border border-[#BC96E6]/25 text-[#BC96E6] rounded-xl px-3 py-2 text-xs font-medium hover:bg-[#BC96E6]/10 hover:border-[#BC96E6]/40 transition-all duration-150 cursor-pointer"
            >
              <i className="bi bi-clock-history" />
              <span>Historial</span>
            </button>
          </div>
        </div>

        <div className="border-t border-white/[0.07] mb-4" />

        {loading.fetchLoading ? (
          <div className="py-4">
            <Loader />
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {plans.map((plan) => (
              <PlanItem
                key={plan._id}
                plan={plan}
                idGroup={idGroup}
                onCheckCompleted={() => handleCheckCompleted(plan._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-10 gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center">
              <i className="bi bi-calendar-event text-[#BC96E6]/40 text-xl" />
            </div>
            <p className="text-white/30 text-sm">No hay planes en este grupo todavía.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isHistoryOpen && (
          <PlanHistory idGroup={idGroup} onClose={() => setIsHistoryOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default AllPlans
