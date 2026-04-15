import { createContext, useState } from "react";
import type { Plans, LoadingPlans } from "../types/plans.types";
import { createPlanService, getAllPlansService } from "../services/plans.service";

interface PlanContextType {
    plans: Plans[];
    createPlan: (data: FormData, idGroup: string) => Promise<void>;
    loading: LoadingPlans;
    getPlans: (idGroup: string) => Promise<void>;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({children}: {children: React.ReactNode}) => {

    const [plans, setPlans] = useState<Plans[]>([]);

    const [loading, setLoading] = useState<LoadingPlans>({
        fetchLoading: false,
        createLoading: false,
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

    return (
        <PlanContext.Provider value={{plans, createPlan, getPlans, loading  }}>
            {children}
        </PlanContext.Provider>
    )
}