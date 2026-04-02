import axios from 'axios';
import type { RegisterData, LoginData, LoginResponse, DashboardResponse, CreateGroupResponse, GroupMemberResponse } from '../types';

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