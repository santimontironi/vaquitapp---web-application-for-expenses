import type { User } from "./auth.types";
import type { Group } from "./groups.types";

export interface Plans {
    _id: string;
    image: string | null;
    name: string;
    description: string | null;
    group: Group;
    created_by: User;
    created_at: Date;
    state: "active" | "completed" | "cancelled";
    members: User[];
}

export interface GetPlansResponse {
    plans: Plans[];
}

export interface CreatePlanData {
    members: string[];
    image: FileList | null;
    name: string;
    description: string | null;
}

export interface CreatePlanResponse {
    planCreated: Plans;
}

export interface LoadingPlans {
    fetchLoading: boolean;
    createLoading: boolean;
}

export interface PlanItemProps {
    plan: Plans;
}

export interface AllPlansProps {
    idGroup: string;
}

export interface CreatePlanProps {
    idGroup: string;
}