import groupRepository from "../repository/group.repository.js";
import cloudinaryConfig from "../config/cloudinary.config.js";

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
            res.status(500).json({ message: 'Error obteniendo grupos', error: error.message });
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
            res.status(500).json({ message: 'Error creando grupo', error: error.message });
        }
    }

    async deleteGroup(req, res) {
        try {
            const { idGroup } = req.params;

            const groupDeleted = await groupRepository.deleteGroup(idGroup);

            res.status(200).json({ message: 'Grupo eliminado exitosamente', groupDeleted: groupDeleted });
        }
        catch (error) {
            res.status(500).json({ message: 'Error eliminando grupo', error: error.message });
        }
    }
}

const groupController = new GroupController();
export default groupController;