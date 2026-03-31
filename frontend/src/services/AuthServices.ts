import axios from 'axios';
import type { RegisterData, LoginData, LoginResponse, DashboardResponse } from '../types/AuthTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const registerUserService = (data: RegisterData) => {
    return axios.post(`${API_URL}/register`, data);
}

export const loginUserService = (data: LoginData) => {
    return axios.post<LoginResponse>(`${API_URL}/login`, data);
}

export const dashboardService = () => {
    return axios.get<DashboardResponse>(`${API_URL}/dashboard`);
}

export const confirmUserService = (token: string) => {
    return axios.get(`${API_URL}/confirm/${token}`);
}