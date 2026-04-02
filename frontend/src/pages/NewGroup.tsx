import useGroup from "../hooks/useGroup"
import { useForm } from "react-hook-form"
import type { CreateGroupData } from "../types"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

const NewGroup = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupData>()
  const { createGroup, loading } = useGroup()
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = async (data: CreateGroupData) => {
    try{
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        if (data.image && data.image[0]) {
          formData.append('image', data.image[0])
        }
        await createGroup(formData)
        reset()
        setPreviewUrl(null)
        navigate("/inicio")
    }
    catch(error: any){
      if(error?.response?.data?.message){
        console.log("Error al crear el grupo:", error.response.data.message)
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0F172A] overflow-hidden flex items-center justify-center px-4 py-12">

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#10B981]/6 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#3B82F6]/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full bg-[#10B981]/3 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">

        <Link
          to="/inicio"
          className="inline-flex items-center gap-2 text-white/40 mb-8 transition-colors duration-150 hover:text-white"
        >
          <i className="bi bi-arrow-left" />
          Volver al dashboard
        </Link>

        <div className="relative p-px rounded-3xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

          <div className="absolute inset-px rounded-[23px] border border-white/5 pointer-events-none z-10" />

          <div className="relative bg-[#0A1020]/85 backdrop-blur-3xl rounded-[23px] p-8 md:p-10 overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/35 to-transparent pointer-events-none" />

            <div className="absolute top-0 left-0 w-40 h-40 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div className="relative flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                  <i className="bi bi-people text-[#10B981]" />
                </div>
                <h1 className="text-white">Nuevo grupo</h1>
              </div>
              <p className="text-white/40">
                Completá los datos para crear tu grupo y empezar a dividir gastos.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-5" noValidate>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/70">
                  Nombre del grupo <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Los del asado"
                  autoComplete="off"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    maxLength: { value: 60, message: "Máximo 60 caracteres" },
                  })}
                  className={[
                    "w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25",
                    "bg-white/5 border",
                    errors.name ? "border-[#EF4444]/60" : "border-white/10",
                    "outline-none transition-all duration-200",
                    "hover:bg-white/7 hover:border-white/25",
                    "focus:bg-[#10B981]/5 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]",
                  ].join(" ")}
                />
                {errors.name && (
                  <p className="flex items-center gap-1.5 text-[#EF4444]">
                    <i className="bi bi-exclamation-circle" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/70">
                  Descripción <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  placeholder="¿De qué se trata el grupo?"
                  rows={3}
                  {...register("description", {
                    required: "La descripción es requerida",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    maxLength: { value: 300, message: "Máximo 300 caracteres" },
                  })}
                  className={[
                    "w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25 resize-none",
                    "bg-white/5 border",
                    errors.description ? "border-[#EF4444]/60" : "border-white/10",
                    "outline-none transition-all duration-200",
                    "hover:bg-white/7 hover:border-white/25",
                    "focus:bg-[#10B981]/5 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]",
                  ].join(" ")}
                />
                {errors.description && (
                  <p className="flex items-center gap-1.5 text-[#EF4444]">
                    <i className="bi bi-exclamation-circle" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/70">
                  Imagen del grupo <span className="text-white/30">(opcional)</span>
                </label>

                <label
                  htmlFor="group-image"
                  className={[
                    "relative flex items-center gap-4 px-4 py-4 rounded-xl border border-dashed cursor-pointer",
                    "bg-white/3 border-white/10 text-white/40",
                    "transition-all duration-200",
                    "hover:bg-white/5 hover:border-[#10B981]/40 hover:text-white/60",
                  ].join(" ")}
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-white/70 truncate">Imagen seleccionada</span>
                        <span className="text-white/30">Hacé click para cambiarla</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/8 shrink-0">
                        <i className="bi bi-image text-white/40" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white/60">Subir imagen</span>
                        <span className="text-white/30">PNG, JPG o WEBP</span>
                      </div>
                    </>
                  )}
                </label>

                <input
                  id="group-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  {...register("image")}
                  onChange={(e) => {
                    register("image").onChange(e)
                    handleImageChange(e)
                  }}
                />
              </div>
              <div className="flex items-center gap-2 opacity-20" aria-hidden="true">
                <div className="h-px flex-1 bg-white/40" />
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="h-px flex-1 bg-white/40" />
              </div>

              <div className="relative group/btn">
                <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[#10B981]/50 to-[#3B82F6]/25 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <button
                  type="submit"
                  disabled={loading.createLoading}
                  className={[
                    "relative flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white",
                    "bg-linear-to-r from-[#10B981] via-[#0fca8a] to-[#0ea371]",
                    "border border-[#10B981]/25 shadow-[0_4px_24px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                    "transition-all duration-200",
                    loading.createLoading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.50),inset_0_1px_0_rgba(255,255,255,0.15)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_12px_rgba(16,185,129,0.25)]",
                  ].join(" ")}
                >
                  {loading.createLoading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creando grupo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle" />
                      Crear grupo
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NewGroup
