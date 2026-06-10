import planController from '../controllers/plan.controller.js';
import planRepository from '../repository/plan.repository.js';
import cloudinaryConfig from '../config/cloudinary.config.js';
import GroupMember from '../models/groupMember.model.js';

jest.mock('../repository/plan.repository.js');
jest.mock('../config/cloudinary.config.js', () => {
  const mockCloudinary = { uploader: { upload: jest.fn() } };
  return { __esModule: true, default: mockCloudinary };
});
jest.mock('../models/groupMember.model.js', () => {
  const mockGroupMember = { find: jest.fn() };
  return { __esModule: true, default: mockGroupMember };
});

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
// getAllPlansByGroup
// ---------------------------------------------------------------------------
describe('planController.getAllPlansByGroup', () => {
  test('devuelve 404 si no hay planes activos', async () => {
    planRepository.getAllPlansByGroup.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getAllPlansByGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No se encontraron planes para este grupo' }));
  });

  test('devuelve los planes activos exitosamente', async () => {
    const plans = [{ _id: 'p1', name: 'Asado' }];
    planRepository.getAllPlansByGroup.mockResolvedValue(plans);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getAllPlansByGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ plans }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getAllPlansByGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getAllPlansByGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getPlanHistory
// ---------------------------------------------------------------------------
describe('planController.getPlanHistory', () => {
  test('devuelve el historial de planes exitosamente', async () => {
    const plans = [{ _id: 'p1', name: 'Asado', state: 'completed' }];
    planRepository.getPlanHistory.mockResolvedValue(plans);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getPlanHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ plans }));
  });

  test('devuelve array vacío si no hay historial', async () => {
    planRepository.getPlanHistory.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getPlanHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ plans: [] }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanHistory.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await planController.getPlanHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// createPlan
// ---------------------------------------------------------------------------
describe('planController.createPlan', () => {
  test('devuelve 400 si falta el nombre', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { name: '', members: ['userId1'] },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Nombre del plan es requerido' }));
  });

  test('devuelve 400 si members está vacío', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', members: [] },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Se requiere al menos un miembro para el plan' }));
  });

  test('devuelve 400 si members no es un array', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', members: 'userId1' },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 400 si algún miembro no pertenece al grupo', async () => {
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ user: { toString: () => 'userId1' } }])
    });

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', members: ['userId1', 'userIdForaneo'] },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Algunos usuarios no pertenecen al grupo' }));
  });

  test('crea el plan exitosamente y agrega al creador si no está en la lista', async () => {
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { user: { toString: () => 'userId1' } },
        { user: { toString: () => 'userId2' } }
      ])
    });
    const createdPlan = { _id: 'p1', name: 'Asado', members: ['userId2', 'userId1'] };
    planRepository.createPlan.mockResolvedValue(createdPlan);

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', description: 'Desc', members: ['userId2'] },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    // El creador debe haberse agregado automáticamente a members
    const createCall = planRepository.createPlan.mock.calls[0];
    expect(createCall[5]).toContain('userId1');
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('crea el plan con imagen subiendo a Cloudinary', async () => {
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ user: { toString: () => 'userId1' } }])
    });
    cloudinaryConfig.uploader.upload.mockResolvedValue({ secure_url: 'http://cloudinary.com/plan.jpg' });
    planRepository.createPlan.mockResolvedValue({ _id: 'p1', name: 'Asado' });

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', members: ['userId1'] },
      user: { id: 'userId1' },
      file: { buffer: Buffer.from('img'), mimetype: 'image/jpeg' }
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(cloudinaryConfig.uploader.upload).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('devuelve 500 en error inesperado', async () => {
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('DB error'))
    });

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asado', members: ['userId1'] },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await planController.createPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// checkPlanAsCompleted
// ---------------------------------------------------------------------------
describe('planController.checkPlanAsCompleted', () => {
  test('devuelve 404 si el plan no pertenece al grupo', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.checkPlanAsCompleted(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('marca el plan como completado exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1', state: 'active' });
    planRepository.checkPlanAsCompleted.mockResolvedValue({ _id: 'p1', state: 'completed' });

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.checkPlanAsCompleted(req, res);

    expect(planRepository.checkPlanAsCompleted).toHaveBeenCalledWith('p1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.checkPlanAsCompleted(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// addMembersToPlan
// ---------------------------------------------------------------------------
describe('planController.addMembersToPlan', () => {
  test('devuelve 400 si userIds está vacío', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: [] }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 400 si userIds no es array', async () => {
    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: 'userId1' }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 404 si el plan no existe', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: ['userId2'] }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve 400 si algún usuario no pertenece al grupo', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ user: { toString: () => 'userId1' } }])
    });

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: ['userIdForaneo'] }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Algunos usuarios no pertenecen al grupo' }));
  });

  test('agrega miembros al plan exitosamente', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue({ _id: 'p1' });
    GroupMember.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { user: { toString: () => 'userId1' } },
        { user: { toString: () => 'userId2' } }
      ])
    });
    planRepository.addMembersToPlan.mockResolvedValue({ _id: 'p1', members: ['userId1', 'userId2'] });

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: ['userId2'] }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(planRepository.addMembersToPlan).toHaveBeenCalledWith('p1', ['userId2']);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1', idPlan: 'p1' },
      body: { userIds: ['userId2'] }
    };
    const res = mockRes();

    await planController.addMembersToPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getPlanByIdAndGroup
// ---------------------------------------------------------------------------
describe('planController.getPlanByIdAndGroup', () => {
  test('devuelve 404 si el plan no existe o no pertenece al grupo', async () => {
    planRepository.getPlanByIdAndGroup.mockResolvedValue(null);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.getPlanByIdAndGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve el plan exitosamente', async () => {
    const plan = { _id: 'p1', name: 'Asado', group: 'g1' };
    planRepository.getPlanByIdAndGroup.mockResolvedValue(plan);

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.getPlanByIdAndGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ plan }));
  });

  test('devuelve 500 en error inesperado', async () => {
    planRepository.getPlanByIdAndGroup.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1', idPlan: 'p1' } };
    const res = mockRes();

    await planController.getPlanByIdAndGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
