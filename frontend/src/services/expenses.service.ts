import { api } from "./auth.service";
import type { CreateExpenseData, CreateExpenseResponse, GetExpensesResponse, GetBalancesResponse } from "../types/expense.types";

export const createExpenseService = (idGroup: string, idPlan: string, data: CreateExpenseData) => {
    return api.post<CreateExpenseResponse>(`/groups/${idGroup}/plans/${idPlan}/expenses`, data);
};

export const getExpensesByPlanService = (idGroup: string, idPlan: string) => {
    return api.get<GetExpensesResponse>(`/groups/${idGroup}/plans/${idPlan}/expenses`);
};

export const getAllExpensesByPlanService = (idGroup: string, idPlan: string) => {
    return api.get<GetExpensesResponse>(`/groups/${idGroup}/plans/${idPlan}/expenses/all`);
};

export const deleteExpenseService = (idGroup: string, idPlan: string, idExpense: string) => {
    return api.delete(`/groups/${idGroup}/plans/${idPlan}/expenses/${idExpense}`);
};

export const completeAllExpensesService = (idGroup: string, idPlan: string) => {
    return api.patch(`/groups/${idGroup}/plans/${idPlan}/expenses/complete-all`);
};


export const getBalancesService = (idGroup: string, idPlan: string) => {
    return api.get<GetBalancesResponse>(`/groups/${idGroup}/plans/${idPlan}/expenses/balances`);
};
