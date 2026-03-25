import groupRepository from "../repository/group.repository.js";

class GroupController {
    async createGroup(req, res) {
        try{
            const { name, description } = req.body;

            if(!name || !description) {
                return res.status(400).json({ message: 'Nombre y descripción son requeridos' });
            }

            const created_by = req.user.id

            const groupCreated = await groupRepository.createGroup(name, description, created_by);

            res.status(201).json({ message: 'Grupo creado exitosamente', groupCreated: groupCreated });
        }
        catch (error) {
            res.status(500).json({ message: 'Error creando grupo', error: error.message });
        }
    }
}

const groupController = new GroupController();
export default groupController;