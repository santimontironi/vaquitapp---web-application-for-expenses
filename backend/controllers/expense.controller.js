import expenseRepository from '../repository/expense.repository.js';
import planRepository from '../repository/plan.repository.js';

class ExpenseController {

    async createExpense(req, res) {
        try {
            const { idGroup, idPlan } = req.params;
            const { description, amount, paid_by, split_among } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ message: 'El monto es requerido y debe ser mayor a 0' });
            }

            if (!paid_by) {
                return res.status(400).json({ message: 'El campo paid_by es requerido' });
            }

            if (!split_among || !Array.isArray(split_among) || split_among.length === 0) {
                return res.status(400).json({ message: 'split_among es requerido y debe contener al menos un usuario' });
            }

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if (!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            const planMemberIds = plan.members.map(m => m._id.toString());

            if (!planMemberIds.includes(paid_by)) {
                return res.status(400).json({ message: 'El usuario que pagó no es miembro del plan' });
            }

            const invalidMembers = split_among.filter(userId => !planMemberIds.includes(userId));

            if (invalidMembers.length > 0) {
                return res.status(400).json({ message: 'Algunos usuarios de split_among no son miembros del plan' });
            }

            const expense = await expenseRepository.createExpense({
                description,
                amount,
                plan: idPlan,
                paid_by,
                split_among
            });

            res.status(201).json({ message: 'Gasto creado exitosamente', expense });
        } catch (error) {
            res.status(500).json({ message: 'Error creando gasto', error: error.message });
        }
    }

    async getExpensesByPlan(req, res) {
        try {
            const { idGroup, idPlan } = req.params;

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if (!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            const expenses = await expenseRepository.getExpensesByPlan(idPlan);

            res.status(200).json({ message: 'Gastos obtenidos exitosamente', expenses });
        } catch (error) {
            res.status(500).json({ message: 'Error obteniendo gastos', error: error.message });
        }
    }

    async getAllExpensesByPlan(req, res) {
        try{
            const { idGroup, idPlan } = req.params;

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if (!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            const expenses = await expenseRepository.getAllExpensesByPlan(idPlan);

            if(expenses.length === 0) {
                return res.status(200).json({ message: 'No hay gastos en este plan', expenses: [] });
            }

            res.status(200).json({ message: 'Gastos obtenidos exitosamente', expenses:expenses });
        }
        catch (error) {
            res.status(500).json({ message: 'Error obteniendo gastos', error: error.message });
        }
    }

    async getBalances(req, res) {
        try {
            const { idGroup, idPlan } = req.params;

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if (!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            // trae todos los gastos del plan con paid_by y split_among populados (id + username)
            const expenses = await expenseRepository.getExpensesByPlan(idPlan);

            if (expenses.length === 0) {
                return res.status(200).json({ message: 'No hay gastos en este plan', transactions: [] });
            }

            // mapa userId -> { _id, username, balance }
            // balance positivo = le deben dinero | balance negativo = debe dinero
            const balanceMap = new Map();

            // si el usuario no está en el mapa lo inicializa con balance 0, luego lo devuelve
            const getOrInit = (user) => {
                const id = user._id.toString();
                if (!balanceMap.has(id)) {
                    balanceMap.set(id, { _id: id, username: user.username, balance: 0 });
                }
                return balanceMap.get(id);
            };

            for (const expense of expenses) {
                // parte proporcional que le corresponde a cada persona del split
                const share = expense.amount / expense.split_among.length;
                // quien pagó suma todo lo que desembolsó
                getOrInit(expense.paid_by).balance += expense.amount;
                // cada persona en split_among resta su parte (lo que debe)
                for (const user of expense.split_among) {
                    getOrInit(user).balance -= share;
                }
            }

            // separar usuarios en acreedores (balance > 0) y deudores (balance < 0)
            // los que quedaron en 0 ya están saldados, no se incluyen
            const creditors = [];
            const debtors = [];

            for (const entry of balanceMap.values()) {
                const rounded = Math.round(entry.balance * 100) / 100; // redondeo a 2 decimales para evitar errores de punto flotante
                if (rounded > 0) creditors.push({ ...entry, balance: rounded });
                else if (rounded < 0) debtors.push({ ...entry, balance: rounded });
            }

            // ordenar de mayor a menor para emparejar los extremos primero
            creditors.sort((a, b) => b.balance - a.balance); // mayor acreedor primero
            debtors.sort((a, b) => a.balance - b.balance);   // mayor deudor primero (más negativo)

            // algoritmo greedy: en cada iteración empareja al mayor deudor con el mayor acreedor
            // el monto de la transacción es el menor entre lo que debe uno y lo que le deben al otro
            // esto garantiza la cantidad mínima de transferencias para saldar todo
            const transactions = [];

            while (creditors.length > 0 && debtors.length > 0) {
                const creditor = creditors[0]; // quien más le deben
                const debtor = debtors[0];     // quien más debe

                const amount = Math.round(Math.min(creditor.balance, Math.abs(debtor.balance)) * 100) / 100;

                transactions.push({
                    from: { _id: debtor._id, username: debtor.username },
                    to: { _id: creditor._id, username: creditor.username },
                    amount
                });

                // actualizar balances tras la transacción
                creditor.balance = Math.round((creditor.balance - amount) * 100) / 100;
                debtor.balance = Math.round((debtor.balance + amount) * 100) / 100;

                // si quedó en 0 ya está saldado, sacarlo de la lista
                if (creditor.balance === 0) creditors.shift();
                if (debtor.balance === 0) debtors.shift();
            }

            res.status(200).json({ message: 'Balances calculados exitosamente', transactions });
        } catch (error) {
            res.status(500).json({ message: 'Error calculando balances', error: error.message });
        }
    }

    async completeExpense(req, res) {
        try {
            const { idPlan, idExpense } = req.params;

            const expense = await expenseRepository.getExpenseById(idExpense);

            if (!expense) {
                return res.status(404).json({ message: 'Gasto no encontrado' });
            }

            if (expense.plan.toString() !== idPlan) {
                return res.status(404).json({ message: 'El gasto no pertenece a este plan' });
            }

            if (expense.state === 'completed') {
                return res.status(400).json({ message: 'El gasto ya fue completado' });
            }

            const isPaidBy = expense.paid_by.toString() === req.user.id;
            const isAdmin = req.member.role === 'admin';

            if (!isPaidBy && !isAdmin) {
                return res.status(403).json({ message: 'No tenés permiso para eliminar este gasto' });
            }

            await expenseRepository.completeExpense(idExpense);

            res.status(200).json({ message: 'Gasto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error eliminando gasto', error: error.message });
        }
    }
}

const expenseController = new ExpenseController();
export default expenseController;
