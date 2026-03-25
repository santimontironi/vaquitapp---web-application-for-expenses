import Group from "../models/group.model.js";
import GroupMember from "../models/groupMember.model.js";

class GroupRepository {
    async createGroup(name, description, created_by) {
        const groupCreated = await Group.create({ name, description, created_by });
        await GroupMember.create({ group: groupCreated._id, user: created_by, role: 'admin' });
        return groupCreated;
    }
}

const groupRepository = new GroupRepository();
export default groupRepository;