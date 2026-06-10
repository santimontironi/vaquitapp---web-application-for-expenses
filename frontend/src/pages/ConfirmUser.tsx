import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { fadeUp } from "../utils/motion";

const ConfirmUser = () => {
    const { token } = useParams()
    const { confirmUser, loadingAuth } = useAuth()

    const [errorResponse, setErrorResponse] = useState<string | null>(null)
    const [successResponse, setSuccessResponse] = useState<string | null>(null)

    useEffect(() => {
        const confirm = async () => {
            if (token) {
                try {
                    await confirmUser(token)
                    setSuccessResponse("Usuario confirmado exitosamente. Ahora puedes iniciar sesión.")
                } catch (err: any) {
                    setErrorResponse(err.response?.data?.message || "Error al confirmar el usuario. Inténtalo de nuevo.")
                }
            }
        }
        confirm()
    }, [token])

    return (
        <main className="min-h-screen bg-[#210B2C] flex items-center justify-center px-4 relative">
            {/* Decorative lines */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
                <div className="absolute top-14 left-0 w-72 h-px bg-linear-to-r from-[#BC96E6]/62 to-transparent" />
                <div className="absolute top-26 left-0 w-48 h-px bg-linear-to-r from-[#FFD166]/50 to-transparent" />
                <div className="absolute top-40 left-0 w-28 h-px bg-linear-to-r from-[#BC96E6]/35 to-transparent" />
                <div className="absolute bottom-16 right-0 w-68 h-px bg-linear-to-l from-[#BC96E6]/58 to-transparent" />
                <div className="absolute bottom-28 right-0 w-44 h-px bg-linear-to-l from-[#FFD166]/44 to-transparent" />
                <div className="absolute bottom-42 right-0 w-26 h-px bg-linear-to-l from-[#BC96E6]/32 to-transparent" />
                <div className="absolute top-1/2 right-10 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/52 to-transparent" />
                <div className="absolute top-[28%] left-12 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/44 to-transparent" />
                <div className="absolute top-[68%] left-28 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/35 to-transparent" />
                <div className="absolute top-[42%] right-32 w-px h-20 bg-linear-to-b from-transparent via-[#FFD166]/32 to-transparent" />
            </div>

            <section className="w-full max-w-md">
                {loadingAuth.confirmLoading ? (
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
                        <Loader />
                        <p className="text-white/50 text-sm mt-4">Verificando tu cuenta...</p>
                    </div>
                ) : (
                    <motion.div {...fadeUp()} className="bg-white/6 border border-white/10 rounded-2xl p-8 md:p-10 text-center backdrop-blur-sm">
                        {successResponse && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                                    <i className="bi bi-check-circle-fill text-emerald-400 text-3xl" />
                                </div>

                                <div className="mb-7">
                                    <h2 className="text-white font-semibold text-xl mb-2">¡Cuenta confirmada!</h2>
                                    <p className="text-white/50 text-sm">{successResponse}</p>
                                </div>

                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-6 py-3 hover:bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                                >
                                    Iniciar sesión
                                    <i className="bi bi-arrow-right" />
                                </Link>
                            </>
                        )}

                        {errorResponse && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                                    <i className="bi bi-x-circle-fill text-red-400 text-3xl" />
                                </div>

                                <div className="mb-7">
                                    <h2 className="text-white font-semibold text-xl mb-2">Error de confirmación</h2>
                                    <p className="text-white/50 text-sm">{errorResponse}</p>
                                </div>

                                <Link
                                    to="/registro"
                                    className="inline-flex items-center gap-2 border border-[#BC96E6]/25 text-[#BC96E6]/70 rounded-xl px-6 py-3 hover:bg-[#BC96E6]/8 hover:border-[#BC96E6]/40 transition-all duration-150 cursor-pointer"
                                >
                                    <i className="bi bi-arrow-left" />
                                    Volver al registro
                                </Link>
                            </>
                        )}
                    </motion.div>
                )}
            </section>
        </main>
    )
};

export default ConfirmUser;
