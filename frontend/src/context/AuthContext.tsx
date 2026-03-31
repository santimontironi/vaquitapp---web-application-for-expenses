import { createContext, useState, useEffect } from "react";
import type { User, RegisterData, LoadingAuth, LoginData, LoginResponse } from "../types/AuthTypes";
import { registerUserService, loginUserService, dashboardService } from "../services/AuthServices";

interface AuthContextType {
    user: User | null;
    registerUser: (data: RegisterData) => Promise<void>;
    loginUser: (data: LoginData) => Promise<LoginResponse>;
    loadingAuth: LoadingAuth;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState<LoadingAuth>({
        loginLoading: false,
        registerLoading: false,
        dashboardLoading: true
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
        <AuthContext.Provider value={{ user, registerUser, loginUser, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}