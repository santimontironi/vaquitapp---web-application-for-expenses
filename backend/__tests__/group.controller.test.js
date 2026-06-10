import groupController from '../controllers/group.controller.js';
import groupRepository from '../repository/group.repository.js';
import authRepository from '../repository/auth.repository.js';
import cloudinaryConfig from '../config/cloudinary.config.js';
import transporter from '../config/mail.config.js';
import jwt from 'jsonwebtoken';

jest.mock('../repository/group.repository.js');
jest.mock('../repository/auth.repository.js');
jest.mock('../config/cloudinary.config.js', () => {
  const mockCloudinary = { uploader: { upload: jest.fn() } };
  return { __esModule: true, default: mockCloudinary };
});
jest.mock('../config/mail.config.js', () => {
  const mockTransporter = { sendMail: jest.fn() };
  return { __esModule: true, default: mockTransporter };
});
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.EMAIL_USER = 'test@test.com';
});

// ---------------------------------------------------------------------------
// getAllGroupsByUser
// ---------------------------------------------------------------------------
describe('groupController.getAllGroupsByUser', () => {
  test('devuelve 404 si no hay grupos', async () => {
    groupRepository.getAllGroupsByUser.mockResolvedValue([]);

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await groupController.getAllGroupsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve los grupos del usuario exitosamente', async () => {
    const groups = [{ _id: 'g1', name: 'Grupo 1' }];
    groupRepository.getAllGroupsByUser.mockResolvedValue(groups);

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await groupController.getAllGroupsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ groups }));
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.getAllGroupsByUser.mockRejectedValue(new Error('DB error'));

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await groupController.getAllGroupsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getGroupById
// ---------------------------------------------------------------------------
describe('groupController.getGroupById', () => {
  test('devuelve el grupo desde req.group', async () => {
    const group = { _id: 'g1', name: 'Grupo 1' };
    const req = { group };
    const res = mockRes();

    await groupController.getGroupById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ group }));
  });
});

