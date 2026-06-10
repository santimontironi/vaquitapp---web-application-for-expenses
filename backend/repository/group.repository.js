import Group from "../models/group.model.js";
import GroupMember from "../models/groupMember.model.js";

class GroupRepository {
    async createGroup(image, name, description, created_by) {
        const groupCreated = await Group.create({ image, name, description, created_by });
        await GroupMember.create({ group: groupCreated._id, user: created_by, role: 'admin' });
        return groupCreated;
    }

    async findGroupById(groupId) {
        const group = await Group.findOne({ _id: groupId, active: true });
        return group;
    }

    async findGroupByIdAndUser(groupId, userId) {
        const member = await GroupMember.findOne({ group: groupId, user: userId });
        return member;
    }

    async deleteGroup(groupId) {
        return await Group.findOneAndUpdate({ _id: groupId, active: true }, { active: false });
    }

    async getAllGroupsByUser(userId) {
        const groups = await GroupMember.find({ user: userId })
            .populate({
                path: 'group',
                match: { active: true }
            });
        return groups.filter(gm => gm.group !== null); // se excluyen los grupos inactivos.
    }

    async addMemberToGroup(groupId, userId, role) {
        const newMember = await GroupMember.create({ group: groupId, user: userId, role });
        return newMember;
    }

    async editGroup(groupId, updates) {
        const updatedGroup = await Group.findOneAndUpdate(
            { _id: groupId, active: true },
            { $set: updates },
            { returnDocument: 'after' }
        );
        return updatedGroup;
    }

    async giveAdminRole(groupId, userId) {
        const updatedMember = await GroupMember.findOneAndUpdate(
            { group: groupId, user: userId },
            { role: 'admin' },
            { returnDocument: 'after' }
        );
        return updatedMember;
    }

    async getGroupMembers(groupId) {
        const members = await GroupMember.find({ group: groupId }).populate('user');
        return members;
    }

    async deleteMemberFromGroup(groupId, userId) {
        return await GroupMember.findOneAndDelete({ group: groupId, user: userId });
    }

    async countAdminsByGroup(groupId) {
        return await GroupMember.countDocuments({ group: groupId, role: 'admin' });
    }

    async leaveGroup(groupId, userId) {
        return await GroupMember.findOneAndDelete({ group: groupId, user: userId });
    }
}

const groupRepository = new GroupRepository();  
export default groupRepository;