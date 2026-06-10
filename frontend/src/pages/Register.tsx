import useAuth from "../hooks/useAuth"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useState } from "react"
import type { RegisterData } from "../types/auth.types"
import Swal from "sweetalert2"
import { motion } from "motion/react"
import { fadeUp, fadeIn } from "../utils/motion"

const Register = () => {
  const { registerUser, loadingAuth } = useAuth()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterData>()
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  async function submitForm(data: RegisterData) {
    try {
      await registerUser(data);
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente. Ahora deberás de confirmar tu email para iniciar sesión.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: "va-swal-popup",
          title: "va-swal-title",
          htmlContainer: "va-swal-text",
        },
      })
      reset()
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorAuth(error.response.data.message);
      }
      reset()
    }
  }

  return (
    <main className="min-h-screen bg-[#210B2C] flex items-center justify-center px-4 py-12 relative">

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
        <div className="absolute top-12 left-0 w-72 h-px bg-linear-to-r from-[#BC96E6]/65 to-transparent" />
        <div className="absolute top-24 left-0 w-48 h-px bg-linear-to-r from-[#FFD166]/50 to-transparent" />
        <div className="absolute top-40 left-0 w-28 h-px bg-linear-to-r from-[#BC96E6]/38 to-transparent" />
        <div className="absolute bottom-14 right-0 w-80 h-px bg-linear-to-l from-[#BC96E6]/60 to-transparent" />
        <div className="absolute bottom-28 right-0 w-56 h-px bg-linear-to-l from-[#FFD166]/45 to-transparent" />
        <div className="absolute bottom-44 right-0 w-32 h-px bg-linear-to-l from-[#BC96E6]/32 to-transparent" />
        <div className="absolute top-1/2 right-8 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/55 to-transparent" />
        <div className="absolute top-[30%] left-12 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/45 to-transparent" />
        <div className="absolute bottom-[20%] left-28 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/38 to-transparent" />
        <div className="absolute top-[60%] right-32 w-px h-20 bg-linear-to-b from-transparent via-[#FFD166]/35 to-transparent" />
      </div>

      <section className="w-full max-w-md">

        <motion.div {...fadeUp()} className="mb-10">
          <div className="bg-linear-to-br from-[#BC96E6]/20 via-[#210B2C] to-[#FFD166]/10 border border-[#BC96E6]/30 rounded-2xl px-8 py-7 backdrop-blur-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 mb-4 drop-shadow-[0_0_16px_rgba(188,150,230,0.45)]">
              <img src="images/logo.png" alt="VaquitApp Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BC96E6]/60 inline-block" />
              <h1 className="text-white font-bold text-3xl tracking-tight drop-shadow-[0_0_12px_rgba(188,150,230,0.30)]">VaquitApp</h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]/60 inline-block" />
            </div>

            <p className="text-white/50 text-sm tracking-wide">Dividí gastos, no amistades.</p>

            <div className="w-20 h-px bg-linear-to-r from-[#BC96E6]/40 via-[#FFD166]/35 to-[#BC96E6]/40 mt-4" />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="bg-white/6 border border-[#FFD166]/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-white font-semibold text-xl mb-1">Registrarse</h2>
          <p className="text-white/50 text-sm mb-6">Completá el formulario para crear tu cuenta.</p>

          {errorAuth && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <i className="bi bi-exclamation-circle shrink-0" />
              <span>{errorAuth}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(submitForm)} noValidate className="space-y-4">

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Nombre de usuario
              </label>
              <div className="relative">
                <i className="bi bi-person absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="tu_usuario"
                  className="w-full bg-white/8 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                  {...register("username", { required: "Este campo es obligatorio." })}
                />
              </div>
              {errors.username && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                  <i className="bi bi-exclamation-circle" />
                  {errors.username.message as string}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Email
              </label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full bg-white/8 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                  {...register("email", { required: "Este campo es obligatorio." })}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                  <i className="bi bi-exclamation-circle" />
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-white/40">
                Contraseña
              </label>
              <div className="relative">
                <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-white/8 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                  {...register("password", { required: "Este campo es obligatorio." })}
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                  <i className="bi bi-exclamation-circle" />
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingAuth?.registerLoading}
              className="w-full hover:bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loadingAuth?.registerLoading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <i className="bi bi-arrow-right" />
                </>
              )}
            </button>

          </form>
        </motion.div>

        <motion.p {...fadeIn(0.16)} className="text-center text-white/40 text-sm mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link to="/" className="text-[#BC96E6] hover:text-[#BC96E6]/80 font-medium transition-colors duration-150">
            Iniciá sesión
          </Link>
        </motion.p>
      </section>
    </main>
  )
}

export default Register
