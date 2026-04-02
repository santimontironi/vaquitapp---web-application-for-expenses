import type { HeaderDashboardProps } from "../types";
import useAuth from "../hooks/useAuth";

const HeaderDashboard = ({ user }: HeaderDashboardProps) => {
  const { logoutUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-linear-to-b from-[#080E1C]/90 to-[#080E1C]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/4.5">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

      <div className="relative grid grid-cols-3 items-center py-5 px-4 md:px-8 xl:px-16 2xl:px-24 h-20 xl:h-20">
        <div className="flex items-center gap-2.5 md:gap-3.5">
          <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-linear-to-br from-[#0A1628] to-[#0E1F3A] border border-emerald-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <img
              src="images/logo.png"
              alt="VaquitApp Logo"
              className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
            />
          </div>

          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.04em] text-white">
              VaquitApp
            </span>
            <span className="text-[9px] md:text-[10px] font-normal tracking-[0.15em] uppercase text-emerald-400/55">
              Dashboard
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] md:text-[10px] font-normal tracking-[0.15em] md:tracking-[0.2em] uppercase text-white/30">
            Panel de
          </span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden sm:block w-6 md:w-8 h-px bg-linear-to-r from-transparent to-emerald-500/35" />
            <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.04em] md:tracking-[0.06em] text-white truncate max-w-15 sm:max-w-15 md:max-w-none">
              {user.username}
            </span>
            <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            <div className="hidden sm:block w-6 md:w-8 h-px bg-linear-to-l from-transparent to-emerald-500/35" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-2.5">
          <button
            onClick={logoutUser}
            className="group/logout flex items-center gap-1.5 px-2.5 md:px-3.5 py-1.5 md:py-1.75 rounded-[10px] bg-red-500/[0.07] border border-red-500/20 text-red-400/75 cursor-pointer text-[11px] md:text-[12.5px] font-medium tracking-[0.02em] transition-all duration-200 hover:bg-red-500/[0.14] hover:border-red-500/40 hover:text-red-400 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(239,68,68,0.2)] active:translate-y-0 active:scale-[0.97] md:w-auto"
            aria-label="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right text-sm transition-transform duration-200 group-hover/logout:translate-x-0.5" />
            <span>Cerrar sesión</span>
          </button>

          <div className="group/avatar cursor-pointer shrink-0">
            <div className="w-8 h-8 md:w-9.5 md:h-9.5 rounded-full bg-linear-to-br from-emerald-500 to-emerald-700 border-[1.5px] border-emerald-400/40 flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-200 group-hover/avatar:-translate-y-0.5 group-hover/avatar:shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
              <span className="text-xs md:text-sm font-bold text-white uppercase">
                {user.username.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
