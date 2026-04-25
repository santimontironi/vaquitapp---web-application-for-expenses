import Plan from '../models/plan.model.js';

class PlanRepository {
    async getPlanById(planId) {
        const plan = await Plan.findOne({ _id: planId, state: 'active' });
        return plan;
    }

    async getPlanByIdAndGroup(planId, groupId) {
        const plan = await Plan.findOne({ _id: planId, group: groupId, state: 'active' })
            .populate('created_by', 'username')
            .populate('members', 'username');
        return plan;
    }

    async createPlan(image, name, description, group, created_by, members) {
        const planCreated = await Plan.create({ image, name, description, group, created_by, members });
        return planCreated;
    }

    async addMembersToPlan(planId, userIds) {
        const planUpdated = await Plan.findOneAndUpdate(
            { _id: planId, state: 'active' },
            { $addToSet: { members: { $each: userIds } } }, //addToSet sirve para evitar duplicados, y each para agregar varios elementos al array
            { new: true }
        );
        return planUpdated;
    }

    async getAllPlansByGroup(groupId) {
        const plans = await Plan.find({ group: groupId, state: 'active' }).populate('created_by', 'username').populate('members', 'username');
        return plans;
    }

    async checkPlanAsCompleted(planId) {
        const plan = await Plan.findOneAndUpdate({ _id: planId, state: 'active' }, { state: 'completed' }, { new: true });
        return plan;
    }
}

const planRepository = new PlanRepository();
export default planRepository;