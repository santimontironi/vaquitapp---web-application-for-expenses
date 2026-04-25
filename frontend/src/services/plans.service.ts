import { api } from "./auth.service";
import type { GetPlansResponse, CreatePlanResponse } from "../types/plans.types";

export const getAllPlansService = (idGroup: string) => {
    return api.get<GetPlansResponse>(`/${idGroup}/plans`);
};

export const createPlanService = (data: FormData, idGroup: string) => {
    return api.post<CreatePlanResponse>(`/${idGroup}/plans`, data);
};

export const checkPlanAsCompletedService = (idGroup: string, idPlan: string) => {
    return api.patch(`/${idGroup}/plans/${idPlan}/complete`);
}