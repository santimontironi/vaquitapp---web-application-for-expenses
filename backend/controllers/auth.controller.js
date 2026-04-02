import authRepository from '../repository/auth.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from '../config/mail.config.js';

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if(!username || !email || !password) {
                return res.status(400).json({ message: 'El nombre de usuario, el correo electrónico y la contraseña son requeridos' });
            }

            const existingUserByEmail = await authRepository.findUserByEmail(email);
            const existingUserByUsername = await authRepository.findUserByUsername(username);

            if (existingUserByEmail || existingUserByUsername) {
                return res.status(400).json({ message: 'El correo electrónico o el nombre de usuario ya están en uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await authRepository.registerUser(username, email, hashedPassword);

            const confirmToken = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const urlConfirmed = `${process.env.FRONTEND_URL}/confirmar/${confirmToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: newUser.email,
                subject: 'Bienvenido a VaquitApp',
                text: `Hola ${newUser.username},\n\nGracias por registrarte en VaquitApp. Para continuar debes de confirmar tu cuenta haciendo click en el siguiente enlace: ${urlConfirmed}`
            }

            await transporter.sendMail(mailOptions);

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async confirmUser(req, res) {
        try{
            const { token } = req.params;

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch {
                return res.status(400).json({ message: 'El enlace de confirmación es inválido o ha expirado' });
            }

            const user = await authRepository.findUserById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (user.isConfirmed) {
                return res.status(400).json({ message: 'El usuario ya ha sido confirmado' });
            }

            await authRepository.confirmUser(decoded.id);

            res.status(200).json({ message: 'Usuario confirmado exitosamente' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { identifier, password } = req.body;

            if(!identifier || !password) {
                return res.status(400).json({ message: 'El correo electrónico o el nombre de usuario y la contraseña son requeridos' });
            }

            const user = await authRepository.findUserByIdentifier(identifier);

            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            if(!user.isConfirmed) {
                return res.status(401).json({ message: 'Debes confirmar tu cuenta para iniciar sesión' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const userWithoutPassword = {
                id: user._id,
                username: user.username,
                email: user.email
            }

            res.status(200).json({
                message: 'Login exitoso',
                user: userWithoutPassword 
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ message: 'Sesión cerrada' });
    }

    async dashboardUser(req, res) {
        try{

            const userId = req.user.id;

            const user = await authRepository.findUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.status(200).json({ user });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const authController = new AuthController();

export default authController;