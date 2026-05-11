import { Router } from 'express';
import expenseController from '../controllers/expense.controller.js';
import { verifyToken } from '../middlewares/verify-auth.js';
import { verifyRole } from '../middlewares/verify-role.js';
import { validateObjectId } from '../middlewares/validate-object-id.js';

export const router = Router();

router.post('/groups/:idGroup/plans/:idPlan/expenses', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, expenseController.createExpense);

router.get('/groups/:idGroup/plans/:idPlan/expenses', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, expenseController.getExpensesByPlan);

router.get('/groups/:idGroup/plans/:idPlan/expenses/all', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, expenseController.getAllExpensesByPlan);

router.get('/groups/:idGroup/plans/:idPlan/expenses/balances', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, expenseController.getBalances);

router.patch('/groups/:idGroup/plans/:idPlan/expenses/:idExpense/complete', verifyToken, validateObjectId('idGroup', 'idPlan', 'idExpense'), verifyRole, expenseController.completeExpense);


