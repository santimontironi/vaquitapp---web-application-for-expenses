import useGroup from "../hooks/useGroup"
import { useForm } from "react-hook-form"
import type { CreateGroupData } from "../types/groups.types"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion } from "motion/react"
import { fadeUp } from "../utils/motion"

const NewGroup = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupData>()
  const { createGroup, loading } = useGroup()
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = async (data: CreateGroupData) => {
    try {
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
    } catch (error: any) {
      if (error?.response?.data?.message) {
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
    <main className="min-h-screen bg-[#210B2C] relative">

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
        <div className="absolute top-14 right-0 w-80 h-px bg-linear-to-l from-[#BC96E6]/58 to-transparent" />
        <div className="absolute top-28 right-0 w-52 h-px bg-linear-to-l from-[#FFD166]/44 to-transparent" />
        <div className="absolute top-44 right-0 w-30 h-px bg-linear-to-l from-[#BC96E6]/32 to-transparent" />
        <div className="absolute bottom-36 left-0 w-68 h-px bg-linear-to-r from-[#BC96E6]/54 to-transparent" />
        <div className="absolute bottom-20 left-0 w-44 h-px bg-linear-to-r from-[#FFD166]/40 to-transparent" />
        <div className="absolute bottom-52 left-0 w-26 h-px bg-linear-to-r from-[#BC96E6]/32 to-transparent" />
        <div className="absolute top-[28%] right-10 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/50 to-transparent" />
        <div className="absolute top-[50%] left-8 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/38 to-transparent" />
        <div className="absolute top-[68%] right-24 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/32 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8 md:py-10">

        <Link
          to="/inicio"
          className="inline-flex items-center gap-2 text-white/50 hover:text-[#BC96E6] hover:bg-[#BC96E6]/8 rounded-lg px-2 py-1 -ml-2 text-sm transition-all duration-150 mb-8"
        >
          <i className="bi bi-arrow-left" />
          Volver al dashboard
        </Link>

        <motion.div {...fadeUp()} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center">
              <i className="bi bi-people text-[#BC96E6] text-lg" />
            </div>
            <h1 className="text-white font-bold text-2xl tracking-tight">Nuevo grupo</h1>
          </div>
          <p className="text-white/40 text-sm ml-13">Completá los datos para crear tu grupo y empezar a dividir gastos.</p>
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Nombre del grupo <span className="text-[#BC96E6]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Los del asado"
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
                Descripción <span className="text-[#BC96E6]">*</span>
              </label>
              <textarea
                placeholder="¿De qué se trata el grupo?"
                rows={3}
                className="w-full bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150 resize-none"
                {...register("description", {
                  required: "La descripción es requerida",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 300, message: "Máximo 300 caracteres" },
                })}
              />
              {errors.description && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                  <i className="bi bi-exclamation-circle" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Imagen del grupo <span className="text-white/30 normal-case tracking-normal font-normal">(opcional)</span>
              </label>
              <label
                htmlFor="group-image"
                className="flex items-center gap-4 bg-white/8 border border-[#BC96E6]/25 border-dashed rounded-xl px-5 py-4 cursor-pointer hover:bg-[#BC96E6]/4 hover:border-[#BC96E6]/45 transition-all duration-150"
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
                id="group-image"
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

            <button
              type="submit"
              disabled={loading.createLoading}
              className="w-full bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 hover:bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading.createLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#210B2C]/30 border-t-[#210B2C] rounded-full animate-spin" />
                  Creando grupo...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle" />
                  Crear grupo
                </>
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </main>
  )
}

export default NewGroup
