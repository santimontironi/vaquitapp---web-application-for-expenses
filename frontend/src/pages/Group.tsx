import { useParams, useNavigate } from "react-router-dom"
import useGroup from "../hooks/useGroup";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeUp, fadeIn } from "../utils/motion";
import Loader from "../components/ui/Loader";
import SideNavGroup from "../components/groups/SideNavGroup";
import AllPlans from "../components/plans/AllPlans";
import AllMembers from "../components/groups/AllMembers";
import CreatePlan from "../components/plans/CreatePlan";
import type { GroupDashboardView } from "../types/groups.types";
import AddMember from "../components/groups/AddMember";

const Group = () => {
  const { idGroup } = useParams() as { idGroup: string };
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
      <div className="min-h-screen bg-[#210B2C] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#210B2C] relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block">
        <div className="absolute top-16 right-0 w-80 h-px bg-linear-to-l from-[#BC96E6]/58 to-transparent" />
        <div className="absolute top-32 right-0 w-52 h-px bg-linear-to-l from-[#FFD166]/44 to-transparent" />
        <div className="absolute top-48 right-0 w-30 h-px bg-linear-to-l from-[#BC96E6]/32 to-transparent" />
        <div className="absolute bottom-40 left-0 w-68 h-px bg-linear-to-r from-[#BC96E6]/52 to-transparent" />
        <div className="absolute bottom-24 left-0 w-44 h-px bg-linear-to-r from-[#FFD166]/38 to-transparent" />
        <div className="absolute top-[25%] left-6 w-px h-32 bg-linear-to-b from-transparent via-[#BC96E6]/50 to-transparent" />
        <div className="absolute top-[50%] right-10 w-px h-28 bg-linear-to-b from-transparent via-[#FFD166]/40 to-transparent" />
        <div className="absolute top-[65%] left-20 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/35 to-transparent" />
        <div className="absolute top-[38%] right-32 w-px h-20 bg-linear-to-b from-transparent via-[#FFD166]/32 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 pt-6 pb-0">
        {groupById?.image ? (
          <motion.div {...fadeUp()} className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8 border border-white/10">
            <img
              src={groupById.image}
              alt={groupById.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#210B2C] via-[#210B2C]/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#210B2C]/50 to-transparent" />
            <button
              onClick={() => navigate('/inicio')}
              aria-label="Volver atrás"
              className="absolute top-4 left-4 flex items-center gap-2 text-white/70 hover:text-white bg-[#210B2C]/60 hover:bg-[#210B2C]/80 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer"
            >
              <i className="bi bi-arrow-left" />
              <span>Volver</span>
            </button>
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
              <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight drop-shadow-lg">{groupById?.name}</h1>
              {groupById?.description && (
                <p className="text-white/60 text-sm mt-1.5 font-medium">{groupById.description}</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div {...fadeUp()} className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8 border border-[#BC96E6]/15">
            <div className="absolute inset-0 bg-linear-to-br from-[#BC96E6]/20 via-[#210B2C] to-[#210B2C]" />
            <div className="absolute inset-0 bg-linear-to-t from-[#210B2C]/80 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-6 right-10 w-32 h-32 rounded-full border border-[#BC96E6]/10" />
              <div className="absolute top-10 right-14 w-20 h-20 rounded-full border border-[#BC96E6]/8" />
              <div className="absolute -bottom-4 right-4 w-48 h-48 rounded-full border border-[#BC96E6]/6" />
              <div className="absolute top-4 left-1/2 w-px h-24 bg-linear-to-b from-transparent via-[#BC96E6]/20 to-transparent" />
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#BC96E6]/10 border border-[#BC96E6]/20 flex items-center justify-center">
              <i className="bi bi-people text-[#BC96E6] text-2xl md:text-3xl" />
            </div>
            <button
              onClick={() => navigate('/inicio')}
              aria-label="Volver atrás"
              className="absolute top-4 left-4 flex items-center gap-2 text-white/70 hover:text-white bg-[#210B2C]/60 hover:bg-[#210B2C]/80 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer"
            >
              <i className="bi bi-arrow-left" />
              <span>Volver</span>
            </button>
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
              <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight">{groupById?.name}</h1>
              {groupById?.description && (
                <p className="text-white/60 text-sm mt-1.5 font-medium">{groupById.description}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-0 pb-6">

        <div className="flex flex-col md:flex-row gap-6">
          <SideNavGroup
            itemSelected={itemSelected}
            setSelectedItem={setItemSelected}
            groupId={idGroup}
          />

          <motion.div key={itemSelected} {...fadeIn()} className="flex-1 min-w-0">
            {itemSelected === "members" && <AllMembers idGroup={idGroup} />}
            {itemSelected === "add-member" && <AddMember idGroup={idGroup} />}
            {itemSelected === "view-plans" && <AllPlans idGroup={idGroup} />}
            {itemSelected === "create-plan" && <CreatePlan idGroup={idGroup} />}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Group;
