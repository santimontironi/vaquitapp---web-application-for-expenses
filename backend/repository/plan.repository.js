import Plan from '../models/plan.model.js';

class PlanRepository {
    async createPlan(image, name, description, group, created_by) {
        const planCreated = await Plan.create({ image, name, description, group, created_by });
        return planCreated;
    }

    async getAllPlansByGroup(groupId) {
        const plans = await Plan.find({ group: groupId, active: true }).populate('created_by', 'username');
        return plans;
    }
}

const planRepository = new PlanRepository();
export default planRepository;