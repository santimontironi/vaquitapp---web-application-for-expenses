import planRepository from "../repository/plan.repository.js";
import cloudinaryConfig from "../config/cloudinary.config.js";

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
            const { name, description } = req.body;

            const { idGroup } = req.params;

            if(!name || !description) {
                return res.status(400).json({ message: 'Nombre, descripción e id del grupo son requeridos' });
            }

            const created_by = req.user.id;

            let imageUrl = null;

            if(req.file){
                const b64 = Buffer.from(req.file.buffer).toString('base64')
                const dataURI = `data:${req.file.mimetype};base64,${b64}`

                const uploadResult = await cloudinaryConfig.uploader.upload(dataURI, { folder: 'vaquitapp/groups' });

                imageUrl = uploadResult.secure_url;
            }

            const planCreated = await planRepository.createPlan(imageUrl, name, description, idGroup, created_by);

            res.status(201).json({ message: 'Plan creado exitosamente', planCreated: planCreated });
        }
        catch (error) {
            res.status(500).json({ message: 'Error creando plan', error: error.message });
        }
    }

    async checkPlanAsCompleted(req, res) {
        try{
            const { idPlan } = req.params;

            const planCompleted = await planRepository.checkPlanAsCompleted(idPlan);

            if(!planCompleted) {
                return res.status(404).json({ message: 'Plan no encontrado' });
            }

            res.status(200).json({ message: 'Plan marcado como completado', planCompleted: planCompleted });

        }
        catch (error) {
            res.status(500).json({ message: 'Error marcando plan como completado', error: error.message });
        }
    }
}

const planController = new PlanController();
export default planController;