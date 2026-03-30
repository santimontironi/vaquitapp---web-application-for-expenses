import Plan from '../models/plan.model.js';

class PlanRepository {
    async createPlan(image, name, description, group, created_by) {
        const planCreated = await Plan.create({ image, name, description, group, created_by });
        return planCreated;
    }

    async getAllPlansByGroup(groupId) {
        const plans = await Plan.find({ group: groupId, state: 'active' }).populate('created_by', 'username');
        return plans;
    }

    async checkPlanAsCompleted(planId) {
        const plan = await Plan.findByIdAndUpdate(planId, { state: 'completed' }, { new: true });
        return plan;
    }
}

const planRepository = new PlanRepository();
export default planRepository;