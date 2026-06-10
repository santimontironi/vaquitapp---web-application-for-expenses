import { useForm } from "react-hook-form"
import type { AddMemberData } from "../../types/groups.types"
import { useState } from "react"
import useGroup from "../../hooks/useGroup"
import Swal from "sweetalert2"

const AddMember = ({ idGroup }: { idGroup: string | undefined }) => {
  const { register, formState: { errors }, handleSubmit, reset } = useForm<AddMemberData>()
  const { inviteMember, loading } = useGroup()
  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  async function submitForm(data: AddMemberData) {
    if (idGroup) {
      try {
        await inviteMember(idGroup, data)
        Swal.fire({
          icon: "success",
          title: "Invitación enviada",
          text: `Se ha enviado una invitación a ${data.email}`,
          confirmButtonText: "Aceptar",
          timer: 3000,
          timerProgressBar: true,
          buttonsStyling: false,
          customClass: {
            popup: "va-swal-popup",
            title: "va-swal-title",
            htmlContainer: "va-swal-text",
            confirmButton: "va-swal-confirm",
          },
        })
        reset()
      } catch (error: any) {
        if (error.response?.data?.message) {
          setErrorResponse(error.response.data.message)
        }
        reset()
      }
    }
  }

  return (
    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
            <i className="bi bi-person-plus text-[#BC96E6] text-sm" />
          </div>
          <h2 className="text-white font-semibold text-base">Agregar miembro</h2>
        </div>

        <div className="border-t border-white/[0.07] mb-5" />

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">Email</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <i className="bi bi-envelope text-white/30 text-sm" />
              </div>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full bg-white/8 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                {...register("email", { required: true, onChange: () => setErrorResponse(null) })}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs">
                <i className="bi bi-exclamation-circle" />
                El email es requerido
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">Rol</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="member"
                  className="sr-only peer"
                  {...register("role", { required: true })}
                />
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/15 rounded-xl px-4 py-3 peer-checked:border-[#FFD166] peer-checked:bg-[#FFD166]/10 transition-all duration-150">
                  <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 peer-checked:bg-[#FFD166]/20">
                    <i className="bi bi-person text-white/40 peer-checked:text-[#FFD166] text-sm" />
                  </div>
                  <span className="text-white/70 peer-checked:text-[#FFD166] text-sm font-medium">Miembro</span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="admin"
                  className="sr-only peer"
                  {...register("role", { required: true })}
                />
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/15 rounded-xl px-4 py-3 peer-checked:border-[#FFD166] peer-checked:bg-[#FFD166]/10 transition-all duration-150">
                  <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 peer-checked:bg-[#FFD166]/20">
                    <i className="bi bi-shield-check text-white/40 peer-checked:text-[#FFD166] text-sm" />
                  </div>
                  <span className="text-white/70 peer-checked:text-[#FFD166] text-sm font-medium">Admin</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading.invitationLoading}
            className="w-full hover:bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading.invitationLoading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" />
                Enviando invitación...
              </>
            ) : (
              "Enviar invitación"
            )}
          </button>

          {errorResponse && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              <i className="bi bi-exclamation-triangle shrink-0" />
              <p>{errorResponse}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddMember
