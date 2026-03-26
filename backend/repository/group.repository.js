import Group from "../models/group.model.js";
import GroupMember from "../models/groupMember.model.js";

class GroupRepository {
    async createGroup(image, name, description, created_by) {
        const groupCreated = await Group.create({ image, name, description, created_by });
        await GroupMember.create({ group: groupCreated._id, user: created_by, role: 'admin' });
        return groupCreated;
    }

    async findGroupByIdAndUser(groupId, userId) {
        const member = await GroupMember.findOne({ group: groupId, user: userId });
        return member;
    }

    async deleteGroup(groupId) {
        await Group.findByIdAndUpdate(groupId, { active: false });
    }

    async getAllGroupsByUser(userId) {
        const groups = await GroupMember.find({ user: userId })
            .populate({
                path: 'group',
                match: { active: true }
            });
        return groups.filter(gm => gm.group !== null); // se excluyen los grupos inactivos.
    }
}

const groupRepository = new GroupRepository();
export default groupRepository;