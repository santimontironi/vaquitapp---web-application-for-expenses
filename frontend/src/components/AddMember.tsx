import { useForm } from "react-hook-form"
import type { AddMemberData } from "../types"
import { useState } from "react"
import useGroup from "../hooks/useGroup"
import Swal from "sweetalert2"

const AddMember = ({ idGroup }: { idGroup: string | undefined }) => {

  const { register, formState: { errors }, handleSubmit, reset } = useForm<AddMemberData>()

  const { inviteMember } = useGroup()

  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  async function submitForm(data: AddMemberData) {
    if (idGroup) {
      try{
        await inviteMember(idGroup, data)
        Swal.fire({
          icon: "success",
          title: "Invitación enviada",
          text: `Se ha enviado una invitación a ${data.email}`,
          confirmButtonText: "Aceptar",
          background: "#0A1020",
          color: "#FFFFFF",
          timer: 3000,
          timerProgressBar: true,
        })
        reset()
      }
      catch(error: any) {
        if(error.response?.data?.message){
          setErrorResponse(error.response.data.message)
        }
        reset()
      }
    }
  }

  return (
    <div className="relative p-px rounded-2xl bg-linear-to-br from-[#10B981]/20 via-white/4 to-[#3B82F6]/15 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="relative rounded-[15px] bg-[#0A1020]/85 backdrop-blur-2xl p-6 md:p-8 overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3B82F6]/4 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative flex flex-col gap-6">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
              <i className="bi bi-person-plus text-[#10B981]" />
            </div>
            <h2 className="text-white font-semibold">Agregar miembro</h2>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(submitForm)}>

            <div className="flex flex-col gap-2">
              <label className="text-white/60 text-sm">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <i className="bi bi-envelope text-white/30" />
                </div>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email", { required: true, onChange: () => setErrorResponse(null) })}
                  className={`w-full bg-white/4 border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 outline-none transition-all duration-200
                    focus:bg-white/[0.07] focus:border-[#10B981]/50 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]
                    ${errors.email ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-400/80 text-xs">
                  <i className="bi bi-exclamation-circle" />
                  El email es requerido
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/60 text-sm">Rol</label>
              <div className="grid grid-cols-2 gap-3">

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    value="member"
                    {...register("role", { required: true })}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/4 transition-all duration-200
                    peer-checked:border-[#3B82F6]/40 peer-checked:bg-[#3B82F6]/8 peer-checked:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]
                    hover:border-white/20 hover:bg-white/[0.07]">
                    <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                      <i className="bi bi-person text-[#3B82F6]" />
                    </div>
                      <span className="text-white/80 text-sm font-medium">Miembro</span>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    value="admin"
                    {...register("role", { required: true })}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/4 transition-all duration-200
                    peer-checked:border-[#10B981]/40 peer-checked:bg-[#10B981]/8 peer-checked:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]
                    hover:border-white/20 hover:bg-white/[0.07]">
                    <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                      <i className="bi bi-shield-check text-[#10B981]" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">Admin</span>
                  </div>
                </label>

              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#0ea271] active:bg-[#0d9167] text-white font-medium transition-all duration-200 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              Enviar invitación
            </button>

            {errorResponse && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#EF4444]/8 border border-[#EF4444]/25">
                <i className="bi bi-exclamation-triangle text-[#EF4444] mt-0.5 shrink-0" />
                <p className="text-[#EF4444] text-sm leading-snug">{errorResponse}</p>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  )
}

export default AddMember
