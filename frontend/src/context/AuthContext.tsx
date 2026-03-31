import { createContext, useState, useEffect } from "react";
import type { User, RegisterData, LoadingAuth, LoginData, LoginResponse } from "../types/AuthTypes";
import { registerUserService, loginUserService, dashboardService, confirmUserService } from "../services/AuthServices";

interface AuthContextType {
    user: User | null;
    registerUser: (data: RegisterData) => Promise<void>;
    loginUser: (data: LoginData) => Promise<LoginResponse>;
    loadingAuth: LoadingAuth;
    confirmUser: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState<LoadingAuth>({
        loginLoading: false,
        registerLoading: false,
        dashboardLoading: true,
        confirmLoading: false
    });

    async function registerUser(data: RegisterData) {
        setLoadingAuth(prev => ({ ...prev, registerLoading: true }));
        try{
            await registerUserService(data);
        }
        catch(error) {
            console.error("Error registrando usuario:", error);
        }
        finally {
            setLoadingAuth(prev => ({ ...prev, registerLoading: false }));
        }
    }

    async function confirmUser(token: string) {
        setLoadingAuth(prev => ({ ...prev, confirmLoading: true }));
        try {
            await confirmUserService(token);
        }
        catch(error) {
            console.error("Error confirmando usuario:", error);
        }
        finally {
            setLoadingAuth(prev => ({ ...prev, confirmLoading: false }));
        }
    }

    async function loginUser (data: LoginData) {
        setLoadingAuth(prev => ({ ...prev, loginLoading: true }));
        try {
            const response = await loginUserService(data);
            setUser(response.data.user);
            return response.data;
        }
        catch(error) {
            console.error("Error iniciando sesión:", error);
            throw error;
        }
        finally {
            setLoadingAuth(prev => ({ ...prev, loginLoading: false }));
        }
    }
    
    useEffect(() => {
        async function fetchUser(){
            try {
                const response = await dashboardService();
                setUser(response.data.user);
            }
            finally {
                setLoadingAuth(prev => ({ ...prev, dashboardLoading: false }));
            }
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, registerUser, loginUser, loadingAuth, confirmUser }}>
            {children}
        </AuthContext.Provider>
    )
}