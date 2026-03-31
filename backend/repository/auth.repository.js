import User from '../models/user.model.js';

class AuthRepository {
    async registerUser(username, email, password) {
        const userCreated = await User.create({ username, email, password });
        return userCreated;
    }

    async findUserByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    async findUserByUsername(username) {
        const user = await User.findOne({ username });
        return user;
    }

    async findUserById(id) {
        const user = await User.findById(id).select('-password');
        return user;
    }

    async findUserByIdentifier(identifier) {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });
        return user;
    }

    async confirmUser(userId) {
        const user = await User.findByIdAndUpdate(userId, { isConfirmed: true }, { new: true }).select('-password');
        return user;
    }
}

const authRepository = new AuthRepository();
export default authRepository;