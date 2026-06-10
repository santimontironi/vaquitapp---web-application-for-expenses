import authController from '../controllers/auth.controller.js';
import authRepository from '../repository/auth.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/mail.config.js';

jest.mock('../repository/auth.repository.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/mail.config.js', () => {
  const mockTransporter = { sendMail: jest.fn() };
  return { __esModule: true, default: mockTransporter };
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.EMAIL_USER = 'test@test.com';
});

// ---------------------------------------------------------------------------
// register
// ---------------------------------------------------------------------------
describe('authController.register', () => {
  test('devuelve 400 si faltan campos requeridos', async () => {
    const req = { body: { username: '', email: '', password: '' } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('devuelve 400 si el email ya está en uso', async () => {
    authRepository.findUserByEmail.mockResolvedValue({ email: 'used@test.com' });
    authRepository.findUserByUsername.mockResolvedValue(null);

    const req = { body: { username: 'newuser', email: 'used@test.com', password: '123456' } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('devuelve 400 si el username ya está en uso', async () => {
    authRepository.findUserByEmail.mockResolvedValue(null);
    authRepository.findUserByUsername.mockResolvedValue({ username: 'existing' });

    const req = { body: { username: 'existing', email: 'new@test.com', password: '123456' } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('registra usuario exitosamente y envía email', async () => {
    authRepository.findUserByEmail.mockResolvedValue(null);
    authRepository.findUserByUsername.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    authRepository.registerUser.mockResolvedValue({
      _id: 'userId1',
      username: 'newuser',
      email: 'new@test.com'
    });
    jwt.sign.mockReturnValue('confirm-token');
    transporter.sendMail.mockResolvedValue({});

    const req = { body: { username: 'newuser', email: 'new@test.com', password: '123456' } };
    const res = mockRes();

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(authRepository.registerUser).toHaveBeenCalled(); 
    expect(transporter.sendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('devuelve 500 en error inesperado', async () => {
    authRepository.findUserByEmail.mockRejectedValue(new Error('DB error'));

    const req = { body: { username: 'u', email: 'e@e.com', password: 'p' } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// confirmUser
// ---------------------------------------------------------------------------
describe('authController.confirmUser', () => {
  test('devuelve 400 si el token es inválido', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    const req = { params: { token: 'bad-token' } };
    const res = mockRes();

    await authController.confirmUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 404 si el usuario no existe', async () => {
    jwt.verify.mockReturnValue({ id: 'userId1' });
    authRepository.findUserById.mockResolvedValue(null);

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await authController.confirmUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve 400 si el usuario ya está confirmado', async () => {
    jwt.verify.mockReturnValue({ id: 'userId1' });
    authRepository.findUserById.mockResolvedValue({ isConfirmed: true });

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await authController.confirmUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El usuario ya ha sido confirmado' }));
  });

  test('confirma el usuario exitosamente', async () => {
    jwt.verify.mockReturnValue({ id: 'userId1' });
    authRepository.findUserById.mockResolvedValue({ isConfirmed: false });
    authRepository.confirmUser.mockResolvedValue({ isConfirmed: true });

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await authController.confirmUser(req, res);

    expect(authRepository.confirmUser).toHaveBeenCalledWith('userId1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('devuelve 500 en error inesperado', async () => {
    jwt.verify.mockReturnValue({ id: 'userId1' });
    authRepository.findUserById.mockRejectedValue(new Error('DB error'));

    const req = { params: { token: 'valid-token' } };
    const res = mockRes();

    await authController.confirmUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------
describe('authController.login', () => {
  test('devuelve 400 si faltan identifier o password', async () => {
    const req = { body: { identifier: '', password: '' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 401 si el usuario no existe', async () => {
    authRepository.findUserByIdentifier.mockResolvedValue(null);

    const req = { body: { identifier: 'nobody', password: '123' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('devuelve 401 si la cuenta no está confirmada', async () => {
    authRepository.findUserByIdentifier.mockResolvedValue({ isConfirmed: false, password: 'hashed' });

    const req = { body: { identifier: 'user', password: '123' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Debes confirmar tu cuenta para iniciar sesión' }));
  });

  test('devuelve 401 si la contraseña es incorrecta', async () => {
    authRepository.findUserByIdentifier.mockResolvedValue({ isConfirmed: true, password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { identifier: 'user', password: 'wrong' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('login exitoso: setea cookie y devuelve datos del usuario', async () => {
    const user = { _id: 'userId1', username: 'santi', email: 's@s.com', isConfirmed: true, password: 'hashed' };
    authRepository.findUserByIdentifier.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('auth-token');

    const req = { body: { identifier: 'santi', password: '123456' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.cookie).toHaveBeenCalledWith('token', 'auth-token', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Login exitoso',
      user: expect.objectContaining({ username: 'santi' })
    }));
  });

  test('la respuesta de login NO incluye la contraseña', async () => {
    const user = { _id: 'userId1', username: 'santi', email: 's@s.com', isConfirmed: true, password: 'hashed' };
    authRepository.findUserByIdentifier.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('auth-token');

    const req = { body: { identifier: 'santi', password: '123456' } };
    const res = mockRes();

    await authController.login(req, res);

    const jsonCall = res.json.mock.calls[0][0];
    expect(jsonCall.user).not.toHaveProperty('password');
  });

  test('devuelve 500 en error inesperado', async () => {
    authRepository.findUserByIdentifier.mockRejectedValue(new Error('DB error'));

    const req = { body: { identifier: 'user', password: '123' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
describe('authController.logout', () => {
  test('limpia la cookie y devuelve 200', () => {
    const req = {};
    const res = mockRes();

    authController.logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Sesión cerrada' }));
  });
});

// ---------------------------------------------------------------------------
// dashboardUser
// ---------------------------------------------------------------------------
describe('authController.dashboardUser', () => {
  test('devuelve 404 si el usuario no existe', async () => {
    authRepository.findUserById.mockResolvedValue(null);

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await authController.dashboardUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('devuelve el usuario exitosamente', async () => {
    const user = { _id: 'userId1', username: 'santi', email: 's@s.com' };
    authRepository.findUserById.mockResolvedValue(user);

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await authController.dashboardUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user });
  });

  test('devuelve 500 en error inesperado', async () => {
    authRepository.findUserById.mockRejectedValue(new Error('DB error'));

    const req = { user: { id: 'userId1' } };
    const res = mockRes();

    await authController.dashboardUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
