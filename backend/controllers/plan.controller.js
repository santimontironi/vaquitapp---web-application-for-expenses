import planRepository from "../repository/plan.repository.js";
import cloudinaryConfig from "../config/cloudinary.config.js";
import GroupMember from "../models/groupMember.model.js";

class PlanController {

    async getAllPlansByGroup(req, res) {
        try{
            const { idGroup } = req.params;
            const plans = await planRepository.getAllPlansByGroup(idGroup);

            if(plans.length === 0) {
                return res.status(404).json({ message: 'No se encontraron planes para este grupo' });
            }

            res.status(200).json({ message: 'Planes obtenidos exitosamente', plans: plans });
        }
        catch (error) {
            res.status(500).json({ message: 'Error obteniendo planes', error: error.message });
        }
    }

    async createPlan(req, res) {
        try{
            const { name, description, members } = req.body;

            const { idGroup } = req.params;

            if(!name) {
                return res.status(400).json({ message: 'Nombre del plan es requerido' });
            }

            if(!members || !Array.isArray(members) || members.length === 0) {
                return res.status(400).json({ message: 'Se requiere al menos un miembro para el plan' });
            }

            const groupMembers = await GroupMember.find({ group: idGroup }).select('user');
            const groupMemberIds = groupMembers.map(m => m.user.toString());

            const invalidMembers = members.filter(userId => !groupMemberIds.includes(userId));

            if(invalidMembers.length > 0) {
                return res.status(400).json({ message: 'Algunos usuarios no pertenecen al grupo' });
            }

            const created_by = req.user.id;

            //este if es para asegurarnos que el creador del plan siempre sea parte de los miembros, aunque no lo haya incluido en la lista de miembros al crear el plan
            if (!members.includes(created_by)) { 
                members.push(created_by);
            }

            let imageUrl = null;

            if(req.file){
                const b64 = Buffer.from(req.file.buffer).toString('base64')
                const dataURI = `data:${req.file.mimetype};base64,${b64}`

                const uploadResult = await cloudinaryConfig.uploader.upload(dataURI, { folder: 'vaquitapp/groups' });

                imageUrl = uploadResult.secure_url;
            }

            const planCreated = await planRepository.createPlan(imageUrl, name, description, idGroup, created_by, members);

            res.status(201).json({ message: 'Plan creado exitosamente', planCreated: planCreated });
        }
        catch (error) {
            res.status(500).json({ message: 'Error creando plan', error: error.message });
        }
    }

    async checkPlanAsCompleted(req, res) {
        try{
            const { idGroup, idPlan } = req.params;

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if(!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            const planCompleted = await planRepository.checkPlanAsCompleted(idPlan);

            res.status(200).json({ message: 'Plan marcado como completado', planCompleted });

        }
        catch (error) {
            res.status(500).json({ message: 'Error marcando plan como completado', error: error.message });
        }
    }

    async addMembersToPlan(req, res) {
        try{
            const { idGroup, idPlan } = req.params;
            const { userIds } = req.body;

            if(!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({ message: 'Se requiere un array de IDs de usuarios' });
            }

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if(!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            const groupMembers = await GroupMember.find({ group: idGroup }).select('user');
            const groupMemberIds = groupMembers.map(m => m.user.toString());

            const invalidMembers = userIds.filter(userId => !groupMemberIds.includes(userId));
            
            if(invalidMembers.length > 0) {
                return res.status(400).json({ message: 'Algunos usuarios no pertenecen al grupo' });
            }

            const planUpdated = await planRepository.addMembersToPlan(idPlan, userIds);

            res.status(200).json({ message: 'Miembros agregados al plan exitosamente', planUpdated });
        }
        catch (error) {
            res.status(500).json({ message: 'Error agregando miembros al plan', error: error.message });
        }
    }

    async getPlanByIdAndGroup(req, res) {
        try{
            const { idGroup, idPlan } = req.params;

            const plan = await planRepository.getPlanByIdAndGroup(idPlan, idGroup);

            if(!plan) {
                return res.status(404).json({ message: 'Plan no encontrado o no pertenece a este grupo' });
            }

            res.status(200).json({ message: 'Plan obtenido exitosamente', plan: plan });
        }
        catch (error) {
            res.status(500).json({ message: 'Error obteniendo plan', error: error.message });
        }
    }
    
}

const planController = new PlanController();
export default planController;