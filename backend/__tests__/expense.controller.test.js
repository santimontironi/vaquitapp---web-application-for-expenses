import expenseController from '../controllers/expense.controller.js';
import expenseRepository from '../repository/expense.repository.js';
import planRepository from '../repository/plan.repository.js';

jest.mock('../repository/expense.repository.js');
jest.mock('../repository/plan.repository.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// createExpense
// ---------------------------------------------------------------------------
describe('expenseController.createExpense', () => {
  test('devuelve 400 si amount es 0 o no está definido', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 0, paid_by: 'userId1', split_among: ['userId1'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El monto es requerido y debe ser mayor a 0' }));
  });

  test('devuelve 400 si amount es negativo', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: -50, paid_by: 'userId1', split_among: ['userId1'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 400 si falta paid_by', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: '', split_among: ['userId1'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El campo paid_by es requerido' }));
  });

  test('devuelve 400 si split_among está vacío', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: [] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'split_among es requerido y debe contener al menos un usuario' }));
  });

  test('devuelve 400 si split_among no es un array', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: 'userId1' }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: ['userId1'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve 400 si paid_by no es miembro del plan', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({
      _id: 'p1',
      members: [{ _id: { toString: () => 'userId2' } }]
    });

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: ['userId2'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El usuario que pagó no es miembro del plan' }));
  });

  test('devuelve 400 si algún miembro de split_among no pertenece al plan', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({
      _id: 'p1',
      members: [{ _id: { toString: () => 'userId1' } }]
    });

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: ['userId1', 'userIdForaneo'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Algunos usuarios de split_among no son miembros del plan' }));
  });

  test('crea el gasto exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({
      _id: 'p1',
      members: [
        { _id: { toString: () => 'userId1' } },
        { _id: { toString: () => 'userId2' } }
      ]
    });
    const expense = { _id: 'exp1', amount: 100, paid_by: 'userId1', split_among: ['userId1', 'userId2'] };
    expenseRepository.createExpense.mockResolvedValue(expense);

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: {
        description: 'Pizza',
        amount: 100,
        paid_by: 'userId1',
        split_among: ['userId1', 'userId2']
      }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(expenseRepository.createExpense).toHaveBeenCalledWith({
      description: 'Pizza',
      amount: 100,
      plan: 'p1',
      paid_by: 'userId1',
      split_among: ['userId1', 'userId2']
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ expense }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { amount: 100, paid_by: 'userId1', split_among: ['userId1'] }
    };
    const res = mockRes();

    await expenseController.createExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getExpensesByPlan
// ---------------------------------------------------------------------------
describe('expenseController.getExpensesByPlan', () => {
  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve array vacío con 200 si no hay gastos activos', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    expenseRepository.getExpensesByPlan.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ expenses: [] }));
  });

  test('devuelve los gastos exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    const expenses = [{ _id: 'exp1', amount: 100 }];
    expenseRepository.getExpensesByPlan.mockResolvedValue(expenses);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ expenses }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getAllExpensesByPlan
// ---------------------------------------------------------------------------
describe('expenseController.getAllExpensesByPlan', () => {
  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getAllExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve array vacío con 200 si no hay gastos', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    expenseRepository.getAllExpensesByPlan.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getAllExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ expenses: [] }));
  });

  test('devuelve todos los gastos exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    const expenses = [{ _id: 'exp1', amount: 100 }, { _id: 'exp2', amount: 50, state: 'completed' }];
    expenseRepository.getAllExpensesByPlan.mockResolvedValue(expenses);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getAllExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ expenses }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getAllExpensesByPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getBalances
