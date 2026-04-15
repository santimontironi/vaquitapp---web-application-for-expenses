import { api } from "./auth.service";
import type { CreateGroupResponse, GroupMemberResponse, GroupDetailsResponse, MembersResponse, AddMemberData } from "../types/groups.types";

export const getUserGroupsService = () => {
    return api.get<GroupMemberResponse>(`/groups`);
};

export const createGroupService = (data: FormData) => {
    return api.post<CreateGroupResponse>(`/groups`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getGroupDetailsService = (idGroup: string) => {
    return api.get<GroupDetailsResponse>(`/groups/${idGroup}`);
};

export const getGroupMembersService = (idGroup: string) => {
    return api.get<MembersResponse>(`/groups/${idGroup}/members`);
};

export const inviteMemberService = (idGroup: string, data: AddMemberData) => {
    return api.post(`/groups/${idGroup}/invite`, data);
};

export const acceptInvitationService = (token: string) => {
    return api.get(`/groups/invite/accept/${token}`);
};

export const deleteMemberService = (idGroup: string, idUser: string) => {
    return api.delete(`/groups/${idGroup}/members/${idUser}`);
};
