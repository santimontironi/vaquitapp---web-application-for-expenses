import { useParams, useNavigate } from "react-router-dom"
import useGroup from "../hooks/useGroup";
import { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import SideNavGroup from "../components/groups/SideNavGroup";
import AllPlans from "../components/plans/AllPlans";
import AllMembers from "../components/groups/AllMembers";
import CreatePlan from "../components/plans/CreatePlan";
import type { GroupDashboardView } from "../types/groups.types";
import AddMember from "../components/groups/AddMember";

const Group = () => {

  const { idGroup } = useParams() as { idGroup: string }; //as es para decirle a TS que idGroup siempre va a ser un string
  const navigate = useNavigate();

  const { groupById, getGroupById, loading } = useGroup();

  const [itemSelected, setItemSelected] = useState<GroupDashboardView>("members");

  useEffect(() => {
    if (idGroup) {
      getGroupById(idGroup);
    }
  }, [idGroup]);

  if (loading.fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0A1020] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0A1020] overflow-x-hidden">

      <button
        onClick={() => navigate(-1)}
        className="fixed cursor-pointer top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A1020]/80 border border-white/10 text-white/70 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-white/8 hover:border-[#10B981]/40 hover:text-white active:scale-95 md:top-5 md:left-6 xl:left-10"
        aria-label="Volver atrás"
      >
        <i className="bi bi-arrow-left" />
        <span className="hidden sm:inline">Volver</span>
      </button>

      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#10B981]/5 blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/3" />
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#3B82F6]/4 blur-[120px] pointer-events-none translate-x-1/2" />
Ñ
      <div className="relative w-full overflow-hidden">

        {groupById?.image ? (
          <div className="relative h-52 md:h-64 xl:h-72 w-full">
            <img
              src={groupById.image}
              alt={groupById.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0A1020]/50" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0A1020]/40 to-[#0A1020]" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0A1020]/60 via-transparent to-transparent" />

            <div className="relative h-full flex flex-col items-center justify-end pb-6 px-4 md:px-8 xl:px-16 2xl:px-24">
              <div className="w-full flex flex-col items-center gap-1 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white w-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {groupById?.name}
                </h1>
                <p className="text-base md:text-lg text-white/60 w-full drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                  {groupById?.description}
                </p>
              </div>
            </div>
          </div>

        ) : (
          <div className="relative px-4 pt-14 pb-10 md:px-8 md:pt-16 md:pb-12 xl:px-16 2xl:px-24">
            <div className="flex flex-col items-center gap-5 text-center">

              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#10B981]/25 blur-2xl scale-125" />
                <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-[#10B981]/20 to-[#10B981]/8 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.25)]">
                  <i className="bi bi-people text-[#10B981]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  <span className="text-[#10B981]/70 uppercase tracking-widest">Grupo</span>
                </div>
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white">{groupById?.name}</h1>
                <p className="text-xl text-white/50">{groupById?.description}</p>
                <div className="w-24 h-px bg-linear-to-r from-transparent via-[#10B981]/50 to-transparent mx-auto mt-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-4 right-4 md:left-8 md:right-8 xl:left-16 xl:right-16 h-px bg-linear-to-r from-transparent via-[#10B981]/20 to-transparent" />
          </div>
        )}
      </div>

      {/* Mobile: tabs on top, content below. Desktop: sidebar left + content right */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 px-4 pt-6 pb-12 md:px-8 md:pt-8 md:gap-7 xl:px-16 xl:gap-8 2xl:px-24">

        <SideNavGroup
          itemSelected={itemSelected}
          setSelectedItem={setItemSelected}
        />

        <div className="flex-1 min-w-0">
          {itemSelected === "members" && <AllMembers idGroup={idGroup} />}
          {itemSelected === "add-member" && <AddMember idGroup={idGroup} />}
          {itemSelected === "view-plans" && <AllPlans idGroup={idGroup} />}
          {itemSelected === "create-plan" && <CreatePlan idGroup={idGroup} />}
        </div>

      </div>
    </main>
  );
};

export default Group;
