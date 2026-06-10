import type { HeaderDashboardProps } from "../../types/groups.types";
import useAuth from "../../hooks/useAuth";

const HeaderDashboard = ({ user }: HeaderDashboardProps) => {
  const { logoutUser } = useAuth();

  return (
    <header className="bg-[#1b0924] border-b-4 border-[#FFD166] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 h-16 xl:h-18 2xl:h-20 flex items-center justify-between gap-4">

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#FFD166]/30">
            <img src="images/logo.png" alt="VaquitApp Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block">
            <span className="text-white font-bold text-base xl:text-lg tracking-tight leading-none block">VaquitApp</span>
            <span className="text-[#FFD166]/60 text-xs xl:text-sm tracking-wide">Dashboard</span>
          </div>
        </div>

        <div className="flex items-stretch overflow-hidden rounded-2xl border border-[#FFD166]/25 shadow-[0_0_24px_rgba(255,209,102,0.12)]">

          <div className="flex items-center gap-2 bg-[#BC96E6]/12 px-3 md:px-3.5 xl:px-4 md:py-2">
            <i className="bi bi-person-fill text-[#BC96E6]/70 text-xs xl:text-sm" />
            <span className="text-[#BC96E6]/80 text-[8px] md:text-[11px] xl:text-xs uppercase tracking-[0.18em] font-bold whitespace-nowrap">Panel de</span>
          </div>

          <div className="w-px bg-linear-to-b from-[#BC96E6]/30 via-white/15 to-[#FFD166]/30" />
  
          <div className="flex items-center gap-2 bg-[#FFD166]/8 px-4 xl:px-5 py-2">
            <span className="text-[#FFD166] font-bold text-sm xl:text-base tracking-tight whitespace-nowrap">{user.username}</span>
            <i className="bi bi-star-fill text-[#FFD166]/30 text-[9px] xl:text-[10px]" />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={logoutUser}
            aria-label="Cerrar sesión"
            className="flex items-center gap-1.5 border border-[#BC96E6]/20 text-white/60 rounded-xl px-3 py-2 text-sm xl:text-base hover:bg-[#BC96E6]/8 hover:text-[#BC96E6]/80 hover:border-[#BC96E6]/40 transition-all duration-150 cursor-pointer"
          >
            <i className="bi bi-box-arrow-right" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
          <div className="shrink-0">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-[#BC96E6]/20 flex items-center justify-center border-2 border-[#BC96E6]/40">
              <span className="text-[#BC96E6] font-bold text-sm xl:text-base">{user.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default HeaderDashboard;
