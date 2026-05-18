import { createContext, useState } from "react";
import type { Expense, LoadingExpenses, CreateExpenseData, Transaction } from "../types/expense.types";
import { createExpenseService, getExpensesByPlanService, completeExpenseService, getBalancesService } from "../services/expenses.service";

interface ExpenseContextType {
    expenses: Expense[];
    balances: Transaction[];
    loading: LoadingExpenses;
    createExpense: (idGroup: string, idPlan: string, data: CreateExpenseData) => Promise<void>;
    getExpenses: (idGroup: string, idPlan: string) => Promise<void>;
    completeExpense: (idGroup: string, idPlan: string, idExpense: string) => Promise<void>;
    getBalanceData: (idGroup: string, idPlan: string) => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [balances, setBalances] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<LoadingExpenses>({
        createLoading: false,
        fetchLoading: false,
        deleteLoading: false,
        balancesLoading: false,
    });

    async function getExpenses(idGroup: string, idPlan: string) {
        setLoading(prev => ({ ...prev, fetchLoading: true }));
        try {
            const res = await getExpensesByPlanService(idGroup, idPlan);
            setExpenses(res.data.expenses);
        } catch (error) {
            console.error("Error al obtener los gastos:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, fetchLoading: false }));
        }
    }

    async function getBalanceData(idGroup: string, idPlan: string) {
        setLoading(prev => ({ ...prev, balancesLoading: true }));
        try {
            const res = await getBalancesService(idGroup, idPlan);
            setBalances(res.data.transactions);
        } catch (error) {
            console.error("Error al obtener los balances:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, balancesLoading: false }));
        }
    }

    async function createExpense(idGroup: string, idPlan: string, data: CreateExpenseData) {
        setLoading(prev => ({ ...prev, createLoading: true }));
        try {
            await createExpenseService(idGroup, idPlan, data);
            await getExpenses(idGroup, idPlan);
            await getBalanceData(idGroup, idPlan);
        } catch (error) {
            console.error("Error al crear el gasto:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, createLoading: false }));
        }
    }

    async function completeExpense(idGroup: string, idPlan: string, idExpense: string) {
        setLoading(prev => ({ ...prev, deleteLoading: true }));
        try {
            await completeExpenseService(idGroup, idPlan, idExpense);
            await getExpenses(idGroup, idPlan);
            await getBalanceData(idGroup, idPlan);
        } catch (error) {
            console.error("Error al completar el gasto:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, deleteLoading: false }));
        }
    }

    return (
        <ExpenseContext.Provider value={{ expenses, balances, loading, createExpense, getExpenses, completeExpense, getBalanceData }}>
            {children}
        </ExpenseContext.Provider>
    );
};
