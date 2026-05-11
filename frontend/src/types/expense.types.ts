import type { User } from "./auth.types";

export interface Expense {
    _id: string;
    description?: string;
    amount: number;
    plan: string;
    paid_by: User;
    split_among: User[];
    state: 'active' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseData {
    description?: string;
    amount: number;
    paid_by: string;
    split_among: string[];
}

export interface CreateExpenseResponse {
    message: string;
    expense: Expense;
}

export interface GetExpensesResponse {
    message: string;
    expenses: Expense[];
}

export interface LoadingExpenses {
    createLoading: boolean;
    fetchLoading: boolean;
    deleteLoading: boolean;
}

export interface CreateExpenseModalProps {
    idGroup: string;
    idPlan: string;
    members: User[];
    onClose: () => void;
}
