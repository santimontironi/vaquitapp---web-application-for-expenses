import useAuth from "../hooks/useAuth"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useState } from "react"
import type { RegisterData } from "../types/auth.types"
import Swal from "sweetalert2"

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
      })
      reset()
    }
    catch (error: any) {
      if (error.response?.data?.message) {
        setErrorAuth(error.response.data.message);
      }
      reset()
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0F172A] flex items-center justify-center py-5 md:py-6 xl:py-10 2xl:py-15 px-4 overflow-hidden">

      {/* Fondo aurora multicapa */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-[#3B82F6]/6 blur-[130px] pointer-events-none" />
      <div className="absolute top-[-5%] left-[-8%] w-96 h-96 rounded-full bg-[#3B82F6]/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-6%] w-80 h-80 rounded-full bg-[#10B981]/7 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] w-64 h-64 rounded-full bg-[#3B82F6]/4 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-[#10B981]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-5%] w-48 h-48 rounded-full bg-[#3B82F6]/5 blur-[80px] pointer-events-none" />

      <section className="relative z-10 w-full max-w-sm md:max-w-md">

        {/* Logo + Título */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#3B82F6]/25 blur-3xl scale-[2.8] pointer-events-none" />
            <div className="absolute -inset-1 rounded-full bg-linear-to-br from-[#3B82F6] via-[#10B981]/50 to-[#3B82F6]/30 animate-spin [animation-duration:7000ms] pointer-events-none" />
            <div className="absolute -inset-1 rounded-full bg-linear-to-tl from-[#3B82F6]/40 to-[#10B981]/20 pointer-events-none" />
            <div className="relative z-10 w-25 h-25 rounded-full bg-[#0F172A]/95 backdrop-blur-xl flex items-center justify-center border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0_40px_rgba(59,130,246,0.18)]">
              <div className="absolute inset-2 rounded-full bg-[#3B82F6]/6 pointer-events-none" />
              <img
                src="images/logo.png"
                alt="VaquitApp Logo"
                className="relative z-10 w-14.5 h-14.5 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.65)]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-white font-bold tracking-tight drop-shadow-[0_0_18px_rgba(59,130,246,0.45)]">
              VaquitApp
            </h1>
            <p className="text-white/40">Dividí gastos, no amistades.</p>
          </div>
        </div>

        {/* Card glassmorphism */}
        <div className="relative p-px rounded-3xl bg-linear-to-br from-[#3B82F6]/60 via-white/5 to-[#10B981]/30 shadow-[0_0_80px_rgba(59,130,246,0.12),0_25px_80px_rgba(0,0,0,0.7)] shadow-2xl">

          <div className="absolute inset-px rounded-[23px] border border-white/5 pointer-events-none z-10" />

          <div className="relative bg-[#0A1020]/85 backdrop-blur-3xl rounded-[23px] p-6 md:p-9 overflow-hidden">

            {/* Shine line superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#3B82F6]/35 to-transparent pointer-events-none" />
            {/* Blob inferior derecha */}
            <div className="absolute bottom-0 right-0 w-52 h-52 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
            {/* Blob superior izquierda */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#3B82F6]/4 rounded-full blur-2xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />

            {/* Header del formulario */}
            <h2 className="text-white font-semibold mb-1">Registrarse</h2>
            <p className="text-white/40 mb-6">Completá el formulario para crear tu cuenta.</p>

            {/* Línea divisora del header */}
            <div className="h-px w-full bg-white/8 mb-7" />

            {errorAuth && (
              <div className="mb-6 flex items-start gap-2.5 bg-[#EF4444]/8 border border-[#EF4444]/30 rounded-xl px-4 py-3 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
                <i className="bi bi-exclamation-circle text-[#EF4444] shrink-0 mt-0.5" />
                <span className="text-[#EF4444]">{errorAuth}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(submitForm)} noValidate className="flex flex-col gap-5">

              {/* Campo: Nombre de usuario */}
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-white/70 font-medium tracking-wide">
                  Nombre de usuario
                </label>
                <div className="relative group/field">
                  {/* Línea izquierda de estado */}
                  <div className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-px h-4/5 rounded-full transition-all duration-300 pointer-events-none",
                    errors.username
                      ? "bg-[#EF4444]/70"
                      : "bg-[#3B82F6]/0 group-focus-within/field:bg-[#3B82F6]/60",
                  ].join(" ")} />
                  {/* Ícono interno izquierda */}
                  <i className="bi bi-person absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-colors duration-200 group-focus-within/field:text-[#3B82F6]/70" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="tu_usuario"
                    className={[
                      "w-full bg-white/4 border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20",
                      "outline-none transition-all duration-200",
                      "hover:bg-white/7 hover:border-white/25",
                      "focus:bg-[#3B82F6]/6 focus:border-[#3B82F6]/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)]",
                      errors.username
                        ? "border-[#EF4444]/70 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
                        : "border-white/10",
                    ].join(" ")}
                    {...register("username", { required: "Este campo es obligatorio." })}
                  />
                </div>
                {errors.username && (
                  <p className="text-[#EF4444] flex items-center gap-1.5">
                    <i className="bi bi-exclamation-circle shrink-0" />
                    {errors.username.message as string}
                  </p>
                )}
              </div>

              {/* Campo: Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white/70 font-medium tracking-wide">
                  Email
                </label>
                <div className="relative group/field">
                  {/* Línea izquierda de estado */}
                  <div className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-px h-4/5 rounded-full transition-all duration-300 pointer-events-none",
                    errors.email
                      ? "bg-[#EF4444]/70"
                      : "bg-[#3B82F6]/0 group-focus-within/field:bg-[#3B82F6]/60",
                  ].join(" ")} />
                  {/* Ícono interno izquierda */}
                  <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-colors duration-200 group-focus-within/field:text-[#3B82F6]/70" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className={[
                      "w-full bg-white/4 border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20",
                      "outline-none transition-all duration-200",
                      "hover:bg-white/7 hover:border-white/25",
                      "focus:bg-[#3B82F6]/6 focus:border-[#3B82F6]/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)]",
                      errors.email
                        ? "border-[#EF4444]/70 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
                        : "border-white/10",
                    ].join(" ")}
                    {...register("email", { required: "Este campo es obligatorio." })}
                  />
                </div>
                {errors.email && (
                  <p className="text-[#EF4444] flex items-center gap-1.5">
                    <i className="bi bi-exclamation-circle shrink-0" />
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Campo: Contraseña */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white/70 font-medium tracking-wide">
                  Contraseña
                </label>
                <div className="relative group/field">
                  {/* Línea izquierda de estado */}
                  <div className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-px h-4/5 rounded-full transition-all duration-300 pointer-events-none",
                    errors.password
                      ? "bg-[#EF4444]/70"
                      : "bg-[#3B82F6]/0 group-focus-within/field:bg-[#3B82F6]/60",
                  ].join(" ")} />
                  {/* Ícono interno izquierda */}
                  <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-colors duration-200 group-focus-within/field:text-[#3B82F6]/70" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={[
                      "w-full bg-white/4 border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/20",
                      "outline-none transition-all duration-200",
                      "hover:bg-white/7 hover:border-white/25",
                      "focus:bg-[#3B82F6]/6 focus:border-[#3B82F6]/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)]",
                      errors.password
                        ? "border-[#EF4444]/70 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
                        : "border-white/10",
                    ].join(" ")}
                    {...register("password", { required: "Este campo es obligatorio." })}
                  />
                </div>
                {errors.password && (
                  <p className="text-[#EF4444] flex items-center gap-1.5">
                    <i className="bi bi-exclamation-circle shrink-0" />
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              {/* Divisor limpio */}
              <div className="h-px w-full bg-white/15" aria-hidden="true" />

              {/* Botón de submit */}
              <div className="relative group/btn">
                <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[#3B82F6]/50 to-[#10B981]/25 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <button
                  type="submit"
                  disabled={loadingAuth?.registerLoading}
                  className={[
                    "relative w-full py-4 px-6 rounded-xl text-white font-semibold tracking-wide cursor-pointer",
                    "bg-linear-to-r from-[#3B82F6] via-[#4f8ff7] to-[#2563EB]",
                    "border border-[#3B82F6]/25 shadow-[0_4px_24px_rgba(59,130,246,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                    "transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(59,130,246,0.50),inset_0_1px_0_rgba(255,255,255,0.15)]",
                    "active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_12px_rgba(59,130,246,0.25)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_24px_rgba(59,130,246,0.30)]",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loadingAuth?.registerLoading ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Crear cuenta
                        <i className="bi bi-arrow-right opacity-70 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>

        <p className="text-center text-white/30 mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/"
            className="text-[#3B82F6] underline underline-offset-4 decoration-[#3B82F6]/30 transition-all duration-150 hover:text-white hover:decoration-white/50"
          >
            Iniciá sesión
          </Link>
        </p>

      </section>
    </main>
  )
}

export default Register
