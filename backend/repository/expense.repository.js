import Expense from '../models/expense.model.js';

class ExpenseRepository {

    async createExpense(data) {
        return await Expense.create(data);
    }

    async getExpensesByPlan(planId) {
        return await Expense.find({ plan: planId, state: 'active' })
            .populate('paid_by', 'username')
            .populate('split_among', 'username');
    }

    async getAllExpensesByPlan(planId) {
        return await Expense.find({ plan: planId })
            .populate('paid_by', 'username')
            .populate('split_among', 'username');
    }

    async getExpenseById(expenseId) {
        return await Expense.findById(expenseId);
    }

    async completeAllExpenses(planId) {
        return await Expense.updateMany({ plan: planId, state: 'active' }, { state: 'completed' });
    }

    async deleteExpense(expenseId) {
        return await Expense.findByIdAndDelete(expenseId);
    }
}

const expenseRepository = new ExpenseRepository();
export default expenseRepository;
