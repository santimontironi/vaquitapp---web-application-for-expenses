import groupRepository from '../repository/group.repository.js';

export const verifyRole = async (req, res, next) => {
    try {
        const { idGroup } = req.params;
        const userId = req.user.id;

        const member = await groupRepository.findGroupByIdAndUser(idGroup, userId);

        if (!member) {
            return res.status(403).json({ message: 'No perteneces a este grupo.' });
        }

        req.member = member;

        next();
        
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar el miembro', error: error.message });
    }
};