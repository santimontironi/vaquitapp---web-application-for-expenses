import useGroup from "../../hooks/useGroup"
import useAuth from "../../hooks/useAuth"
import usePlan from "../../hooks/usePlan"
import type { CreatePlanProps, CreatePlanData } from "../../types/plans.types"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import MemberOption from "./MemberOption"

const CreatePlan = ({ idGroup }: CreatePlanProps) => {
  const { members, getMembersByGroup } = useGroup()
  const { createPlan, loading } = usePlan()
  const { user } = useAuth()

  const [selectedMembers, setSelectedIds] = useState<string[]>([])
  const [membersError, setMembersError] = useState<string | null>(null)
  const [errorResponse, setErrorResponse] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<CreatePlanData, 'members'>>()

  useEffect(() => {
    getMembersByGroup(idGroup)
  }, [idGroup])

  const toggleMember = (id: string) => {
    setMembersError(null)
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const onSubmit = async (data: Omit<CreatePlanData, 'members'>) => {
    if (selectedMembers.length === 0) {
      setMembersError("Seleccioná al menos un miembro")
      return
    }

    setErrorResponse(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.image?.[0]) formData.append('image', data.image[0])
      selectedMembers.forEach(id => formData.append('members[]', id))

      await createPlan(formData, idGroup)
      reset()
      setSelectedIds([])
      setPreviewUrl(null)
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Ocurrió un error al crear el plan"
      setErrorResponse(message)
    }
  }

  return (
    <section className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-[#FFD166]/40 transition-colors duration-200">
      <div>
    
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center shrink-0">
                <i className="bi bi-calendar-event text-[#BC96E6] text-sm" />
              </div>
              <h2 className="text-white font-semibold text-base">Nuevo plan</h2>
            </div>
            <p className="text-white/40 text-xs ml-10.5">Completá los datos para crear un plan dentro del grupo.</p>
          </div>
        </div>

        <div className="border-t border-white/[0.07] mb-5" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
              Nombre del plan <span className="text-[#BC96E6]">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Asado del domingo"
              autoComplete="off"
              className="w-full bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
              {...register("name", {
                required: "El nombre es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              })}
            />
            {errors.name && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs">
                <i className="bi bi-exclamation-circle" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
              Descripción <span className="text-white/25 normal-case tracking-normal font-normal">(opcional)</span>
            </label>
            <textarea
              placeholder="¿De qué se trata este plan?"
              rows={3}
              className="w-full bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150 resize-none"
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
              Imagen del plan <span className="text-white/25 normal-case tracking-normal font-normal">(opcional)</span>
            </label>
            <label
              htmlFor="plan-image"
              className="flex items-center gap-4 bg-white/5 border border-[#BC96E6]/25 border-dashed rounded-xl px-5 py-4 cursor-pointer hover:bg-[#BC96E6]/4 hover:border-[#BC96E6]/45 transition-all duration-150"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="text-white/80 text-sm font-medium block">Imagen seleccionada</span>
                    <span className="text-white/40 text-xs">Hacé click para cambiarla</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[#BC96E6]/10 flex items-center justify-center shrink-0">
                    <i className="bi bi-image text-[#BC96E6]/60 text-xl" />
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium block">Subir imagen</span>
                    <span className="text-white/30 text-xs">PNG, JPG o WEBP</span>
                  </div>
                </>
              )}
            </label>
            <input
              id="plan-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              {...register("image")}
              onChange={(e) => {
                register("image").onChange(e)
                handleImageChange(e)
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Miembros del plan <span className="text-[#BC96E6]">*</span>
              </label>
              {selectedMembers.length > 0 && (
                <span className="flex items-center gap-1 bg-[#BC96E6]/15 text-[#BC96E6] text-xs font-semibold px-2.5 py-1 rounded-full">
                  <i className="bi bi-check-circle text-xs" />
                  {selectedMembers.length} seleccionado{selectedMembers.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {members && members.filter(m => m.user._id !== user?._id).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {members.filter(m => m.user._id !== user?._id).map(member => (
                  <MemberOption
                    key={member._id}
                    member={member}
                    active={selectedMembers.includes(member.user._id)}
                    onToggle={toggleMember}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/4 border border-white/[0.07] rounded-xl px-4 py-3">
                <i className="bi bi-people text-white/20" />
                <span className="text-white/30 text-sm">No hay miembros en el grupo todavía</span>
              </div>
            )}

            {membersError && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs">
                <i className="bi bi-exclamation-circle" />
                {membersError}
              </p>
            )}
          </div>

          {errorResponse && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              <i className="bi bi-exclamation-circle shrink-0" />
              <span>{errorResponse}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading.createLoading}
            className="w-full hover:bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading.createLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#210B2C]/30 border-t-[#210B2C] rounded-full animate-spin" />
                Creando plan...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle" />
                Crear plan
              </>
            )}
          </button>

        </form>
      </div>
    </section>
  )
}

export default CreatePlan