// ---------------------------------------------------------------------------
describe('expenseController.getBalances', () => {
  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getBalances(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve array vacío de transacciones si no hay gastos', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    expenseRepository.getExpensesByPlan.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getBalances(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ transactions: [] }));
  });

  test('calcula balances correctamente: un pagador, dos deudores', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });

    // userId1 pagó 90, dividido entre userId1, userId2, userId3
    // Share = 30 cada uno
    // userId1: pagó 90, debe 30 → balance neto = +60
    // userId2: no pagó, debe 30 → balance = -30
    // userId3: no pagó, debe 30 → balance = -30
    expenseRepository.getExpensesByPlan.mockResolvedValue([
      {
        amount: 90,
        paid_by: { _id: { toString: () => 'u1' }, username: 'Alice' },
        split_among: [
          { _id: { toString: () => 'u1' }, username: 'Alice' },
          { _id: { toString: () => 'u2' }, username: 'Bob' },
          { _id: { toString: () => 'u3' }, username: 'Charlie' }
        ]
      }
    ]);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getBalances(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const { transactions } = res.json.mock.calls[0][0];
    // Deben haber exactamente 2 transacciones (Bob→Alice y Charlie→Alice)
    expect(transactions).toHaveLength(2);
    transactions.forEach(t => {
      expect(t).toMatchObject({
        from: expect.objectContaining({ username: expect.any(String) }),
        to: expect.objectContaining({ username: 'Alice' }),
        amount: 30
      });
    });
  });

  test('calcula balances correctamente cuando todos pagan su parte exacta (sin deudas)', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });

    // Cada uno paga exactamente 50, dividido solo entre sí mismo → balance neto = 0 para todos
    expenseRepository.getExpensesByPlan.mockResolvedValue([
      {
        amount: 50,
        paid_by: { _id: { toString: () => 'u1' }, username: 'Alice' },
        split_among: [{ _id: { toString: () => 'u1' }, username: 'Alice' }]
      },
      {
        amount: 50,
        paid_by: { _id: { toString: () => 'u2' }, username: 'Bob' },
        split_among: [{ _id: { toString: () => 'u2' }, username: 'Bob' }]
      }
    ]);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getBalances(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const { transactions } = res.json.mock.calls[0][0];
    expect(transactions).toHaveLength(0);
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.getBalances(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// deleteExpense
// ---------------------------------------------------------------------------
describe('expenseController.deleteExpense', () => {
  test('devuelve 404 si el gasto no existe', async () => {
    expenseRepository.getExpenseById.mockResolvedValue(null);

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve 400 si el gasto no pertenece al plan', async () => {
    expenseRepository.getExpenseById.mockResolvedValue({
      _id: 'exp1',
      plan: { toString: () => 'p2' }, // plan diferente
      paid_by: { toString: () => 'userId1' }
    });

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El gasto no pertenece a este plan' }));
  });

  test('devuelve 403 si el usuario no pagó el gasto y no es admin', async () => {
    expenseRepository.getExpenseById.mockResolvedValue({
      _id: 'exp1',
      plan: { toString: () => 'p1' },
      paid_by: { toString: () => 'userId2' } // otro usuario pagó
    });

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' }, // userId1 intenta borrar
      member: { role: 'member' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No tenés permiso para eliminar este gasto' }));
  });

  test('el creador del gasto puede eliminarlo', async () => {
    expenseRepository.getExpenseById.mockResolvedValue({
      _id: 'exp1',
      plan: { toString: () => 'p1' },
      paid_by: { toString: () => 'userId1' }
    });
    expenseRepository.deleteExpense.mockResolvedValue({});

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(expenseRepository.deleteExpense).toHaveBeenCalledWith('exp1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('el admin puede eliminar cualquier gasto', async () => {
    expenseRepository.getExpenseById.mockResolvedValue({
      _id: 'exp1',
      plan: { toString: () => 'p1' },
      paid_by: { toString: () => 'userId2' } // otro pagó, pero admin puede borrar
    });
    expenseRepository.deleteExpense.mockResolvedValue({});

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(expenseRepository.deleteExpense).toHaveBeenCalledWith('exp1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    expenseRepository.getExpenseById.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idPlan: 'p1', idExpense: 'exp1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await expenseController.deleteExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// completeAllExpenses
// ---------------------------------------------------------------------------
describe('expenseController.completeAllExpenses', () => {
  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.completeAllExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('completa todos los gastos exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    expenseRepository.completeAllExpenses.mockResolvedValue({ modifiedCount: 3 });

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.completeAllExpenses(req, res);

    expect(expenseRepository.completeAllExpenses).toHaveBeenCalledWith('p1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Todos los gastos fueron saldados exitosamente' }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await expenseController.completeAllExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
