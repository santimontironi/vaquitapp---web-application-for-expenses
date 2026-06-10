import useAuth from "../hooks/useAuth"
import useGroup from "../hooks/useGroup"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { fadeUp } from "../utils/motion"
import HeaderDashboard from "../components/layout/HeaderDashboard"
import MyGroups from "../components/groups/MyGroups"

const Dashboard = () => {
  const { user } = useAuth()
  const { groups, getMyGroups, loading } = useGroup()

  useEffect(() => {
    getMyGroups()
  }, [])

  return (
    <main className="min-h-screen bg-[#210B2C] relative">
   
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
        <div className="absolute top-20 right-0 w-80 h-px bg-linear-to-l from-[#BC96E6]/58 to-transparent" />
        <div className="absolute top-36 right-0 w-56 h-px bg-linear-to-l from-[#FFD166]/44 to-transparent" />
        <div className="absolute top-52 right-0 w-32 h-px bg-linear-to-l from-[#BC96E6]/32 to-transparent" />
        <div className="absolute bottom-36 left-0 w-72 h-px bg-linear-to-r from-[#BC96E6]/55 to-transparent" />
        <div className="absolute bottom-20 left-0 w-48 h-px bg-linear-to-r from-[#FFD166]/40 to-transparent" />
        <div className="absolute bottom-52 left-0 w-28 h-px bg-linear-to-r from-[#BC96E6]/32 to-transparent" />
        <div className="absolute top-[30%] left-6 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/52 to-transparent" />
        <div className="absolute top-[55%] right-14 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/40 to-transparent" />
        <div className="absolute top-[70%] left-24 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/35 to-transparent" />
        <div className="absolute top-[40%] right-36 w-px h-20 bg-linear-to-b from-transparent via-[#FFD166]/32 to-transparent" />
      </div>

      <section>
        {user && <HeaderDashboard user={user} />}

        <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8 md:py-10">
          {groups && groups.length > 0 ? (
            <MyGroups myGroups={groups} loading={loading} />
          ) : (
            <motion.div {...fadeUp()} className="flex flex-col items-center justify-center text-center py-20 md:py-28">
              <div className="w-20 h-20 rounded-2xl bg-[#BC96E6]/10 border border-[#BC96E6]/20 flex items-center justify-center mb-6">
                <i className="bi bi-people text-[#BC96E6]/40 text-4xl" />
              </div>

              <div className="max-w-sm mb-8">
                <h3 className="text-white font-semibold text-xl mb-2">Todavía no estás en ningún grupo</h3>
                <p className="text-white/40 text-sm leading-relaxed">Creá tu primer grupo e invitá a tus amigos para empezar a dividir gastos juntos.</p>
              </div>

              <div className="flex items-center gap-3 mb-10">
                <span className="flex items-center gap-2 bg-[#BC96E6]/10 border border-[#BC96E6]/20 text-[#BC96E6]/70 text-xs font-medium px-3 py-2 rounded-xl">
                  <i className="bi bi-person-plus text-[#BC96E6]/50" />
                  Invitá amigos
                </span>
                <span className="flex items-center gap-2 bg-[#FFD166]/6 border border-[#FFD166]/25 text-[#FFD166]/70 text-xs font-medium px-3 py-2 rounded-xl">
                  <i className="bi bi-cash-coin text-[#FFD166]/50" />
                  Dividí gastos
                </span>
                <span className="flex items-center gap-2 bg-[#FFD166]/6 border border-[#FFD166]/25 text-[#FFD166]/70 text-xs font-medium px-3 py-2 rounded-xl">
                  <i className="bi bi-check2-circle text-[#FFD166]/50" />
                  Saldá deudas
                </span>
              </div>

              <Link
                to="/nuevo-grupo"
                className="inline-flex items-center gap-2 bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-6 py-3 hover:bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <i className="bi bi-plus-circle" />
                Crear un grupo
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
