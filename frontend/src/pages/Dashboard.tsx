import useAuth from "../hooks/useAuth"
import useGroup from "../hooks/useGroup"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import HeaderDashboard from "../components/layout/HeaderDashboard"
import MyGroups from "../components/groups/MyGroups"

const Dashboard = () => {

  const { user } = useAuth()
  const { groups, getMyGroups, loading } = useGroup()

  useEffect(() => {
    getMyGroups()
  },[])

  return (
    <main className="relative min-h-screen bg-[#0F172A] overflow-hidden">

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#10B981]/6 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#3B82F6]/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full bg-[#10B981]/3 blur-[130px] pointer-events-none" />

      <section className="relative z-10">
        {user && <HeaderDashboard user={user} />}

        <div className="px-4 md:px-8 xl:px-16 2xl:px-24 py-8 md:py-10 xl:py-14">
          {groups && groups.length > 0 ? (
            <MyGroups myGroups={groups} loading={loading} />
          ) : (
            <div className="flex items-center justify-center mt-16 md:mt-24 px-4">
              <div className="relative p-px rounded-3xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-full max-w-sm md:max-w-md">

                <div className="absolute inset-px rounded-[23px] border border-white/5 pointer-events-none z-10" />

                <div className="relative bg-[#0A1020]/85 backdrop-blur-3xl rounded-[23px] p-8 md:p-12 overflow-hidden flex flex-col items-center gap-6 text-center">

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#10B981]/35 to-transparent pointer-events-none" />

                  <div className="absolute top-0 left-0 w-40 h-40 bg-[#10B981]/4 rounded-full blur-2xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-white">Todavía no estás en ningún grupo</h3>
                    <p className="text-white/40 max-w-xs">
                      Creá tu primer grupo e invitá a tus amigos para empezar a dividir gastos juntos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full opacity-20" aria-hidden="true">
                    <div className="h-px flex-1 bg-white/40" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="h-px flex-1 bg-white/40" />
                  </div>

                  <div className="relative group/btn w-full">
                    <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[#10B981]/50 to-[#3B82F6]/25 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <Link
                      to="/nuevo-grupo"
                      className={[
                        "relative flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white",
                        "bg-linear-to-r from-[#10B981] via-[#0fca8a] to-[#0ea371]",
                        "border border-[#10B981]/25 shadow-[0_4px_24px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                        "transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.50),inset_0_1px_0_rgba(255,255,255,0.15)]",
                        "active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_12px_rgba(16,185,129,0.25)]",
                      ].join(" ")}
                    >
                      <i className="bi bi-plus-circle" />
                      Crear un grupo
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

export default Dashboard
