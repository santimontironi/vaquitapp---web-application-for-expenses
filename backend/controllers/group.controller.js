import groupRepository from "../repository/group.repository.js";
import authRepository from "../repository/auth.repository.js";
import cloudinaryConfig from "../config/cloudinary.config.js";
import transporter from "../config/mail.config.js";
import jwt from "jsonwebtoken";

class GroupController {

    async getAllGroupsByUser(req, res) {
        try{
            const userId = req.user.id;

            const groups = await groupRepository.getAllGroupsByUser(userId);

            if(groups.length === 0) {
                return res.status(404).json({ message: 'No se encontraron grupos para este usuario' });
            }

            res.status(200).json({ message: 'Grupos obtenidos exitosamente', groups: groups });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGroupById(req, res) {
        try{
            const { idGroup } = req.params;

            const member = req.member

            if(!member) {
                return res.status(403).json({ message: 'No sos miembro de este grupo' });
            }

            const group = await groupRepository.findGroupById(idGroup);

            if(!group) {
                return res.status(404).json({ message: 'No se encontró el grupo' });
            }

            res.status(200).json({ message: 'Grupo obtenido exitosamente', group: group });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createGroup(req, res) {
        try{
            const { name, description } = req.body;

            if(!name || !description) {
                return res.status(400).json({ message: 'Nombre y descripción son requeridos' });
            }

            let imageUrl = null;

            if(req.file){
                const b64 = Buffer.from(req.file.buffer).toString('base64')
                const dataURI = `data:${req.file.mimetype};base64,${b64}`

                const uploadResult = await cloudinaryConfig.uploader.upload(dataURI, { folder: 'vaquitapp/groups' });

                imageUrl = uploadResult.secure_url;
            }

            const created_by = req.user.id

            const groupCreated = await groupRepository.createGroup(imageUrl, name, description, created_by);

            res.status(201).json({ message: 'Grupo creado exitosamente', groupCreated: groupCreated });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteGroup(req, res) {
        try {
            const { idGroup } = req.params;

            const member = req.member

            if(member.role !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden eliminar el grupo' });
            }

            const groupDeleted = await groupRepository.deleteGroup(idGroup);

            res.status(200).json({ message: 'Grupo eliminado exitosamente', groupDeleted: groupDeleted });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addMemberToGroup(req, res) {
        try{
            const { idGroup } = req.params;
            const { email, role } = req.body;

            if(!email || !role) {
                return res.status(400).json({ message: 'Email y rol son requeridos' });
            }

            const member = req.member

            if(member.role !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden agregar miembros al grupo' });
            }

            const invitedUser = await authRepository.findUserByEmail(email);

            if(invitedUser) {
                const alreadyMember = await groupRepository.findGroupByIdAndUser(idGroup, invitedUser._id);
                if(alreadyMember) {
                    return res.status(400).json({ message: 'El usuario ya es miembro de este grupo' });
                }
            }

            const inviteToken = jwt.sign(
                { groupId: idGroup, email, role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            const inviteLink = `${process.env.FRONTEND_URL}/invitacion/${inviteToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Has sido invitado a un grupo en VaquitApp',
                text: `Has sido invitado a un grupo en VaquitApp.\n\nPara unirte, iniciá sesión y usá el siguiente enlace:\n\n${inviteLink}\n\nEste enlace expira en 7 días.`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Invitación enviada exitosamente' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async acceptInvitation(req, res) {
        try {
            const { token } = req.params;

            if (!token) {
                return res.status(400).json({ message: 'Token de invitación requerido' });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(400).json({ message: 'Token inválido o expirado' });
            }

            const { groupId, email, role } = decoded;

            const user = await authRepository.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'No existe una cuenta registrada con este email' });
            }

            const alreadyMember = await groupRepository.findGroupByIdAndUser(groupId, user._id);
            if (alreadyMember) {
                return res.status(400).json({ message: 'Ya sos miembro de este grupo' });
            }

            const newMember = await groupRepository.addMemberToGroup(groupId, user._id, role);

            res.status(200).json({ message: '¡Bienvenido al grupo!', newMember });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async editGroup(req, res) {
        try {
            const { idGroup } = req.params;
            const { name, description } = req.body;

            if(!name || !description) {
                return res.status(400).json({ message: 'Nombre y descripción son requeridos' });
            }

            const member = req.member

            if(member.role !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden editar el grupo' });
            }

            let imageUrl = null;

            if(req.file){
                const b64 = Buffer.from(req.file.buffer).toString('base64')
                const dataURI = `data:${req.file.mimetype};base64,${b64}`
                imageUrl = dataURI;
            }

            const updatedGroup = await groupRepository.editGroup(idGroup, imageUrl, name, description);

            res.status(200).json({ message: 'Grupo actualizado exitosamente', updatedGroup });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async giveAdminRole(req, res) {
        try{
            const { idGroup, idMember } = req.params;

            const member = req.member

            if(member.role !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden otorgar roles de admin' });
            }

            const updatedMember = await groupRepository.giveAdminRole(idGroup, idMember);

            res.status(200).json({ message: 'Rol de admin otorgado exitosamente', updatedMember });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGroupMembers(req, res) {
        try{
            const { idGroup } = req.params;

            const member = req.member

            if(!member) {
                return res.status(403).json({ message: 'No sos miembro de este grupo' });
            }

            const members = await groupRepository.getGroupMembers(idGroup);

            if(members.length === 0) {
                return res.status(404).json({ message: 'No se encontraron miembros para este grupo' });
            }

            res.status(200).json({ message: 'Miembros obtenidos exitosamente', members: members });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteMemberFromGroup(req, res) {
        try{
            const { idGroup, idMember } = req.params;

            const member = req.member

            if(member.role !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden eliminar miembros del grupo' });
            }

            await groupRepository.deleteMemberFromGroup(idGroup, idMember);

            res.status(200).json({ message: 'Miembro eliminado del grupo exitosamente' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const groupController = new GroupController();
export default groupController;