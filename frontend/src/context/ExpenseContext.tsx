import { createContext, useState } from "react";
import type { Expense, LoadingExpenses, CreateExpenseData, Transaction } from "../types/expense.types";
import { createExpenseService, getExpensesByPlanService, getAllExpensesByPlanService, completeAllExpensesService, deleteExpenseService, getBalancesService } from "../services/expenses.service";

interface ExpenseContextType {
    expenses: Expense[];
    completedExpenses: Expense[];
    balances: Transaction[];
    loading: LoadingExpenses;
    createExpense: (idGroup: string, idPlan: string, data: CreateExpenseData) => Promise<void>;
    getExpenses: (idGroup: string, idPlan: string) => Promise<void>;
    getCompletedExpenses: (idGroup: string, idPlan: string) => Promise<void>;
    deleteExpense: (idGroup: string, idPlan: string, idExpense: string) => Promise<void>;
    completeAllExpenses: (idGroup: string, idPlan: string) => Promise<void>;
    getBalanceData: (idGroup: string, idPlan: string) => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [completedExpenses, setCompletedExpenses] = useState<Expense[]>([]);
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

    async function getCompletedExpenses(idGroup: string, idPlan: string) {
        try {
            const res = await getAllExpensesByPlanService(idGroup, idPlan);
            setCompletedExpenses(res.data.expenses.filter(e => e.state === 'completed'));
        } catch (error) {
            console.error("Error al obtener el historial de gastos:", error);
            throw error;
        }
    }

    async function deleteExpense(idGroup: string, idPlan: string, idExpense: string) {
        setLoading(prev => ({ ...prev, deleteLoading: true }));
        try {
            await deleteExpenseService(idGroup, idPlan, idExpense);
            await getExpenses(idGroup, idPlan);
            await getBalanceData(idGroup, idPlan);
        } catch (error) {
            console.error("Error al eliminar el gasto:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, deleteLoading: false }));
        }
    }

    async function completeAllExpenses(idGroup: string, idPlan: string) {
        setLoading(prev => ({ ...prev, deleteLoading: true }));
        try {
            await completeAllExpensesService(idGroup, idPlan);
            await getExpenses(idGroup, idPlan);
            await getBalanceData(idGroup, idPlan);
        } catch (error) {
            console.error("Error al saldar gastos:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, deleteLoading: false }));
        }
    }

    return (
        <ExpenseContext.Provider value={{ expenses, completedExpenses, balances, loading, createExpense, getExpenses, getCompletedExpenses, deleteExpense, completeAllExpenses, getBalanceData }}>
            {children}
        </ExpenseContext.Provider>
    );
};
