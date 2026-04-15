import useAuth from "../hooks/useAuth"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import type { LoginData } from "../types/auth.types"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const { loginUser, loadingAuth, user } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()

  const navigate = useNavigate()

  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  async function submitForm(data: LoginData) {
    try{
      await loginUser(data);
    }
    catch(error: any){
      if (error.response?.data?.message) {
        setErrorAuth(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    if (user){
      navigate("/inicio")
    }
  }, [user, navigate])

  return (
    <main className="relative min-h-screen bg-[#0F172A] flex items-center justify-center py-5 md:py-6 xl:py-10 2xl:py-15 px-4 overflow-hidden">

      <div className="absolute top-20 right-20 rounded-full bg-[#10B981] w-20 h-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 rounded-full bg-[#10B981] w-20 h-20 blur-3xl pointer-events-none"></div>

      <section className="relative z-10 w-full max-w-sm md:max-w-md">

        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#10B981]/25 blur-3xl scale-[2.4] pointer-events-none" />
            <div className="absolute -inset-1 rounded-full bg-linear-to-br from-[#10B981] via-[#3B82F6]/50 to-[#10B981]/30 animate-spin [animation-duration:7000ms] pointer-events-none" />
            <div className="absolute -inset-1 rounded-full bg-linear-to-tl from-[#10B981]/40 to-[#3B82F6]/20 pointer-events-none" />
            <div className="relative z-10 w-25 h-25 rounded-full bg-[#0F172A]/95 backdrop-blur-xl flex items-center justify-center border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0_40px_rgba(16,185,129,0.18)]">
              <div className="absolute inset-2 rounded-full bg-[#10B981]/6 pointer-events-none" />
              <img
                src="images/logo.png"
                alt="VaquitApp Logo"
                className="relative z-10 w-14.5 h-14.5 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.65)]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-white drop-shadow-[0_0_18px_rgba(16,185,129,0.45)]">
              VaquitApp
            </h1>
            <p className="text-white/40">Dividí gastos, no amistades.</p>
          </div>
        </div>

        <div className="relative p-px rounded-3xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/30 shadow-[0_0_60px_rgba(16,185,129,0.10),0_25px_60px_rgba(0,0,0,0.6)]">

          <div className="absolute inset-px rounded-[23px] border border-white/5 pointer-events-none z-10" />

          <div className="relative bg-[#0A1020]/85 backdrop-blur-3xl rounded-[23px] p-6 md:p-9 overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/35 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-52 h-52 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
            
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />

            <h2 className="text-white mb-1">Iniciar sesión</h2>

            <div className="flex items-center gap-3 mb-7">
              <div className="h-px flex-1 bg-linear-to-r from-[#10B981]/35 to-transparent" />
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-[#10B981]/60" />
                <div className="w-1 h-1 rounded-full bg-[#3B82F6]/40" />
              </div>
              <div className="h-px flex-1 bg-linear-to-l from-[#3B82F6]/20 to-transparent" />
            </div>

            {errorAuth && (
              <div className="mb-6 flex items-start gap-2.5 bg-[#EF4444]/8 border border-[#EF4444]/30 rounded-xl px-4 py-3 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
                <i className="bi bi-exclamation-circle text-[#EF4444] shrink-0 mt-0.5" />
                <span className="text-[#EF4444]">{errorAuth}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(submitForm)} noValidate className="flex flex-col gap-5">

              <div className="flex flex-col gap-2">
                <label htmlFor="identifier" className="text-white/55">
                  Email o usuario
                </label>
                <div className="relative group/field">
                  <div className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-px h-4/5 rounded-full transition-all duration-300 pointer-events-none",
                    errors.identifier
                      ? "bg-[#EF4444]/70"
                      : "bg-[#10B981]/0 group-focus-within/field:bg-[#10B981]/60",
                  ].join(" ")} />
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="tu@email.com"
                    className={[
                      "w-full bg-white/4 border rounded-xl px-4 py-3 text-white placeholder:text-white/20",
                      "outline-none transition-all duration-200",
                      "hover:bg-white/7 hover:border-white/25",
                      "focus:bg-[#10B981]/6 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.10)]",
                      errors.identifier
                        ? "border-[#EF4444]/70 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
                        : "border-white/10",
                    ].join(" ")}
                    {...register("identifier", { required: "Este campo es obligatorio." })}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[#EF4444] flex items-center gap-1.5">
                    <i className="bi bi-exclamation-circle shrink-0" />
                    {errors.identifier.message as string}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white/55">
                  Contraseña
                </label>
                <div className="relative group/field">
                  <div className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-px h-4/5 rounded-full transition-all duration-300 pointer-events-none",
                    errors.password
                      ? "bg-[#EF4444]/70"
                      : "bg-[#10B981]/0 group-focus-within/field:bg-[#10B981]/60",
                  ].join(" ")} />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={[
                      "w-full bg-white/4 border rounded-xl px-4 py-3 text-white placeholder:text-white/20",
                      "outline-none transition-all duration-200",
                      "hover:bg-white/7 hover:border-white/25",
                      "focus:bg-[#10B981]/6 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.10)]",
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

              <div className="flex items-center gap-2 opacity-15 select-none" aria-hidden="true">
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
                  disabled={loadingAuth?.loginLoading}
                  className={[
                    "relative w-full py-3.5 px-6 rounded-xl text-white cursor-pointer",
                    "bg-linear-to-r from-[#10B981] via-[#0fca8a] to-[#0ea371]",
                    "border border-[#10B981]/25 shadow-[0_4px_24px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                    "transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.50),inset_0_1px_0_rgba(255,255,255,0.15)]",
                    "active:shadow-[0_2px_12px_rgba(16,185,129,0.25)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_24px_rgba(16,185,129,0.30)]",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-center">
                    {loadingAuth?.loginLoading ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin" />
                        Ingresando...
                      </>
                    ) : (
                      <>
                        Iniciar sesión
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
          ¿No tenés cuenta?{" "}
          <Link
            to="/registro"
            className="text-[#10B981] underline underline-offset-4 decoration-[#10B981]/30 transition-all duration-150 hover:text-white hover:decoration-white/50"
          >
            Registrate
          </Link>
        </p>

      </section>
    </main>
  )
}

export default Login
