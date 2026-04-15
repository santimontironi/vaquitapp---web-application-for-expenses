export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}

export interface LoadingAuth {
    loginLoading: boolean;
    registerLoading: boolean;
    dashboardLoading?: boolean;
    confirmLoading?: boolean;
}

export interface DashboardResponse {
    user: User;
}
