import { createContext, useState } from "react";
import type { Plans, LoadingPlans } from "../types/plans.types";
import { createPlanService, getAllPlansService, checkPlanAsCompletedService, getPlanService, getPlanHistoryService } from "../services/plans.service";

interface PlanContextType {
    plans: Plans[];
    planById: Plans | null;
    planHistory: Plans[];
    createPlan: (data: FormData, idGroup: string) => Promise<void>;
    checkPlanAsCompleted: (idGroup: string, idPlan: string) => Promise<void>;
    loading: LoadingPlans;
    getPlans: (idGroup: string) => Promise<void>;
    getPlanById: (idGroup: string, idPlan: string) => Promise<void>;
    getPlanHistory: (idGroup: string) => Promise<void>;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({children}: {children: React.ReactNode}) => {

    const [plans, setPlans] = useState<Plans[]>([]);
    const [planById, setPlanById] = useState<Plans | null>(null);
    const [planHistory, setPlanHistory] = useState<Plans[]>([]);

    const [loading, setLoading] = useState<LoadingPlans>({
        fetchLoading: false,
        createLoading: false,
        fetchByIdLoading: false
    });

    async function getPlans(idGroup: string) {
        setLoading(prev => ({ ...prev, fetchLoading: true }));
        try {
            const response = await getAllPlansService(idGroup);
            setPlans(response.data.plans);
        } catch (error) {
            console.error("Error al obtener los planes:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, fetchLoading: false }));
        }
    }

    async function getPlanById(idGroup: string, idPlan: string){
        setLoading(prev => ({ ...prev, fetchByIdLoading: true }));
        try{
            const res = await getPlanService(idGroup,idPlan)
            setPlanById(res.data.plan)
        }
        catch(error){
            console.log("Error al obtener el plan: ", error)
            throw error
        }
        finally{
          setLoading(prev => ({ ...prev, fetchByIdLoading: false }));  
        }
    }

    async function createPlan(data: FormData, idGroup: string) {
        setLoading(prev => ({ ...prev, createLoading: true }));
        try {
            await createPlanService(data, idGroup);
            await getPlans(idGroup);
        } catch (error) {
            console.error("Error al crear el plan:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, createLoading: false }));
        }
    }

    async function getPlanHistory(idGroup: string) {
        try {
            const response = await getPlanHistoryService(idGroup);
            setPlanHistory(response.data.plans);
        } catch (error) {
            console.error("Error al obtener el historial de planes:", error);
            throw error;
        }
    }

    async function checkPlanAsCompleted(idGroup: string, idPlan: string) {
        try {
            await checkPlanAsCompletedService(idGroup, idPlan);
            await getPlans(idGroup);
        } catch (error) {
            console.error("Error al marcar el plan como completado:", error);
            throw error;
        }
    }

    return (
        <PlanContext.Provider value={{ plans, planById, planHistory, createPlan, getPlans, getPlanById, getPlanHistory, loading, checkPlanAsCompleted }}>
            {children}
        </PlanContext.Provider>
    )
}