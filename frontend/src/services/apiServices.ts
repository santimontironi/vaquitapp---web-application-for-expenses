import axios from 'axios';
import type { RegisterData, LoginData, LoginResponse, DashboardResponse, CreateGroupResponse, GroupMemberResponse, GroupDetailsResponse, MembersResponse, AddMemberData } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const registerUserService = (data: RegisterData) => {
    return api.post(`/register`, data);
}

export const loginUserService = (data: LoginData) => {
    return api.post<LoginResponse>(`/login`, data);
}

export const dashboardService = () => {
    return api.get<DashboardResponse>(`/dashboard`);
}

export const confirmUserService = (token: string) => {
    return api.get(`/confirm/${token}`);
}

export const getUserGroupsService = () => {
    return api.get<GroupMemberResponse>(`/groups`);
}

export const createGroupService = (data: FormData) => {
    return api.post<CreateGroupResponse>(`/groups`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export const logoutService = () => {
    return api.post(`/logout`);
}

export const getGroupDetailsService = (idGroup: string) => {
    return api.get<GroupDetailsResponse>(`/groups/${idGroup}`);
}

export const getGroupMembersService = (idGroup: string) => {
    return api.get<MembersResponse>(`/groups/${idGroup}/members`);
}

export const inviteMemberService = (idGroup: string, data: AddMemberData) => {
    return api.post(`/groups/${idGroup}/invite`, data);
}

export const acceptInvitationService = (token: string) => {
    return api.get(`/groups/invite/accept/${token}`);
}

export const deleteMemberService = (idGroup: string, idUser: string) => {
    return api.delete(`/groups/${idGroup}/members/${idUser}`);
}