// ---------------------------------------------------------------------------
// createGroup
// ---------------------------------------------------------------------------
describe('groupController.createGroup', () => {
  test('devuelve 400 si faltan nombre o descripcion', async () => {
    const req = { body: { name: '', description: '' }, user: { id: 'userId1' }, file: null };
    const res = mockRes();

    await groupController.createGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('crea grupo sin imagen exitosamente', async () => {
    const createdGroup = { _id: 'g1', name: 'Asados', description: 'Grupo de asados' };
    groupRepository.createGroup.mockResolvedValue(createdGroup);

    const req = {
      body: { name: 'Asados', description: 'Grupo de asados' },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await groupController.createGroup(req, res);

    expect(groupRepository.createGroup).toHaveBeenCalledWith(null, 'Asados', 'Grupo de asados', 'userId1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ groupCreated: createdGroup }));
  });

  test('crea grupo con imagen subiendo a Cloudinary', async () => {
    cloudinaryConfig.uploader.upload.mockResolvedValue({ secure_url: 'http://cloudinary.com/img.jpg' });
    const createdGroup = { _id: 'g1', name: 'Asados', image: 'http://cloudinary.com/img.jpg' };
    groupRepository.createGroup.mockResolvedValue(createdGroup);

    const req = {
      body: { name: 'Asados', description: 'Grupo de asados' },
      user: { id: 'userId1' },
      file: { buffer: Buffer.from('img'), mimetype: 'image/jpeg' }
    };
    const res = mockRes();

    await groupController.createGroup(req, res);

    expect(cloudinaryConfig.uploader.upload).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.createGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      body: { name: 'Asados', description: 'Desc' },
      user: { id: 'userId1' },
      file: null
    };
    const res = mockRes();

    await groupController.createGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// deleteGroup
// ---------------------------------------------------------------------------
describe('groupController.deleteGroup', () => {
  test('devuelve 403 si el miembro no es admin', async () => {
    const req = {
      params: { idGroup: 'g1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.deleteGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('elimina el grupo exitosamente', async () => {
    const deletedGroup = { _id: 'g1', active: false };
    groupRepository.deleteGroup.mockResolvedValue(deletedGroup);

    const req = {
      params: { idGroup: 'g1' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.deleteGroup(req, res);

    expect(groupRepository.deleteGroup).toHaveBeenCalledWith('g1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.deleteGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.deleteGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// addMemberToGroup
// ---------------------------------------------------------------------------
describe('groupController.addMemberToGroup', () => {
  test('devuelve 400 si faltan email o role', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { email: '', role: '' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.addMemberToGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 403 si el miembro no es admin', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { email: 'invited@test.com', role: 'member' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.addMemberToGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('devuelve 400 si el usuario ya es miembro del grupo', async () => {
    authRepository.findUserByEmail.mockResolvedValue({ _id: 'userId2', email: 'invited@test.com' });
    groupRepository.findGroupByIdAndUser.mockResolvedValue({ group: 'g1', user: 'userId2' });

    const req = {
      params: { idGroup: 'g1' },
      body: { email: 'invited@test.com', role: 'member' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.addMemberToGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El usuario ya es miembro de este grupo' }));
  });

  test('envía invitación exitosamente a email nuevo', async () => {
    authRepository.findUserByEmail.mockResolvedValue(null);
    jwt.sign.mockReturnValue('invite-token');
    transporter.sendMail.mockResolvedValue({});

    const req = {
      params: { idGroup: 'g1' },
      body: { email: 'new@test.com', role: 'member' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.addMemberToGroup(req, res);

    expect(transporter.sendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invitación enviada exitosamente' }));
  });

  test('devuelve 500 en error inesperado', async () => {
    authRepository.findUserByEmail.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1' },
      body: { email: 'new@test.com', role: 'member' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.addMemberToGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// acceptInvitation
// ---------------------------------------------------------------------------
describe('groupController.acceptInvitation', () => {
  test('devuelve 400 si el token es inválido', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    const req = { params: { token: 'bad-token' } };
    const res = mockRes();

    await groupController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 404 si el grupo no existe', async () => {
    jwt.verify.mockReturnValue({ groupId: 'g1', email: 'u@u.com', role: 'member' });
    groupRepository.findGroupById.mockResolvedValue(null);

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await groupController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No se encontró el grupo o no está activo' }));
  });

  test('devuelve 404 si el usuario no existe', async () => {
    jwt.verify.mockReturnValue({ groupId: 'g1', email: 'u@u.com', role: 'member' });
    groupRepository.findGroupById.mockResolvedValue({ _id: 'g1' });
    authRepository.findUserByEmail.mockResolvedValue(null);

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await groupController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No existe una cuenta registrada con este email' }));
  });

  test('devuelve 400 si el usuario ya es miembro', async () => {
    jwt.verify.mockReturnValue({ groupId: 'g1', email: 'u@u.com', role: 'member' });
    groupRepository.findGroupById.mockResolvedValue({ _id: 'g1' });
    authRepository.findUserByEmail.mockResolvedValue({ _id: 'userId1' });
    groupRepository.findGroupByIdAndUser.mockResolvedValue({ group: 'g1', user: 'userId1' });

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await groupController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Ya sos miembro de este grupo' }));
  });

  test('acepta la invitación exitosamente', async () => {
    jwt.verify.mockReturnValue({ groupId: 'g1', email: 'u@u.com', role: 'member' });
    groupRepository.findGroupById.mockResolvedValue({ _id: 'g1' });
    authRepository.findUserByEmail.mockResolvedValue({ _id: 'userId1' });
    groupRepository.findGroupByIdAndUser.mockResolvedValue(null);
    groupRepository.addMemberToGroup.mockResolvedValue({ group: 'g1', user: 'userId1', role: 'member' });

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await groupController.acceptInvitation(req, res);

    expect(groupRepository.addMemberToGroup).toHaveBeenCalledWith('g1', 'userId1', 'member');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ---------------------------------------------------------------------------
// editGroup
// ---------------------------------------------------------------------------
describe('groupController.editGroup', () => {
  test('devuelve 403 si el miembro no es admin', async () => {
    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Nuevo nombre' },
      member: { role: 'member' },
      file: null
    };
    const res = mockRes();

    await groupController.editGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('edita el grupo exitosamente sin imagen', async () => {
    const updatedGroup = { _id: 'g1', name: 'Nuevo nombre' };
    groupRepository.editGroup.mockResolvedValue(updatedGroup);

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Nuevo nombre', description: 'Nueva desc' },
      member: { role: 'admin' },
      file: null
    };
    const res = mockRes();

    await groupController.editGroup(req, res);

    expect(groupRepository.editGroup).toHaveBeenCalledWith('g1', { name: 'Nuevo nombre', description: 'Nueva desc' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('edita el grupo con nueva imagen subiendo a Cloudinary', async () => {
    cloudinaryConfig.uploader.upload.mockResolvedValue({ secure_url: 'http://cloudinary.com/new.jpg' });
    groupRepository.editGroup.mockResolvedValue({ _id: 'g1', image: 'http://cloudinary.com/new.jpg' });

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Asados' },
      member: { role: 'admin' },
      file: { buffer: Buffer.from('img'), mimetype: 'image/jpeg' }
    };
    const res = mockRes();

    await groupController.editGroup(req, res);

    expect(cloudinaryConfig.uploader.upload).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.editGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1' },
      body: { name: 'Nombre' },
      member: { role: 'admin' },
      file: null
    };
    const res = mockRes();

    await groupController.editGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// giveAdminRole
// ---------------------------------------------------------------------------
describe('groupController.giveAdminRole', () => {
  test('devuelve 403 si el miembro no es admin', async () => {
    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.giveAdminRole(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('devuelve 404 si el miembro no se encuentra', async () => {
    groupRepository.giveAdminRole.mockResolvedValue(null);

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.giveAdminRole(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('otorga rol admin exitosamente', async () => {
    const updatedMember = { group: 'g1', user: 'userId2', role: 'admin' };
    groupRepository.giveAdminRole.mockResolvedValue(updatedMember);

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.giveAdminRole(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ updatedMember }));
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.giveAdminRole.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.giveAdminRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// getGroupMembers
// ---------------------------------------------------------------------------
describe('groupController.getGroupMembers', () => {
  test('devuelve 404 si no hay miembros', async () => {
    groupRepository.getGroupMembers.mockResolvedValue([]);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await groupController.getGroupMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve los miembros del grupo exitosamente', async () => {
    const members = [{ user: { _id: 'u1', username: 'santi' }, role: 'admin' }];
    groupRepository.getGroupMembers.mockResolvedValue(members);

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await groupController.getGroupMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ members }));
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.getGroupMembers.mockRejectedValue(new Error('DB error'));

    const req = { params: { idGroup: 'g1' } };
    const res = mockRes();

    await groupController.getGroupMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// deleteMemberFromGroup
// ---------------------------------------------------------------------------
describe('groupController.deleteMemberFromGroup', () => {
  test('devuelve 403 si el miembro no es admin', async () => {
    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.deleteMemberFromGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('devuelve 404 si el miembro no se encuentra', async () => {
    groupRepository.deleteMemberFromGroup.mockResolvedValue(null);

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.deleteMemberFromGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('elimina miembro exitosamente', async () => {
    groupRepository.deleteMemberFromGroup.mockResolvedValue({ group: 'g1', user: 'userId2' });

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.deleteMemberFromGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.deleteMemberFromGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1', idMember: 'userId2' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.deleteMemberFromGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// leaveGroup
// ---------------------------------------------------------------------------
describe('groupController.leaveGroup', () => {
  test('devuelve 400 si es el único admin e intenta salir', async () => {
    groupRepository.countAdminsByGroup.mockResolvedValue(1);

    const req = {
      params: { idGroup: 'g1' },
      user: { id: 'userId1' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.leaveGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('único administrador') }));
  });

  test('admin puede salir si hay más de un admin', async () => {
    groupRepository.countAdminsByGroup.mockResolvedValue(2);
    groupRepository.leaveGroup.mockResolvedValue({ group: 'g1', user: 'userId1' });

    const req = {
      params: { idGroup: 'g1' },
      user: { id: 'userId1' },
      member: { role: 'admin' }
    };
    const res = mockRes();

    await groupController.leaveGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('miembro regular puede salir exitosamente', async () => {
    groupRepository.leaveGroup.mockResolvedValue({ group: 'g1', user: 'userId1' });

    const req = {
      params: { idGroup: 'g1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.leaveGroup(req, res);

    expect(groupRepository.leaveGroup).toHaveBeenCalledWith('g1', 'userId1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 404 si no se encontró el registro de membresía', async () => {
    groupRepository.leaveGroup.mockResolvedValue(null);

    const req = {
      params: { idGroup: 'g1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.leaveGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve 500 en error inesperado', async () => {
    groupRepository.leaveGroup.mockRejectedValue(new Error('DB error'));

    const req = {
      params: { idGroup: 'g1' },
      user: { id: 'userId1' },
      member: { role: 'member' }
    };
    const res = mockRes();

    await groupController.leaveGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
