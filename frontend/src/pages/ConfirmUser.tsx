import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ConfirmUser = () => {

    const {token} = useParams()

    const {confirmUser, loadingAuth} = useAuth()

    const [errorResponse, setErrorResponse] = useState<string | null>(null)
    const [successResponse, setSuccessResponse] = useState<string | null>(null)

    useEffect(() => {
        const confirm = async () => {
            if(token) {
                try{
                    await confirmUser(token)
                    setSuccessResponse("Usuario confirmado exitosamente. Ahora puedes iniciar sesión.")
                }
                catch(err: any) {
                    setErrorResponse(err.response?.data?.message || "Error al confirmar el usuario. Inténtalo de nuevo.")
                }
            }
        }
        confirm()
    },[token])

    return (
        <main className="relative min-h-screen bg-[#0F172A] flex items-center justify-center py-5 md:py-6 xl:py-10 2xl:py-15 px-4 overflow-hidden">

            <div className="absolute top-20 right-20 rounded-full bg-[#10B981] w-20 h-20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-20 rounded-full bg-[#10B981] w-20 h-20 blur-3xl pointer-events-none" />

            <section className="relative z-10 w-full max-w-sm md:max-w-md">

                {loadingAuth.confirmLoading ? (
                    <div className="flex flex-col items-center gap-6">
                        <Loader />
                        <p className="text-white/40">Verificando tu cuenta...</p>
                    </div>
                ) : (
                    <div className="relative p-px rounded-3xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/30 shadow-[0_0_60px_rgba(16,185,129,0.10),0_25px_60px_rgba(0,0,0,0.6)]">

                        <div className="absolute inset-px rounded-[23px] border border-white/5 pointer-events-none z-10" />

                        <div className="relative bg-[#0A1020]/85 backdrop-blur-3xl rounded-[23px] p-6 md:p-9 overflow-hidden flex flex-col items-center text-center gap-6">

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/35 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-52 h-52 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
                            <div className="absolute top-0 left-0 w-40 h-40 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />

                            {successResponse && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-[#10B981]/20 blur-2xl scale-150 pointer-events-none" />
                                        <i className="bi bi-check-circle-fill relative z-10 text-[#10B981] text-5xl drop-shadow-[0_0_16px_rgba(16,185,129,0.60)]" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-white">¡Cuenta confirmada!</h2>
                                        <p className="text-white/50">{successResponse}</p>
                                    </div>

                                    <div className="w-full relative group/btn">
                                        <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[#10B981]/50 to-[#3B82F6]/25 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        <Link
                                            to="/"
                                            className={[
                                                "relative flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white",
                                                "bg-linear-to-r from-[#10B981] via-[#0fca8a] to-[#0ea371]",
                                                "border border-[#10B981]/25 shadow-[0_4px_24px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                                                "transition-all duration-200",
                                                "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.50),inset_0_1px_0_rgba(255,255,255,0.15)]",
                                                "active:shadow-[0_2px_12px_rgba(16,185,129,0.25)]",
                                            ].join(" ")}
                                        >
                                            Iniciar sesión
                                            <i className="bi bi-arrow-right opacity-70 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                                        </Link>
                                    </div>
                                </>
                            )}

                            {errorResponse && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-[#EF4444]/15 blur-2xl scale-150 pointer-events-none" />
                                        <i className="bi bi-x-circle-fill relative z-10 text-[#EF4444] text-5xl drop-shadow-[0_0_16px_rgba(239,68,68,0.50)]" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-white">Error de confirmación</h2>
                                        <p className="text-white/50">{errorResponse}</p>
                                    </div>

                                    <Link
                                        to="/registro"
                                        className={[
                                            "flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white",
                                            "bg-transparent border border-[#EF4444]/50",
                                            "shadow-[0_0_0_0_rgba(239,68,68,0)] transition-all duration-200",
                                            "hover:bg-[#EF4444]/8 hover:border-[#EF4444]/80 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(239,68,68,0.20)]",
                                            "active:shadow-none",
                                        ].join(" ")}
                                    >
                                        <i className="bi bi-arrow-left opacity-70" />
                                        Volver al registro
                                    </Link>
                                </>
                            )}

                        </div>
                    </div>
                )}

            </section>
        </main>
    )
};

export default ConfirmUser;
